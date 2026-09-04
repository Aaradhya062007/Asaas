from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings

from bookings.models import Booking
from movies.recommendations import get_recommended_for_user

def register_view(request):
    """Handles User Registration."""
    if request.user.is_authenticated:
        return redirect('movies:list')

    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, f"Welcome to BookMySeat, {user.username}!")
            return redirect('movies:list')
        else:
            for error in form.errors.values():
                messages.error(request, error)
    else:
        form = UserCreationForm()

    return render(request, 'accounts/register.html', {'form': form})


def login_view(request):
    """Handles User Login."""
    if request.user.is_authenticated:
        return redirect('movies:list')

    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, f"Welcome back, {user.username}!")
            next_url = request.GET.get('next') or 'movies:list'
            return redirect(next_url)
        else:
            messages.error(request, "Invalid username or password.")
    else:
        form = AuthenticationForm()

    return render(request, 'accounts/login.html', {'form': form})


def logout_view(request):
    """Handles User Logout."""
    logout(request)
    messages.info(request, "You have been logged out.")
    return redirect('movies:list')


def forgot_username_view(request):
    """Handles sending username reminder emails."""
    if request.method == 'POST':
        email = request.POST.get('email', '').strip()
        if email:
            users = User.objects.filter(email__iexact=email, is_active=True)
            if users.exists():
                usernames = ", ".join([u.username for u in users])
                subject = "Your BookMySeat Username Reminder"
                message = f"Hello,\n\nWe received a request to retrieve your BookMySeat username.\n\nYour username(s) associated with this email address: {usernames}\n\nThank you,\nBookMySeat Team"
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    fail_silently=True,
                )
            messages.success(request, f"If an account with {email} exists, an email with your username has been sent!")
            return redirect('accounts:login')
        else:
            messages.error(request, "Please enter a valid email address.")

    return render(request, 'accounts/forgot_username.html')


@login_required
def profile_view(request):
    """
    User Profile Dashboard with username/email update form,
    complete Booking history, and PDF ticket download options.
    """
    if request.method == 'POST':
        new_username = request.POST.get('username', '').strip()
        new_email = request.POST.get('email', '').strip()
        
        if new_username:
            request.user.username = new_username
        if new_email:
            request.user.email = new_email
        request.user.save()
        messages.success(request, "Profile details updated successfully!")
        return redirect('accounts:profile')

    user_bookings = Booking.objects.filter(
        user=request.user
    ).select_related(
        'show_schedule__movie', 'show_schedule__screen__theater'
    ).prefetch_related(
        'booked_seats__seat', 'transactions'
    ).order_by('-created_at')

    recommended_movies = get_recommended_for_user(request.user, limit=4)

    context = {
        'user': request.user,
        'bookings': user_bookings,
        'recommended_movies': recommended_movies,
    }
    return render(request, 'accounts/profile.html', context)

