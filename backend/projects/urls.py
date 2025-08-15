from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'projects', views.ProjectViewSet)
router.register(r'milestones', views.ProjectMilestoneViewSet)
router.register(r'requests', views.ProjectRequestViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
