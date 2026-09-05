from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

from movies.models import Movie, Genre, Language
from bookings.models import City, Theater, Screen, Seat, ShowSchedule, Booking, BookingSeat, PaymentTransaction
from analytics.services import get_dashboard_analytics, generate_analytics_csv_report

class AnalyticsModuleTestCase(TestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser('admin_test', 'admin@test.com', 'pass123')
        self.user = User.objects.create_user('customer_test', 'cust@test.com', 'pass123')

        self.movie = Movie.objects.create(
            title='Blockbuster Movie',
            description='Action hit',
            duration_minutes=120,
            age_rating='UA',
            release_date=timezone.now().date(),
            youtube_trailer_url='https://youtube.com/watch?v=123'
        )

        self.city = City.objects.create(name='Gotham', state='NY')
        self.theater = Theater.objects.create(name='IMAX Cinema', city=self.city, address='Downtown')
        self.screen = Screen.objects.create(theater=self.theater, name='Screen 1', total_seats=50)
        self.seat = Seat.objects.create(screen=self.screen, row_label='A', number=1, price=300.00)

        self.schedule = ShowSchedule.objects.create(
            movie=self.movie,
            screen=self.screen,
            start_time=timezone.now() + timedelta(hours=2),
            end_time=timezone.now() + timedelta(hours=4)
        )

        # Create confirmed booking
        self.booking = Booking.objects.create(
            user=self.user,
            show_schedule=self.schedule,
            total_amount=300.00,
            payment_status='SUCCESS'
        )
        BookingSeat.objects.create(booking=self.booking, seat=self.seat, price=300.00)
        PaymentTransaction.objects.create(
            booking=self.booking,
            transaction_id='TXN-12345',
            provider='STRIPE',
            amount=300.00,
            status='SUCCESS'
        )

    def test_dashboard_analytics_computation(self):
        data = get_dashboard_analytics()
        self.assertIn('revenue', data)
        self.assertEqual(float(data['revenue']['total']), 300.00)
        self.assertEqual(data['cancellation_stats']['success'], 1)

    def test_csv_report_generation(self):
        response = generate_analytics_csv_report()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'text/csv')
        self.assertIn('BOOKMYSEAT BUSINESS ANALYTICS REPORT', response.content.decode('utf-8'))
