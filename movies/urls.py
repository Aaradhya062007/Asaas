from django.urls import path
from . import views

app_name = 'movies'

urlpatterns = [
    path('', views.movie_list, name='list'),
    path('api/filter-count/', views.filter_count_api, name='filter_count_api'),
    path('movie/<slug:slug>/', views.movie_detail, name='detail'),
    path('movie/<int:movie_id>/review/', views.submit_review, name='submit_review'),
    path('review/<int:review_id>/report/', views.report_review, name='report_review'),
]
