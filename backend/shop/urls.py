from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'products', views.ProductViewSet)
router.register(r'orders', views.OrderViewSet)
router.register(r'categories', views.CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('analytics/', views.ShopAnalyticsAPIView.as_view(), name='shop-analytics'),
    path('public/stats/', views.PublicShopStatsAPIView.as_view(), name='public-shop-stats'),
]