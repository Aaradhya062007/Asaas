# pyrefly: ignore [missing-import]
from django.db import models
# pyrefly: ignore [missing-import]
from django.contrib.auth.models import User
# pyrefly: ignore [missing-import]
from django.utils.text import slugify
from django.db.models import Avg, Count
import re

class Genre(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=60, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Language(models.Model):
    name = models.CharField(max_length=50, unique=True)
    code = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return self.name


class CastMember(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100, help_text="e.g. Actor, Director, Producer", default="Actor")
    photo_url = models.URLField(max_length=500, blank=True, null=True)


    def __str__(self):
        return f"{self.name} ({self.role})"


class Movie(models.Model):
    AGE_RATING_CHOICES = [
        ('U', 'U - Universal'),
        ('UA', 'UA - Parental Guidance'),
        ('A', 'A - Adults Only'),
        ('R', 'R - Restricted'),
    ]

    title = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField()
    duration_minutes = models.PositiveIntegerField(help_text="Duration in minutes")
    age_rating = models.CharField(max_length=10, choices=AGE_RATING_CHOICES, default='UA', db_index=True)
    release_date = models.DateField(db_index=True)
    youtube_trailer_url = models.URLField(max_length=500, help_text="YouTube link or embed URL")
    poster_image = models.URLField(max_length=500, default="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80")
    genres = models.ManyToManyField(Genre, related_name='movies')
    languages = models.ManyToManyField(Language, related_name='movies')
    cast_members = models.ManyToManyField(CastMember, related_name='movies', blank=True)
    average_rating = models.FloatField(default=0.0, db_index=True)
    total_reviews = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-release_date', '-created_at']
        indexes = [
            models.Index(fields=['release_date', 'average_rating']),
            models.Index(fields=['is_active', 'release_date']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def update_rating_metrics(self):
        stats = self.reviews.aggregate(avg_score=Avg('rating'), count=Count('id'))
        self.average_rating = round(stats['avg_score'] or 0.0, 1)
        self.total_reviews = stats['count'] or 0
        self.save(update_fields=['average_rating', 'total_reviews'])

    @property
    def embed_youtube_url(self):
        """Converts YouTube URLs to embed format safely."""
        url = self.youtube_trailer_url or ''
        if 'embed' in url:
            return url
        match = re.search(r'(?:v=|\/live\/|\/shorts\/|youtu\.be\/|\/v\/|embed\/)([a-zA-Z0-9_-]{11}|[a-zA-Z0-9_-]+)', url)
        if match and match.group(1):
            video_id = match.group(1)
            return f"https://www.youtube.com/embed/{video_id}"
        return url

    def __str__(self):
        return self.title


class MoviePoster(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='posters')
    image_url = models.URLField(max_length=500)
    caption = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Poster for {self.movie.title}"


class Review(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='reviews', db_index=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)])
    review_text = models.TextField()
    is_verified_viewer = models.BooleanField(default=False)
    is_flagged = models.BooleanField(default=False, db_index=True)
    flag_reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ('movie', 'user')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.movie.update_rating_metrics()

    def delete(self, *args, **kwargs):
        movie = self.movie
        super().delete(*args, **kwargs)
        movie.update_rating_metrics()

    def __str__(self):
        return f"{self.user.username}'s review on {self.movie.title}"


class RecentlyViewed(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recently_viewed')
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-viewed_at']
        unique_together = ('user', 'movie')

    def __str__(self):
        return f"{self.user.username} viewed {self.movie.title}"
