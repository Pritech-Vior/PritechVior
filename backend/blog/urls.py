from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views, admin_views

router = DefaultRouter()
router.register(r'posts', views.BlogPostViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'comments', views.BlogCommentViewSet)
router.register(r'download-requests', views.BlogDownloadRequestViewSet)
router.register(r'newsletter', views.NewsletterSubscriptionViewSet)

# Admin router
admin_router = DefaultRouter()
admin_router.register(r'posts', admin_views.AdminBlogPostViewSet)
admin_router.register(r'images', admin_views.AdminBlogImageViewSet)
admin_router.register(r'downloads', admin_views.AdminBlogDownloadViewSet)
admin_router.register(r'categories', admin_views.AdminCategoryViewSet)

urlpatterns = [
    # Public API
    path('api/', include(router.urls)),
    
    # Admin API - New dedicated admin views
    path('api/admin/blog/', include(admin_router.urls)),
    
    # Legacy admin endpoints (for backward compatibility)
    path('api/admin/blog/posts/', admin_views.AdminBlogPostViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='admin-blogpost-list'),
    path('api/admin/blog/posts/<slug:slug>/', admin_views.AdminBlogPostViewSet.as_view({
        'get': 'retrieve',
        'patch': 'partial_update',
        'put': 'update',
        'delete': 'destroy'
    }), name='admin-blogpost-detail'),
    
    # For Django deployment under /blog/, add these endpoints as well:
    path('blog/api/admin/blog/', include(admin_router.urls)),
    path('blog/api/admin/blog/posts/', admin_views.AdminBlogPostViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='admin-blogpost-list-blog'),
    path('blog/api/admin/blog/posts/<slug:slug>/', admin_views.AdminBlogPostViewSet.as_view({
        'get': 'retrieve',
        'patch': 'partial_update',
        'put': 'update',
        'delete': 'destroy'
    }), name='admin-blogpost-detail-blog'),
]