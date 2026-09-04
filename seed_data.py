import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookmyseat.settings')
django.setup()

from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.models import User
from movies.models import Genre, Language, CastMember, Movie, MoviePoster, Review
from bookings.models import City, Theater, Screen, Seat, ShowSchedule

print("Re-seeding 10 Movies with Authentic Varied Ratings (No Default 5.0 Rating)...")

# Clear old data for fresh setup
ShowSchedule.objects.all().delete()
MoviePoster.objects.all().delete()
Review.objects.all().delete()
Movie.objects.all().delete()

# 1. Genres
action, _ = Genre.objects.get_or_create(name="Action")
sci_fi, _ = Genre.objects.get_or_create(name="Sci-Fi")
drama, _ = Genre.objects.get_or_create(name="Drama")
thriller, _ = Genre.objects.get_or_create(name="Thriller")
comedy, _ = Genre.objects.get_or_create(name="Comedy")
adventure, _ = Genre.objects.get_or_create(name="Adventure")
crime, _ = Genre.objects.get_or_create(name="Crime")
biography, _ = Genre.objects.get_or_create(name="Biography")

# 2. Languages
eng, _ = Language.objects.get_or_create(name="English", defaults={'code': "EN"})
hin, _ = Language.objects.get_or_create(name="Hindi", defaults={'code': "HI"})
tam, _ = Language.objects.get_or_create(name="Tamil", defaults={'code': "TA"})
tel, _ = Language.objects.get_or_create(name="Telugu", defaults={'code': "TE"})

# 3. Cast Members
srk, _ = CastMember.objects.get_or_create(name="Shah Rukh Khan", role="Actor")
dp, _ = CastMember.objects.get_or_create(name="Deepika Padukone", role="Actress")
aamir, _ = CastMember.objects.get_or_create(name="Aamir Khan", role="Actor")
atlee, _ = CastMember.objects.get_or_create(name="Atlee", role="Director")
ss_rajamouli, _ = CastMember.objects.get_or_create(name="S.S. Rajamouli", role="Director")

nolan, _ = CastMember.objects.get_or_create(name="Christopher Nolan", role="Director")
leo, _ = CastMember.objects.get_or_create(name="Leonardo DiCaprio", role="Actor")
bale, _ = CastMember.objects.get_or_create(name="Christian Bale", role="Actor")
cillian, _ = CastMember.objects.get_or_create(name="Cillian Murphy", role="Actor")
sam_worthington, _ = CastMember.objects.get_or_create(name="Sam Worthington", role="Actor")

# 4. Cities & Theaters
mumbai, _ = City.objects.get_or_create(name="Mumbai", defaults={'state': "MH"})
delhi, _ = City.objects.get_or_create(name="Delhi", defaults={'state': "DL"})
bengaluru, _ = City.objects.get_or_create(name="Bengaluru", defaults={'state': "KA"})

t1, _ = Theater.objects.get_or_create(name="PVR Icon Phoenix Lower Parel", city=mumbai, defaults={'address': "Phoenix Mills, Lower Parel, Mumbai"})
t2, _ = Theater.objects.get_or_create(name="INOX Megaplex Malad", city=mumbai, defaults={'address': "Inorbit Mall, Malad West, Mumbai"})
t3, _ = Theater.objects.get_or_create(name="Cinepolis DLF Avenue Saket", city=delhi, defaults={'address': "DLF Avenue, Saket, New Delhi"})
t4, _ = Theater.objects.get_or_create(name="PVR Forum Mall Koramangala", city=bengaluru, defaults={'address': "Forum Mall, Koramangala, Bengaluru"})

# 5. Screens & Seats
def setup_screen(theater, screen_name, rows=5, cols=8):
    screen, _ = Screen.objects.get_or_create(
        theater=theater,
        name=screen_name,
        defaults={'total_seats': rows * cols, 'rows': rows, 'cols': cols}
    )
    for r_idx in range(rows):
        row_char = chr(65 + r_idx)
        seat_type = 'RECLINER' if r_idx == 0 else ('VIP' if r_idx < 3 else 'STANDARD')
        price = 450.00 if seat_type == 'RECLINER' else (320.00 if seat_type == 'VIP' else 220.00)
        for c_idx in range(1, cols + 1):
            Seat.objects.get_or_create(
                screen=screen,
                row_label=row_char,
                number=c_idx,
                defaults={'seat_type': seat_type, 'price': price}
            )
    return screen

s1 = setup_screen(t1, "Screen 1 IMAX 4K")
s2 = setup_screen(t2, "Screen 2 Insignia")
s3 = setup_screen(t3, "Screen 1 VIP")
s4 = setup_screen(t4, "Screen 3 Gold Class")

# 6. MOVIES WITH VARIED RATINGS & REVIEW PROFILES
movies_data = [
    # --- 5 BOLLYWOOD MOVIES ---
    {
        'title': 'Jawan',
        'description': 'A high-octane action thriller highlighting the emotional journey of a man who is set to rectify the wrongs in society with a team of skilled women.',
        'duration_minutes': 169,
        'age_rating': 'UA',
        'release_date': timezone.now().date() - timedelta(days=30),
        'youtube_trailer_url': 'https://www.youtube.com/watch?v=COv52Qyctws',
        'poster_image': 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80',
        'genres': [action, thriller, drama],
        'languages': [hin, tam, tel],
        'cast': [srk, atlee],
        'review_ratings': [5, 4, 5, 4]  # Target avg: 4.5
    },
    {
        'title': 'Pathaan',
        'description': 'An Indian secret agent takes on a ruthless mercenary commander leading a rogue terrorist group planning a deadly biological attack against India.',
        'duration_minutes': 146,
        'age_rating': 'UA',
        'release_date': timezone.now().date() - timedelta(days=60),
        'youtube_trailer_url': 'https://www.youtube.com/watch?v=vqu4z34wENw',
        'poster_image': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
        'genres': [action, thriller],
        'languages': [hin, eng],
        'cast': [srk, dp],
        'review_ratings': [4, 4, 5, 4]  # Target avg: 4.3
    },
    {
        'title': 'Dangal',
        'description': 'Former wrestler Mahavir Singh Phogat and his daughters Geeta and Babita triumph against societal odds to win gold medals for India at the Commonwealth Games.',
        'duration_minutes': 161,
        'age_rating': 'U',
        'release_date': timezone.now().date() - timedelta(days=90),
        'youtube_trailer_url': 'https://www.youtube.com/watch?v=x_7YlGv9u1g',
        'poster_image': 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&auto=format&fit=crop&q=80',
        'genres': [drama, action],
        'languages': [hin],
        'cast': [aamir],
        'review_ratings': [5, 5, 5, 4]  # Target avg: 4.8
    },
    {
        'title': 'RRR (Rise Roar Revolt)',
        'description': 'A legendary tale of two Indian revolutionaries and their journey away from home before they started fighting for their country in 1920s India.',
        'duration_minutes': 187,
        'age_rating': 'UA',
        'release_date': timezone.now().date() - timedelta(days=120),
        'youtube_trailer_url': 'https://www.youtube.com/watch?v=NgBoAI772vY',
        'poster_image': 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
        'genres': [action, drama],
        'languages': [hin, tel, tam],
        'cast': [ss_rajamouli],
        'review_ratings': [5, 5, 4, 5]  # Target avg: 4.7
    },
    {
        'title': '3 Idiots',
        'description': 'Two friends search for their long lost college companion while reminiscing about their undergraduate engineering days and rethinking the educational system.',
        'duration_minutes': 170,
        'age_rating': 'U',
        'release_date': timezone.now().date() - timedelta(days=150),
        'youtube_trailer_url': 'https://www.youtube.com/watch?v=K0eDlFX9GMc',
        'poster_image': 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=600&auto=format&fit=crop&q=80',
        'genres': [comedy, drama],
        'languages': [hin],
        'cast': [aamir],
        'review_ratings': [5, 5, 5, 4]  # Target avg: 4.8
    },

    # --- 5 HOLLYWOOD MOVIES ---
    {
        'title': 'Inception',
        'description': 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        'duration_minutes': 148,
        'age_rating': 'UA',
        'release_date': timezone.now().date() - timedelta(days=15),
        'youtube_trailer_url': 'https://www.youtube.com/watch?v=YoHD9XEInc0',
        'poster_image': 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80',
        'genres': [action, sci_fi, thriller],
        'languages': [eng, hin],
        'cast': [nolan, leo],
        'review_ratings': [5, 5, 4, 5]  # Target avg: 4.7
    },
    {
        'title': 'Interstellar',
        'description': 'When Earth becomes uninhabitable, a team of space explorers undertakes the most important mission in human history to find a new home.',
        'duration_minutes': 169,
        'age_rating': 'U',
        'release_date': timezone.now().date() - timedelta(days=45),
        'youtube_trailer_url': 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
        'poster_image': 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
        'genres': [sci_fi, drama, adventure],
        'languages': [eng],
        'cast': [nolan],
        'review_ratings': [5, 4, 4, 5]  # Target avg: 4.5
    },
    {
        'title': 'The Dark Knight',
        'description': 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological tests of his ability to fight injustice.',
        'duration_minutes': 152,
        'age_rating': 'UA',
        'release_date': timezone.now().date() - timedelta(days=80),
        'youtube_trailer_url': 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
        'poster_image': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
        'genres': [action, crime, drama],
        'languages': [eng, hin],
        'cast': [nolan, bale],
        'review_ratings': [5, 5, 5, 4]  # Target avg: 4.8
    },
    {
        'title': 'Avatar: The Way of Water',
        'description': 'Jake Sully lives with his newfound family formed on Pandora. Once a familiar threat returns, Jake must work with Neytiri and the army of the Na\'vi race.',
        'duration_minutes': 192,
        'age_rating': 'UA',
        'release_date': timezone.now().date() - timedelta(days=100),
        'youtube_trailer_url': 'https://www.youtube.com/watch?v=d9MyW72ELq0',
        'poster_image': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
        'genres': [action, sci_fi, adventure],
        'languages': [eng, hin],
        'cast': [sam_worthington],
        'review_ratings': [4, 4, 3, 5]  # Target avg: 4.0
    },
    {
        'title': 'Oppenheimer',
        'description': 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
        'duration_minutes': 180,
        'age_rating': 'A',
        'release_date': timezone.now().date() - timedelta(days=25),
        'youtube_trailer_url': 'https://www.youtube.com/watch?v=uYPbbksJxIg',
        'poster_image': 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&auto=format&fit=crop&q=80',
        'genres': [biography, drama],
        'languages': [eng, hin],
        'cast': [nolan, cillian],
        'review_ratings': [5, 4, 4, 4]  # Target avg: 4.2
    }
]

# Create Admin Superuser Aaradhya
admin_aaradhya, _ = User.objects.get_or_create(username="Aaradhya", defaults={'email': "aaradhya@example.com", 'is_staff': True, 'is_superuser': True})
admin_aaradhya.set_password("Aaradhya123")
admin_aaradhya.is_staff = True
admin_aaradhya.is_superuser = True
admin_aaradhya.save()

# Create 4 Demo User Profiles to generate authentic reviews
users_data = [
    ("Aaradhya", "aaradhya@example.com"),
    ("cinema_fan", "fan@example.com"),
    ("movie_critic", "critic@example.com"),
    ("bollywood_buff", "buff@example.com")
]

user_objs = []
for uname, uemail in users_data:
    u, _ = User.objects.get_or_create(username=uname, defaults={'email': uemail})
    u.set_password("password123")
    u.save()
    user_objs.append(u)

created_movies = []
for md in movies_data:
    m = Movie.objects.create(
        title=md['title'],
        description=md['description'],
        duration_minutes=md['duration_minutes'],
        age_rating=md['age_rating'],
        release_date=md['release_date'],
        youtube_trailer_url=md['youtube_trailer_url'],
        poster_image=md['poster_image'],
    )
    m.genres.set(md['genres'])
    m.languages.set(md['languages'])
    m.cast_members.set(md['cast'])
    MoviePoster.objects.create(movie=m, image_url=md['poster_image'], caption="Official Poster 1")

    # Add varied reviews with different star ratings
    for idx, rating_val in enumerate(md['review_ratings']):
        user_owner = user_objs[idx % len(user_objs)]
        review_comments = {
            5: "Masterpiece cinema! Exceptional direction, storyline, and acting.",
            4: "Very good watch! Great visuals and compelling story, highly recommended.",
            3: "Decent movie with good moments, though pacing could be better."
        }
        Review.objects.create(
            movie=m,
            user=user_owner,
            rating=rating_val,
            review_text=review_comments.get(rating_val, "Solid entertainment overall."),
            is_verified_viewer=True
        )

    # Recalculate metrics based on actual reviews
    m.update_rating_metrics()
    created_movies.append(m)

# 7. Upcoming Show Schedules
now = timezone.now()
screens = [s1, s2, s3, s4]
for idx, movie in enumerate(created_movies):
    screen = screens[idx % len(screens)]
    for days_ahead in range(0, 5):
        for hour in [14, 18, 21]:
            st = now.replace(hour=hour, minute=0, second=0, microsecond=0) + timedelta(days=days_ahead)
            if st < now:
                continue
            et = st + timedelta(minutes=movie.duration_minutes)
            ShowSchedule.objects.create(
                movie=movie,
                screen=screen,
                start_time=st,
                end_time=et,
                price_multiplier=1.15 if hour >= 18 else 1.0
            )

print("Seeded Authentic Varied Ratings (4.0 to 4.8 Stars) Across All Movies Successfully!")
