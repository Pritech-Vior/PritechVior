from rest_framework import generics, status, filters
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import (
    ProjectCategory, TechnologyStack, ProjectTemplate, 
    ServicePackage, ProjectRequest, ProjectCustomization
)
from .serializers import (
    ProjectCategorySerializer, TechnologyStackSerializer, 
    ProjectTemplateSerializer, ProjectTemplateDetailSerializer,
    ServicePackageSerializer, ProjectRequestSerializer, 
    ProjectRequestCreateSerializer, ProjectCustomizationSerializer
)


class ProjectCategoryListView(generics.ListAPIView):
    """List all project categories with optional filtering by user type"""
    serializer_class = ProjectCategorySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['user_type', 'is_active']
    search_fields = ['name', 'description']
    
    def get_queryset(self):
        return ProjectCategory.objects.filter(is_active=True).order_by('user_type', 'name')


class TechnologyStackListView(generics.ListAPIView):
    """List all technology stacks with optional filtering"""
    serializer_class = TechnologyStackSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'is_active']
    search_fields = ['name', 'description']
    
    def get_queryset(self):
        return TechnologyStack.objects.filter(is_active=True).order_by('category', 'name')


class ProjectTemplateListView(generics.ListAPIView):
    """List all project templates with filtering and search"""
    serializer_class = ProjectTemplateSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_featured', 'is_active', 'complexity_level']
    search_fields = ['title', 'description', 'features']
    ordering_fields = ['created_at', 'title', 'student_price', 'client_price', 'business_price']
    ordering = ['-is_featured', '-created_at']
    
    def get_queryset(self):
        queryset = ProjectTemplate.objects.filter(is_active=True).prefetch_related('technologies')
        
        # Filter by user type for pricing
        user_type = self.request.query_params.get('user_type')
        if user_type:
            queryset = queryset.extra(
                select={
                    'relevant_price': f'CASE WHEN %s = "student" THEN student_price '
                                   f'WHEN %s = "client" THEN client_price '
                                   f'ELSE business_price END'
                },
                select_params=[user_type, user_type]
            )
        
        return queryset


class ProjectTemplateDetailView(generics.RetrieveAPIView):
    """Get project template details by slug"""
    serializer_class = ProjectTemplateDetailSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        return ProjectTemplate.objects.filter(is_active=True).prefetch_related('technologies')


class FeaturedProjectsView(generics.ListAPIView):
    """Get featured projects for showcase"""
    serializer_class = ProjectTemplateSerializer
    
    def get_queryset(self):
        return ProjectTemplate.objects.filter(
            is_active=True, 
            is_featured=True
        ).prefetch_related('technologies').order_by('-created_at')[:6]


class ServicePackageListView(generics.ListAPIView):
    """List service packages with filtering by user type"""
    serializer_class = ServicePackageSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user_type', 'is_active']
    
    def get_queryset(self):
        return ServicePackage.objects.filter(is_active=True).order_by('user_type', 'price')


class ProjectRequestCreateView(generics.CreateAPIView):
    """Create a new project request"""
    serializer_class = ProjectRequestCreateSerializer
    
    def perform_create(self, serializer):
        # Calculate estimated cost before saving
        instance = serializer.save()
        instance.estimated_cost = instance.calculate_estimated_cost()
        instance.save()


class ProjectRequestListView(generics.ListAPIView):
    """List project requests with filtering"""
    serializer_class = ProjectRequestSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['user_type', 'request_type', 'status', 'project_category']
    search_fields = ['project_title', 'contact_name', 'contact_email', 'description']
    ordering_fields = ['created_at', 'estimated_cost']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return ProjectRequest.objects.all().select_related(
            'project_category', 'base_template'
        ).prefetch_related('selected_services')


class ProjectRequestDetailView(generics.RetrieveUpdateAPIView):
    """Get or update a specific project request"""
    serializer_class = ProjectRequestSerializer
    queryset = ProjectRequest.objects.all().select_related(
        'project_category', 'base_template'
    ).prefetch_related('selected_services', 'customizations')


# Custom API views
@api_view(['GET'])
def project_stats(request):
    """Get project statistics for dashboard"""
    stats = {
        'total_templates': ProjectTemplate.objects.filter(is_active=True).count(),
        'featured_templates': ProjectTemplate.objects.filter(is_active=True, is_featured=True).count(),
        'total_categories': ProjectCategory.objects.filter(is_active=True).count(),
        'total_requests': ProjectRequest.objects.count(),
        'pending_requests': ProjectRequest.objects.filter(status='pending').count(),
        'completed_requests': ProjectRequest.objects.filter(status='completed').count(),
    }
    return Response(stats)


@api_view(['GET'])
def search_projects(request):
    """Advanced search for projects"""
    query = request.GET.get('q', '')
    user_type = request.GET.get('user_type', 'student')
    category_slug = request.GET.get('category')
    
    queryset = ProjectTemplate.objects.filter(is_active=True)
    
    if query:
        queryset = queryset.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query) |
            Q(features__icontains=query) |
            Q(technologies__name__icontains=query)
        ).distinct()
    
    if category_slug:
        queryset = queryset.filter(category__slug=category_slug)
    
    # Add relevant pricing based on user type
    queryset = queryset.extra(
        select={
            'relevant_price': f'CASE WHEN %s = "student" THEN student_price '
                           f'WHEN %s = "client" THEN client_price '
                           f'ELSE business_price END'
        },
        select_params=[user_type, user_type]
    )
    
    serializer = ProjectTemplateSerializer(
        queryset.prefetch_related('technologies')[:20], 
        many=True,
        context={'request': request}
    )
    return Response(serializer.data)


@api_view(['POST'])
def calculate_project_cost(request):
    """Calculate estimated cost for a project request"""
    data = request.data
    
    # Base cost calculation logic
    base_cost = 0
    user_type = data.get('user_type', 'student')
    request_type = data.get('request_type', 'new')
    
    if request_type == 'existing' and data.get('base_template_id'):
        try:
            template = ProjectTemplate.objects.get(id=data['base_template_id'])
            if user_type == 'student':
                base_cost = template.student_price
            elif user_type == 'client':
                base_cost = template.client_price
            else:
                base_cost = template.business_price
        except ProjectTemplate.DoesNotExist:
            pass
    
    # Add service package costs
    service_ids = data.get('selected_services', [])
    if service_ids:
        services = ServicePackage.objects.filter(
            id__in=service_ids, 
            user_type=user_type,
            is_active=True
        )
        service_cost = sum(service.price for service in services)
        base_cost += service_cost
    
    # Apply complexity multiplier for new projects
    if request_type == 'new':
        complexity_multiplier = {
            'simple': 1.0,
            'medium': 1.5,
            'complex': 2.0,
            'enterprise': 3.0
        }
        complexity = data.get('complexity_level', 'medium')
        base_cost = int(base_cost * complexity_multiplier.get(complexity, 1.5))
    
    return Response({
        'estimated_cost': base_cost,
        'user_type': user_type,
        'request_type': request_type
    })
