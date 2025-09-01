from rest_framework import serializers
from .models import Product, Order, Category, OrderItem, ProductImage, Brand, ProductType


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'parent', 'is_active', 
                 'sort_order', 'created_at', 'product_count']
    
    def get_product_count(self, obj):
        return obj.products.filter(status='active').count()


class BrandSerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'description', 'logo', 'website', 
                 'is_active', 'sort_order', 'created_at', 'product_count']
    
    def get_product_count(self, obj):
        return obj.products.filter(status='active').count()


class ProductTypeSerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductType
        fields = ['id', 'name', 'slug', 'description', 'is_active', 
                 'sort_order', 'created_at', 'product_count']
    
    def get_product_count(self, obj):
        return obj.products.filter(status='active').count()


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    discount_percentage = serializers.ReadOnlyField()
    is_on_sale = serializers.ReadOnlyField()
    is_low_stock = serializers.ReadOnlyField()
    is_in_stock = serializers.ReadOnlyField()
    sales_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'short_description', 'specifications',
            'price', 'original_price', 'cost_price', 'wholesale_price', 'currency',
            'category', 'category_name', 'brand', 'brand_name', 'product_type', 'status',
            'availability', 'stock_quantity', 'low_stock_threshold', 'weight', 'dimensions',
            'featured', 'trending', 'new_arrival', 'best_seller',
            'meta_title', 'meta_description', 'tags',
            'youtube_video_id', 'product_video', 'video_thumbnail', 'video_url',
            'rating', 'review_count', 'external_sources',
            'is_affiliate', 'affiliate_source', 'affiliate_url', 'affiliate_commission',
            'accepts_custom_orders', 'custom_order_lead_time', 'custom_order_min_quantity',
            'created_at', 'updated_at', 'images', 'discount_percentage', 'is_on_sale',
            'is_low_stock', 'is_in_stock', 'sales_count'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_sales_count(self, obj):
        return OrderItem.objects.filter(product=obj).count()


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.SerializerMethodField()
    subtotal = serializers.ReadOnlyField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_image', 'quantity', 
                 'price', 'custom_specifications', 'subtotal']
    
    def get_product_image(self, obj):
        primary_image = obj.product.images.filter(is_primary=True).first()
        if primary_image and primary_image.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary_image.image.url)
        return None


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer = serializers.SerializerMethodField()
    order_number = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'customer', 'status', 'payment_status',
            'subtotal', 'shipping_cost', 'tax_amount', 'total_amount', 'currency',
            'shipping_method', 'shipping_address', 'billing_address', 'tracking_number',
            'created_at', 'updated_at', 'shipped_at', 'delivered_at', 'items'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_customer(self, obj):
        return {
            'id': obj.user.id,
            'username': obj.user.username,
            'email': obj.user.email,
            'name': f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username
        }
    
    def get_order_number(self, obj):
        return f"ORD-{str(obj.id)[:8].upper()}"


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    
    class Meta:
        model = Order
        fields = [
            'status', 'payment_status', 'subtotal', 'shipping_cost', 
            'tax_amount', 'total_amount', 'currency', 'shipping_method',
            'shipping_address', 'billing_address', 'items'
        ]
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        
        return order


class OrderUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status', 'payment_status', 'tracking_number', 'shipped_at', 'delivered_at']