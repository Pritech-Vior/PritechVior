from django.contrib import admin
from .models import Course, Lesson, Enrollment, CourseReview

class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 0
    prepopulated_fields = {'slug': ('title',)}
    fields = ('title', 'slug', 'order', 'duration_minutes', 'is_free')

class CourseReviewInline(admin.TabularInline):
    model = CourseReview
    extra = 0
    readonly_fields = ('rating', 'created_at')
    fields = ('student', 'rating', 'review_text', 'created_at')

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'instructor', 'category', 'difficulty', 'price', 'status', 'featured', 'created_at')
    list_filter = ('category', 'difficulty', 'status', 'featured', 'created_at')
    search_fields = ('title', 'description', 'instructor__username')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [LessonInline, CourseReviewInline]
    
    fieldsets = (
        ('Course Information', {
            'fields': ('title', 'slug', 'description', 'short_description', 'instructor')
        }),
        ('Classification', {
            'fields': ('category', 'difficulty', 'status', 'featured')
        }),
        ('Pricing & Duration', {
            'fields': ('price', 'duration_hours', 'duration_weeks')
        }),
        ('Course Structure', {
            'fields': ('module_count', 'project_count', 'enrollment_count', 'rating')
        }),
    )

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order', 'duration_minutes', 'is_free')
    list_filter = ('course', 'is_free')
    search_fields = ('title', 'course__title')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'status', 'progress', 'enrolled_at')
    list_filter = ('status', 'enrolled_at')
    search_fields = ('student__username', 'course__title')
    readonly_fields = ('enrolled_at',)

@admin.register(CourseReview)
class CourseReviewAdmin(admin.ModelAdmin):
    list_display = ('course', 'student', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('course__title', 'student__username', 'review_text')
    readonly_fields = ('created_at',)
