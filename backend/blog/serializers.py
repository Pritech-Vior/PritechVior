from rest_framework import serializers
from .models import BlogPost, NewsletterSubscription


class BlogPostSerializer(serializers.ModelSerializer):
    """Serializer for blog posts"""
    author = serializers.StringRelatedField(read_only=True)
    excerpt = serializers.ReadOnlyField()
    read_time = serializers.ReadOnlyField()
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'content', 'excerpt', 'author',
            'category', 'tags', 'featured_image', 'is_published',
            'is_featured', 'read_time', 'views', 'created_at', 'updated_at'
        ]


class NewsletterSubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for newsletter subscriptions"""
    
    class Meta:
        model = NewsletterSubscription
        fields = ['id', 'email', 'is_active', 'subscribed_at']
