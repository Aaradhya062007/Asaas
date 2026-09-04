from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

from movies.models import Movie, Genre, Language
from bookings.models import City, Theater, Screen, Seat, ShowSchedule, SeatReservation, Booking, BookingSeat
from bookings.seat_manager import reserve_seats_transactional
from bookings.pdf_generator import generate_pdf_ticket

class SeatReservationTestCase(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user('testuser1', 'u1@test.com', 'pass123')
        self.user2 = User.objects.create_user('testuser2', 'u2@test.com', 'pass123')

        self.movie = Movie.objects.create(
            title='Test Movie',
            description='Test Desc',
            duration_minutes=120,
            age_rating='UA',
            release_date=timezone.now().date(),
            youtube_trailer_url='https://youtube.com/watch?v=123'
        )

        self.city = City.objects.create(name='Test City', state='TS')
        self.theater = Theater.objects.create(name='Test Theater', city=self.city, address='123 St')
        self.screen = Screen.objects.create(theater=self.theater, name='Screen 1', total_seats=10)

        self.seat1 = Seat.objects.create(screen=self.screen, row_label='A', number=1, price=200.00)
        self.seat2 = Seat.objects.create(screen=self.screen, row_label='A', number=2, price=200.00)

        self.schedule = ShowSchedule.objects.create(
            movie=self.movie,
            screen=self.screen,
            start_time=timezone.now() + timedelta(hours=2),
            end_time=timezone.now() + timedelta(hours=4)
        )

    def test_seat_hold_success(self):
        success, msg, holds = reserve_seats_transactional(self.schedule.id, [self.seat1.id], self.user1)
        self.assertTrue(success)
        self.assertEqual(len(holds), 1)
        self.assertEqual(holds[0].status, 'HELD')

    def test_seat_hold_concurrency_prevention(self):
        # User 1 holds seat 1
        success1, _, _ = reserve_seats_transactional(self.schedule.id, [self.seat1.id], self.user1)
        self.assertTrue(success1)

        # User 2 attempts to hold same seat 1
        success2, msg2, _ = reserve_seats_transactional(self.schedule.id, [self.seat1.id], self.user2)
        self.assertFalse(success2)
        self.assertIn("held by another user", msg2)

    def test_pdf_ticket_generation(self):
        booking = Booking.objects.create(
            user=self.user1,
            show_schedule=self.schedule,
            total_amount=200.00,
            payment_status='SUCCESS'
        )
        BookingSeat.objects.create(booking=booking, seat=self.seat1, price=200.00)

        pdf_bytes = generate_pdf_ticket(booking)
        self.assertIsInstance(pdf_bytes, bytes)
        self.assertTrue(len(pdf_bytes) > 0)
        self.assertTrue(pdf_bytes.startswith(b'%PDF'))
