from rest_framework import serializers
from .models import Course, Lesson, Enrollment, CourseReview
from users.models import User


class LessonSerializer(serializers.ModelSerializer):
    """Serializer for course lessons"""
    
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'slug', 'content', 'order', 'duration_minutes', 'is_free']


class CourseSerializer(serializers.ModelSerializer):
    """Serializer for ThinkForge courses"""
    instructor = serializers.StringRelatedField(read_only=True)
    duration_display = serializers.ReadOnlyField()
    modules = serializers.ReadOnlyField()
    projects = serializers.ReadOnlyField()
    enrolled = serializers.ReadOnlyField()
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'slug', 'description', 'short_description',
            'instructor', 'category', 'difficulty', 'status', 'price',
            'duration_hours', 'duration_weeks', 'duration_display',
            'module_count', 'modules', 'project_count', 'projects',
            'enrollment_count', 'enrolled', 'rating', 'featured',
            'created_at', 'updated_at'
        ]


class CourseDetailSerializer(CourseSerializer):
    """Detailed course serializer with lessons"""
    lessons = LessonSerializer(many=True, read_only=True)
    
    class Meta(CourseSerializer.Meta):
        fields = CourseSerializer.Meta.fields + ['lessons']


class EnrollmentSerializer(serializers.ModelSerializer):
    """Serializer for course enrollments"""
    student = serializers.StringRelatedField(read_only=True)
    course = CourseSerializer(read_only=True)
    
    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'course', 'status', 'progress', 'enrolled_at', 'completed_at']


class CourseReviewSerializer(serializers.ModelSerializer):
    """Serializer for course reviews"""
    student = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = CourseReview
        fields = ['id', 'student', 'rating', 'review_text', 'created_at']
