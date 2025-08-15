from django.contrib import admin
from .models import Archive, ArchiveDownloadRequest

@admin.register(Archive)
class ArchiveAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'source_type', 'version', 'file_size_display', 'request_only', 'download_count', 'archived_by', 'created_at')
    list_filter = ('category', 'source_type', 'license', 'featured', 'request_only', 'created_at')
    search_fields = ('title', 'description', 'version', 'archived_by__username')
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'version', 'category', 'license')
        }),
        ('Source Information', {
            'fields': ('source_type', 'file', 'external_url', 'github_repo', 'official_website', 'mirror_links', 'download_instructions')
        }),
        ('Technical Details', {
            'fields': ('platforms', 'requirements', 'file_size_display')
        }),
        ('Settings', {
            'fields': ('archived_by', 'featured', 'request_only')
        }),
        ('Statistics', {
            'fields': ('download_count', 'rating'),
            'classes': ('collapse',)
        }),
    )

@admin.register(ArchiveDownloadRequest)
class ArchiveDownloadRequestAdmin(admin.ModelAdmin):
    list_display = ('archive', 'user', 'status', 'created_at', 'processed_at')
    list_filter = ('status', 'created_at')
    search_fields = ('archive__title', 'user__username', 'message')
    readonly_fields = ('created_at',)
