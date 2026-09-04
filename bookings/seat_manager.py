from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from bookings.models import ShowSchedule, Seat, SeatReservation, BookingSeat, Booking

HOLD_DURATION_SECONDS = 120  # 2 Minutes hold timer

def cleanup_expired_reservations(show_schedule_id=None):
    """Releases all expired seat holds where expires_at < now()."""
    now = timezone.now()
    qs = SeatReservation.objects.filter(status='HELD', expires_at__lt=now)
    if show_schedule_id:
        qs = qs.filter(show_schedule_id=show_schedule_id)
    qs.update(status='RELEASED')


def get_live_seat_status_map(show_schedule_id, current_user=None):
    """
    Returns a dictionary of seat statuses for a given show schedule:
    {
      seat_id: {
         'status': 'AVAILABLE' | 'RESERVED' | 'BOOKED',
         'held_by_me': True/False,
         'expires_at_iso': ISO String or None
      }
    }
    """
    cleanup_expired_reservations(show_schedule_id)
    now = timezone.now()

    # Confirmed booked seats
    booked_seat_ids = set(
        BookingSeat.objects.filter(
            booking__show_schedule_id=show_schedule_id,
            booking__payment_status='SUCCESS'
        ).values_list('seat_id', flat=True)
    )

    # Currently held seats (active unexpired holds)
    active_holds = SeatReservation.objects.filter(
        show_schedule_id=show_schedule_id,
        status='HELD',
        expires_at__gt=now
    ).select_related('seat', 'user')

    status_map = {}

    # Populate active holds
    for hold in active_holds:
        held_by_me = (current_user and current_user.is_authenticated and hold.user_id == current_user.id)
        status_map[hold.seat_id] = {
            'status': 'RESERVED',
            'held_by_me': held_by_me,
            'expires_at_iso': hold.expires_at.isoformat(),
            'seconds_remaining': max(0, int((hold.expires_at - now).total_seconds()))
        }

    # Populate booked seats
    for seat_id in booked_seat_ids:
        status_map[seat_id] = {
            'status': 'BOOKED',
            'held_by_me': False,
            'expires_at_iso': None,
            'seconds_remaining': 0
        }

    return status_map


def reserve_seats_transactional(show_schedule_id, seat_ids, user):
    """
    Reserves requested seats using Django atomic transactions and row locking (`select_for_update`).
    Ensures zero race conditions or duplicate bookings under high concurrency.
    """
    now = timezone.now()
    expires_at = now + timedelta(seconds=HOLD_DURATION_SECONDS)

    with transaction.atomic():
        # Cleanup expired holds for this show
        SeatReservation.objects.filter(
            show_schedule_id=show_schedule_id,
            status='HELD',
            expires_at__lt=now
        ).update(status='RELEASED')

        # Lock the requested seat rows to serialize concurrent attempts
        locked_seats = list(
            Seat.objects.filter(id__in=seat_ids).select_for_update()
        )

        if len(locked_seats) != len(seat_ids):
            return False, "One or more selected seats could not be found.", []

        # Check for confirmed bookings
        already_booked = BookingSeat.objects.filter(
            booking__show_schedule_id=show_schedule_id,
            booking__payment_status='SUCCESS',
            seat_id__in=seat_ids
        ).exists()

        if already_booked:
            return False, "One or more seats have already been booked by another customer.", []

        # Check for active holds by other users
        active_holds_by_others = SeatReservation.objects.filter(
            show_schedule_id=show_schedule_id,
            seat_id__in=seat_ids,
            status='HELD',
            expires_at__gt=now
        ).exclude(user=user)

        if active_holds_by_others.exists():
            return False, "One or more seats are currently held by another user. Please choose different seats.", []

        # Release any previous active holds for this user on other seats if modifying
        SeatReservation.objects.filter(
            show_schedule_id=show_schedule_id,
            user=user,
            status='HELD'
        ).update(status='RELEASED')

        # Create or update holds for requested seats
        reservations = []
        for seat in locked_seats:
            hold, created = SeatReservation.objects.update_or_create(
                show_schedule_id=show_schedule_id,
                seat=seat,
                defaults={
                    'user': user,
                    'reserved_at': now,
                    'expires_at': expires_at,
                    'status': 'HELD'
                }
            )
            reservations.append(hold)

        return True, "Seats reserved successfully for 2 minutes.", reservations
