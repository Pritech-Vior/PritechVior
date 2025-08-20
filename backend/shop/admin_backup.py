from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Product, ProductImage, ProductReview, Order, OrderItem, Cart, CartItem,
    Wishlist, WishlistItem, CustomOrderRequest, ProductRequest, ShippingMethod
)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'alt_text', 'is_primary', 'order']


class ProductReviewInline(admin.TabularInline):
    model = ProductReview
    extra = 0
    readonly_fields = ['user', 'rating', 'created_at']
    can_delete = True


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'category', 'brand', 'price', 'product_type', 
        'availability', 'featured', 'stock_quantity', 'rating', 'created_at'
    ]
    list_filter = [
        'category', 'brand', 'product_type', 'availability', 'status',
        'featured', 'trending', 'new_arrival', 'best_seller', 'created_at'
    ]
    search_fields = ['name', 'description', 'short_description', 'tags']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['rating', 'review_count', 'created_at', 'updated_at']
    inlines = [ProductImageInline, ProductReviewInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'description', 'short_description', 'specifications')
        }),
        ('Pricing', {
            'fields': ('price', 'original_price', 'cost_price', 'wholesale_price')
        }),
        ('Categorization', {
            'fields': ('category', 'brand', 'product_type', 'tags')
        }),
        ('Inventory & Physical', {
            'fields': ('availability', 'stock_quantity', 'low_stock_threshold', 'weight', 'dimensions')
        }),
        ('Features & Marketing', {
            'fields': ('featured', 'trending', 'new_arrival', 'best_seller', 'status')
        }),
        ('Media Content', {
            'fields': ('youtube_video_id', 'product_video', 'video_thumbnail'),
            'classes': ('collapse',)
        }),
        ('External & Custom Orders', {
            'fields': (
                'external_sources', 'is_affiliate', 'affiliate_source', 'affiliate_url',
                'accepts_custom_orders', 'custom_order_lead_time', 'custom_order_min_quantity'
            ),
            'classes': ('collapse',)
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        }),
        ('Statistics', {
            'fields': ('rating', 'review_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related().prefetch_related('images', 'reviews')


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'alt_text', 'is_primary', 'order']
    list_filter = ['is_primary']
    search_fields = ['product__name', 'alt_text']


@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'user', 'rating', 'title', 'verified_purchase', 'helpful_count', 'created_at']
    list_filter = ['rating', 'verified_purchase', 'created_at']
    search_fields = ['product__name', 'user__username', 'title', 'review_text']
    readonly_fields = ['helpful_count', 'created_at', 'updated_at']


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['price', 'subtotal']
    fields = ['product', 'quantity', 'price', 'subtotal', 'custom_specifications']

    def subtotal(self, obj):
        return obj.subtotal
    subtotal.short_description = 'Subtotal'


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'user', 'status', 'payment_status', 'total_amount', 
        'items_count', 'created_at', 'updated_at'
    ]
    list_filter = ['status', 'payment_status', 'created_at', 'shipping_method']
    search_fields = ['user__username', 'user__email', 'id']
    inlines = [OrderItemInline]
    date_hierarchy = 'created_at'
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Order Information', {
            'fields': ('user', 'status', 'payment_status')
        }),
        ('Pricing', {
            'fields': ('subtotal', 'shipping_cost', 'tax_amount', 'total_amount')
        }),
        ('Shipping & Addresses', {
            'fields': ('shipping_method', 'shipping_address', 'billing_address', 'tracking_number')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'shipped_at', 'delivered_at'),
            'classes': ('collapse',)
        }),
    )

    def items_count(self, obj):
        return obj.items.count()
    items_count.short_description = 'Items'


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ['subtotal', 'added_at']


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_items', 'total_amount', 'created_at', 'updated_at']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['total_items', 'total_amount', 'created_at', 'updated_at']
    inlines = [CartItemInline]


class WishlistItemInline(admin.TabularInline):
    model = WishlistItem
    extra = 0
    readonly_fields = ['added_at']


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'items_count', 'created_at']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at']
    inlines = [WishlistItemInline]

    def items_count(self, obj):
        return obj.products.count()
    items_count.short_description = 'Items'


@admin.register(CustomOrderRequest)
class CustomOrderRequestAdmin(admin.ModelAdmin):
    list_display = [
        'product_name', 'user', 'quantity', 'status', 
        'quoted_price', 'created_at', 'updated_at'
    ]
    list_filter = ['status', 'created_at']
    search_fields = ['product_name', 'user__username', 'description']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Request Information', {
            'fields': ('user', 'product_name', 'description', 'specifications')
        }),
        ('Order Details', {
            'fields': ('quantity', 'budget_range', 'target_delivery_date')
        }),
        ('Admin Response', {
            'fields': ('status', 'quoted_price', 'estimated_delivery', 'admin_notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ProductRequest)
class ProductRequestAdmin(admin.ModelAdmin):
    list_display = [
        'product_name', 'platform', 'user', 'quantity', 'original_price',
        'quoted_price', 'status', 'created_at'
    ]
    list_filter = ['platform', 'status', 'created_at']
    search_fields = ['product_name', 'user__username', 'product_url']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Request Information', {
            'fields': ('user', 'platform', 'product_url', 'product_name')
        }),
        ('Order Details', {
            'fields': ('quantity', 'original_price')
        }),
        ('Admin Response', {
            'fields': ('status', 'quoted_price', 'service_fee', 'estimated_delivery', 'admin_notes')
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def total_cost(self, obj):
        if obj.quoted_price:
            return obj.quoted_price + obj.service_fee
        return None
    total_cost.short_description = 'Total Cost'


@admin.register(ShippingMethod)
class ShippingMethodAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'base_cost', 'cost_per_kg', 'estimated_days_min', 
        'estimated_days_max', 'free_shipping_threshold', 'is_active'
    ]
    list_filter = ['is_active']
    search_fields = ['name', 'description']
@admin.register(ShippingMethod)
class ShippingMethodAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'base_cost', 'cost_per_kg', 'estimated_days_min', 
        'estimated_days_max', 'free_shipping_threshold', 'is_active'
    ]
    list_filter = ['is_active']
    search_fields = ['name', 'description']
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def items_count(self, obj):
        return obj.items.count()
    items_count.short_description = 'Items'

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'price')
    list_filter = ('order__status', 'order__created_at')
    search_fields = ('product__name', 'order__user__username')
    readonly_fields = ('price',)
