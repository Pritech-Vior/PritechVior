from django.db import models
from django.conf import settings

class Archive(models.Model):
    CATEGORY_CHOICES = [
        ('productivity', 'Productivity'),
        ('design', 'Design'),
        ('development', 'Development'),
        ('browser', 'Browser'),
        ('utilities', 'Utilities'),
        ('media', 'Media'),
        ('security', 'Security'),
        ('communication', 'Communication'),
        ('remote_access', 'Remote Access'),
        ('other', 'Other'),
    ]
    
    LICENSE_CHOICES = [
        ('free', 'Free'),
        ('licensed', 'Licensed'),
        ('free_pro', 'Free/Pro'),
        ('free_personal_business', 'Free Personal/Business'),
        ('trial', 'Trial'),
    ]
    
    PLATFORM_CHOICES = [
        ('windows', 'Windows'),
        ('macos', 'macOS'),
        ('linux', 'Linux'),
        ('android', 'Android'),
        ('ios', 'iOS'),
    ]
    
    # Basic Information
    title = models.CharField(max_length=255)
    description = models.TextField()
    version = models.CharField(max_length=50, default="1.0")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    
    # File Information
    file = models.FileField(upload_to='archives/%Y/%m/', blank=True, null=True)
    file_size = models.PositiveIntegerField(help_text='File size in bytes', default=0)
    file_size_display = models.CharField(max_length=20, blank=True, help_text='Human readable file size')
    
    # Software Details
    license = models.CharField(max_length=30, choices=LICENSE_CHOICES, default='free')
    platforms = models.JSONField(default=list, help_text='List of supported platforms')
    requirements = models.TextField(blank=True, help_text='System requirements')
    
    # Statistics & Features
    download_count = models.PositiveIntegerField(default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    featured = models.BooleanField(default=False)
    
    # Management
    archived_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='archived_items')
    tags = models.CharField(max_length=500, blank=True, help_text='Comma-separated tags')
    is_public = models.BooleanField(default=True)
    
    # Download Management
    download_url = models.URLField(blank=True, help_text='External download URL if not hosting file')
    request_only = models.BooleanField(default=True, help_text='Require contact for download')
    
    # External Source Information
    source_type = models.CharField(max_length=20, choices=[
        ('file', 'File Upload'),
        ('external', 'External Source'),
        ('github', 'GitHub Repository'),
        ('official', 'Official Website'),
    ], default='file')
    external_url = models.URLField(blank=True, help_text='External source URL')
    github_repo = models.URLField(blank=True, help_text='GitHub repository URL')
    official_website = models.URLField(blank=True, help_text='Official website URL')
    mirror_links = models.JSONField(default=list, blank=True, help_text='List of mirror download links')
    download_instructions = models.TextField(blank=True, help_text='Instructions for downloading from external sources')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        # Auto-generate file size display
        if self.file_size and not self.file_size_display:
            self.file_size_display = self.file_size_formatted
        super().save(*args, **kwargs)
    
    @property
    def file_size_formatted(self):
        """Format file size in human readable format"""
        if not self.file_size:
            return "Unknown"
        
        size = self.file_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"
    
    @property
    def platform_list(self):
        """Return platforms as list for frontend"""
        return self.platforms if isinstance(self.platforms, list) else []
    
    def increment_download_count(self):
        """Increment download count"""
        self.download_count += 1
        self.save(update_fields=['download_count'])
    
    def __str__(self):
        return self.title


class ArchiveComment(models.Model):
    """Comments on archives"""
    archive = models.ForeignKey(Archive, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='archive_comments')
    comment = models.TextField()
    rating = models.PositiveIntegerField(choices=[
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    ], null=True, blank=True, help_text='Optional rating (1-5 stars)')
    is_approved = models.BooleanField(default=True, help_text='Moderate comments if needed')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['archive', 'user']  # One comment per user per archive
    
    def __str__(self):
        return f"{self.user.username} - {self.archive.title}"


class ArchiveDownloadRequest(models.Model):
    """Track download requests for contact-required archives"""
    archive = models.ForeignKey(Archive, on_delete=models.CASCADE, related_name='download_requests')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='archive_requests')
    email = models.EmailField()
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('sent', 'Sent'),
        ('rejected', 'Rejected'),
    ], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['archive', 'user']
    
    def __str__(self):
        return f"{self.user.username} - {self.archive.title}"
