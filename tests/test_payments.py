from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from bookings.models import City, Theater, Screen, Seat, ShowSchedule, Booking, PaymentTransaction
from movies.models import Movie

class PaymentIntegrationTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('payuser', 'pay@test.com', 'pass123')
        self.movie = Movie.objects.create(
            title='Pay Movie', description='Desc', duration_minutes=120, age_rating='U', release_date=timezone.now().date(), youtube_trailer_url='https://youtube.com/watch?v=123'
        )
        self.city = City.objects.create(name='PayCity', state='ST')
        self.theater = Theater.objects.create(name='PayTheater', city=self.city, address='123 St')
        self.screen = Screen.objects.create(theater=self.theater, name='Screen 1', total_seats=10)
        self.schedule = ShowSchedule.objects.create(movie=self.movie, screen=self.screen, start_time=timezone.now()+timedelta(hours=1), end_time=timezone.now()+timedelta(hours=3))

    def test_payment_transaction_creation(self):
        booking = Booking.objects.create(user=self.user, show_schedule=self.schedule, total_amount=250.00, payment_status='SUCCESS')
        txn = PaymentTransaction.objects.create(booking=booking, transaction_id='TXN-TEST-1', provider='STRIPE', amount=250.00, status='SUCCESS')
        self.assertEqual(txn.status, 'SUCCESS')
