from django.contrib import admin
from django.utils.html import format_html
from .models import Product, Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('price',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category_badge', 'price_display', 'status_badge', 'featured_badge', 'stock_display', 'created_at')
    list_filter = ('category', 'status', 'featured', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    
    fieldsets = (
        ('Product Information', {
            'fields': ('name', 'slug', 'description', 'short_description')
        }),
        ('Pricing & Category', {
            'fields': ('price', 'category')
        }),
        ('Status & Inventory', {
            'fields': ('status', 'featured', 'stock_quantity')
        }),
    )
    
    def category_badge(self, obj):
        colors = {
            'software': '#AC6AFF',
            'consulting': '#FFC876',
            'training': '#7ADB78',
            'support': '#FF98E2',
            'other': '#858DFF',
        }
        color = colors.get(obj.category, '#757185')
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">{}</span>',
            color,
            obj.get_category_display()
        )
    category_badge.short_description = 'Category'
    
    def price_display(self, obj):
        return format_html(
            '<span style="background: var(--color-4); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">${}</span>',
            obj.price
        )
    price_display.short_description = 'Price'
    
    def status_badge(self, obj):
        colors = {
            'active': '#7ADB78',
            'inactive': '#FF776F',
            'out_of_stock': '#FFC876',
        }
        color = colors.get(obj.status, '#757185')
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def featured_badge(self, obj):
        if obj.featured:
            return format_html(
                '<span style="background: var(--color-2); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">⭐ FEATURED</span>'
            )
        return format_html(
            '<span style="color: var(--n-4); font-size: 11px;">-</span>'
        )
    featured_badge.short_description = 'Featured'
    
    def stock_display(self, obj):
        if obj.stock_quantity == 0:
            color = '#FF776F'
        elif obj.stock_quantity < 10:
            color = '#FFC876'
        else:
            color = '#7ADB78'
            
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">{}</span>',
            color,
            obj.stock_quantity
        )
    stock_display.short_description = 'Stock'
    
    class Media:
        css = {
            'all': ('admin/css/pritechvior_admin.css',)
        }

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status_badge', 'total_display', 'items_count', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username', 'user__email')
    inlines = [OrderItemInline]
    date_hierarchy = 'created_at'
    
    def status_badge(self, obj):
        colors = {
            'pending': '#858DFF',
            'processing': '#FFC876',
            'shipped': '#AC6AFF',
            'delivered': '#7ADB78',
            'cancelled': '#FF776F',
            'refunded': '#FF98E2',
        }
        color = colors.get(obj.status, '#757185')
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def total_display(self, obj):
        return format_html(
            '<span style="background: var(--color-4); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">${}</span>',
            obj.total_amount
        )
    total_display.short_description = 'Total'
    
    def items_count(self, obj):
        count = obj.items.count()
        return format_html(
            '<span style="background: var(--color-1); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">{} items</span>',
            count
        )
    items_count.short_description = 'Items'
    
    class Media:
        css = {
            'all': ('admin/css/pritechvior_admin.css',)
        }
