from django.contrib import admin
from .models import Archive, ArchiveDownloadRequest, ArchiveComment

class ArchiveCommentInline(admin.TabularInline):
    model = ArchiveComment
    extra = 0
    readonly_fields = ('user', 'created_at')
    fields = ('user', 'comment', 'rating', 'is_approved', 'created_at')

@admin.register(Archive)
class ArchiveAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'source_type', 'file_size_formatted', 'is_public', 'download_count', 'comment_count', 'archived_by', 'created_at')
    list_filter = ('category', 'source_type', 'is_public', 'featured', 'created_at')
    search_fields = ('title', 'description', 'tags', 'archived_by__username')
    date_hierarchy = 'created_at'
    readonly_fields = ('file_size_formatted', 'created_at', 'updated_at')
    inlines = [ArchiveCommentInline]
    
    fieldsets = (
        ('Archive Information', {
            'fields': ('title', 'description', 'category', 'tags', 'archived_by')
        }),
        ('Source & File Information', {
            'fields': ('source_type', 'file', 'file_size', 'file_size_display')
        }),
        ('External Sources', {
            'fields': ('download_url', 'external_url', 'github_repo', 'official_website', 'mirror_links', 'download_instructions'),
            'classes': ('collapse',)
        }),
        ('Software Details', {
            'fields': ('license', 'platforms', 'requirements', 'version'),
            'classes': ('collapse',)
        }),
        ('Settings & Statistics', {
            'fields': ('is_public', 'featured', 'request_only', 'download_count', 'rating')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def comment_count(self, obj):
        return obj.comments.filter(is_approved=True).count()
    comment_count.short_description = 'Comments'

@admin.register(ArchiveComment)
class ArchiveCommentAdmin(admin.ModelAdmin):
    list_display = ('archive', 'user', 'rating', 'is_approved', 'created_at')
    list_filter = ('rating', 'is_approved', 'created_at')
    search_fields = ('archive__title', 'user__username', 'comment')
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Comment Information', {
            'fields': ('archive', 'user', 'comment', 'rating')
        }),
        ('Moderation', {
            'fields': ('is_approved',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(ArchiveDownloadRequest)
class ArchiveDownloadRequestAdmin(admin.ModelAdmin):
    list_display = ('archive', 'user', 'email', 'status', 'created_at', 'processed_at')
    list_filter = ('status', 'created_at')
    search_fields = ('archive__title', 'user__username', 'email')
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at',)
    
    fieldsets = (
        ('Request Information', {
            'fields': ('archive', 'user', 'email', 'message')
        }),
        ('Status', {
            'fields': ('status', 'processed_at')
        }),
        ('Timestamps', {
            'fields': ('created_at',)
        }),
    )
