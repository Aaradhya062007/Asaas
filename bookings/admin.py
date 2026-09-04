from django.contrib import admin
from bookings.models import (
    City, Theater, Screen, Seat, ShowSchedule,
    SeatReservation, Booking, BookingSeat, PaymentTransaction
)

class SeatInline(admin.TabularInline):
    model = Seat
    extra = 5

class ScreenInline(admin.TabularInline):
    model = Screen
    extra = 1

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'state')

@admin.register(Theater)
class TheaterAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'address')
    list_filter = ('city',)
    inlines = [ScreenInline]

@admin.register(Screen)
class ScreenAdmin(admin.ModelAdmin):
    list_display = ('name', 'theater', 'total_seats', 'rows', 'cols')
    inlines = [SeatInline]

@admin.register(Seat)
class SeatAdmin(admin.ModelAdmin):
    list_display = ('screen', 'row_label', 'number', 'seat_type', 'price', 'is_active')
    list_filter = ('screen__theater', 'seat_type', 'is_active')
    search_fields = ('row_label', 'screen__name')

@admin.register(ShowSchedule)
class ShowScheduleAdmin(admin.ModelAdmin):
    list_display = ('movie', 'screen', 'start_time', 'end_time', 'price_multiplier')
    list_filter = ('screen__theater', 'start_time', 'movie')

class BookingSeatInline(admin.TabularInline):
    model = BookingSeat
    extra = 0

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('booking_id', 'user', 'show_schedule', 'total_amount', 'payment_status', 'created_at')
    list_filter = ('payment_status', 'created_at')
    search_fields = ('booking_id', 'user__username')
    inlines = [BookingSeatInline]

@admin.register(SeatReservation)
class SeatReservationAdmin(admin.ModelAdmin):
    list_display = ('id', 'show_schedule', 'seat', 'user', 'status', 'expires_at')
    list_filter = ('status', 'show_schedule')

@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'booking', 'provider', 'amount', 'status', 'created_at')
    list_filter = ('provider', 'status', 'created_at')
