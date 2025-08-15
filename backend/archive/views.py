from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.db.models import Q
import django_filters.rest_framework as filters

from .models import Archive, ArchiveDownloadRequest
from .serializers import ArchiveSerializer, ArchiveDownloadRequestSerializer


class ArchiveFilter(filters.FilterSet):
    """Filter for software archives"""
    category = filters.CharFilter(field_name='category', lookup_expr='icontains')
    license = filters.CharFilter(field_name='license')
    source_type = filters.CharFilter(field_name='source_type')
    archived_by = filters.CharFilter(field_name='archived_by__username', lookup_expr='icontains')
    search = filters.CharFilter(method='filter_search')
    
    class Meta:
        model = Archive
        fields = ['category', 'license', 'source_type', 'featured', 'is_public']
    
    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) |
            Q(description__icontains=value) |
            Q(version__icontains=value) |
            Q(tags__icontains=value)
        )


class ArchiveFilter(filters.FilterSet):
    """Filter for software archives"""
    category = filters.CharFilter(field_name='category', lookup_expr='icontains')
    license = filters.CharFilter(field_name='license')
    archived_by = filters.CharFilter(field_name='archived_by__username', lookup_expr='icontains')
    search = filters.CharFilter(method='filter_search')
    
    class Meta:
        model = Archive
        fields = ['category', 'license', 'is_public']
    
    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) |
            Q(description__icontains=value) |
            Q(version__icontains=value)
        )


class ArchiveViewSet(viewsets.ModelViewSet):
    """ViewSet for software archives"""
    queryset = Archive.objects.filter(is_public=True)
    serializer_class = ArchiveSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = ArchiveFilter
    lookup_field = 'pk'
    
    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.role in ['ceo', 'admin']:
            return Archive.objects.all()
        return Archive.objects.filter(is_public=True)
    
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
            message=request.data.get('message', ''),
            email=user.email,
            status='pending'
        )
        
        serializer = ArchiveDownloadRequestSerializer(download_request)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def download(self, request, pk=None):
        """Download archive file or get external download info"""
        archive = self.get_object()
        user = request.user
        
        # Check permissions for request-only archives
        if archive.request_only and not archive.is_public:
            if not ArchiveDownloadRequest.objects.filter(
                user=user, archive=archive, status='approved'
            ).exists():
                return Response({'error': 'Download not authorized'}, status=status.HTTP_403_FORBIDDEN)
        
        # Increment download count
        archive.increment_download_count()
        
        # Return download information based on source type
        response_data = {
            'source_type': archive.source_type,
            'has_external_source': archive.has_external_source,
            'all_download_links': archive.all_download_links,
            'download_instructions': archive.download_instructions
        }
        
        # Add primary download link
        primary_link = archive.download_link
        if primary_link:
            response_data['download_url'] = primary_link
        
        return Response(response_data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['get'])
    def download_info(self, request, pk=None):
        """Get download information without incrementing counter"""
        archive = self.get_object()
        
        return Response({
            'source_type': archive.source_type,
            'has_external_source': archive.has_external_source,
            'all_download_links': archive.all_download_links,
            'download_instructions': archive.download_instructions,
            'request_only': archive.request_only,
            'is_public': archive.is_public
        })
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_uploads(self, request):
        """Get user's uploaded archives"""
        archives = Archive.objects.filter(archived_by=request.user)
        serializer = ArchiveSerializer(archives, many=True)
        return Response(serializer.data)


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
