from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'profiles', views.UserProfileViewSet, basename='userprofile')
router.register(r'users', views.UserViewSet, basename='user')

urlpatterns = [
    # Authentication endpoints
    path('auth/login/', views.CustomTokenObtainPairView.as_view(), name='login'),
    path('auth/register/', views.UserRegistrationView.as_view(), name='register'),
    path('auth/google/', views.GoogleAuthView.as_view(), name='google_auth'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/password-change/', views.PasswordChangeView.as_view(), name='password_change'),
    path('auth/password-reset/', views.PasswordResetView.as_view(), name='password_reset'),
    path('auth/password-reset-confirm/<str:uidb64>/<str:token>/', 
         views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('auth/verify-email/', views.verify_email, name='verify_email'),
    path('auth/roles/', views.roles_list, name='roles_list'),
    
    # API routes
    path('api/', include(router.urls)),
]
