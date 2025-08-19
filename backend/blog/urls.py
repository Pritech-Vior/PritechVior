from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'posts', views.BlogPostViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'comments', views.BlogCommentViewSet)
router.register(r'download-requests', views.BlogDownloadRequestViewSet)
router.register(r'newsletter', views.NewsletterSubscriptionViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
