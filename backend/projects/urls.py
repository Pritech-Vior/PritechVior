from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.ProjectCategoryViewSet)
router.register(r'technologies', views.TechnologyStackViewSet)
router.register(r'service-packages', views.ServicePackageViewSet)
router.register(r'course-categories', views.CourseCategoryViewSet)
router.register(r'templates', views.ProjectTemplateViewSet)
router.register(r'requests', views.ProjectRequestViewSet)
router.register(r'projects', views.ProjectViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/stats/', views.DashboardStatsAPIView.as_view(), name='dashboard-stats'),
    path('public-data/', views.PublicDataAPIView.as_view(), name='public-data'),
]
