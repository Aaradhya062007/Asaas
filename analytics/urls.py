from django.urls import path
from . import views

app_name = 'analytics'

urlpatterns = [
    path('dashboard/', views.admin_dashboard, name='dashboard'),
    path('export-csv/', views.export_csv_report, name='export_csv'),
]
