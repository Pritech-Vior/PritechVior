from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
from django.utils.text import slugify


def generate_request_id():
    """Generate a unique request ID"""
    return uuid.uuid4()


class ProjectCategory(models.Model):
    """Project categories for organizing projects"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Icon name for frontend")
    color = models.CharField(max_length=7, default="#3B82F6", help_text="Hex color code")
    slug = models.SlugField(unique=True, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = "Project Categories"
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name


class TechnologyStack(models.Model):
    """Technology stacks available for projects"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    category = models.CharField(max_length=50, choices=[
        ('frontend', 'Frontend'),
        ('backend', 'Backend'),
        ('database', 'Database'),
        ('mobile', 'Mobile'),
        ('devops', 'DevOps'),
        ('other', 'Other'),
    ], default='other')
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['category', 'name']
    
    def __str__(self):
        return self.name


class ServicePackage(models.Model):
    """Service packages for different user types"""
    USER_TYPE_CHOICES = [
        ('student', 'Student'),
        ('client', 'Individual Client'),
        ('business', 'Business'),
    ]
    
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    features = models.JSONField(default=list, help_text="List of features included")
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['user_type', 'order']
        unique_together = ['user_type', 'order']
    
    def __str__(self):
        return f"{self.name} ({self.get_user_type_display()})"


class CourseCategory(models.Model):
    """Academic course categories for students"""
    name = models.CharField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    user_type = models.CharField(max_length=20, choices=[
        ('student', 'Student'),
        ('all', 'All Users'),
    ], default='student')
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
        verbose_name_plural = "Course Categories"
    
    def __str__(self):
        return self.name


class ProjectTemplate(models.Model):
    """Pre-built project templates"""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('archived', 'Archived'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    slug = models.SlugField(unique=True, blank=True)
    
    # Classification
    category = models.ForeignKey(ProjectCategory, on_delete=models.CASCADE, related_name='templates')
    technologies = models.ManyToManyField(TechnologyStack, blank=True)
    
    # Pricing
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    student_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Features
    features = models.JSONField(default=list, help_text="List of included features")
    customizable_features = models.JSONField(default=list, help_text="Features that can be customized")
    
    # Timeline
    estimated_duration = models.PositiveIntegerField(help_text="Estimated duration in days")
    
    # Images
    thumbnail = models.ImageField(upload_to='project_templates/', blank=True)
    gallery = models.JSONField(default=list, help_text="List of gallery image URLs")
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    is_featured = models.BooleanField(default=False)
    
    # SEO
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    
    # Stats
    view_count = models.PositiveIntegerField(default=0)
    request_count = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_featured', '-created_at']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def get_price_for_user_type(self, user_type):
        """Get appropriate price based on user type"""
        if user_type == 'student' and self.student_price:
            return self.student_price
        return self.base_price
    
    def __str__(self):
        return self.title

class Project(models.Model):
    STATUS_CHOICES = [
        ('planning', 'Planning'),
        ('in_progress', 'In Progress'),
        ('review', 'Under Review'),
        ('completed', 'Completed'),
        ('on_hold', 'On Hold'),
        ('cancelled', 'Cancelled'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    USER_TYPE_CHOICES = [
        ('student', 'Student'),
        ('client', 'Individual Client'),
        ('business', 'Business'),
    ]
    
    # Basic Information
    title = models.CharField(max_length=255)
    description = models.TextField()
    requirements = models.TextField(blank=True, help_text="Project requirements and specifications")
    slug = models.SlugField(unique=True, blank=True)
    
    # Classification
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='client')
    category = models.ForeignKey(ProjectCategory, on_delete=models.CASCADE, related_name='projects')
    template = models.ForeignKey(ProjectTemplate, on_delete=models.SET_NULL, null=True, blank=True, related_name='projects')
    
    # Academic fields (for students)
    course_category = models.ForeignKey(CourseCategory, on_delete=models.SET_NULL, null=True, blank=True)
    academic_level = models.CharField(max_length=50, blank=True, choices=[
        ('undergraduate', 'Undergraduate'),
        ('graduate', 'Graduate'),
        ('phd', 'PhD'),
        ('other', 'Other'),
    ])
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    
    # People
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='client_projects')
    assigned_users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='assigned_projects', blank=True)
    project_manager = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_projects')
    
    # Timeline & Budget
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    deadline = models.DateField(null=True, blank=True)
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    estimated_cost = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    
    # Technical Details
    technologies = models.ManyToManyField(TechnologyStack, blank=True)
    technology_preferences = models.JSONField(default=dict, blank=True, help_text="Client technology preferences")
    customizations = models.JSONField(default=dict, blank=True, help_text="Project customizations")
    
    # Service Package
    service_package = models.ForeignKey(ServicePackage, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Repository & Demo
    repository_url = models.URLField(blank=True)
    live_demo_url = models.URLField(blank=True)
    
    # Progress Tracking
    progress_percentage = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    
    # Contact Information
    contact_phone = models.CharField(max_length=20, blank=True)
    contact_email = models.EmailField(blank=True)
    
    # Visibility
    is_public = models.BooleanField(default=False, help_text="Show this project in public showcase")
    is_requestable = models.BooleanField(default=False, help_text="Allow users to request customization of this project")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Project.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)
    
    @property
    def is_overdue(self):
        """Check if project is overdue"""
        if self.deadline and self.status not in ['completed', 'cancelled']:
            return timezone.now().date() > self.deadline
        return False
    
    @property
    def days_remaining(self):
        """Get days remaining until deadline"""
        if self.deadline:
            delta = self.deadline - timezone.now().date()
            return delta.days
        return None
    
    @property
    def team_size(self):
        """Get team size"""
        return self.assigned_users.count()
    
    def __str__(self):
        return self.title


class ProjectRequest(models.Model):
    """Project requests from clients"""
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('reviewing', 'Under Review'),
        ('quoted', 'Quote Provided'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('converted', 'Converted to Project'),
    ]
    
    REQUEST_TYPE_CHOICES = [
        ('new', 'New Custom Project'),
        ('template', 'Template Customization'),
    ]
    
    USER_TYPE_CHOICES = [
        ('student', 'Student'),
        ('client', 'Individual Client'),
        ('business', 'Business'),
    ]
    
    # Request ID
    request_id = models.UUIDField(default=generate_request_id, editable=False, unique=True)
    
    # Basic Information
    title = models.CharField(max_length=255)
    description = models.TextField()
    requirements = models.TextField(blank=True)
    
    # Request Details
    request_type = models.CharField(max_length=20, choices=REQUEST_TYPE_CHOICES, default='new')
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='client')
    
    # Academic Information (for students)
    course_category = models.ForeignKey(CourseCategory, on_delete=models.SET_NULL, null=True, blank=True)
    academic_level = models.CharField(max_length=50, blank=True)
    institution = models.CharField(max_length=200, blank=True)
    
    # Template Customization (if applicable)
    template = models.ForeignKey(ProjectTemplate, on_delete=models.SET_NULL, null=True, blank=True)
    customizations = models.JSONField(default=dict, blank=True)
    
    # Technical Requirements
    preferred_technologies = models.ManyToManyField(TechnologyStack, blank=True)
    technology_notes = models.TextField(blank=True)
    
    # Project Scope
    features_required = models.JSONField(default=list, blank=True)
    additional_features = models.TextField(blank=True)
    
    # Timeline & Budget
    budget_range = models.CharField(max_length=100, blank=True)
    preferred_deadline = models.DateField(null=True, blank=True)
    timeline_flexibility = models.CharField(max_length=20, choices=[
        ('flexible', 'Flexible'),
        ('somewhat_flexible', 'Somewhat Flexible'),
        ('strict', 'Strict Deadline'),
    ], default='flexible')
    
    # Service Package
    service_package = models.ForeignKey(ServicePackage, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Client Information
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='project_requests')
    contact_phone = models.CharField(max_length=20, blank=True)
    contact_email = models.EmailField(blank=True)
    
    # Status & Assignment
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_requests')
    
    # Quotes & Estimates
    estimated_cost = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    quoted_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    estimated_duration = models.PositiveIntegerField(null=True, blank=True, help_text="Estimated duration in days")
    
    # Conversion
    converted_project = models.OneToOneField(Project, on_delete=models.SET_NULL, null=True, blank=True, related_name='source_request')
    
    # Notes
    internal_notes = models.TextField(blank=True, help_text="Internal notes for staff")
    client_notes = models.TextField(blank=True, help_text="Notes from client")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"#{self.request_id.hex[:8]} - {self.title}"


class ProjectRequestCommunication(models.Model):
    """Communication thread for project requests"""
    SENDER_TYPE_CHOICES = [
        ('client', 'Client'),
        ('staff', 'Staff'),
        ('system', 'System'),
    ]
    
    request = models.ForeignKey(ProjectRequest, on_delete=models.CASCADE, related_name='communications')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    sender_type = models.CharField(max_length=10, choices=SENDER_TYPE_CHOICES)
    
    message = models.TextField()
    attachments = models.JSONField(default=list, blank=True)
    
    is_internal = models.BooleanField(default=False, help_text="Internal message not visible to client")
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.sender.username} - {self.request.title[:50]}"


class ProjectMilestone(models.Model):
    """Project milestones for tracking progress"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='milestones')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    
    # Financial
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Timeline
    due_date = models.DateField()
    completed_date = models.DateField(null=True, blank=True)
    
    # Progress
    order = models.PositiveIntegerField(default=0)
    deliverables = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'due_date']
        unique_together = ['project', 'order']
    
    @property
    def is_overdue(self):
        """Check if milestone is overdue"""
        if self.status not in ['completed', 'paid'] and self.due_date:
            return timezone.now().date() > self.due_date
        return False
    
    def __str__(self):
        return f"{self.project.title} - {self.name}"
