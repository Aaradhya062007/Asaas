from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
import random

from movies.models import Genre, Language, CastMember, Movie, MoviePoster, Review
from bookings.models import City, Theater, Screen, Seat, ShowSchedule, Booking, BookingSeat, PaymentTransaction, SeatReservation

class Command(BaseCommand):
    help = 'Seeds database with realistic initial sample data for BookMySeat'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Starting database seeding process..."))

        # 1. Superuser / Admin & Test User
        admin_user, _ = User.objects.get_or_create(
            username='admin',
            defaults={'email': 'admin@bookmyseat.com', 'is_staff': True, 'is_superuser': True}
        )
        admin_user.set_password('admin123')
        admin_user.save()

        test_user, _ = User.objects.get_or_create(
            username='user1',
            defaults={'email': 'user1@example.com'}
        )
        test_user.set_password('user123')
        test_user.save()

        self.stdout.write(self.style.SUCCESS("Admin user created: admin / admin123"))

        # 2. Genres & Languages
        action, _ = Genre.objects.get_or_create(name='Action')
        scifi, _ = Genre.objects.get_or_create(name='Sci-Fi')
        drama, _ = Genre.objects.get_or_create(name='Drama')
        thriller, _ = Genre.objects.get_or_create(name='Thriller')

        english, _ = Language.objects.get_or_create(name='English', code='en')
        hindi, _ = Language.objects.get_or_create(name='Hindi', code='hi')

        # 3. Cast Members
        nolan, _ = CastMember.objects.get_or_create(name='Christopher Nolan', role='Director')
        cillian, _ = CastMember.objects.get_or_create(name='Cillian Murphy', role='Lead Actor')
        zendaya, _ = CastMember.objects.get_or_create(name='Zendaya', role='Lead Actress')

        # 4. Movies
        now = timezone.now()

        m1, _ = Movie.objects.get_or_create(
            title='Inception',
            defaults={
                'description': 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
                'duration_minutes': 148,
                'age_rating': 'UA',
                'release_date': (now - timedelta(days=30)).date(),
                'youtube_trailer_url': 'https://www.youtube.com/watch?v=YoHD9XEInc0',
                'poster_image': 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80',
            }
        )
        m1.genres.add(scifi, action, thriller)
        m1.languages.add(english)
        m1.cast_members.add(nolan)

        m2, _ = Movie.objects.get_or_create(
            title='Oppenheimer',
            defaults={
                'description': 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
                'duration_minutes': 180,
                'age_rating': 'A',
                'release_date': (now - timedelta(days=15)).date(),
                'youtube_trailer_url': 'https://www.youtube.com/watch?v=uYPbbksJxIg',
                'poster_image': 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&auto=format&fit=crop&q=80',
            }
        )
        m2.genres.add(drama)
        m2.languages.add(english)
        m2.cast_members.add(cillian, nolan)

        m3, _ = Movie.objects.get_or_create(
            title='Dune: Part Two',
            defaults={
                'description': 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
                'duration_minutes': 166,
                'age_rating': 'UA',
                'release_date': (now - timedelta(days=5)).date(),
                'youtube_trailer_url': 'https://www.youtube.com/watch?v=Way9Dexny3w',
                'poster_image': 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=600&auto=format&fit=crop&q=80',
            }
        )
        m3.genres.add(scifi, action)
        m3.languages.add(english)
        m3.cast_members.add(zendaya)

        # 5. Cities, Theaters, Screens & Seats
        mumbai, _ = City.objects.get_or_create(name='Mumbai', state='Maharashtra')
        ny, _ = City.objects.get_or_create(name='New York', state='NY')

        t1, _ = Theater.objects.get_or_create(name='PVR ICON IMAX', city=mumbai, defaults={'address': 'Phoenix Palladium, Lower Parel'})
        t2, _ = Theater.objects.get_or_create(name='AMC Empire 25', city=ny, defaults={'address': '234 W 42nd St, Times Square'})

        s1, _ = Screen.objects.get_or_create(theater=t1, name='IMAX Screen 1', defaults={'total_seats': 60, 'rows': 6, 'cols': 10})
        s2, _ = Screen.objects.get_or_create(theater=t2, name='Auditorium 4', defaults={'total_seats': 60, 'rows': 6, 'cols': 10})

        for scr in [s1, s2]:
            if not Seat.objects.filter(screen=scr).exists():
                rows = ['A', 'B', 'C', 'D', 'E', 'F']
                for r_idx, r in enumerate(rows):
                    stype = 'RECLINER' if r_idx in [0, 1] else ('VIP' if r_idx in [2, 3] else 'STANDARD')
                    sprice = 400.00 if stype == 'RECLINER' else (300.00 if stype == 'VIP' else 200.00)
                    for n in range(1, 11):
                        Seat.objects.create(
                            screen=scr,
                            row_label=r,
                            number=n,
                            seat_type=stype,
                            price=sprice
                        )

        # 6. ShowSchedules
        sched1, _ = ShowSchedule.objects.get_or_create(
            movie=m1,
            screen=s1,
            start_time=now + timedelta(hours=3),
            defaults={'end_time': now + timedelta(hours=5, minutes=30), 'price_multiplier': 1.00}
        )

        sched2, _ = ShowSchedule.objects.get_or_create(
            movie=m2,
            screen=s2,
            start_time=now + timedelta(hours=6),
            defaults={'end_time': now + timedelta(hours=9), 'price_multiplier': 1.20}
        )

        sched3, _ = ShowSchedule.objects.get_or_create(
            movie=m3,
            screen=s1,
            start_time=now + timedelta(days=1, hours=2),
            defaults={'end_time': now + timedelta(days=1, hours=5), 'price_multiplier': 1.00}
        )

        # 7. Sample Confirmed Booking & Verified Review
        booking1, _ = Booking.objects.get_or_create(
            booking_id='BMS-DEMO-001',
            defaults={
                'user': test_user,
                'show_schedule': sched1,
                'total_amount': 400.00,
                'payment_status': 'SUCCESS'
            }
        )
        sample_seats = Seat.objects.filter(screen=s1)[:2]
        for st in sample_seats:
            BookingSeat.objects.get_or_create(booking=booking1, seat=st, defaults={'price': st.price})
            SeatReservation.objects.get_or_create(
                show_schedule=sched1,
                seat=st,
                defaults={'user': test_user, 'expires_at': now + timedelta(hours=10), 'status': 'BOOKED'}
            )

        PaymentTransaction.objects.get_or_create(
            transaction_id='TXN-DEMO-999',
            defaults={'booking': booking1, 'provider': 'STRIPE', 'amount': 400.00, 'status': 'SUCCESS'}
        )

        Review.objects.get_or_create(
            movie=m1,
            user=test_user,
            defaults={
                'rating': 5,
                'review_text': 'Mind-blowing masterpiece! The sound design and visuals in IMAX are top tier.',
                'is_verified_viewer': True
            }
        )

        self.stdout.write(self.style.SUCCESS("Successfully seeded sample movies, theaters, screens, seats, showtimes, and demo bookings!"))
