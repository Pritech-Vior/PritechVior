from django.urls import path
from . import admin_views

urlpatterns = [
    # Dashboard Stats
    path('dashboard/stats/', admin_views.DashboardStatsAPIView.as_view(), name='dashboard-stats'),
    
    # System Health
    path('system/health/', admin_views.SystemHealthAPIView.as_view(), name='system-health'),
    
    # Recent Activity
    path('activity/recent/', admin_views.RecentActivityAPIView.as_view(), name='recent-activity'),
    
    # Analytics
    path('analytics/', admin_views.AnalyticsAPIView.as_view(), name='analytics'),
]