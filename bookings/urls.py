from django.urls import path
from . import views

app_name = 'bookings'

urlpatterns = [
    path('select-seats/<int:schedule_id>/', views.seat_selection, name='seat_selection'),
    path('api/seat-status/<int:schedule_id>/', views.live_seat_status_api, name='live_seat_status_api'),
    path('api/hold-seats/<int:schedule_id>/', views.hold_seats_api, name='hold_seats_api'),
    path('checkout/<str:booking_id>/', views.checkout_payment, name='checkout'),
    path('process-payment/<str:booking_id>/', views.process_payment, name='process_payment'),
    path('webhook/', views.payment_webhook, name='webhook'),
    path('download-ticket/<str:booking_id>/', views.download_ticket_pdf, name='download_ticket'),
]
