from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views_new as views

# Create router for any ViewSets (if needed later)
router = DefaultRouter()

app_name = 'projects'

urlpatterns = [
    # API endpoints
    path('api/', include([
        # Categories and Technologies
        path('categories/', views.ProjectCategoryListView.as_view(), name='category-list'),
        path('technologies/', views.TechnologyStackListView.as_view(), name='technology-list'),
        
        # Project Templates
        path('templates/', views.ProjectTemplateListView.as_view(), name='template-list'),
        path('templates/featured/', views.FeaturedProjectsView.as_view(), name='featured-projects'),
        path('templates/<slug:slug>/', views.ProjectTemplateDetailView.as_view(), name='template-detail'),
        
        # Service Packages
        path('packages/', views.ServicePackageListView.as_view(), name='package-list'),
        
        # Project Requests
        path('requests/', views.ProjectRequestListView.as_view(), name='request-list'),
        path('requests/create/', views.ProjectRequestCreateView.as_view(), name='request-create'),
        path('requests/<int:pk>/', views.ProjectRequestDetailView.as_view(), name='request-detail'),
        
        # Utility endpoints
        path('stats/', views.project_stats, name='project-stats'),
        path('search/', views.search_projects, name='search-projects'),
        path('calculate-cost/', views.calculate_project_cost, name='calculate-cost'),
    ])),
    
    # Router URLs
    path('api/', include(router.urls)),
]
