from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q, Count, Avg
from django.utils import timezone
from datetime import datetime

from movies.models import Movie, Genre, Language, Review, RecentlyViewed, MoviePoster
from bookings.models import City, Theater, ShowSchedule, Booking
from movies.recommendations import get_similar_movies, get_recommended_for_user, get_trending_movies

def _filter_movies_queryset(request):
    """Applies search query, multi-filters, and sorting to Movie QuerySet."""
    qs = Movie.objects.filter(is_active=True).prefetch_related('genres', 'languages')

    # Search by title
    q = request.GET.get('q', '').strip()
    if q:
        qs = qs.filter(title__icontains=q)

    # Filter by Genre
    genre_slug = request.GET.get('genre', '').strip()
    if genre_slug:
        qs = qs.filter(genres__slug=genre_slug)

    # Filter by Language
    language_code = request.GET.get('language', '').strip()
    if language_code:
        qs = qs.filter(languages__code=language_code)

    # Filter by City
    city_id = request.GET.get('city', '').strip()
    if city_id:
        qs = qs.filter(schedules__screen__theater__city_id=city_id).distinct()

    # Filter by Theater
    theater_id = request.GET.get('theater', '').strip()
    if theater_id:
        qs = qs.filter(schedules__screen__theater_id=theater_id).distinct()

    # Filter by Rating (Minimum rating threshold)
    min_rating = request.GET.get('rating', '').strip()
    if min_rating:
        try:
            qs = qs.filter(average_rating__gte=float(min_rating))
        except ValueError:
            pass

    # Filter by Age Certification
    age_rating = request.GET.get('age_rating', '').strip()
    if age_rating:
        qs = qs.filter(age_rating=age_rating)

    # Sorting
    sort_by = request.GET.get('sort', 'popularity').strip()
    if sort_by == 'newest':
        qs = qs.order_by('-release_date', '-created_at')
    elif sort_by == 'rating':
        qs = qs.order_by('-average_rating', '-total_reviews')
    elif sort_by == 'price_low':
        qs = qs.order_by('schedules__screen__seats__price').distinct()
    elif sort_by == 'price_high':
        qs = qs.order_by('-schedules__screen__seats__price').distinct()
    else:  # Popularity (total reviews / bookings count)
        qs = qs.order_by('-total_reviews', '-average_rating')

    return qs.distinct()


def movie_list(request):
    """Movie Discovery Page with search, filters, pagination, and recommendations."""
    movies_qs = _filter_movies_queryset(request)

    # Pagination (5 movies per page to balance Hollywood & Bollywood across 2 pages)
    paginator = Paginator(movies_qs, 5)
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)

    # Filter options context
    genres = Genre.objects.all()
    languages = Language.objects.all()
    cities = City.objects.all()
    theaters = Theater.objects.all()

    # Recommended section
    recommended_movies = get_recommended_for_user(request.user, limit=4)
    trending_movies = get_trending_movies(limit=4)

    context = {
        'page_obj': page_obj,
        'total_matches': movies_qs.count(),
        'genres': genres,
        'languages': languages,
        'cities': cities,
        'theaters': theaters,
        'recommended_movies': recommended_movies,
        'trending_movies': trending_movies,
        'selected_q': request.GET.get('q', ''),
        'selected_genre': request.GET.get('genre', ''),
        'selected_language': request.GET.get('language', ''),
        'selected_city': request.GET.get('city', ''),
        'selected_theater': request.GET.get('theater', ''),
        'selected_rating': request.GET.get('rating', ''),
        'selected_age': request.GET.get('age_rating', ''),
        'selected_sort': request.GET.get('sort', 'popularity'),
    }
    return render(request, 'movies/index.html', context)


def filter_count_api(request):
    """Returns dynamic count of matching movies after filter changes via AJAX."""
    movies_qs = _filter_movies_queryset(request)
    return JsonResponse({
        'status': 'success',
        'count': movies_qs.count()
    })


def movie_detail(request, slug):
    """Detailed view for a movie including YouTube embed trailer, reviews, and similar movies."""
    movie = get_object_or_404(Movie.objects.prefetch_related('genres', 'languages', 'cast_members', 'posters'), slug=slug)

    # Log recently viewed for authenticated users
    if request.user.is_authenticated:
        RecentlyViewed.objects.update_or_create(
            user=request.user,
            movie=movie,
            defaults={'viewed_at': timezone.now()}
        )

    # Verify if user is eligible to write/edit review (has confirmed booking)
    is_verified_viewer = False
    existing_review = None
    if request.user.is_authenticated:
        is_verified_viewer = Booking.objects.filter(
            user=request.user,
            show_schedule__movie=movie,
            payment_status='SUCCESS'
        ).exists()

        existing_review = Review.objects.filter(movie=movie, user=request.user).first()

    # Active show schedules for booking
    now = timezone.now()
    schedules = ShowSchedule.objects.filter(
        movie=movie,
        start_time__gte=now
    ).select_related('screen__theater__city').order_by('start_time')

    # Reviews list (exclude unmoderated severely flagged reviews if flagged)
    reviews = movie.reviews.filter(is_flagged=False).select_related('user__profile').order_by('-created_at')

    similar_movies = get_similar_movies(movie, limit=4)

    context = {
        'movie': movie,
        'posters': movie.posters.all(),
        'schedules': schedules,
        'reviews': reviews,
        'similar_movies': similar_movies,
        'is_verified_viewer': is_verified_viewer,
        'existing_review': existing_review,
    }
    return render(request, 'movies/detail.html', context)


@login_required
def submit_review(request, movie_id):
    """
    Submit or edit a movie review.
    Enforces verified viewer check (user must have a confirmed booking for the movie).
    """
    movie = get_object_or_404(Movie, id=movie_id)
    
    # Check verified booking eligibility
    has_confirmed_booking = Booking.objects.filter(
        user=request.user,
        show_schedule__movie=movie,
        payment_status='SUCCESS'
    ).exists()

    if not has_confirmed_booking:
        messages.error(request, "Only users who have booked and watched this movie can submit a review.")
        return redirect('movies:detail', slug=movie.slug)

    if request.method == 'POST':
        rating = int(request.POST.get('rating', 5))
        review_text = request.POST.get('review_text', '').strip()

        if not (1 <= rating <= 5):
            messages.error(request, "Rating must be between 1 and 5 stars.")
            return redirect('movies:detail', slug=movie.slug)

        review, created = Review.objects.update_or_create(
            movie=movie,
            user=request.user,
            defaults={
                'rating': rating,
                'review_text': review_text,
                'is_verified_viewer': True
            }
        )

        if created:
            messages.success(request, "Thank you! Your verified review has been published.")
        else:
            messages.success(request, "Your review has been updated.")

    return redirect('movies:detail', slug=movie.slug)


@login_required
def report_review(request, review_id):
    """Allows users to report inappropriate review content."""
    review = get_object_or_404(Review, id=review_id)
    if request.method == 'POST':
        reason = request.POST.get('flag_reason', 'Inappropriate content').strip()
        review.is_flagged = True
        review.flag_reason = reason
        review.save(update_fields=['is_flagged', 'flag_reason'])
        messages.info(request, "Review has been reported to administrators for moderation.")

    return redirect('movies:detail', slug=review.movie.slug)
