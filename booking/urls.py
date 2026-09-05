from django.urls import path
from booking.views import (
    seat_selection, live_seat_status_api, hold_seats_api,
    checkout_payment, process_payment, payment_webhook, download_ticket_pdf
)

app_name = 'booking'

urlpatterns = [
    path('seats/<int:schedule_id>/', seat_selection, name='seat_selection'),
    path('api/seat-status/<int:schedule_id>/', live_seat_status_api, name='live_seat_status_api'),
    path('api/hold-seats/<int:schedule_id>/', hold_seats_api, name='hold_seats_api'),
    path('checkout/<str:booking_id>/', checkout_payment, name='checkout'),
    path('process-payment/<str:booking_id>/', process_payment, name='process_payment'),
    path('webhook/', payment_webhook, name='payment_webhook'),
    path('ticket/<str:booking_id>/pdf/', download_ticket_pdf, name='download_ticket_pdf'),
]
