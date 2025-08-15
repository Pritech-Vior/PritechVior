from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'products', views.ProductViewSet)
router.register(r'reviews', views.ProductReviewViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
