from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.db.models import Q, Avg
import django_filters.rest_framework as filters

from .models import Course, Lesson, Enrollment, CourseReview
from .serializers import (
    CourseSerializer, CourseDetailSerializer, LessonSerializer,
    EnrollmentSerializer, CourseReviewSerializer
)


class CourseFilter(filters.FilterSet):
    """Filter for ThinkForge courses"""
    category = filters.CharFilter(field_name='category', lookup_expr='icontains')
    difficulty = filters.CharFilter(field_name='difficulty')
    price_min = filters.NumberFilter(field_name='price', lookup_expr='gte')
    price_max = filters.NumberFilter(field_name='price', lookup_expr='lte')
    rating_min = filters.NumberFilter(field_name='rating', lookup_expr='gte')
    instructor = filters.CharFilter(field_name='instructor__username', lookup_expr='icontains')
    search = filters.CharFilter(method='filter_search')
    
    class Meta:
        model = Course
        fields = ['category', 'difficulty', 'status', 'featured']
    
    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) |
            Q(description__icontains=value) |
            Q(short_description__icontains=value) |
            Q(instructor__username__icontains=value)
        )


class CourseViewSet(viewsets.ModelViewSet):
    """ViewSet for ThinkForge courses"""
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = CourseFilter
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return CourseSerializer
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def enroll(self, request, slug=None):
        """Enroll student in course"""
        course = self.get_object()
        student = request.user
        
        # Check if already enrolled
        if Enrollment.objects.filter(student=student, course=course).exists():
            return Response({'error': 'Already enrolled'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create enrollment
        enrollment = Enrollment.objects.create(
            student=student,
            course=course,
            status='active'
        )
        
        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def review(self, request, slug=None):
        """Add course review"""
        course = self.get_object()
        student = request.user
        
        # Check if enrolled
        if not Enrollment.objects.filter(student=student, course=course).exists():
            return Response({'error': 'Must be enrolled to review'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if already reviewed
        if CourseReview.objects.filter(student=student, course=course).exists():
            return Response({'error': 'Already reviewed'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = CourseReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(student=student, course=course)
            
            # Update course rating
            avg_rating = CourseReview.objects.filter(course=course).aggregate(
                avg_rating=Avg('rating')
            )['avg_rating']
            course.rating = round(avg_rating, 1) if avg_rating else 0
            course.save()
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_courses(self, request):
        """Get user's enrolled courses"""
        enrollments = Enrollment.objects.filter(student=request.user)
        courses = [enrollment.course for enrollment in enrollments]
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)


class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for course lessons"""
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    
    def get_queryset(self):
        course_slug = self.request.query_params.get('course')
        if course_slug:
            return Lesson.objects.filter(course__slug=course_slug)
        return Lesson.objects.all()


class EnrollmentViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for enrollments"""
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Enrollment.objects.filter(student=self.request.user)
    
    @action(detail=True, methods=['patch'])
    def update_progress(self, request, pk=None):
        """Update course progress"""
        enrollment = self.get_object()
        progress = request.data.get('progress', enrollment.progress)
        
        if 0 <= progress <= 100:
            enrollment.progress = progress
            if progress == 100:
                enrollment.status = 'completed'
                enrollment.save()
            else:
                enrollment.save()
            
            serializer = EnrollmentSerializer(enrollment)
            return Response(serializer.data)
        
        return Response({'error': 'Invalid progress value'}, status=status.HTTP_400_BAD_REQUEST)


class CourseReviewViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for course reviews"""
    queryset = CourseReview.objects.all()
    serializer_class = CourseReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        course_slug = self.request.query_params.get('course')
        if course_slug:
            return CourseReview.objects.filter(course__slug=course_slug)
        return CourseReview.objects.all()
