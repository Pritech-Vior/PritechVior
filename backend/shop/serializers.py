from rest_framework import serializers
from .models import Product, ProductReview


class ProductSerializer(serializers.ModelSerializer):
    """Serializer for ViorMart products"""
    discount_percentage = serializers.ReadOnlyField()
    is_on_sale = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'short_description',
            'price', 'original_price', 'discount_percentage', 'is_on_sale',
            'category', 'brand', 'status', 'featured', 'in_stock',
            'stock_quantity', 'rating', 'review_count',
            'is_affiliate', 'affiliate_source', 'affiliate_url',
            'created_at', 'updated_at'
        ]


class ProductReviewSerializer(serializers.ModelSerializer):
    """Serializer for product reviews"""
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = ProductReview
        fields = ['id', 'user', 'rating', 'review_text', 'created_at']


class ProductDetailSerializer(ProductSerializer):
    """Detailed product serializer with reviews"""
    reviews = ProductReviewSerializer(many=True, read_only=True)
    
    class Meta(ProductSerializer.Meta):
        fields = ProductSerializer.Meta.fields + ['reviews']
