from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name

class BlogPost(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    
    CATEGORY_CHOICES = [
        ('web_development', 'Web Development'),
        ('business', 'Business'),
        ('fintech', 'Fintech'),
        ('technology', 'Technology'),
        ('tutorial', 'Tutorial'),
        ('case_study', 'Case Study'),
        ('industry_news', 'Industry News'),
        ('other', 'Other'),
    ]
    
    # Basic Information
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    excerpt = models.TextField(max_length=500, help_text="Short description for preview")
    content = models.TextField()
    
    # Categorization
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='blog_posts')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    categories = models.ManyToManyField(Category, related_name='posts', blank=True)
    tags = models.JSONField(default=list, help_text='List of tags for the post')
    
    # Publishing
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    featured = models.BooleanField(default=False)
    
    # SEO & Media
    image = models.URLField(blank=True, help_text='Featured image URL')
    meta_description = models.CharField(max_length=160, blank=True)
    
    # Analytics
    views = models.PositiveIntegerField(default=0)
    read_time = models.CharField(max_length=20, default="5 min read")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        
        # Auto-generate read time based on content length
        if not self.read_time and self.content:
            word_count = len(self.content.split())
            read_minutes = max(1, round(word_count / 200))  # 200 words per minute
            self.read_time = f"{read_minutes} min read"
        
        # Auto-generate excerpt if not provided
        if not self.excerpt and self.content:
            self.excerpt = self.content[:200] + "..." if len(self.content) > 200 else self.content
        
        super().save(*args, **kwargs)
    
    @property
    def tag_list(self):
        """Return tags as list for frontend"""
        return self.tags if isinstance(self.tags, list) else []
    
    @property
    def date(self):
        """Return published date or created date for frontend"""
        return self.published_at or self.created_at
    
    def increment_views(self):
        """Increment view count"""
        self.views += 1
        self.save(update_fields=['views'])
    
    @property
    def like_count(self):
        """Return total number of likes"""
        return self.likes.count()
    
    @property
    def comment_count(self):
        """Return total number of approved comments"""
        return self.comments.filter(is_approved=True).count()
    
    @property
    def download_count(self):
        """Return total downloads across all downloadable files"""
        return sum(download.download_count for download in self.downloads.all())
    
    def __str__(self):
        return self.title


class BlogLike(models.Model):
    """Like model for blog posts"""
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('post', 'user')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} likes {self.post.title}"


class BlogComment(models.Model):
    """Comment model for blog posts"""
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField(max_length=1000)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    is_approved = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comment by {self.user.username} on {self.post.title}"


class BlogImage(models.Model):
    """Additional images for blog posts (Instagram-like gallery)"""
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='blog/images/', blank=True, null=True)
    image_url = models.URLField(blank=True, help_text='External image URL')
    caption = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', 'created_at']
    
    @property
    def image_source(self):
        """Return image URL or file URL"""
        if self.image:
            return self.image.url
        return self.image_url
    
    def __str__(self):
        return f"Image for {self.post.title}"


class BlogDownload(models.Model):
    """Download attachments for blog posts"""
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='downloads')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='blog/downloads/', blank=True, null=True)
    file_url = models.URLField(blank=True, help_text='External file URL')
    file_size = models.CharField(max_length=50, blank=True, help_text='e.g., 2.5 MB')
    file_type = models.CharField(max_length=50, blank=True, help_text='e.g., PDF, ZIP, etc.')
    download_count = models.PositiveIntegerField(default=0)
    is_premium = models.BooleanField(default=False, help_text='Require authentication to download')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
    
    @property
    def download_source(self):
        """Return file URL or file URL"""
        if self.file:
            return self.file.url
        return self.file_url
    
    def increment_download_count(self):
        """Increment download count"""
        self.download_count += 1
        self.save(update_fields=['download_count'])
    
    def __str__(self):
        return f"{self.title} - {self.post.title}"


class BlogDownloadRequest(models.Model):
    """Download request for premium content"""
    download = models.ForeignKey(BlogDownload, on_delete=models.CASCADE, related_name='requests')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    email = models.EmailField()
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('sent', 'Sent'),
    ], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ('download', 'user')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Download request by {self.user.username} for {self.download.title}"


class NewsletterSubscription(models.Model):
    """Newsletter subscription model for blog subscribers"""
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-subscribed_at']
    
    def __str__(self):
        return self.email
