from django.urls import path
from . import debug_views

urlpatterns = [
    path('debug/user-info/', debug_views.debug_user_info, name='debug-user-info'),
    path('debug/admin-test/', debug_views.TestAdminPermissionView.as_view(), name='debug-admin-test'),
    path('auth/logout/', debug_views.logout_view, name='logout'),
]