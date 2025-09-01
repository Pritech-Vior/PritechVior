from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import admin_views

router = DefaultRouter()
router.register(r'users', admin_views.UserManagementViewSet)

urlpatterns = [
    path('', include(router.urls)),
]