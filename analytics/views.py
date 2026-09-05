from django.shortcuts import render, redirect
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib import messages

from analytics.services import get_dashboard_analytics, generate_analytics_csv_report

@staff_member_required
def admin_dashboard(request):
    """
    Real-Time Admin Business Insights Dashboard.
    Supports custom date range filtering and displays revenue metrics, booking trends,
    theater occupancy, most booked movies, peak booking hours, cancellation stats, and user growth.
    """
    start_date = request.GET.get('start_date', '').strip() or None
    end_date = request.GET.get('end_date', '').strip() or None

    data = get_dashboard_analytics(start_date, end_date)
    return render(request, 'analytics/dashboard.html', data)


@staff_member_required
def export_csv_report(request):
    """Export Analytics Report as CSV."""
    start_date = request.GET.get('start_date', '').strip() or None
    end_date = request.GET.get('end_date', '').strip() or None

    return generate_analytics_csv_report(start_date, end_date)
