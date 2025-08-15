from django.db import models
from django.conf import settings
from django.utils.text import slugify

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
    
    def __str__(self):
        return self.title


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
