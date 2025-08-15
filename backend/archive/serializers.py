from rest_framework import serializers
from .models import Archive, ArchiveDownloadRequest


class ArchiveSerializer(serializers.ModelSerializer):
    """Serializer for software archives"""
    archived_by = serializers.StringRelatedField(read_only=True)
    file_size_formatted = serializers.ReadOnlyField()
    platform_list = serializers.ReadOnlyField()
    mirror_list = serializers.ReadOnlyField()
    download_link = serializers.ReadOnlyField()
    has_external_source = serializers.ReadOnlyField()
    all_download_links = serializers.ReadOnlyField()
    
    class Meta:
        model = Archive
        fields = [
            'id', 'title', 'description', 'version', 'category',
            'file', 'file_size', 'file_size_formatted', 'source_type',
            'external_url', 'official_website', 'github_repo', 'mirror_links',
            'license', 'platforms', 'platform_list', 'requirements',
            'download_count', 'rating', 'featured', 'archived_by',
            'tags', 'is_public', 'request_only', 'download_instructions',
            'download_link', 'has_external_source', 'all_download_links',
            'mirror_list', 'created_at', 'updated_at'
        ]


class ArchiveDownloadRequestSerializer(serializers.ModelSerializer):
    """Serializer for archive download requests"""
    user = serializers.StringRelatedField(read_only=True)
    archive = ArchiveSerializer(read_only=True)
    
    class Meta:
        model = ArchiveDownloadRequest
        fields = ['id', 'user', 'archive', 'status', 'created_at', 'processed_at', 'message']
