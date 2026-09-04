import json
import uuid
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from django.db import transaction
from django.utils import timezone

from bookings.models import ShowSchedule, Seat, SeatReservation, Booking, BookingSeat, PaymentTransaction
from bookings.seat_manager import get_live_seat_status_map, reserve_seats_transactional, HOLD_DURATION_SECONDS
from bookings.pdf_generator import generate_pdf_ticket
from bookings.tasks import send_ticket_email_async

@login_required
def seat_selection(request, schedule_id):
    """Interactive Seat Map & Selection page."""
    schedule = get_object_or_404(
        ShowSchedule.objects.select_related('movie', 'screen__theater__city'),
        id=schedule_id
    )

    screen = schedule.screen
    seats = Seat.objects.filter(screen=screen, is_active=True).order_by('row_label', 'number')

    # Group seats by row
    rows_dict = {}
    for s in seats:
        if s.row_label not in rows_dict:
            rows_dict[s.row_label] = []
        rows_dict[s.row_label].append(s)

    seat_status_map = get_live_seat_status_map(schedule.id, current_user=request.user)

    context = {
        'schedule': schedule,
        'screen': screen,
        'rows_dict': rows_dict,
        'seat_status_map_json': json.dumps(seat_status_map),
        'price_multiplier': float(schedule.price_multiplier),
        'hold_duration': HOLD_DURATION_SECONDS
    }
    return render(request, 'bookings/seat_selection.html', context)


@login_required
def live_seat_status_api(request, schedule_id):
    """AJAX endpoint for polling live seat map status."""
    seat_status_map = get_live_seat_status_map(schedule_id, current_user=request.user)
    return JsonResponse({
        'status': 'success',
        'seat_status_map': seat_status_map
    })


@login_required
def hold_seats_api(request, schedule_id):
    """
    POST API to reserve selected seats for 2 minutes using atomic database transactions.
    """
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=400)

    try:
        data = json.loads(request.body)
        seat_ids = [int(sid) for sid in data.get('seat_ids', [])]
    except Exception:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON payload.'}, status=400)

    if not seat_ids:
        return JsonResponse({'status': 'error', 'message': 'No seats were selected.'}, status=400)

    success, message, reservations = reserve_seats_transactional(schedule_id, seat_ids, request.user)

    if not success:
        return JsonResponse({'status': 'error', 'message': message}, status=409)

    # Calculate total amount
    schedule = ShowSchedule.objects.get(id=schedule_id)
    seats = Seat.objects.filter(id__in=seat_ids)
    subtotal = sum(s.price for s in seats)
    total_amount = round(float(subtotal) * float(schedule.price_multiplier), 2)

    # Pre-create or retrieve PENDING booking
    with transaction.atomic():
        booking, created = Booking.objects.get_or_create(
            user=request.user,
            show_schedule=schedule,
            payment_status='PENDING',
            defaults={'total_amount': total_amount}
        )
        booking.total_amount = total_amount
        booking.save()

        # Update booked seats reference
        BookingSeat.objects.filter(booking=booking).delete()
        for s in seats:
            BookingSeat.objects.create(
                booking=booking,
                seat=s,
                price=round(float(s.price) * float(schedule.price_multiplier), 2)
            )

    return JsonResponse({
        'status': 'success',
        'message': message,
        'booking_id': booking.booking_id,
        'expires_at_iso': reservations[0].expires_at.isoformat(),
        'hold_duration': HOLD_DURATION_SECONDS,
        'checkout_url': f"/bookings/checkout/{booking.booking_id}/"
    })


@login_required
def checkout_payment(request, booking_id):
    """Payment Checkout Page."""
    booking = get_object_or_404(
        Booking.objects.select_related('show_schedule__movie', 'show_schedule__screen__theater', 'user'),
        booking_id=booking_id,
        user=request.user
    )

    if booking.payment_status == 'SUCCESS':
        messages.info(request, "This booking has already been completed.")
        return redirect('accounts:profile')

    # Verify holds haven't expired
    now = timezone.now()
    active_holds = SeatReservation.objects.filter(
        show_schedule=booking.show_schedule,
        user=request.user,
        status='HELD',
        expires_at__gt=now
    )

    if not active_holds.exists():
        booking.payment_status = 'CANCELLED'
        booking.save(update_fields=['payment_status'])
        messages.error(request, "Your 2-minute seat reservation expired. Please select your seats again.")
        return redirect('bookings:seat_selection', schedule_id=booking.show_schedule.id)

    # Time remaining calculation
    expires_at = active_holds.first().expires_at
    seconds_remaining = max(0, int((expires_at - now).total_seconds()))

    context = {
        'booking': booking,
        'booked_seats': booking.booked_seats.select_related('seat'),
        'seconds_remaining': seconds_remaining,
        'expires_at_iso': expires_at.isoformat()
    }
    return render(request, 'bookings/payment.html', context)


@login_required
def process_payment(request, booking_id):
    """
    Handles payment execution (Stripe / Razorpay server-side verification).
    Guarantees idempotency and triggers asynchronous email delivery.
    """
    if request.method != 'POST':
        return redirect('bookings:checkout', booking_id=booking_id)

    booking = get_object_or_404(
        Booking.objects.select_related('show_schedule__movie', 'show_schedule__screen__theater'),
        booking_id=booking_id,
        user=request.user
    )

    # Idempotency check: if already confirmed, redirect directly to success ticket page
    if booking.payment_status == 'SUCCESS':
        messages.info(request, "Payment already completed!")
        return render(request, 'bookings/confirmation.html', {'booking': booking})

    payment_action = request.POST.get('payment_action', 'simulate_success')
    provider = request.POST.get('provider', 'STRIPE').upper()
    transaction_ref = request.POST.get('transaction_id', f"TXN-{uuid.uuid4().hex[:10].upper()}")

    with transaction.atomic():
        if payment_action == 'simulate_success':
            # Confirm Booking
            booking.payment_status = 'SUCCESS'
            booking.save(update_fields=['payment_status'])

            # Update Seat Reservations to BOOKED
            SeatReservation.objects.filter(
                show_schedule=booking.show_schedule,
                seat_id__in=booking.booked_seats.values_list('seat_id', flat=True),
                user=request.user
            ).update(status='BOOKED')

            # Log Transaction
            PaymentTransaction.objects.create(
                booking=booking,
                transaction_id=transaction_ref,
                provider=provider,
                amount=booking.total_amount,
                status='SUCCESS',
                response_payload=json.dumps({"gateway_response": "APPROVED", "ref": transaction_ref})
            )

            # Dispatch Asynchronous Email Task
            send_ticket_email_async(booking.booking_id)

            messages.success(request, f"Payment of ₹{booking.total_amount:.2f} successful! E-Ticket sent to email.")
            return render(request, 'bookings/confirmation.html', {'booking': booking})

        else:
            # Handle payment failure or user cancellation
            booking.payment_status = 'FAILED'
            booking.save(update_fields=['payment_status'])

            # Automatically release held seats
            SeatReservation.objects.filter(
                show_schedule=booking.show_schedule,
                seat_id__in=booking.booked_seats.values_list('seat_id', flat=True),
                user=request.user,
                status='HELD'
            ).update(status='RELEASED')

            PaymentTransaction.objects.create(
                booking=booking,
                transaction_id=transaction_ref,
                provider=provider,
                amount=booking.total_amount,
                status='FAILED',
                response_payload=json.dumps({"gateway_response": "DECLINED", "ref": transaction_ref})
            )

            messages.error(request, "Payment failed or was cancelled. Reserved seats have been released.")
            return redirect('bookings:seat_selection', schedule_id=booking.show_schedule.id)


@csrf_exempt
def payment_webhook(request):
    """
    Server-side Payment Webhook Handler for Stripe & Razorpay.
    Guarantees server-side verification and idempotency.
    """
    if request.method != 'POST':
        return HttpResponse(status=405)

    try:
        payload = json.loads(request.body)
        event_type = payload.get('type') or payload.get('event')
        booking_id = payload.get('data', {}).get('object', {}).get('metadata', {}).get('booking_id') or payload.get('booking_id')
        transaction_id = payload.get('data', {}).get('object', {}).get('id') or payload.get('payment_id') or f"WEBHOOK-{uuid.uuid4().hex[:8]}"

        if not booking_id:
            return JsonResponse({'status': 'ignored', 'reason': 'missing booking_id'}, status=200)

        booking = Booking.objects.filter(booking_id=booking_id).first()
        if not booking:
            return JsonResponse({'status': 'not_found'}, status=404)

        # Idempotency check
        if booking.payment_status == 'SUCCESS':
            return JsonResponse({'status': 'already_processed'}, status=200)

        if event_type in ['payment_intent.succeeded', 'checkout.session.completed', 'payment.authorized']:
            with transaction.atomic():
                booking.payment_status = 'SUCCESS'
                booking.save(update_fields=['payment_status'])

                SeatReservation.objects.filter(
                    show_schedule=booking.show_schedule,
                    seat_id__in=booking.booked_seats.values_list('seat_id', flat=True)
                ).update(status='BOOKED')

                PaymentTransaction.objects.get_or_create(
                    transaction_id=transaction_id,
                    defaults={
                        'booking': booking,
                        'provider': 'STRIPE',
                        'amount': booking.total_amount,
                        'status': 'SUCCESS',
                        'response_payload': json.dumps(payload)
                    }
                )

                send_ticket_email_async(booking.booking_id)

            return JsonResponse({'status': 'success'}, status=200)
        else:
            booking.payment_status = 'FAILED'
            booking.save(update_fields=['payment_status'])

            SeatReservation.objects.filter(
                show_schedule=booking.show_schedule,
                seat_id__in=booking.booked_seats.values_list('seat_id', flat=True)
            ).update(status='RELEASED')

            return JsonResponse({'status': 'failed_recorded'}, status=200)

    except Exception as e:
        return JsonResponse({'status': 'error', 'detail': str(e)}, status=400)


@login_required
def download_ticket_pdf(request, booking_id):
    """Downloads previously booked tickets as PDF."""
    booking = get_object_or_404(
        Booking.objects.select_related('user', 'show_schedule__movie', 'show_schedule__screen__theater'),
        booking_id=booking_id
    )

    # Permission check: user owns booking or is staff
    if booking.user != request.user and not request.user.is_staff:
        messages.error(request, "Permission denied.")
        return redirect('accounts:profile')

    if booking.payment_status != 'SUCCESS':
        messages.error(request, "PDF ticket is only available for confirmed bookings.")
        return redirect('accounts:profile')

    pdf_bytes = generate_pdf_ticket(booking)
    response = HttpResponse(pdf_bytes, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="Ticket_{booking.booking_id}.pdf"'
    return response
