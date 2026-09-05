import logging
import threading
from celery import shared_task
from django.core.mail import EmailMessage
from django.conf import settings

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3, default_retry_delay=5)
def send_ticket_email_task(self, booking_id):
    """
    Celery task to send PDF ticket via email asynchronously with retry support.
    """
    from bookings.models import Booking
    from bookings.pdf_generator import generate_pdf_ticket

    try:
        booking = Booking.objects.select_related('user', 'show_schedule__movie', 'show_schedule__screen__theater').get(booking_id=booking_id)
        recipient_email = booking.user.email or "customer@example.com"
        
        pdf_bytes = generate_pdf_ticket(booking)

        subject = f"Your Movie Ticket - {booking.show_schedule.movie.title} [{booking.booking_id}]"
        body = (
            f"Dear {booking.user.username},\n\n"
            f"Your booking for '{booking.show_schedule.movie.title}' is confirmed!\n"
            f"Booking ID: {booking.booking_id}\n"
            f"Theater: {booking.show_schedule.screen.theater.name}\n"
            f"Showtime: {booking.show_schedule.start_time.strftime('%b %d, %Y %I:%M %p')}\n\n"
            f"Your PDF e-ticket with QR code is attached to this email.\n\n"
            f"Enjoy your movie!\n"
            f"Team BookMySeat"
        )

        email = EmailMessage(
            subject=subject,
            body=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient_email]
        )
        email.attach(f"Ticket_{booking.booking_id}.pdf", pdf_bytes, 'application/pdf')
        email.send(fail_silently=False)
        logger.info(f"Successfully sent PDF ticket email for booking {booking_id} to {recipient_email}")
        return True

    except Exception as exc:
        logger.error(f"Error sending ticket email for booking {booking_id}: {exc}. Retrying...")
        raise self.retry(exc=exc)


def send_ticket_email_async(booking_id):
    """
    Triggers asynchronous email delivery.
    Tries Celery task first. If Celery broker is unavailable, fails gracefully to background thread.
    Guarantees non-blocking execution.
    """
    try:
        send_ticket_email_task.delay(booking_id)
        logger.info(f"Dispatched Celery task for booking {booking_id}")
    except Exception as e:
        logger.warning(f"Celery dispatch unavailable ({e}). Fallback to background thread for booking {booking_id}")
        thread = threading.Thread(target=_send_ticket_email_direct_fallback, args=(booking_id,))
        thread.daemon = True
        thread.start()


def _send_ticket_email_direct_fallback(booking_id):
    """Fallback thread execution function."""
    try:
        from bookings.models import Booking
        from bookings.pdf_generator import generate_pdf_ticket

        booking = Booking.objects.select_related('user', 'show_schedule__movie', 'show_schedule__screen__theater').get(booking_id=booking_id)
        recipient_email = booking.user.email or "customer@example.com"
        pdf_bytes = generate_pdf_ticket(booking)

        subject = f"Your Movie Ticket - {booking.show_schedule.movie.title} [{booking.booking_id}]"
        body = (
            f"Dear {booking.user.username},\n\n"
            f"Your booking for '{booking.show_schedule.movie.title}' is confirmed!\n"
            f"Booking ID: {booking.booking_id}\n\n"
            f"Your PDF e-ticket with QR code is attached.\n\n"
            f"Team BookMySeat"
        )
        email = EmailMessage(
            subject=subject,
            body=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient_email]
        )
        email.attach(f"Ticket_{booking.booking_id}.pdf", pdf_bytes, 'application/pdf')
        email.send(fail_silently=True)
    except Exception as ex:
        logger.error(f"Fallback email thread failed for booking {booking_id}: {ex}")
