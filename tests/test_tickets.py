from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from bookings.models import City, Theater, Screen, Seat, ShowSchedule, Booking, BookingSeat
from bookings.pdf_generator import generate_pdf_ticket
from movies.models import Movie

class TicketPdfTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('ticketuser', 't@test.com', 'pass123')
        self.movie = Movie.objects.create(
            title='Ticket Movie', description='Desc', duration_minutes=120, age_rating='U', release_date=timezone.now().date(), youtube_trailer_url='https://youtube.com/watch?v=123'
        )
        self.city = City.objects.create(name='TicketCity', state='ST')
        self.theater = Theater.objects.create(name='TicketTheater', city=self.city, address='123 St')
        self.screen = Screen.objects.create(theater=self.theater, name='Screen 1', total_seats=10)
        self.seat = Seat.objects.create(screen=self.screen, row_label='A', number=1, price=200.00)
        self.schedule = ShowSchedule.objects.create(movie=self.movie, screen=self.screen, start_time=timezone.now()+timedelta(hours=1), end_time=timezone.now()+timedelta(hours=3))

    def test_pdf_generation(self):
        booking = Booking.objects.create(user=self.user, show_schedule=self.schedule, total_amount=200.00, payment_status='SUCCESS')
        BookingSeat.objects.create(booking=booking, seat=self.seat, price=200.00)
        pdf = generate_pdf_ticket(booking)
        self.assertTrue(len(pdf) > 0)
        self.assertTrue(pdf.startswith(b'%PDF'))
