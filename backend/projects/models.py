from django.db import models
from django.conf import settings
from django.utils import timezone

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
    
    TYPE_CHOICES = [
        ('final_year', 'Final Year Project'),
        ('enterprise', 'Enterprise'),
        ('student', 'Student Project'),
        ('research', 'Research Project'),
        ('consulting', 'Consulting'),
        ('other', 'Other'),
    ]
    
    CATEGORY_CHOICES = [
        ('web', 'Web Development'),
        ('mobile', 'Mobile Development'),
        ('desktop', 'Desktop Application'),
        ('api', 'API Development'),
        ('data_science', 'Data Science'),
        ('ai_ml', 'AI/ML'),
        ('other', 'Other'),
    ]
    
    # Basic Information
    title = models.CharField(max_length=255)
    description = models.TextField()
    requirements = models.TextField(blank=True, help_text="Project requirements and specifications")
    
    # Classification
    project_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='other')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='web')
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
    budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Technical Details
    technology_stack = models.JSONField(default=list, blank=True, help_text="Technologies used in the project")
    repository_url = models.URLField(blank=True)
    live_demo_url = models.URLField(blank=True)
    
    # Progress Tracking
    progress_percentage = models.PositiveIntegerField(default=0, help_text="Project completion percentage")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
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


class ProjectMilestone(models.Model):
    """Project milestones for tracking progress and payments"""
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
    deliverables = models.JSONField(default=list, blank=True, help_text="List of deliverables for this milestone")
    
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


class ProjectRequest(models.Model):
    """Client project requests"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewing', 'Under Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('converted', 'Converted to Project'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    # Basic Information
    title = models.CharField(max_length=255)
    description = models.TextField()
    requirements = models.TextField(blank=True)
    
    # Classification
    project_type = models.CharField(max_length=20, choices=Project.TYPE_CHOICES, default='other')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    
    # Client Information
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='project_requests')
    
    # Project Details
    budget = models.CharField(max_length=100, help_text="Budget range or amount")
    deadline = models.DateField(null=True, blank=True)
    technology = models.CharField(max_length=200, blank=True, help_text="Preferred technologies")
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Assignment
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_requests')
    
    # Conversion
    converted_project = models.OneToOneField(Project, on_delete=models.SET_NULL, null=True, blank=True, related_name='source_request')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.client.username}"


class ProjectRequestResponse(models.Model):
    """Responses to project requests (communication thread)"""
    TYPE_CHOICES = [
        ('system', 'System'),
        ('staff', 'Staff'),
        ('client', 'Client'),
    ]
    
    request = models.ForeignKey(ProjectRequest, on_delete=models.CASCADE, related_name='responses')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='request_responses')
    message = models.TextField()
    response_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='staff')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.sender.username} - {self.request.title[:50]}"
