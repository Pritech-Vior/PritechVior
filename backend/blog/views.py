from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.db.models import Q
import django_filters.rest_framework as filters

from .models import BlogPost, NewsletterSubscription
from .serializers import BlogPostSerializer, NewsletterSubscriptionSerializer


class BlogPostFilter(filters.FilterSet):
    """Filter for blog posts"""
    category = filters.CharFilter(field_name='category', lookup_expr='icontains')
    author = filters.CharFilter(field_name='author__username', lookup_expr='icontains')
    search = filters.CharFilter(method='filter_search')
    date_from = filters.DateFilter(field_name='created_at', lookup_expr='gte')
    date_to = filters.DateFilter(field_name='created_at', lookup_expr='lte')
    
    class Meta:
        model = BlogPost
        fields = ['category', 'featured', 'status']
    
    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) |
            Q(content__icontains=value) |
            Q(tags__icontains=value)
        )


class BlogPostViewSet(viewsets.ModelViewSet):
    """ViewSet for blog posts"""
    queryset = BlogPost.objects.filter(status='published')
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = BlogPostFilter
    lookup_field = 'slug'
    
    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.role in ['ceo', 'admin', 'writer']:
            return BlogPost.objects.all()
        return BlogPost.objects.filter(is_published=True)
    
    def retrieve(self, request, *args, **kwargs):
        """Override retrieve to increment view count"""
        instance = self.get_object()
        instance.views += 1
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured blog posts"""
        featured_posts = BlogPost.objects.filter(is_published=True, is_featured=True)
        serializer = BlogPostSerializer(featured_posts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent blog posts"""
        recent_posts = BlogPost.objects.filter(is_published=True).order_by('-created_at')[:5]
        serializer = BlogPostSerializer(recent_posts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get popular blog posts"""
        popular_posts = BlogPost.objects.filter(is_published=True).order_by('-views')[:5]
        serializer = BlogPostSerializer(popular_posts, many=True)
        return Response(serializer.data)


class NewsletterSubscriptionViewSet(viewsets.ModelViewSet):
    """ViewSet for newsletter subscriptions"""
    queryset = NewsletterSubscription.objects.all()
    serializer_class = NewsletterSubscriptionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.role in ['ceo', 'admin']:
            return NewsletterSubscription.objects.all()
        return NewsletterSubscription.objects.none()
    
    def create(self, request, *args, **kwargs):
        """Subscribe to newsletter"""
        email = request.data.get('email')
        
        # Check if already subscribed
        if NewsletterSubscription.objects.filter(email=email).exists():
            return Response({'error': 'Already subscribed'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Successfully subscribed'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def unsubscribe(self, request):
        """Unsubscribe from newsletter"""
        email = request.data.get('email')
        
        try:
            subscription = NewsletterSubscription.objects.get(email=email)
            subscription.is_active = False
            subscription.save()
            return Response({'message': 'Successfully unsubscribed'})
        except NewsletterSubscription.DoesNotExist:
            return Response({'error': 'Email not found'}, status=status.HTTP_404_NOT_FOUND)
