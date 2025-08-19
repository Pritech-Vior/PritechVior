from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.db.models import Q
import django_filters.rest_framework as filters

from .models import Archive, ArchiveDownloadRequest, ArchiveComment, ArchiveVersion, ArchivePlatformDownload
from .serializers import (
    ArchiveSerializer, 
    ArchiveDownloadRequestSerializer, 
    ArchiveCommentSerializer,
    ArchiveVersionSerializer,
    ArchivePlatformDownloadSerializer
)


class ArchiveFilter(filters.FilterSet):
    """Filter for software archives"""
    category = filters.CharFilter(field_name='category', lookup_expr='icontains')
    license = filters.CharFilter(field_name='license')
    source_type = filters.CharFilter(field_name='source_type')
    archived_by = filters.CharFilter(field_name='archived_by__username', lookup_expr='icontains')
    search = filters.CharFilter(method='filter_search')
    
    class Meta:
        model = Archive
        fields = ['category', 'license', 'source_type', 'is_public', 'featured']
    
    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) |
            Q(description__icontains=value) |
            Q(tags__icontains=value) |
            Q(version__icontains=value)
        )


class ArchiveViewSet(viewsets.ModelViewSet):
    """ViewSet for software archives"""
    queryset = Archive.objects.filter(is_public=True)
    serializer_class = ArchiveSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = ArchiveFilter
    
    def get_queryset(self):
        if self.request.user.is_authenticated and hasattr(self.request.user, 'role') and self.request.user.role in ['ceo', 'admin']:
            return Archive.objects.all()
        return Archive.objects.filter(is_public=True)
    
    def perform_create(self, serializer):
        serializer.save(archived_by=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_comment(self, request, pk=None):
        """Add comment to archive"""
        archive = self.get_object()
        user = request.user
        
        # Check if user already commented
        existing_comment = ArchiveComment.objects.filter(user=user, archive=archive).first()
        if existing_comment:
            # Update existing comment
            serializer = ArchiveCommentSerializer(existing_comment, data=request.data, partial=True)
        else:
            # Create new comment
            serializer = ArchiveCommentSerializer(data=request.data)
        
        if serializer.is_valid():
            if existing_comment:
                serializer.save()
            else:
                serializer.save(user=user, archive=archive)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        """Get all approved comments for archive"""
        archive = self.get_object()
        comments = archive.comments.filter(is_approved=True)
        serializer = ArchiveCommentSerializer(comments, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def request_download(self, request, pk=None):
        """Request download access for private archive"""
        archive = self.get_object()
        user = request.user
        
        # Debug logging
        import logging
        logger = logging.getLogger(__name__)
        logger.info(f"Download request from user: {user} (authenticated: {user.is_authenticated})")
        
        # Check if already requested
        existing_request = ArchiveDownloadRequest.objects.filter(user=user, archive=archive).first()
        if existing_request:
            # Return different messages based on request status
            status_messages = {
                'pending': 'Your download request is being processed. We will contact you soon.',
                'approved': 'Your download request has been approved. Check your email for download instructions.',
                'sent': 'Download instructions have been sent to your email.',
                'rejected': 'Your previous download request was rejected. You can submit a new request.'
            }
            
            message = status_messages.get(existing_request.status, 'You have already submitted a download request.')
            
            # If rejected, allow new request
            if existing_request.status == 'rejected':
                existing_request.delete()
            else:
                return Response({
                    'error': message,
                    'status': existing_request.status,
                    'requested_at': existing_request.created_at.isoformat(),
                    'can_resubmit': existing_request.status == 'rejected'
                }, status=status.HTTP_409_CONFLICT)
        
        # Create download request
        download_request = ArchiveDownloadRequest.objects.create(
            user=user,
            archive=archive,
            email=request.data.get('email', user.email),
            message=request.data.get('message', ''),
            status='pending'
        )
        
        serializer = ArchiveDownloadRequestSerializer(download_request)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'], permission_classes=[])
    def download(self, request, pk=None):
        """Download archive file or get download info"""
        archive = self.get_object()
        user = request.user
        
        # Check permissions for request-only archives
        if archive.request_only:
            if not user.is_authenticated:
                return Response({'error': 'Authentication required for request-only downloads'}, status=status.HTTP_401_UNAUTHORIZED)
            
            if not ArchiveDownloadRequest.objects.filter(
                user=user, archive=archive, status__in=['approved', 'sent']
            ).exists():
                return Response({'error': 'Download not authorized. Please request access first.'}, status=status.HTTP_403_FORBIDDEN)
        
        # For non-request-only archives, allow public access
        # Increment download count
        archive.increment_download_count()
        
        # Return download information
        download_info = {
            'title': archive.title,
            'version': archive.version,
            'source_type': archive.source_type,
        }
        
        if archive.file:
            download_info['file_url'] = archive.file.url
        if archive.download_url:
            download_info['download_url'] = archive.download_url
        if archive.external_url:
            download_info['external_url'] = archive.external_url
        if archive.github_repo:
            download_info['github_repo'] = archive.github_repo
        if archive.official_website:
            download_info['official_website'] = archive.official_website
        if archive.mirror_links:
            download_info['mirror_links'] = archive.mirror_links
        if archive.download_instructions:
            download_info['instructions'] = archive.download_instructions
        
        return Response(download_info, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_uploads(self, request):
        """Get user's uploaded archives"""
        archives = Archive.objects.filter(archived_by=request.user)
        serializer = ArchiveSerializer(archives, many=True)
        return Response(serializer.data)


class ArchiveCommentViewSet(viewsets.ModelViewSet):
    """ViewSet for archive comments"""
    queryset = ArchiveComment.objects.filter(is_approved=True)
    serializer_class = ArchiveCommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = ArchiveComment.objects.filter(is_approved=True)
        archive_id = self.request.query_params.get('archive')
        if archive_id:
            queryset = queryset.filter(archive_id=archive_id)
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ArchiveDownloadRequestViewSet(viewsets.ModelViewSet):
    """ViewSet for archive download requests"""
    queryset = ArchiveDownloadRequest.objects.all()
    serializer_class = ArchiveDownloadRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role in ['ceo', 'admin']:
            return ArchiveDownloadRequest.objects.all()
        return ArchiveDownloadRequest.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def approve(self, request, pk=None):
        """Approve download request (admin only)"""
        if request.user.role not in ['ceo', 'admin']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        download_request = self.get_object()
        download_request.status = 'approved'
        download_request.save()
        
        serializer = ArchiveDownloadRequestSerializer(download_request)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def reject(self, request, pk=None):
        """Reject download request (admin only)"""
        if request.user.role not in ['ceo', 'admin']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        download_request = self.get_object()
        download_request.status = 'rejected'
        download_request.save()
        
        serializer = ArchiveDownloadRequestSerializer(download_request)
        return Response(serializer.data)


class ArchiveVersionViewSet(viewsets.ModelViewSet):
    """ViewSet for archive versions"""
    queryset = ArchiveVersion.objects.all()
    serializer_class = ArchiveVersionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        archive_id = self.request.query_params.get('archive')
        if archive_id:
            return ArchiveVersion.objects.filter(archive_id=archive_id)
        return ArchiveVersion.objects.all()
    
    def perform_create(self, serializer):
        archive_id = self.request.data.get('archive')
        serializer.save(archive_id=archive_id)


class ArchivePlatformDownloadViewSet(viewsets.ModelViewSet):
    """ViewSet for platform-specific downloads"""
    queryset = ArchivePlatformDownload.objects.all()
    serializer_class = ArchivePlatformDownloadSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        version_id = self.request.query_params.get('version')
        if version_id:
            return ArchivePlatformDownload.objects.filter(version_id=version_id)
        return ArchivePlatformDownload.objects.all()
    
    def perform_create(self, serializer):
        version_id = self.request.data.get('version')
        serializer.save(version_id=version_id)
    
    @action(detail=True, methods=['post'], permission_classes=[])
    def download(self, request, pk=None):
        """Handle platform-specific download and track count"""
        platform_download = self.get_object()
        
        # Increment download count
        platform_download.increment_download_count()
        
        # Return download info
        serializer = ArchivePlatformDownloadSerializer(platform_download)
        return Response({
            'download_link': platform_download.download_link,
            'platform': platform_download.platform,
            'architecture': platform_download.architecture,
            'file_size': platform_download.file_size_display,
            'download_count': platform_download.download_count,
            'message': 'Download tracked successfully'
        })
