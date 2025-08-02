from django.contrib import admin
from django.utils.html import format_html
from .models import Category, BlogPost

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'post_count', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    
    def post_count(self, obj):
        count = obj.posts.count()
        return format_html(
            '<span style="background: var(--color-1); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">{}</span>',
            count
        )
    post_count.short_description = 'Posts'
    
    class Media:
        css = {
            'all': ('admin/css/pritechvior_admin.css',)
        }

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'status_badge', 'featured_badge', 'views_count', 'created_at', 'published_at')
    list_filter = ('status', 'featured', 'categories', 'created_at', 'published_at')
    search_fields = ('title', 'content', 'author__username')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('categories',)
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Content', {
            'fields': ('title', 'slug', 'content', 'excerpt')
        }),
        ('Publishing', {
            'fields': ('author', 'status', 'featured', 'published_at')
        }),
        ('Categories', {
            'fields': ('categories',)
        }),
        ('Statistics', {
            'fields': ('views',),
            'classes': ('collapse',)
        }),
    )
    
    def status_badge(self, obj):
        colors = {
            'draft': '#858DFF',
            'published': '#7ADB78',
            'archived': '#FF776F',
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
    
    def views_count(self, obj):
        return format_html(
            '<span style="background: var(--color-1); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">{}</span>',
            obj.views
        )
    views_count.short_description = 'Views'
    
    class Media:
        css = {
            'all': ('admin/css/pritechvior_admin.css',)
        }
