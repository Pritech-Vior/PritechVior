from rest_framework import serializers
from .models import Archive, ArchiveDownloadRequest, ArchiveComment, ArchiveVersion, ArchivePlatformDownload


class ArchivePlatformDownloadSerializer(serializers.ModelSerializer):
    """Serializer for platform-specific downloads"""
    download_link = serializers.ReadOnlyField()
    file_size_formatted = serializers.ReadOnlyField()
    platform_display = serializers.CharField(source='get_platform_display', read_only=True)
    
    class Meta:
        model = ArchivePlatformDownload
        fields = [
            'id', 'platform', 'platform_display', 'download_link', 'file_size', 
            'file_size_display', 'file_size_formatted', 'architecture', 'installer_type',
            'platform_requirements', 'download_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['download_count', 'created_at', 'updated_at']


class ArchiveVersionSerializer(serializers.ModelSerializer):
    """Serializer for archive versions"""
    platform_downloads = ArchivePlatformDownloadSerializer(many=True, read_only=True)
    file_size_formatted = serializers.ReadOnlyField()
    
    class Meta:
        model = ArchiveVersion
        fields = [
            'id', 'version', 'release_date', 'release_notes', 'is_latest', 'is_beta', 
            'is_deprecated', 'file_size', 'file_size_display', 'file_size_formatted',
            'requirements', 'platform_downloads', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class ArchiveCommentSerializer(serializers.ModelSerializer):
    """Serializer for archive comments"""
    user = serializers.StringRelatedField(read_only=True)
    user_id = serializers.ReadOnlyField(source='user.id')
    
    class Meta:
        model = ArchiveComment
        fields = ['id', 'user', 'user_id', 'comment', 'rating', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']


class ArchiveSerializer(serializers.ModelSerializer):
    """Serializer for software archives"""
    archived_by = serializers.StringRelatedField(read_only=True)
    file_size_formatted = serializers.ReadOnlyField()
    platform_list = serializers.ReadOnlyField()
    comments = ArchiveCommentSerializer(many=True, read_only=True)
    versions = ArchiveVersionSerializer(many=True, read_only=True)
    comments_count = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    latest_version = serializers.SerializerMethodField()
    
    class Meta:
        model = Archive
        fields = [
            'id', 'title', 'description', 'version', 'category',
            'file', 'file_size', 'file_size_display', 'file_size_formatted', 'license', 'platforms', 'platform_list',
            'requirements', 'download_count', 'rating', 'featured',
            'archived_by', 'tags', 'is_public', 'download_url', 'request_only',
            'source_type', 'external_url', 'github_repo', 'official_website',
            'mirror_links', 'download_instructions', 'created_at', 'updated_at',
            'comments', 'comments_count', 'average_rating', 'versions', 'latest_version'
        ]
        read_only_fields = ['archived_by', 'download_count', 'created_at', 'updated_at']
    
    def get_comments_count(self, obj):
        return obj.comments.filter(is_approved=True).count()
    
    def get_average_rating(self, obj):
        approved_comments = obj.comments.filter(is_approved=True, rating__isnull=False)
        if approved_comments.exists():
            total_rating = sum(comment.rating for comment in approved_comments)
            return round(total_rating / approved_comments.count(), 1)
        return 0.0
    
    def get_latest_version(self, obj):
        """Get the latest version with platform downloads"""
        latest = obj.versions.filter(is_latest=True).first()
        if latest:
            return ArchiveVersionSerializer(latest).data
        return None


class ArchiveDownloadRequestSerializer(serializers.ModelSerializer):
    """Serializer for archive download requests"""
    user = serializers.StringRelatedField(read_only=True)
    archive_title = serializers.ReadOnlyField(source='archive.title')
    
    class Meta:
        model = ArchiveDownloadRequest
        fields = ['id', 'user', 'archive', 'archive_title', 'email', 'message', 'status', 'created_at', 'processed_at']
        read_only_fields = ['user', 'created_at', 'processed_at']
