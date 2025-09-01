from django.urls import path
from . import admin_views_simple

urlpatterns = [
    # Dashboard Stats - Simplified
    path('dashboard/stats/', admin_views_simple.DashboardStatsAPIView.as_view(), name='dashboard-stats-simple'),
    
    # System Health - Simplified
    path('system/health/', admin_views_simple.SystemHealthAPIView.as_view(), name='system-health-simple'),
    
    # Recent Activity - Simplified
    path('activity/recent/', admin_views_simple.RecentActivityAPIView.as_view(), name='recent-activity-simple'),
    
    # Analytics - Simplified
    path('analytics/', admin_views_simple.AnalyticsAPIView.as_view(), name='analytics-simple'),
]