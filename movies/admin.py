from django.contrib import admin
from movies.models import Genre, Language, CastMember, Movie, MoviePoster, Review, RecentlyViewed

class MoviePosterInline(admin.TabularInline):
    model = MoviePoster
    extra = 1

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'age_rating', 'duration_minutes', 'release_date', 'average_rating', 'total_reviews', 'is_active')
    list_filter = ('age_rating', 'is_active', 'genres', 'languages', 'release_date')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [MoviePosterInline]
    filter_horizontal = ('genres', 'languages', 'cast_members')

@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')

@admin.register(CastMember)
class CastMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'role')
    search_fields = ('name', 'role')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('movie', 'user', 'rating', 'is_verified_viewer', 'is_flagged', 'created_at')
    list_filter = ('rating', 'is_verified_viewer', 'is_flagged', 'created_at')
    search_fields = ('movie__title', 'user__username', 'review_text')
    actions = ['approve_reviews', 'flag_reviews']

    def approve_reviews(self, request, queryset):
        queryset.update(is_flagged=False)
    approve_reviews.short_description = "Unflag/Approve selected reviews"

    def flag_reviews(self, request, queryset):
        queryset.update(is_flagged=True)
    flag_reviews.short_description = "Flag selected reviews as inappropriate"

@admin.register(RecentlyViewed)
class RecentlyViewedAdmin(admin.ModelAdmin):
    list_display = ('user', 'movie', 'viewed_at')
