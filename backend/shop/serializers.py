from rest_framework import serializers
from .models import (
    Category, Brand, ProductType, Platform, Product, ProductReview, ProductImage, 
    Order, OrderItem, Cart, CartItem, Wishlist, WishlistItem, 
    CustomOrderRequest, ProductRequest, ShippingMethod
)


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for product categories"""
    subcategories = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'parent', 'subcategories', 'is_active', 'sort_order']
    
    def get_subcategories(self, obj):
        subcategories = obj.subcategories.filter(is_active=True)
        return CategorySerializer(subcategories, many=True, context=self.context).data


class BrandSerializer(serializers.ModelSerializer):
    """Serializer for product brands"""
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'description', 'logo', 'website', 'is_active']


class ProductTypeSerializer(serializers.ModelSerializer):
    """Serializer for product types"""
    class Meta:
        model = ProductType
        fields = ['id', 'name', 'slug', 'description', 'is_active']


class PlatformSerializer(serializers.ModelSerializer):
    """Serializer for platforms"""
    class Meta:
        model = Platform
        fields = ['id', 'name', 'slug', 'description', 'website', 'is_active']


class ProductImageSerializer(serializers.ModelSerializer):
    """Serializer for product images"""
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']


class ShippingMethodSerializer(serializers.ModelSerializer):
    """Serializer for shipping methods"""
    class Meta:
        model = ShippingMethod
        fields = [
            'id', 'name', 'description', 'base_cost', 'cost_per_kg',
            'estimated_days_min', 'estimated_days_max', 'free_shipping_threshold'
        ]


class ProductSerializer(serializers.ModelSerializer):
    """Serializer for ViorMart products"""
    discount_percentage = serializers.ReadOnlyField()
    is_on_sale = serializers.ReadOnlyField()
    is_low_stock = serializers.ReadOnlyField()
    is_in_stock = serializers.ReadOnlyField()
    youtube_embed_url = serializers.ReadOnlyField()
    primary_image = serializers.SerializerMethodField()
    category_detail = CategorySerializer(source='category', read_only=True)
    brand_detail = BrandSerializer(source='brand', read_only=True)
    product_type_detail = ProductTypeSerializer(source='product_type', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'short_description',
            'price', 'original_price', 'discount_percentage', 'is_on_sale', 'currency',
            'category', 'brand', 'product_type', 'status', 'availability',
            'category_detail', 'brand_detail', 'product_type_detail',
            'featured', 'trending', 'new_arrival', 'best_seller',
            'stock_quantity', 'is_low_stock', 'is_in_stock', 'weight', 'dimensions',
            'rating', 'review_count', 'tags', 'specifications',
            'youtube_video_id', 'youtube_embed_url', 'video_thumbnail',
            'is_affiliate', 'affiliate_source', 'affiliate_url',
            'accepts_custom_orders', 'custom_order_lead_time', 'custom_order_min_quantity',
            'external_sources', 'primary_image', 'created_at', 'updated_at'
        ]
    
    def get_primary_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image:
            return self.context['request'].build_absolute_uri(primary_image.image.url)
        return None


class ProductDetailSerializer(ProductSerializer):
    """Detailed product serializer with images and reviews"""
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = serializers.SerializerMethodField()
    related_products = serializers.SerializerMethodField()
    
    class Meta(ProductSerializer.Meta):
        fields = ProductSerializer.Meta.fields + ['images', 'reviews', 'related_products']
    
    def get_reviews(self, obj):
        reviews = obj.reviews.all()[:10]  # Limit to 10 recent reviews
        return ProductReviewSerializer(reviews, many=True).data
    
    def get_related_products(self, obj):
        related = Product.objects.filter(
            category=obj.category, 
            status='active'
        ).exclude(id=obj.id)[:4]
        return ProductSerializer(related, many=True, context=self.context).data


class ProductReviewSerializer(serializers.ModelSerializer):
    """Serializer for product reviews"""
    user = serializers.StringRelatedField(read_only=True)
    user_avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductReview
        fields = [
            'id', 'user', 'user_avatar', 'rating', 'title', 'review_text', 
            'verified_purchase', 'helpful_count', 'created_at', 'updated_at'
        ]
    
    def get_user_avatar(self, obj):
        # Return user avatar if available
        # Note: UserProfile model doesn't have avatar field, so return None for now
        # You can implement avatar functionality later by adding avatar field to UserProfile
        return None


class CartItemSerializer(serializers.ModelSerializer):
    """Serializer for cart items"""
    product = ProductSerializer(read_only=True)
    subtotal = serializers.ReadOnlyField()
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'custom_specifications', 'subtotal', 'added_at']


class CartSerializer(serializers.ModelSerializer):
    """Serializer for shopping cart"""
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.ReadOnlyField()
    total_amount = serializers.ReadOnlyField()
    
    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_items', 'total_amount', 'created_at', 'updated_at']


class WishlistItemSerializer(serializers.ModelSerializer):
    """Serializer for wishlist items"""
    product = ProductSerializer(read_only=True)
    
    class Meta:
        model = WishlistItem
        fields = ['id', 'product', 'added_at']


class WishlistSerializer(serializers.ModelSerializer):
    """Serializer for wishlist"""
    items = serializers.SerializerMethodField()
    
    class Meta:
        model = Wishlist
        fields = ['id', 'items', 'created_at']
    
    def get_items(self, obj):
        items = WishlistItem.objects.filter(wishlist=obj)
        return WishlistItemSerializer(items, many=True, context=self.context).data


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for order items"""
    product = ProductSerializer(read_only=True)
    subtotal = serializers.ReadOnlyField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price', 'custom_specifications', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for orders"""
    items = OrderItemSerializer(many=True, read_only=True)
    shipping_method = ShippingMethodSerializer(read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'status', 'payment_status', 'subtotal', 'shipping_cost', 
            'tax_amount', 'total_amount', 'shipping_method', 'shipping_address',
            'billing_address', 'tracking_number', 'items', 'created_at', 
            'updated_at', 'shipped_at', 'delivered_at'
        ]


class CustomOrderRequestSerializer(serializers.ModelSerializer):
    """Serializer for custom order requests"""
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = CustomOrderRequest
        fields = [
            'id', 'user', 'product_name', 'description', 'specifications',
            'quantity', 'budget_range', 'target_delivery_date', 'status',
            'quoted_price', 'estimated_delivery', 'admin_notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'status', 'quoted_price', 'estimated_delivery', 'admin_notes']


class ProductRequestSerializer(serializers.ModelSerializer):
    """Serializer for product requests from external sites"""
    user = serializers.StringRelatedField(read_only=True)
    platform = PlatformSerializer(read_only=True)
    platform_id = serializers.PrimaryKeyRelatedField(
        queryset=Platform.objects.filter(is_active=True),
        source='platform',
        write_only=True,
        required=False,
        allow_null=True
    )
    total_cost = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductRequest
        fields = [
            'id', 'user', 'platform', 'platform_id', 'product_url', 'product_name',
            'quantity', 'original_price', 'quoted_price', 'service_fee',
            'total_cost', 'estimated_delivery', 'status', 'notes',
            'admin_notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'quoted_price', 'status', 'admin_notes']
    
    def get_total_cost(self, obj):
        if obj.quoted_price:
            return obj.quoted_price + obj.service_fee
        return None


class AddToCartSerializer(serializers.Serializer):
    """Serializer for adding items to cart"""
    product_id = serializers.UUIDField()
    quantity = serializers.IntegerField(min_value=1, default=1)
    custom_specifications = serializers.JSONField(required=False, default=dict)


class UpdateCartItemSerializer(serializers.Serializer):
    """Serializer for updating cart items"""
    quantity = serializers.IntegerField(min_value=1)


class CheckoutSerializer(serializers.Serializer):
    """Serializer for checkout process"""
    shipping_method_id = serializers.IntegerField()
    shipping_address = serializers.JSONField()
    billing_address = serializers.JSONField()
    payment_method = serializers.CharField(max_length=50)
    special_instructions = serializers.CharField(max_length=500, required=False)
