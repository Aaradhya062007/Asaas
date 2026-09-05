from django.db.models import Count, Q
from movies.models import Movie, RecentlyViewed
from bookings.models import Booking

def get_similar_movies(movie, limit=6):
    """
    Finds similar movies based on matching genres and languages.
    """
    genre_ids = movie.genres.values_list('id', flat=True)
    language_ids = movie.languages.values_list('id', flat=True)

    similar = Movie.objects.filter(
        is_active=True
    ).exclude(
        id=movie.id
    ).filter(
        Q(genres__id__in=genre_ids) | Q(languages__id__in=language_ids)
    ).annotate(
        match_count=Count('id')
    ).order_by('-match_count', '-average_rating', '-release_date').distinct()[:limit]

    return similar


def get_recommended_for_user(user, limit=6):
    """
    Recommends movies based on user's booking history and recently viewed movies.
    Fallback to top-rated releases if no history available.
    """
    if not user or not user.is_authenticated:
        return get_trending_movies(limit=limit)

    # 1. Preferred genres from confirmed bookings
    booked_movie_ids = Booking.objects.filter(
        user=user,
        payment_status='SUCCESS'
    ).values_list('show_schedule__movie_id', flat=True)

    user_genre_ids = list(Movie.objects.filter(
        id__in=booked_movie_ids
    ).values_list('genres__id', flat=True))

    # 2. Preferred genres from recently viewed
    recently_viewed_ids = RecentlyViewed.objects.filter(
        user=user
    ).values_list('movie_id', flat=True)[:10]

    viewed_genre_ids = list(Movie.objects.filter(
        id__in=recently_viewed_ids
    ).values_list('genres__id', flat=True))

    all_preferred_genres = list(set(user_genre_ids + viewed_genre_ids))

    exclude_ids = set(list(booked_movie_ids) + list(recently_viewed_ids))

    if all_preferred_genres:
        recommendations = Movie.objects.filter(
            is_active=True,
            genres__id__in=all_preferred_genres
        ).exclude(
            id__in=exclude_ids
        ).annotate(
            match_count=Count('id')
        ).order_by('-match_count', '-average_rating', '-release_date').distinct()[:limit]

        if len(recommendations) >= 3:
            return recommendations

    # Fallback to top-rated trending movies
    return get_trending_movies(limit=limit, exclude_ids=exclude_ids)


def get_trending_movies(limit=6, exclude_ids=None):
    """Returns trending and recently released top-rated movies."""
    qs = Movie.objects.filter(is_active=True)
    if exclude_ids:
        qs = qs.exclude(id__in=exclude_ids)
    return qs.order_by('-average_rating', '-release_date')[:limit]
