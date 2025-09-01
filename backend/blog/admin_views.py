from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
import django_filters.rest_framework as filters

from .models import BlogPost, BlogImage, BlogDownload, Category
from .serializers import BlogDownloadSerializer, CategorySerializer
from .admin_serializers import AdminBlogPostSerializer, AdminBlogImageSerializer


class AdminBlogPostViewSet(viewsets.ModelViewSet):
    """Admin ViewSet for blog posts with full CRUD permissions"""
    queryset = BlogPost.objects.all()
    serializer_class = AdminBlogPostSerializer
    permission_classes = [IsAuthenticated]  # Use same as working endpoints
    lookup_field = 'slug'
    
    def check_admin_permission(self, request):
        """Check if user has admin permissions - same logic as working endpoints"""
        user = request.user
        if not (user.is_staff or user.is_superuser or user.role in ['admin', 'ceo', 'treasury', 'writer']):
            return Response({
                'error': 'Admin access required',
                'user_role': user.role,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser
            }, status=status.HTTP_403_FORBIDDEN)
        return None
    
    def list(self, request, *args, **kwargs):
        """Override list to check admin permissions"""
        permission_error = self.check_admin_permission(request)
        if permission_error:
            return permission_error
        return super().list(request, *args, **kwargs)
    
    def retrieve(self, request, *args, **kwargs):
        """Override retrieve to check admin permissions"""
        permission_error = self.check_admin_permission(request)
        if permission_error:
            return permission_error
        return super().retrieve(request, *args, **kwargs)
    
    def create(self, request, *args, **kwargs):
        """Override create to check admin permissions and provide detailed error logging"""
        permission_error = self.check_admin_permission(request)
        if permission_error:
            return permission_error
        
        print(f"=== BLOG CREATE REQUEST DEBUG ===")
        print(f"User: {request.user.username}, Role: {request.user.role}")
        print(f"Request data keys: {list(request.data.keys()) if hasattr(request.data, 'keys') else 'Not a dict'}")
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            print(f"=== CREATE SERIALIZER VALIDATION PASSED ===")
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            print(f"=== CREATE SERIALIZER VALIDATION FAILED ===")
            print(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        """Override update to check admin permissions and handle partial updates properly"""
        permission_error = self.check_admin_permission(request)
        if permission_error:
            return permission_error
            
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Enhanced debugging
        print(f"=== BLOG UPDATE REQUEST DEBUG ===")
        print(f"User: {request.user.username}, Role: {request.user.role}")
        print(f"Request method: {request.method}")
        print(f"Partial update: {partial}")
        print(f"Request data keys: {list(request.data.keys()) if hasattr(request.data, 'keys') else 'Not a dict'}")
        
        # Log current instance state
        print(f"=== CURRENT INSTANCE STATE ===")
        print(f"Title: '{instance.title}'")
        print(f"Status: '{instance.status}'")
        print(f"Content length: {len(instance.content)}")
        print(f"Image: '{instance.image}'")
        print(f"Featured: {instance.featured}")
        print(f"Tags: {instance.tags}")
        print(f"Category: '{instance.category}'")
        print(f"Excerpt: '{instance.excerpt[:50]}...' (truncated)")
        print(f"Gallery images count: {instance.images.count()}")
        
        # Log specific fields being updated
        updateable_fields = ['title', 'content', 'excerpt', 'category', 'tags', 'image', 'video_url', 'status', 'featured', 'meta_description']
        print(f"=== FIELD CHANGES DETECTED ===")
        changes_detected = False
        for field in updateable_fields:
            if field in request.data:
                current_value = getattr(instance, field, None)
                new_value = request.data[field]
                if current_value != new_value:
                    print(f"✓ Field '{field}' changing: '{current_value}' -> '{new_value}'")
                    changes_detected = True
                else:
                    print(f"- Field '{field}' unchanged: '{current_value}'")
        
        if not changes_detected:
            print(f"⚠️  NO CHANGES DETECTED in updateable fields!")
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            print(f"=== UPDATE SERIALIZER VALIDATION PASSED ===")
            self.perform_update(serializer)
            
            # Refresh from database to get updated values
            instance.refresh_from_db()
            
            # Log the updated state
            print(f"=== UPDATED INSTANCE STATE ===")
            print(f"Title: '{instance.title}'")
            print(f"Status: '{instance.status}'")
            print(f"Content length: {len(instance.content)}")
            print(f"Image: '{instance.image}'")
            print(f"Featured: {instance.featured}")
            print(f"Tags: {instance.tags}")
            print(f"Category: '{instance.category}'")
            print(f"Gallery images count: {instance.images.count()}")
            print(f"Last updated: {instance.updated_at}")
            
            # Return fresh serialized data
            response_serializer = self.get_serializer(instance)
            return Response(response_serializer.data)
        else:
            print(f"=== UPDATE SERIALIZER VALIDATION FAILED ===")
            print(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def partial_update(self, request, *args, **kwargs):
        """Handle PATCH requests"""
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        """Override destroy to check admin permissions"""
        permission_error = self.check_admin_permission(request)
        if permission_error:
            return permission_error
        return super().destroy(request, *args, **kwargs)
    
    def get_queryset(self):
        # Admin can see all posts regardless of status
        return BlogPost.objects.all()
    
    def perform_create(self, serializer):
        # Set the author to the current user
        print(f"=== PERFORMING CREATE ===")
        serializer.save(author=self.request.user)
        print(f"=== CREATE COMPLETED ===")
    
    def perform_update(self, serializer):
        # Allow admin to update any post
        print(f"=== PERFORMING UPDATE ===")
        serializer.save()
        print(f"=== UPDATE COMPLETED ===")
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, slug=None):
        """Update only the status of a blog post"""
        permission_error = self.check_admin_permission(request)
        if permission_error:
            return permission_error
            
        post = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(BlogPost.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        post.status = new_status
        post.save(update_fields=['status'])
        
        serializer = self.get_serializer(post)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def toggle_featured(self, request, slug=None):
        """Toggle featured status of a blog post"""
        permission_error = self.check_admin_permission(request)
        if permission_error:
            return permission_error
            
        post = self.get_object()
        post.featured = not post.featured
        post.save(update_fields=['featured'])
        
        serializer = self.get_serializer(post)
        return Response(serializer.data)
    
    @action(detail=True, methods=['delete'])
    def delete_gallery_image(self, request, slug=None):
        """Delete a specific gallery image from a blog post"""
        permission_error = self.check_admin_permission(request)
        if permission_error:
            return permission_error
        
        post = self.get_object()
        image_id = request.data.get('image_id')
        
        if not image_id:
            return Response(
                {'error': 'image_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            image = BlogImage.objects.get(id=image_id, post=post)
            image.delete()
            print(f"✓ Deleted gallery image {image_id} from post {post.slug}")
            
            # Return updated post data
            serializer = self.get_serializer(post)
            return Response(serializer.data)
        except BlogImage.DoesNotExist:
            return Response(
                {'error': 'Image not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def add_gallery_image(self, request, slug=None):
        """Add a new gallery image to a blog post"""
        permission_error = self.check_admin_permission(request)
        if permission_error:
            return permission_error
        
        post = self.get_object()
        
        # Create new gallery image
        image_data = request.data.copy()
        image_data['post'] = post.id
        
        serializer = AdminBlogImageSerializer(data=image_data)
        
        if serializer.is_valid():
            serializer.save()
            print(f"✓ Added new gallery image to post {post.slug}")
            
            # Return updated post data
            post_serializer = self.get_serializer(post)
            return Response(post_serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def drafts(self, request):
        """Get all draft posts"""
        permission_error = self.check_admin_permission(request)
        if permission_error:
            return permission_error
            
        drafts = self.get_queryset().filter(status='draft')
        serializer = self.get_serializer(drafts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def published(self, request):
        """Get all published posts"""
        permission_error = self.check_admin_permission(request)
        if permission_error:
            return permission_error
            
        published = self.get_queryset().filter(status='published')
        serializer = self.get_serializer(published, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def archived(self, request):
        """Get all archived posts"""
        permission_error = self.check_admin_permission(request)
        if permission_error:
            return permission_error
            
        archived = self.get_queryset().filter(status='archived')
        serializer = self.get_serializer(archived, many=True)
        return Response(serializer.data)


class AdminBlogImageViewSet(viewsets.ModelViewSet):
    """Admin ViewSet for blog images"""
    queryset = BlogImage.objects.all()
    serializer_class = AdminBlogImageSerializer
    permission_classes = [IsAuthenticated]
    
    def check_admin_permission(self, request):
        """Check if user has admin permissions"""
        user = request.user
        if not (user.is_staff or user.is_superuser or user.role in ['admin', 'ceo', 'treasury', 'writer']):
            return Response({
                'error': 'Admin access required',
                'user_role': user.role,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser
            }, status=status.HTTP_403_FORBIDDEN)
        return None
    
    def list(self, request, *args, **kwargs):
        permission_error = self.check_admin_permission(request)
        if permission_error:
            return permission_error
        return super().list(request, *args, **kwargs)
    
    def create(self, request, *args, **kwargs):
        permission_error = self.check_admin_permission(request)
        if permission_error:
            return permission_error
        return super().create(request, *args, **kwargs)
    
    def retrieve(self, request, *args, **kwargs):
        permission_error = self.check_admin_permission(request)
        if permission_error:
            return permission_error
        return super().retrieve(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        permission_error = self.check_admin_permission(request)
        if permission_error:
            return permission_error
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        permission_error = self.check_admin_permission(request)
        if permission_error:
            return permission_error
        
        instance = self.get_object()
        print(f"✓ Deleting gallery image {instance.id} from post {instance.post.slug}")
        return super().destroy(request, *args, **kwargs)
    
    def get_queryset(self):
        post_slug = self.request.query_params.get('post')
        if post_slug:
            return BlogImage.objects.filter(post__slug=post_slug)
        return BlogImage.objects.all()


class AdminBlogDownloadViewSet(viewsets.ModelViewSet):
    """Admin ViewSet for blog downloads"""
    queryset = BlogDownload.objects.all()
    serializer_class = BlogDownloadSerializer
    permission_classes = [IsAuthenticated]
    
    def check_admin_permission(self, request):
        """Check if user has admin permissions"""
        user = request.user
        if not (user.is_staff or user.is_superuser or user.role in ['admin', 'ceo', 'treasury', 'writer']):
            return Response({
                'error': 'Admin access required',
                'user_role': user.role,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser
            }, status=status.HTTP_403_FORBIDDEN)
        return None
    
    def list(self, request, *args, **kwargs):
        permission_error = self.check_admin_permission(request)
        if permission_error:
            return permission_error
        return super().list(request, *args, **kwargs)
    
    def create(self, request, *args, **kwargs):
        permission_error = self.check_admin_permission(request)
        if permission_error:
            return permission_error
        return super().create(request, *args, **kwargs)
    
    def retrieve(self, request, *args, **kwargs):
        permission_error = self.check_admin_permission(request)
        if permission_error:
            return permission_error
        return super().retrieve(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        permission_error = self.check_admin_permission(request)
        if permission_error:
            return permission_error
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        permission_error = self.check_admin_permission(request)
        if permission_error:
            return permission_error
        return super().destroy(request, *args, **kwargs)
    
    def get_queryset(self):
        post_slug = self.request.query_params.get('post')
        if post_slug:
            return BlogDownload.objects.filter(post__slug=post_slug)
        return BlogDownload.objects.all()


class AdminCategoryViewSet(viewsets.ModelViewSet):
    """Admin ViewSet for blog categories"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    
    def check_admin_permission(self, request):
        """Check if user has admin permissions"""
        user = request.user
        if not (user.is_staff or user.is_superuser or user.role in ['admin', 'ceo', 'treasury', 'writer']):
            return Response({
                'error': 'Admin access required',
                'user_role': user.role,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser
            }, status=status.HTTP_403_FORBIDDEN)
        return None
    
    def list(self, request, *args, **kwargs):
        permission_error = self.check_admin_permission(request)
        if permission_error:
            return permission_error
        return super().list(request, *args, **kwargs)
    
    def create(self, request, *args, **kwargs):
        permission_error = self.check_admin_permission(request)
        if permission_error:
            return permission_error
        return super().create(request, *args, **kwargs)
    
    def retrieve(self, request, *args, **kwargs):
        permission_error = self.check_admin_permission(request)
        if permission_error:
            return permission_error
        return super().retrieve(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        permission_error = self.check_admin_permission(request)
        if permission_error:
            return permission_error
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        permission_error = self.check_admin_permission(request)
        if permission_error:
            return permission_error
        return super().destroy(request, *args, **kwargs)