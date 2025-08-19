from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from django.db.models import Q
import django_filters.rest_framework as filters

from .models import (
    BlogPost, NewsletterSubscription, BlogLike, BlogComment,
    BlogImage, BlogDownload, BlogDownloadRequest, Category
)
from .serializers import (
    BlogPostSerializer, BlogPostListSerializer, NewsletterSubscriptionSerializer,
    BlogLikeSerializer, BlogCommentSerializer, BlogImageSerializer,
    BlogDownloadSerializer, BlogDownloadRequestSerializer, CategorySerializer
)


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
        if self.request.user.is_authenticated and hasattr(self.request.user, 'role') and self.request.user.role in ['ceo', 'admin', 'writer']:
            return BlogPost.objects.all()
        return BlogPost.objects.filter(status='published')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return BlogPostListSerializer
        return BlogPostSerializer
    
    def retrieve(self, request, *args, **kwargs):
        """Override retrieve to increment view count"""
        instance = self.get_object()
        instance.increment_views()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, slug=None):
        """Like or unlike a blog post"""
        post = self.get_object()
        user = request.user
        
        like, created = BlogLike.objects.get_or_create(post=post, user=user)
        
        if not created:
            # Unlike the post
            like.delete()
            return Response({
                'liked': False,
                'like_count': post.like_count
            })
        else:
            # Like the post
            return Response({
                'liked': True,
                'like_count': post.like_count
            })
    
    @action(detail=True, methods=['get'])
    def likes(self, request, slug=None):
        """Get all likes for a post"""
        post = self.get_object()
        likes = post.likes.all()
        serializer = BlogLikeSerializer(likes, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_comment(self, request, slug=None):
        """Add a comment to a blog post"""
        post = self.get_object()
        serializer = BlogCommentSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(user=request.user, post=post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def comments(self, request, slug=None):
        """Get all comments for a post"""
        post = self.get_object()
        comments = post.comments.filter(is_approved=True, parent=None)  # Only top-level comments
        serializer = BlogCommentSerializer(comments, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def images(self, request, slug=None):
        """Get all images for a post"""
        post = self.get_object()
        images = post.images.all()
        serializer = BlogImageSerializer(images, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def downloads(self, request, slug=None):
        """Get all downloads for a post"""
        post = self.get_object()
        downloads = post.downloads.all()
        serializer = BlogDownloadSerializer(downloads, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def download_file(self, request, slug=None):
        """Download a specific file"""
        post = self.get_object()
        download_id = request.data.get('download_id')
        
        try:
            download = post.downloads.get(id=download_id)
        except BlogDownload.DoesNotExist:
            return Response({'error': 'Download not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if premium content requires authentication
        if download.is_premium and not request.user.is_authenticated:
            return Response({'error': 'Authentication required for premium downloads'}, 
                          status=status.HTTP_401_UNAUTHORIZED)
        
        # Increment download count
        download.increment_download_count()
        
        return Response({
            'download_url': download.download_source,
            'title': download.title,
            'file_type': download.file_type,
            'file_size': download.file_size
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def request_download(self, request, slug=None):
        """Request access to premium download"""
        post = self.get_object()
        download_id = request.data.get('download_id')
        
        try:
            download = post.downloads.get(id=download_id)
        except BlogDownload.DoesNotExist:
            return Response({'error': 'Download not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if already requested
        existing_request = BlogDownloadRequest.objects.filter(
            download=download, user=request.user
        ).first()
        
        if existing_request:
            status_messages = {
                'pending': 'Your download request is being processed.',
                'approved': 'Your download request has been approved. Check your email.',
                'sent': 'Download instructions have been sent to your email.',
                'rejected': 'Your previous download request was rejected.'
            }
            
            message = status_messages.get(existing_request.status, 'You have already requested this download.')
            
            if existing_request.status == 'rejected':
                existing_request.delete()
            else:
                return Response({
                    'error': message,
                    'status': existing_request.status
                }, status=status.HTTP_409_CONFLICT)
        
        # Create new download request
        serializer = BlogDownloadRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, download=download)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured blog posts"""
        featured_posts = BlogPost.objects.filter(status='published', featured=True)
        serializer = BlogPostListSerializer(featured_posts, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent blog posts"""
        recent_posts = BlogPost.objects.filter(status='published').order_by('-created_at')[:5]
        serializer = BlogPostListSerializer(recent_posts, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get popular blog posts"""
        popular_posts = BlogPost.objects.filter(status='published').order_by('-views')[:5]
        serializer = BlogPostListSerializer(popular_posts, many=True, context={'request': request})
        return Response(serializer.data)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for blog categories"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class BlogCommentViewSet(viewsets.ModelViewSet):
    """ViewSet for blog comments"""
    queryset = BlogComment.objects.filter(is_approved=True)
    serializer_class = BlogCommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        post_slug = self.request.query_params.get('post')
        if post_slug:
            return BlogComment.objects.filter(
                post__slug=post_slug, 
                is_approved=True,
                parent=None  # Only top-level comments
            )
        return BlogComment.objects.filter(is_approved=True)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BlogDownloadRequestViewSet(viewsets.ModelViewSet):
    """ViewSet for blog download requests"""
    queryset = BlogDownloadRequest.objects.all()
    serializer_class = BlogDownloadRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if hasattr(self.request.user, 'role') and self.request.user.role in ['ceo', 'admin']:
            return BlogDownloadRequest.objects.all()
        return BlogDownloadRequest.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def approve(self, request, pk=None):
        """Approve download request (admin only)"""
        if not (hasattr(request.user, 'role') and request.user.role in ['ceo', 'admin']):
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        download_request = self.get_object()
        download_request.status = 'approved'
        download_request.save()
        
        serializer = BlogDownloadRequestSerializer(download_request)
        return Response(serializer.data)


class NewsletterSubscriptionViewSet(viewsets.ModelViewSet):
    """ViewSet for newsletter subscriptions"""
    queryset = NewsletterSubscription.objects.all()
    serializer_class = NewsletterSubscriptionSerializer
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'create':
            # Allow anyone to subscribe to newsletter
            permission_classes = [AllowAny]
        else:
            # Only authenticated users can view/manage subscriptions
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.role in ['ceo', 'admin']:
            return NewsletterSubscription.objects.all()
        return NewsletterSubscription.objects.none()
    
    def create(self, request, *args, **kwargs):
        """Subscribe to newsletter"""
        email = request.data.get('email')
        
        # Check if already subscribed
        if NewsletterSubscription.objects.filter(email=email).exists():
            existing_subscription = NewsletterSubscription.objects.get(email=email)
            if existing_subscription.is_active:
                return Response({
                    'message': 'You are already subscribed to our newsletter!',
                    'already_subscribed': True
                }, status=status.HTTP_200_OK)
            else:
                # Reactivate inactive subscription
                existing_subscription.is_active = True
                existing_subscription.save()
                return Response({
                    'message': 'Welcome back! Your subscription has been reactivated.',
                    'reactivated': True
                }, status=status.HTTP_200_OK)
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Successfully subscribed to our newsletter!',
                'subscribed': True
            }, status=status.HTTP_201_CREATED)
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
