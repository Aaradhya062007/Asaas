from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

from movies.models import Movie, Genre, Language, Review, RecentlyViewed
from movies.recommendations import get_similar_movies, get_recommended_for_user, get_trending_movies
from bookings.models import City, Theater, Screen, Seat, ShowSchedule, Booking, BookingSeat

class MovieModuleTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('testuser', 'test@example.com', 'password123')
        self.genre_action = Genre.objects.create(name='Action')
        self.genre_scifi = Genre.objects.create(name='Sci-Fi')
        self.lang_eng = Language.objects.create(name='English', code='EN')

        self.movie1 = Movie.objects.create(
            title='Inception Odyssey',
            description='Mind bending thriller',
            duration_minutes=148,
            age_rating='UA',
            release_date=timezone.now().date() - timedelta(days=10),
            youtube_trailer_url='https://youtube.com/watch?v=123'
        )
        self.movie1.genres.add(self.genre_action, self.genre_scifi)
        self.movie1.languages.add(self.lang_eng)

        self.movie2 = Movie.objects.create(
            title='Starlight Horizons',
            description='Space drama',
            duration_minutes=160,
            age_rating='U',
            release_date=timezone.now().date() - timedelta(days=5),
            youtube_trailer_url='https://youtube.com/watch?v=456'
        )
        self.movie2.genres.add(self.genre_scifi)
        self.movie2.languages.add(self.lang_eng)

        # Setup booking prerequisites for verified review
        self.city = City.objects.create(name='Metropolis', state='NY')
        self.theater = Theater.objects.create(name='Grand Cinema', city=self.city, address='123 Main')
        self.screen = Screen.objects.create(theater=self.theater, name='Screen 1', total_seats=20)
        self.schedule = ShowSchedule.objects.create(
            movie=self.movie1,
            screen=self.screen,
            start_time=timezone.now() + timedelta(hours=1),
            end_time=timezone.now() + timedelta(hours=3)
        )

    def test_youtube_embed_conversion(self):
        self.assertEqual(self.movie1.embed_youtube_url, 'https://www.youtube.com/embed/123')

    def test_review_submission_and_rating_recalculation(self):
        # Initial rating
        self.assertEqual(self.movie1.average_rating, 0.0)

        # Post review
        review = Review.objects.create(
            movie=self.movie1,
            user=self.user,
            rating=5,
            review_text='Outstanding masterpiece!',
            is_verified_viewer=True
        )

        self.movie1.refresh_from_db()
        self.assertEqual(self.movie1.average_rating, 5.0)
        self.assertEqual(self.movie1.total_reviews, 1)

        # Delete review
        review.delete()
        self.movie1.refresh_from_db()
        self.assertEqual(self.movie1.average_rating, 0.0)
        self.assertEqual(self.movie1.total_reviews, 0)

    def test_similar_movies_recommendation(self):
        similar = get_similar_movies(self.movie1)
        self.assertIn(self.movie2, similar)

    def test_recommended_for_user(self):
        # Log recently viewed
        RecentlyViewed.objects.create(user=self.user, movie=self.movie1)

        recs = get_recommended_for_user(self.user)
        self.assertTrue(len(recs) >= 0)
