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


class ArchiveVersion(models.Model):
    """Multiple versions of an archive"""
    archive = models.ForeignKey(Archive, on_delete=models.CASCADE, related_name='versions')
    version = models.CharField(max_length=50, help_text='Version number (e.g., 1.0.0, 2.1.3)')
    release_date = models.DateTimeField()
    release_notes = models.TextField(blank=True, help_text='What\'s new in this version')
    is_latest = models.BooleanField(default=False, help_text='Mark as latest version')
    is_beta = models.BooleanField(default=False, help_text='Beta/pre-release version')
    is_deprecated = models.BooleanField(default=False, help_text='Deprecated version')
    
    # Version-specific details
    file_size = models.PositiveIntegerField(help_text='File size in bytes', default=0)
    file_size_display = models.CharField(max_length=20, blank=True, help_text='Human readable file size')
    requirements = models.TextField(blank=True, help_text='Version-specific system requirements')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-release_date']
        unique_together = ['archive', 'version']
    
    def save(self, *args, **kwargs):
        # Auto-generate file size display
        if self.file_size and not self.file_size_display:
            self.file_size_display = self.file_size_formatted
        
        # Ensure only one latest version per archive
        if self.is_latest:
            ArchiveVersion.objects.filter(archive=self.archive, is_latest=True).exclude(id=self.id).update(is_latest=False)
        
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
    
    def __str__(self):
        return f"{self.archive.title} v{self.version}"


class ArchivePlatformDownload(models.Model):
    """Platform-specific download links for archive versions"""
    version = models.ForeignKey(ArchiveVersion, on_delete=models.CASCADE, related_name='platform_downloads')
    platform = models.CharField(max_length=20, choices=Archive.PLATFORM_CHOICES)
    
    # Download options
    file = models.FileField(upload_to='archives/%Y/%m/platforms/', blank=True, null=True, help_text='Upload file for this platform')
    download_url = models.URLField(blank=True, help_text='External download URL for this platform')
    
    # Platform-specific details
    file_size = models.PositiveIntegerField(help_text='Platform-specific file size in bytes', default=0)
    file_size_display = models.CharField(max_length=20, blank=True, help_text='Human readable file size')
    architecture = models.CharField(max_length=20, blank=True, help_text='e.g., x64, x86, arm64')
    installer_type = models.CharField(max_length=30, blank=True, help_text='e.g., msi, exe, dmg, deb, rpm')
    platform_requirements = models.TextField(blank=True, help_text='Platform-specific requirements')
    
    # Statistics
    download_count = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['platform']
        unique_together = ['version', 'platform', 'architecture']
    
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
    def download_link(self):
        """Get the actual download link (file or external URL)"""
        if self.file:
            return self.file.url
        return self.download_url
    
    def increment_download_count(self):
        """Increment download count for this platform"""
        self.download_count += 1
        self.save(update_fields=['download_count'])
        # Also increment the main archive download count
        self.version.archive.increment_download_count()
    
    def __str__(self):
        arch_suffix = f" ({self.architecture})" if self.architecture else ""
        return f"{self.version} - {self.get_platform_display()}{arch_suffix}"


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
