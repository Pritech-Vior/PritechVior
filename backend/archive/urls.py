from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'archives', views.ArchiveViewSet)
router.register(r'comments', views.ArchiveCommentViewSet)
router.register(r'download-requests', views.ArchiveDownloadRequestViewSet)
router.register(r'versions', views.ArchiveVersionViewSet)
router.register(r'platform-downloads', views.ArchivePlatformDownloadViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
