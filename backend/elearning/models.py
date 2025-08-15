from django.db import models
from django.conf import settings
from django.utils.text import slugify

class Course(models.Model):
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    CATEGORY_CHOICES = [
        ('programming', 'Programming'),
        ('design', 'Design'),
        ('business', 'Business'),
        ('marketing', 'Marketing'),
        ('data_science', 'Data Science'),
        ('web_development', 'Web Development'),
        ('mobile_development', 'Mobile Development'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    
    # Basic Information
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField()
    short_description = models.CharField(max_length=500, blank=True)
    
    # Course Details
    instructor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='courses')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='programming')
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='beginner')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    # Pricing & Duration
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    duration_hours = models.PositiveIntegerField(default=0)
    duration_weeks = models.PositiveIntegerField(default=0, help_text="Course duration in weeks")
    
    # Course Structure
    module_count = models.PositiveIntegerField(default=0, help_text="Number of modules in the course")
    project_count = models.PositiveIntegerField(default=0, help_text="Number of hands-on projects")
    
    # Statistics
    enrollment_count = models.PositiveIntegerField(default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    featured = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    @property
    def duration_display(self):
        """Return duration in weeks format for frontend"""
        if self.duration_weeks:
            return f"{self.duration_weeks} weeks"
        elif self.duration_hours:
            weeks = self.duration_hours // 40  # Assuming 40 hours per week
            if weeks > 0:
                return f"{weeks} weeks"
            return f"{self.duration_hours} hours"
        return "Self-paced"
    
    @property
    def modules(self):
        """Return module count for frontend compatibility"""
        return self.module_count
    
    @property
    def projects(self):
        """Return project count for frontend compatibility"""
        return self.project_count
    
    @property
    def enrolled(self):
        """Return enrollment count for frontend compatibility"""
        return self.enrollment_count
    
    def __str__(self):
        return self.title


class CourseReview(models.Model):
    """Course reviews to support rating system"""
    RATING_CHOICES = [
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    ]
    
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='reviews')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='course_reviews')
    rating = models.IntegerField(choices=RATING_CHOICES)
    review_text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['course', 'student']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.student.username} - {self.course.title} ({self.rating} stars)"

class Lesson(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, blank=True)
    content = models.TextField()
    order = models.PositiveIntegerField(default=0)
    duration_minutes = models.PositiveIntegerField(default=0)
    is_free = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order']
        unique_together = ['course', 'order']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.course.title} - {self.title}"

class Enrollment(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    progress = models.PositiveIntegerField(default=0)  # Progress percentage
    enrolled_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ['student', 'course']
        ordering = ['-enrolled_at']
    
    def __str__(self):
        return f"{self.student.username} - {self.course.title}"
