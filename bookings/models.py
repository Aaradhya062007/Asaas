from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from movies.models import Movie
import uuid

class City(models.Model):
    name = models.CharField(max_length=100, unique=True)
    state = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "Cities"
        ordering = ['name']

    def __str__(self):
        return f"{self.name}, {self.state}"


class Theater(models.Model):
    name = models.CharField(max_length=200)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='theaters')
    address = models.TextField()

    class Meta:
        ordering = ['city', 'name']

    def __str__(self):
        return f"{self.name} - {self.city.name}"


class Screen(models.Model):
    theater = models.ForeignKey(Theater, on_delete=models.CASCADE, related_name='screens')
    name = models.CharField(max_length=100)  # e.g., Screen 1, IMAX 3D
    total_seats = models.PositiveIntegerField(default=60)
    rows = models.PositiveIntegerField(default=6)
    cols = models.PositiveIntegerField(default=10)

    def __str__(self):
        return f"{self.theater.name} - {self.name}"


class Seat(models.Model):
    SEAT_TYPE_CHOICES = [
        ('STANDARD', 'Standard'),
        ('VIP', 'VIP'),
        ('RECLINER', 'Recliner'),
    ]

    screen = models.ForeignKey(Screen, on_delete=models.CASCADE, related_name='seats')
    row_label = models.CharField(max_length=5)  # A, B, C...
    number = models.PositiveIntegerField()       # 1, 2, 3...
    seat_type = models.CharField(max_length=20, choices=SEAT_TYPE_CHOICES, default='STANDARD')
    price = models.DecimalField(max_digits=8, decimal_places=2, default=200.00)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('screen', 'row_label', 'number')
        ordering = ['row_label', 'number']

    def __str__(self):
        return f"{self.screen.name} | Seat {self.row_label}{self.number} ({self.get_seat_type_display()})"


class ShowSchedule(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='schedules', db_index=True)
    screen = models.ForeignKey(Screen, on_delete=models.CASCADE, related_name='schedules', db_index=True)
    start_time = models.DateTimeField(db_index=True)
    end_time = models.DateTimeField()
    price_multiplier = models.DecimalField(max_digits=4, decimal_places=2, default=1.00)

    class Meta:
        ordering = ['start_time']
        indexes = [
            models.Index(fields=['start_time', 'movie']),
            models.Index(fields=['screen', 'start_time']),
        ]

    def __str__(self):
        return f"{self.movie.title} @ {self.screen.theater.name} ({self.screen.name}) - {self.start_time.strftime('%b %d, %H:%M')}"


class SeatReservation(models.Model):
    STATUS_CHOICES = [
        ('HELD', 'Held'),
        ('BOOKED', 'Booked'),
        ('RELEASED', 'Released'),
    ]

    show_schedule = models.ForeignKey(ShowSchedule, on_delete=models.CASCADE, related_name='reservations', db_index=True)
    seat = models.ForeignKey(Seat, on_delete=models.CASCADE, related_name='reservations', db_index=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='seat_holds')
    reserved_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(db_index=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='HELD', db_index=True)

    class Meta:
        indexes = [
            models.Index(fields=['show_schedule', 'seat', 'status', 'expires_at']),
        ]

    def is_expired(self):
        return self.status == 'HELD' and timezone.now() > self.expires_at

    def __str__(self):
        return f"Hold #{self.id}: Seat {self.seat} for {self.user.username} ({self.status})"


class Booking(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending Payment'),
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
        ('CANCELLED', 'Cancelled'),
    ]

    booking_id = models.CharField(max_length=64, unique=True, db_index=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings', db_index=True)
    show_schedule = models.ForeignKey(ShowSchedule, on_delete=models.CASCADE, related_name='bookings')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['payment_status', 'created_at']),
            models.Index(fields=['user', 'payment_status']),
        ]

    def save(self, *args, **kwargs):
        if not self.booking_id:
            self.booking_id = f"BMS-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Booking {self.booking_id} - {self.user.username} ({self.payment_status})"


class BookingSeat(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='booked_seats')
    seat = models.ForeignKey(Seat, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return f"Booking {self.booking.booking_id} -> {self.seat.row_label}{self.seat.number}"


class PaymentTransaction(models.Model):
    PROVIDER_CHOICES = [
        ('STRIPE', 'Stripe'),
        ('RAZORPAY', 'Razorpay'),
    ]

    STATUS_CHOICES = [
        ('INITIATED', 'Initiated'),
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
        ('CANCELLED', 'Cancelled'),
    ]

    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='transactions')
    transaction_id = models.CharField(max_length=100, unique=True, db_index=True)
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES, default='STRIPE')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='INITIATED', db_index=True)
    response_payload = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    def __str__(self):
        return f"Txn {self.transaction_id} - {self.status} (₹{self.amount})"
