from rest_framework import serializers
from .models import Project, ProjectMilestone, ProjectRequest


class ProjectMilestoneSerializer(serializers.ModelSerializer):
    """Serializer for project milestones"""
    
    class Meta:
        model = ProjectMilestone
        fields = ['id', 'title', 'description', 'due_date', 'status', 'completed_date']


class ProjectSerializer(serializers.ModelSerializer):
    """Serializer for projects"""
    client = serializers.StringRelatedField(read_only=True)
    lead_developer = serializers.StringRelatedField(read_only=True)
    team_members = serializers.StringRelatedField(many=True, read_only=True)
    progress_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'description', 'client', 'lead_developer',
            'team_members', 'project_type', 'category', 'status', 'priority',
            'budget', 'start_date', 'end_date', 'progress_percentage',
            'tech_stack', 'features', 'requirements', 'created_at', 'updated_at'
        ]


class ProjectDetailSerializer(ProjectSerializer):
    """Detailed project serializer with milestones"""
    milestones = ProjectMilestoneSerializer(many=True, read_only=True)
    
    class Meta(ProjectSerializer.Meta):
        fields = ProjectSerializer.Meta.fields + ['milestones']


class ProjectRequestSerializer(serializers.ModelSerializer):
    """Serializer for project requests"""
    client = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = ProjectRequest
        fields = [
            'id', 'client', 'project_title', 'description', 'project_type',
            'budget_range', 'timeline', 'contact_info', 'status',
            'submitted_at', 'reviewed_at'
        ]
