from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.db.models import Q
import django_filters.rest_framework as filters

from .models import Archive, ArchiveDownloadRequest, ArchiveComment
from .serializers import ArchiveSerializer, ArchiveDownloadRequestSerializer, ArchiveCommentSerializer


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
        
        # Check if already requested
        if ArchiveDownloadRequest.objects.filter(user=user, archive=archive).exists():
            return Response({'error': 'Already requested'}, status=status.HTTP_400_BAD_REQUEST)
        
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
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def download(self, request, pk=None):
        """Download archive file or get download info"""
        archive = self.get_object()
        user = request.user
        
        # Check permissions for request-only archives
        if archive.request_only and not archive.is_public:
            if not ArchiveDownloadRequest.objects.filter(
                user=user, archive=archive, status__in=['approved', 'sent']
            ).exists():
                return Response({'error': 'Download not authorized'}, status=status.HTTP_403_FORBIDDEN)
        
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
