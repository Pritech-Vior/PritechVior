from rest_framework import serializers
from .models import (
    Project, ProjectMilestone, ProjectRequest, ProjectRequestCommunication,
    ProjectTemplate, ProjectCategory, TechnologyStack, ServicePackage,
    CourseCategory
)
from django.contrib.auth import get_user_model

User = get_user_model()


class ProjectCategorySerializer(serializers.ModelSerializer):
    """Serializer for project categories"""
    
    class Meta:
        model = ProjectCategory
        fields = ['id', 'name', 'description', 'icon', 'color', 'slug', 'order']


class TechnologyStackSerializer(serializers.ModelSerializer):
    """Serializer for technology stacks"""
    
    class Meta:
        model = TechnologyStack
        fields = ['id', 'name', 'description', 'icon', 'category']


class ServicePackageSerializer(serializers.ModelSerializer):
    """Serializer for service packages"""
    
    class Meta:
        model = ServicePackage
        fields = ['id', 'name', 'description', 'user_type', 'price', 'features', 'order']


class CourseCategorySerializer(serializers.ModelSerializer):
    """Serializer for course categories"""
    
    class Meta:
        model = CourseCategory
        fields = ['id', 'name', 'description', 'user_type']


class ProjectTemplateSerializer(serializers.ModelSerializer):
    """Serializer for project templates"""
    category = ProjectCategorySerializer(read_only=True)
    technologies = TechnologyStackSerializer(many=True, read_only=True)
    
    class Meta:
        model = ProjectTemplate
        fields = [
            'id', 'title', 'description', 'slug', 'category', 'technologies',
            'base_price', 'student_price', 'features', 'customizable_features',
            'estimated_duration', 'thumbnail', 'gallery', 'is_featured',
            'view_count', 'request_count', 'created_at'
        ]


class ProjectTemplateDetailSerializer(ProjectTemplateSerializer):
    """Detailed project template serializer"""
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Add pricing based on user type if provided in context
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user_type = request.GET.get('user_type', 'client')
            data['price'] = instance.get_price_for_user_type(user_type)
        return data


class ProjectMilestoneSerializer(serializers.ModelSerializer):
    """Serializer for project milestones"""
    is_overdue = serializers.ReadOnlyField()
    
    class Meta:
        model = ProjectMilestone
        fields = [
            'id', 'name', 'description', 'amount', 'status', 'due_date',
            'completed_date', 'order', 'deliverables', 'is_overdue'
        ]


class ProjectSerializer(serializers.ModelSerializer):
    """Serializer for projects"""
    client = serializers.StringRelatedField(read_only=True)
    category = ProjectCategorySerializer(read_only=True)
    course_category = CourseCategorySerializer(read_only=True)
    technologies = TechnologyStackSerializer(many=True, read_only=True)
    service_package = ServicePackageSerializer(read_only=True)
    template = ProjectTemplateSerializer(read_only=True)
    is_overdue = serializers.ReadOnlyField()
    days_remaining = serializers.ReadOnlyField()
    team_size = serializers.ReadOnlyField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'slug', 'user_type', 'category',
            'template', 'course_category', 'academic_level', 'status', 'priority',
            'client', 'budget', 'estimated_cost', 'start_date', 'end_date',
            'deadline', 'technologies', 'service_package', 'progress_percentage',
            'repository_url', 'live_demo_url', 'contact_phone', 'contact_email',
            'is_public', 'is_requestable', 'is_overdue', 'days_remaining', 'team_size', 
            'created_at', 'updated_at'
        ]


class ProjectDetailSerializer(ProjectSerializer):
    """Detailed project serializer with milestones"""
    milestones = ProjectMilestoneSerializer(many=True, read_only=True)
    assigned_users = serializers.StringRelatedField(many=True, read_only=True)
    project_manager = serializers.StringRelatedField(read_only=True)
    
    class Meta(ProjectSerializer.Meta):
        fields = ProjectSerializer.Meta.fields + [
            'milestones', 'assigned_users', 'project_manager', 'requirements',
            'technology_preferences', 'customizations'
        ]


class ProjectRequestCommunicationSerializer(serializers.ModelSerializer):
    """Serializer for project request communications"""
    sender = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = ProjectRequestCommunication
        fields = [
            'id', 'sender', 'sender_type', 'message', 'attachments',
            'is_internal', 'created_at'
        ]


class ProjectRequestSerializer(serializers.ModelSerializer):
    """Serializer for project requests"""
    client = serializers.StringRelatedField(read_only=True)
    course_category = CourseCategorySerializer(read_only=True)
    template = ProjectTemplateSerializer(read_only=True)
    preferred_technologies = TechnologyStackSerializer(many=True, read_only=True)
    service_package = ServicePackageSerializer(read_only=True)
    converted_project = ProjectSerializer(read_only=True)
    
    class Meta:
        model = ProjectRequest
        fields = [
            'id', 'request_id', 'title', 'description', 'requirements',
            'request_type', 'user_type', 'course_category', 'academic_level',
            'institution', 'template', 'customizations', 'preferred_technologies',
            'technology_notes', 'features_required', 'additional_features',
            'budget_range', 'preferred_deadline', 'timeline_flexibility',
            'service_package', 'client', 'contact_phone', 'contact_email',
            'status', 'estimated_cost', 'quoted_price', 'estimated_duration',
            'converted_project', 'client_notes', 'created_at', 'updated_at'
        ]


class ProjectRequestDetailSerializer(ProjectRequestSerializer):
    """Detailed project request serializer with communications"""
    communications = ProjectRequestCommunicationSerializer(many=True, read_only=True)
    assigned_to = serializers.StringRelatedField(read_only=True)
    
    class Meta(ProjectRequestSerializer.Meta):
        fields = ProjectRequestSerializer.Meta.fields + [
            'communications', 'assigned_to', 'internal_notes', 'reviewed_at'
        ]


class ProjectRequestCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating project requests"""
    preferred_technologies = serializers.PrimaryKeyRelatedField(
        many=True, queryset=TechnologyStack.objects.filter(is_active=True), required=False
    )
    course_category = serializers.PrimaryKeyRelatedField(
        queryset=CourseCategory.objects.filter(is_active=True), required=False
    )
    template = serializers.PrimaryKeyRelatedField(
        queryset=ProjectTemplate.objects.filter(status='active'), required=False
    )
    service_package = serializers.PrimaryKeyRelatedField(
        queryset=ServicePackage.objects.filter(is_active=True), required=False
    )
    
    class Meta:
        model = ProjectRequest
        fields = [
            'title', 'description', 'requirements', 'request_type', 'user_type',
            'course_category', 'academic_level', 'institution', 'template',
            'customizations', 'preferred_technologies', 'technology_notes',
            'features_required', 'additional_features', 'budget_range',
            'preferred_deadline', 'timeline_flexibility', 'service_package',
            'contact_phone', 'contact_email', 'client_notes'
        ]
    
    def create(self, validated_data):
        # Extract many-to-many fields
        preferred_technologies = validated_data.pop('preferred_technologies', [])
        
        # Create the request
        request = ProjectRequest.objects.create(**validated_data)
        
        # Set many-to-many relationships
        request.preferred_technologies.set(preferred_technologies)
        
        return request


class ProjectRequestUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating project requests (staff only)"""
    
    class Meta:
        model = ProjectRequest
        fields = [
            'status', 'assigned_to', 'estimated_cost', 'quoted_price',
            'estimated_duration', 'internal_notes'
        ]
