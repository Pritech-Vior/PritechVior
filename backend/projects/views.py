from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.db.models import Q
import django_filters.rest_framework as filters

from .models import Project, ProjectMilestone, ProjectRequest
from .serializers import (
    ProjectSerializer, ProjectDetailSerializer, ProjectMilestoneSerializer,
    ProjectRequestSerializer
)


class ProjectFilter(filters.FilterSet):
    """Filter for projects"""
    client = filters.CharFilter(field_name='client__username', lookup_expr='icontains')
    category = filters.CharFilter(field_name='category', lookup_expr='icontains')
    project_type = filters.CharFilter(field_name='project_type')
    status = filters.CharFilter(field_name='status')
    priority = filters.CharFilter(field_name='priority')
    search = filters.CharFilter(method='filter_search')
    budget_min = filters.NumberFilter(field_name='budget', lookup_expr='gte')
    budget_max = filters.NumberFilter(field_name='budget', lookup_expr='lte')
    
    class Meta:
        model = Project
        fields = ['category', 'project_type', 'status', 'priority']
    
    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) |
            Q(description__icontains=value) |
            Q(tech_stack__icontains=value)
        )


class ProjectViewSet(viewsets.ModelViewSet):
    """ViewSet for projects"""
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = ProjectFilter
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
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
