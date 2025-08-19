from rest_framework import serializers
from .models import (
    BlogPost, NewsletterSubscription, BlogLike, BlogComment, 
    BlogImage, BlogDownload, BlogDownloadRequest, Category
)


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for blog categories"""
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']


class BlogImageSerializer(serializers.ModelSerializer):
    """Serializer for blog images"""
    image_source = serializers.ReadOnlyField()
    
    class Meta:
        model = BlogImage
        fields = ['id', 'image', 'image_url', 'image_source', 'caption', 'order']


class BlogDownloadSerializer(serializers.ModelSerializer):
    """Serializer for blog downloads"""
    download_source = serializers.ReadOnlyField()
    
    class Meta:
        model = BlogDownload
        fields = [
            'id', 'title', 'description', 'file', 'file_url', 
            'download_source', 'file_size', 'file_type', 
            'download_count', 'is_premium'
        ]


class BlogCommentSerializer(serializers.ModelSerializer):
    """Serializer for blog comments"""
    user = serializers.StringRelatedField(read_only=True)
    replies = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogComment
        fields = [
            'id', 'content', 'user', 'parent', 'replies',
            'is_approved', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'is_approved']
    
    def get_replies(self, obj):
        if obj.replies.exists():
            return BlogCommentSerializer(obj.replies.filter(is_approved=True), many=True).data
        return []


class BlogLikeSerializer(serializers.ModelSerializer):
    """Serializer for blog likes"""
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = BlogLike
        fields = ['id', 'user', 'created_at']
        read_only_fields = ['user']


class BlogPostSerializer(serializers.ModelSerializer):
    """Serializer for blog posts"""
    author = serializers.StringRelatedField(read_only=True)
    excerpt = serializers.ReadOnlyField()
    read_time = serializers.ReadOnlyField()
    like_count = serializers.ReadOnlyField()
    comment_count = serializers.ReadOnlyField()
    download_count = serializers.ReadOnlyField()
    images = BlogImageSerializer(many=True, read_only=True)
    downloads = BlogDownloadSerializer(many=True, read_only=True)
    comments = BlogCommentSerializer(many=True, read_only=True)
    user_has_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'content', 'excerpt', 'author',
            'category', 'tags', 'image', 'status', 'featured',
            'read_time', 'views', 'like_count', 'comment_count', 
            'download_count', 'user_has_liked', 'images', 'downloads',
            'comments', 'created_at', 'updated_at', 'published_at'
        ]
    
    def get_user_has_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False


class BlogPostListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for blog post lists"""
    author = serializers.StringRelatedField(read_only=True)
    like_count = serializers.ReadOnlyField()
    comment_count = serializers.ReadOnlyField()
    user_has_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'author', 'category',
            'tags', 'image', 'featured', 'read_time', 'views',
            'like_count', 'comment_count', 'user_has_liked',
            'created_at', 'published_at'
        ]
    
    def get_user_has_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False


class BlogDownloadRequestSerializer(serializers.ModelSerializer):
    """Serializer for blog download requests"""
    user = serializers.StringRelatedField(read_only=True)
    download_title = serializers.CharField(source='download.title', read_only=True)
    
    class Meta:
        model = BlogDownloadRequest
        fields = [
            'id', 'download', 'download_title', 'user', 'email',
            'message', 'status', 'created_at', 'processed_at'
        ]
        read_only_fields = ['user', 'status', 'processed_at']


class NewsletterSubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for newsletter subscriptions"""
    
    class Meta:
        model = NewsletterSubscription
        fields = ['id', 'email', 'is_active', 'subscribed_at']
