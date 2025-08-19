from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from . import views

# Main router
router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'brands', views.BrandViewSet)
router.register(r'product-types', views.ProductTypeViewSet)
router.register(r'platforms', views.PlatformViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'cart', views.CartViewSet, basename='cart')
router.register(r'wishlist', views.WishlistViewSet, basename='wishlist')
router.register(r'orders', views.OrderViewSet, basename='order')
router.register(r'custom-orders', views.CustomOrderRequestViewSet, basename='custom-order')
router.register(r'product-requests', views.ProductRequestViewSet, basename='product-request')
router.register(r'shipping-methods', views.ShippingMethodViewSet)

# Nested router for product reviews
products_router = routers.NestedDefaultRouter(router, r'products', lookup='product')
products_router.register(r'reviews', views.ProductReviewViewSet, basename='product-reviews')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(products_router.urls)),
]
