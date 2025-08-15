from django.contrib import admin
from .models import Product, Order, OrderItem, ProductReview

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('price',)

class ProductReviewInline(admin.TabularInline):
    model = ProductReview
    extra = 0
    readonly_fields = ('rating', 'created_at')
    fields = ('user', 'rating', 'review_text', 'created_at')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'status', 'featured', 'stock_quantity', 'created_at')
    list_filter = ('category', 'status', 'featured', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductReviewInline]
    
    fieldsets = (
        ('Product Information', {
            'fields': ('name', 'slug', 'description', 'short_description')
        }),
        ('Pricing & Category', {
            'fields': ('price', 'original_price', 'category', 'brand')
        }),
        ('Status & Inventory', {
            'fields': ('status', 'featured', 'stock_quantity')
        }),
        ('Affiliate & Ratings', {
            'fields': ('is_affiliate', 'affiliate_source', 'rating', 'review_count')
        }),
    )

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'total_amount', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username', 'user__email')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [OrderItemInline]

@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('product__name', 'user__username', 'review_text')
    readonly_fields = ('created_at',)
