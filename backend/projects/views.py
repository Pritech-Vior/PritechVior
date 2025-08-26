from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.db.models import Q, Count, Avg
import django_filters.rest_framework as filters
from django_filters import rest_framework as filters

from .models import (
    Project, ProjectMilestone, ProjectRequest, ProjectRequestCommunication,
    ProjectTemplate, ProjectCategory, TechnologyStack, ServicePackage,
    CourseCategory
)
from .serializers import (
    ProjectSerializer, ProjectDetailSerializer, ProjectMilestoneSerializer,
    ProjectRequestSerializer, ProjectRequestDetailSerializer, ProjectRequestCreateSerializer,
    ProjectRequestUpdateSerializer, ProjectTemplateSerializer, ProjectTemplateDetailSerializer,
    ProjectCategorySerializer, TechnologyStackSerializer, ServicePackageSerializer,
    CourseCategorySerializer, ProjectRequestCommunicationSerializer
)


# Filters
class ProjectTemplateFilter(filters.FilterSet):
    """Filter for project templates"""
    category = filters.CharFilter(field_name='category__slug')
    technology = filters.CharFilter(field_name='technologies__name', lookup_expr='icontains')
    price_min = filters.NumberFilter(method='filter_price_min')
    price_max = filters.NumberFilter(method='filter_price_max')
    search = filters.CharFilter(method='filter_search')
    
    class Meta:
        model = ProjectTemplate
        fields = ['category', 'status', 'is_featured']
    
    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) |
            Q(description__icontains=value) |
            Q(features__icontains=value)
        )
    
    def filter_price_min(self, queryset, name, value):
        user_type = self.request.GET.get('user_type', 'client')
        if user_type == 'student':
            return queryset.filter(
                Q(student_price__gte=value) | 
                (Q(student_price__isnull=True) & Q(base_price__gte=value))
            )
        return queryset.filter(base_price__gte=value)
    
    def filter_price_max(self, queryset, name, value):
        user_type = self.request.GET.get('user_type', 'client')
        if user_type == 'student':
            return queryset.filter(
                Q(student_price__lte=value) | 
                (Q(student_price__isnull=True) & Q(base_price__lte=value))
            )
        return queryset.filter(base_price__lte=value)


class ProjectRequestFilter(filters.FilterSet):
    """Filter for project requests"""
    user_type = filters.CharFilter(field_name='user_type')
    status = filters.CharFilter(field_name='status')
    request_type = filters.CharFilter(field_name='request_type')
    search = filters.CharFilter(method='filter_search')
    
    class Meta:
        model = ProjectRequest
        fields = ['user_type', 'status', 'request_type']
    
    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) |
            Q(description__icontains=value) |
            Q(client__username__icontains=value) |
            Q(client__email__icontains=value)
        )


# API Views
class ProjectCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for project categories"""
    queryset = ProjectCategory.objects.filter(is_active=True)
    serializer_class = ProjectCategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class TechnologyStackViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for technology stacks"""
    queryset = TechnologyStack.objects.filter(is_active=True)
    serializer_class = TechnologyStackSerializer
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Get technologies grouped by category"""
        technologies = self.get_queryset()
        grouped = {}
        for tech in technologies:
            if tech.category not in grouped:
                grouped[tech.category] = []
            grouped[tech.category].append(TechnologyStackSerializer(tech).data)
        return Response(grouped)


class ServicePackageViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for service packages"""
    queryset = ServicePackage.objects.filter(is_active=True)
    serializer_class = ServicePackageSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user_type = self.request.query_params.get('user_type')
        if user_type:
            queryset = queryset.filter(user_type=user_type)
        return queryset


class CourseCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for course categories"""
    queryset = CourseCategory.objects.filter(is_active=True)
    serializer_class = CourseCategorySerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user_type = self.request.query_params.get('user_type')
        if user_type:
            queryset = queryset.filter(Q(user_type=user_type) | Q(user_type='all'))
        return queryset


class ProjectTemplateViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for project templates"""
    queryset = ProjectTemplate.objects.filter(status='active')
    serializer_class = ProjectTemplateSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = ProjectTemplateFilter
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectTemplateDetailSerializer
        return ProjectTemplateSerializer
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        instance.view_count += 1
        instance.save(update_fields=['view_count'])
        return super().retrieve(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured templates"""
        featured = self.get_queryset().filter(is_featured=True)[:6]
        serializer = self.get_serializer(featured, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def categories(self, request):
        """Get templates grouped by categories"""
        categories = ProjectCategory.objects.filter(is_active=True, templates__status='active').distinct()
        data = []
        for category in categories:
            templates = self.get_queryset().filter(category=category)[:6]
            data.append({
                'category': ProjectCategorySerializer(category).data,
                'templates': self.get_serializer(templates, many=True).data
            })
        return Response(data)


class ProjectRequestViewSet(viewsets.ModelViewSet):
    """ViewSet for project requests"""
    queryset = ProjectRequest.objects.all()
    serializer_class = ProjectRequestSerializer
    permission_classes = [permissions.AllowAny]  # Allow anonymous users to create requests
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = ProjectRequestFilter
    
    def get_permissions(self):
        """Override permissions per action"""
        if self.action == 'create':
            # Allow anyone to create project requests
            return [permissions.AllowAny()]
        else:
            # Require authentication for list/retrieve/update/delete
            return [permissions.IsAuthenticated()]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ProjectRequestCreateSerializer
        elif self.action == 'retrieve':
            return ProjectRequestDetailSerializer
        elif self.action in ['update', 'partial_update'] and self.request.user.is_staff:
            return ProjectRequestUpdateSerializer
        return ProjectRequestSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        if not self.request.user.is_staff:
            # Regular users can only see their own requests
            queryset = queryset.filter(client=self.request.user)
        return queryset
    
    def perform_create(self, serializer):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        # Handle anonymous users by assigning to guest user
        if self.request.user.is_authenticated:
            client = self.request.user
        else:
            # Get or create guest user for anonymous requests
            client, created = User.objects.get_or_create(
                username='guest',
                defaults={
                    'email': 'guest@pritechvior.com',
                    'first_name': 'Guest',
                    'last_name': 'User',
                    'is_active': False
                }
            )
        
        serializer.save(client=client)
    
    @action(detail=True, methods=['post'])
    def add_communication(self, request, pk=None):
        """Add communication to project request"""
        project_request = self.get_object()
        message = request.data.get('message', '')
        
        if not message:
            return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        communication = ProjectRequestCommunication.objects.create(
            request=project_request,
            sender=request.user,
            sender_type='client' if not request.user.is_staff else 'staff',
            message=message,
            attachments=request.data.get('attachments', [])
        )
        
        serializer = ProjectRequestCommunicationSerializer(communication)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def convert_to_project(self, request, pk=None):
        """Convert request to project (staff only)"""
        if not request.user.is_staff:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        project_request = self.get_object()
        
        if project_request.converted_project:
            return Response({'error': 'Request already converted'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create project from request
        project = Project.objects.create(
            title=project_request.title,
            description=project_request.description,
            requirements=project_request.requirements,
            user_type=project_request.user_type,
            category=project_request.template.category if project_request.template else None,
            template=project_request.template,
            course_category=project_request.course_category,
            academic_level=project_request.academic_level,
            client=project_request.client,
            budget=project_request.quoted_price or project_request.estimated_cost,
            estimated_cost=project_request.estimated_cost,
            deadline=project_request.preferred_deadline,
            service_package=project_request.service_package,
            contact_phone=project_request.contact_phone,
            contact_email=project_request.contact_email,
            customizations=project_request.customizations,
            technology_preferences=project_request.technology_notes
        )
        
        # Set technologies
        project.technologies.set(project_request.preferred_technologies.all())
        
        # Update request
        project_request.status = 'converted'
        project_request.converted_project = project
        project_request.save()
        
        return Response({
            'message': 'Request converted to project successfully',
            'project_id': project.id,
            'project_slug': project.slug
        })


class ProjectViewSet(viewsets.ModelViewSet):
    """ViewSet for projects"""
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # For anonymous users, show only public projects
        if not self.request.user.is_authenticated:
            return queryset.filter(is_public=True)
        
        # For authenticated staff users, show all projects
        if self.request.user.is_staff:
            return queryset
            
        # For authenticated regular users, show only their own projects
        return queryset.filter(
            Q(client=self.request.user) | 
            Q(assigned_users=self.request.user)
        ).distinct()


class DashboardStatsAPIView(APIView):
    """API view for dashboard statistics"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        if not request.user.is_staff:
            # Client dashboard stats
            stats = {
                'total_projects': Project.objects.filter(client=request.user).count(),
                'active_projects': Project.objects.filter(
                    client=request.user, 
                    status__in=['planning', 'in_progress']
                ).count(),
                'completed_projects': Project.objects.filter(
                    client=request.user, 
                    status='completed'
                ).count(),
                'pending_requests': ProjectRequest.objects.filter(
                    client=request.user,
                    status__in=['pending', 'reviewing']
                ).count(),
            }
        else:
            # Admin dashboard stats
            stats = {
                'total_projects': Project.objects.count(),
                'active_projects': Project.objects.filter(status__in=['planning', 'in_progress']).count(),
                'pending_requests': ProjectRequest.objects.filter(status='pending').count(),
                'total_templates': ProjectTemplate.objects.filter(status='active').count(),
                'recent_requests': ProjectRequestSerializer(
                    ProjectRequest.objects.order_by('-created_at')[:5], 
                    many=True
                ).data,
                'project_stats_by_type': Project.objects.values('user_type').annotate(
                    count=Count('id')
                ),
                'request_stats_by_status': ProjectRequest.objects.values('status').annotate(
                    count=Count('id')
                ),
            }
        
        return Response(stats)


class PublicDataAPIView(APIView):
    """API view for public data (categories, technologies, etc.)"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        data = {
            'categories': ProjectCategorySerializer(
                ProjectCategory.objects.filter(is_active=True), 
                many=True
            ).data,
            'technologies': {
                'frontend': TechnologyStackSerializer(
                    TechnologyStack.objects.filter(category='frontend', is_active=True),
                    many=True
                ).data,
                'backend': TechnologyStackSerializer(
                    TechnologyStack.objects.filter(category='backend', is_active=True),
                    many=True
                ).data,
                'database': TechnologyStackSerializer(
                    TechnologyStack.objects.filter(category='database', is_active=True),
                    many=True
                ).data,
                'mobile': TechnologyStackSerializer(
                    TechnologyStack.objects.filter(category='mobile', is_active=True),
                    many=True
                ).data,
                'other': TechnologyStackSerializer(
                    TechnologyStack.objects.filter(category='other', is_active=True),
                    many=True
                ).data,
            },
            'service_packages': {
                'student': ServicePackageSerializer(
                    ServicePackage.objects.filter(user_type='student', is_active=True),
                    many=True
                ).data,
                'client': ServicePackageSerializer(
                    ServicePackage.objects.filter(user_type='client', is_active=True),
                    many=True
                ).data,
                'business': ServicePackageSerializer(
                    ServicePackage.objects.filter(user_type='business', is_active=True),
                    many=True
                ).data,
            },
            'course_categories': CourseCategorySerializer(
                CourseCategory.objects.filter(is_active=True),
                many=True
            ).data,
        }
        
        return Response(data)
        return ProjectSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role in ['ceo', 'admin']:
            return Project.objects.all()
        elif user.role in ['technician', 'designer']:
            return Project.objects.filter(
                Q(lead_developer=user) | Q(team_members=user)
            )
        elif user.role == 'client':
            return Project.objects.filter(client=user)
        return Project.objects.none()
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def update_status(self, request, slug=None):
        """Update project status"""
        project = self.get_object()
        user = request.user
        
        # Check permissions
        if user.role not in ['ceo', 'admin'] and user != project.lead_developer:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        new_status = request.data.get('status')
        if new_status in dict(Project.STATUS_CHOICES):
            project.status = new_status
            project.save()
            
            serializer = ProjectSerializer(project)
            return Response(serializer.data)
        
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_milestone(self, request, slug=None):
        """Add milestone to project"""
        project = self.get_object()
        user = request.user
        
        # Check permissions
        if user.role not in ['ceo', 'admin'] and user != project.lead_developer:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ProjectMilestoneSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(project=project)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_projects(self, request):
        """Get user's projects"""
        user = request.user
        if user.role == 'client':
            projects = Project.objects.filter(client=user)
        elif user.role in ['technician', 'designer']:
            projects = Project.objects.filter(
                Q(lead_developer=user) | Q(team_members=user)
            )
        else:
            projects = Project.objects.all()
        
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)


class ProjectMilestoneViewSet(viewsets.ModelViewSet):
    """ViewSet for project milestones"""
    queryset = ProjectMilestone.objects.all()
    serializer_class = ProjectMilestoneSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        project_slug = self.request.query_params.get('project')
        if project_slug:
            return ProjectMilestone.objects.filter(project__slug=project_slug)
        return ProjectMilestone.objects.all()
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def complete(self, request, pk=None):
        """Mark milestone as completed"""
        milestone = self.get_object()
        user = request.user
        
        # Check permissions
        project = milestone.project
        if user.role not in ['ceo', 'admin'] and user != project.lead_developer:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        milestone.status = 'completed'
        milestone.save()
        
        serializer = ProjectMilestoneSerializer(milestone)
        return Response(serializer.data)


class ProjectRequestViewSet(viewsets.ModelViewSet):
    """ViewSet for project requests"""
    queryset = ProjectRequest.objects.all()
    serializer_class = ProjectRequestSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.role in ['ceo', 'admin']:
                return ProjectRequest.objects.all()
            elif user.role == 'client':
                return ProjectRequest.objects.filter(client=user)
        return ProjectRequest.objects.none()
    
    def create(self, request, *args, **kwargs):
        """Submit project request"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            if request.user.is_authenticated:
                serializer.save(client=request.user)
            else:
                serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def review(self, request, pk=None):
        """Review project request (admin only)"""
        if request.user.role not in ['ceo', 'admin']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        project_request = self.get_object()
        new_status = request.data.get('status')
        
        if new_status in dict(ProjectRequest.STATUS_CHOICES):
            project_request.status = new_status
            project_request.save()
            
            serializer = ProjectRequestSerializer(project_request)
            return Response(serializer.data)
        
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
