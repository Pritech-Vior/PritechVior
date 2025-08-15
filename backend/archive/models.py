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
    
    # External Source Information
    SOURCE_TYPE_CHOICES = [
        ('hosted', 'Hosted File'),
        ('external', 'External Download'),
        ('github', 'GitHub Release'),
        ('official', 'Official Website'),
        ('direct', 'Direct Link'),
        ('mirror', 'Mirror Site'),
    ]
    
    source_type = models.CharField(max_length=20, choices=SOURCE_TYPE_CHOICES, default='hosted')
    external_url = models.URLField(blank=True, help_text='External download/source URL')
    official_website = models.URLField(blank=True, help_text='Official website URL')
    github_repo = models.URLField(blank=True, help_text='GitHub repository URL')
    mirror_links = models.JSONField(default=list, help_text='Alternative download mirrors')
    
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
    request_only = models.BooleanField(default=False, help_text='Require contact for download')
    download_instructions = models.TextField(blank=True, help_text='Special download instructions')
    
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
    
    @property
    def mirror_list(self):
        """Return mirror links as list for frontend"""
        return self.mirror_links if isinstance(self.mirror_links, list) else []
    
    @property
    def download_link(self):
        """Get the primary download link"""
        if self.source_type == 'hosted' and self.file:
            return self.file.url
        elif self.external_url:
            return self.external_url
        return None
    
    @property
    def has_external_source(self):
        """Check if this archive uses external sources"""
        return self.source_type != 'hosted' or bool(self.external_url)
    
    @property
    def all_download_links(self):
        """Get all available download links"""
        links = []
        
        # Primary download link
        primary = self.download_link
        if primary:
            links.append({
                'type': 'primary',
                'url': primary,
                'label': self.get_source_type_display()
            })
        
        # Official website
        if self.official_website:
            links.append({
                'type': 'official',
                'url': self.official_website,
                'label': 'Official Website'
            })
        
        # GitHub repository
        if self.github_repo:
            links.append({
                'type': 'github',
                'url': self.github_repo,
                'label': 'GitHub Repository'
            })
        
        # Mirror links
        for i, mirror in enumerate(self.mirror_list):
            if mirror:
                links.append({
                    'type': 'mirror',
                    'url': mirror,
                    'label': f'Mirror {i + 1}'
                })
        
        return links
    
    def increment_download_count(self):
        """Increment download count"""
        self.download_count += 1
        self.save(update_fields=['download_count'])
    
    def __str__(self):
        return self.title


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
