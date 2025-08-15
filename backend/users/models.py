from django.contrib.auth.models import AbstractUser, Permission
from django.db import models

class CustomRole(models.Model):
    name = models.CharField(max_length=50, unique=True)
    permissions = models.ManyToManyField(Permission, blank=True)

    def __str__(self):
        return self.name


class User(AbstractUser):
    ROLE_CHOICES = [
        ('guest', 'Guest'),
        ('student', 'Student'),
        ('parent', 'Parent'),
        ('trainer', 'Trainer'),
        ('client', 'Client'),
        ('designer', 'Designer'),
        ('writer', 'Writer'),
        ('technician', 'Technician'),
        ('admin', 'Admin'),
        ('treasury', 'Treasury'),
        ('ceo', 'CEO'),
    ]
    
    # Basic Role (primary role)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='guest')
    
    # Multi-role support
    additional_roles = models.ManyToManyField('self', blank=True, symmetrical=False, related_name='users_with_role')
    custom_role = models.ForeignKey(CustomRole, null=True, blank=True, on_delete=models.SET_NULL)
    
    # Profile Information
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    
    # Skills and Interests (for matching and recommendations)
    skills = models.JSONField(default=list, blank=True, help_text='List of user skills')
    interests = models.JSONField(default=list, blank=True, help_text='List of user interests')
    
    # Dashboard Preferences
    dashboard_layout = models.JSONField(default=dict, blank=True, help_text='Dashboard layout preferences')
    notification_preferences = models.JSONField(default=dict, blank=True, help_text='Notification settings')
    
    # Account Status
    is_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=100, blank=True)
    
    # Timestamps
    last_active = models.DateTimeField(null=True, blank=True)
    
    def get_all_roles(self):
        """Get all roles for this user including additional roles"""
        roles = [self.role]
        for additional_role in self.additional_roles.all():
            if additional_role.role not in roles:
                roles.append(additional_role.role)
        return roles
    
    def has_role(self, role_name):
        """Check if user has a specific role"""
        return role_name in self.get_all_roles()
    
    def add_role(self, role_name):
        """Add an additional role to user"""
        if role_name in dict(self.ROLE_CHOICES) and not self.has_role(role_name):
            if role_name != self.role:
                # Create a temporary user object to represent the role
                role_user, created = User.objects.get_or_create(
                    username=f"{self.username}_{role_name}",
                    defaults={'role': role_name, 'is_active': False}
                )
                self.additional_roles.add(role_user)
    
    @property
    def display_name(self):
        """Return display name for the user"""
        return self.get_full_name() if self.get_full_name() else self.username
    
    def __str__(self):
        return f"{self.username} ({', '.join(self.get_all_roles())})"


class UserProfile(models.Model):
    """Extended user profile for additional information"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Professional Information
    company = models.CharField(max_length=100, blank=True)
    job_title = models.CharField(max_length=100, blank=True)
    website = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    github = models.URLField(blank=True)
    
    # Educational Background
    education = models.JSONField(default=list, blank=True, help_text='Educational background')
    certifications = models.JSONField(default=list, blank=True, help_text='Professional certifications')
    
    # Preferences
    timezone = models.CharField(max_length=50, default='UTC')
    language = models.CharField(max_length=10, default='en')
    theme_preference = models.CharField(max_length=20, default='dark', choices=[
        ('light', 'Light'),
        ('dark', 'Dark'),
        ('auto', 'Auto'),
    ])
    
    # Statistics (for analytics)
    courses_completed = models.PositiveIntegerField(default=0)
    projects_completed = models.PositiveIntegerField(default=0)
    total_learning_hours = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"
