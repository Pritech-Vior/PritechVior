from rest_framework import serializers
from .models import BlogPost, NewsletterSubscription


class BlogPostSerializer(serializers.ModelSerializer):
    """Serializer for blog posts"""
    author = serializers.StringRelatedField(read_only=True)
    tag_list = serializers.ReadOnlyField()
    date = serializers.ReadOnlyField()
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'content', 'excerpt', 'author',
            'category', 'tags', 'tag_list', 'image', 'status',
            'featured', 'read_time', 'views', 'date', 'created_at', 'updated_at'
        ]


class NewsletterSubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for newsletter subscriptions"""
    
    class Meta:
        model = NewsletterSubscription
        fields = ['id', 'email', 'is_active', 'subscribed_at']
