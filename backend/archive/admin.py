from django.contrib import admin
from django.utils.html import format_html
from .models import Archive

@admin.register(Archive)
class ArchiveAdmin(admin.ModelAdmin):
    list_display = ('title', 'category_badge', 'file_size_display', 'visibility_badge', 'download_badge', 'archived_by', 'created_at')
    list_filter = ('category', 'is_public', 'created_at')
    search_fields = ('title', 'description', 'tags', 'archived_by__username')
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Archive Information', {
            'fields': ('title', 'description', 'category', 'tags')
        }),
        ('File Information', {
            'fields': ('file', 'file_size')
        }),
        ('Settings', {
            'fields': ('archived_by', 'is_public')
        }),
        ('Statistics', {
            'fields': ('download_count',),
            'classes': ('collapse',)
        }),
    )
    
    def category_badge(self, obj):
        colors = {
            'project': '#AC6AFF',
            'document': '#FFC876',
            'image': '#FF98E2',
            'video': '#FF776F',
            'audio': '#7ADB78',
            'other': '#858DFF',
        }
        color = colors.get(obj.category, '#757185')
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">{}</span>',
            color,
            obj.get_category_display()
        )
    category_badge.short_description = 'Category'
    
    def file_size_display(self, obj):
        return format_html(
            '<span style="background: var(--color-5); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">{}</span>',
            obj.file_size_formatted
        )
    file_size_display.short_description = 'Size'
    
    def visibility_badge(self, obj):
        if obj.is_public:
            return format_html(
                '<span style="background: var(--color-4); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">🌍 PUBLIC</span>'
            )
        return format_html(
            '<span style="background: var(--color-3); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">🔒 PRIVATE</span>'
        )
    visibility_badge.short_description = 'Visibility'
    
    def download_badge(self, obj):
        return format_html(
            '<span style="background: var(--color-1); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">{} downloads</span>',
            obj.download_count
        )
    download_badge.short_description = 'Downloads'
    
    class Media:
        css = {
            'all': ('admin/css/pritechvior_admin.css',)
        }
