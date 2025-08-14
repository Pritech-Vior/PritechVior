from django.contrib import admin
from django.utils.html import format_html
from .models import Course, Lesson, Enrollment

class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 0
    prepopulated_fields = {'slug': ('title',)}
    fields = ('title', 'slug', 'order', 'duration_minutes', 'is_free')

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'instructor', 'difficulty_badge', 'status_badge', 'price_display', 'enrollment_badge', 'rating_display', 'featured_badge', 'created_at')
    list_filter = ('difficulty', 'status', 'featured', 'created_at')
    search_fields = ('title', 'description', 'instructor__username')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [LessonInline]
    
    fieldsets = (
        ('Course Information', {
            'fields': ('title', 'slug', 'description', 'short_description', 'instructor')
        }),
        ('Course Details', {
            'fields': ('difficulty', 'status', 'price', 'duration_hours')
        }),
        ('Statistics', {
            'fields': ('enrollment_count', 'rating', 'featured'),
            'classes': ('collapse',)
        }),
    )
    
    def difficulty_badge(self, obj):
        colors = {
            'beginner': '#7ADB78',
            'intermediate': '#FFC876',
            'advanced': '#FF98E2',
            'expert': '#FF776F',
        }
        color = colors.get(obj.difficulty, '#757185')
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">{}</span>',
            color,
            obj.get_difficulty_display()
        )
    difficulty_badge.short_description = 'Difficulty'
    
    def status_badge(self, obj):
        colors = {
            'draft': '#858DFF',
            'published': '#7ADB78',
            'archived': '#FF776F',
        }
        color = colors.get(obj.status, '#757185')
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def price_display(self, obj):
        if obj.price == 0:
            return format_html(
                '<span style="background: var(--color-4); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">FREE</span>'
            )
        return format_html(
            '<span style="background: var(--color-2); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">${}</span>',
            obj.price
        )
    price_display.short_description = 'Price'
    
    def enrollment_badge(self, obj):
        return format_html(
            '<span style="background: var(--color-1); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">{} students</span>',
            obj.enrollment_count
        )
    enrollment_badge.short_description = 'Enrollments'
    
    def rating_display(self, obj):
        stars = '⭐' * int(obj.rating)
        return format_html(
            '<span style="background: var(--color-2); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">{} {:.1f}</span>',
            stars,
            obj.rating
        )
    rating_display.short_description = 'Rating'
    
    def featured_badge(self, obj):
        if obj.featured:
            return format_html(
                '<span style="background: var(--color-2); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">⭐ FEATURED</span>'
            )
        return format_html(
            '<span style="color: var(--n-4); font-size: 11px;">-</span>'
        )
    featured_badge.short_description = 'Featured'
    
    class Media:
        css = {
            'all': ('admin/css/pritechvior_admin.css',)
        }

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order', 'duration_display', 'free_badge', 'created_at')
    list_filter = ('is_free', 'course', 'created_at')
    search_fields = ('title', 'content', 'course__title')
    prepopulated_fields = {'slug': ('title',)}
    
    fieldsets = (
        ('Lesson Information', {
            'fields': ('course', 'title', 'slug', 'content')
        }),
        ('Settings', {
            'fields': ('order', 'duration_minutes', 'is_free')
        }),
    )
    
    def duration_display(self, obj):
        return format_html(
            '<span style="background: var(--color-5); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">{} min</span>',
            obj.duration_minutes
        )
    duration_display.short_description = 'Duration'
    
    def free_badge(self, obj):
        if obj.is_free:
            return format_html(
                '<span style="background: var(--color-4); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">FREE</span>'
            )
        return format_html(
            '<span style="background: var(--color-2); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">PREMIUM</span>'
        )
    free_badge.short_description = 'Access'
    
    class Media:
        css = {
            'all': ('admin/css/pritechvior_admin.css',)
        }

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'status_badge', 'progress_bar', 'enrolled_at', 'completed_at')
    list_filter = ('status', 'enrolled_at', 'course')
    search_fields = ('student__username', 'student__email', 'course__title')
    date_hierarchy = 'enrolled_at'
    
    fieldsets = (
        ('Enrollment Information', {
            'fields': ('student', 'course', 'status')
        }),
        ('Progress', {
            'fields': ('progress', 'completed_at')
        }),
    )
    
    def status_badge(self, obj):
        colors = {
            'active': '#7ADB78',
            'completed': '#AC6AFF',
            'cancelled': '#FF776F',
        }
        color = colors.get(obj.status, '#757185')
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def progress_bar(self, obj):
        return format_html(
            '<div style="width: 100px; height: 8px; background: var(--n-6); border-radius: 4px; overflow: hidden;">'
            '<div style="width: {}%; height: 100%; background: linear-gradient(45deg, var(--color-1), var(--color-2)); transition: width 0.3s ease;"></div>'
            '</div><span style="font-size: 11px; color: var(--n-3); margin-left: 8px;">{}%</span>',
            obj.progress,
            obj.progress
        )
    progress_bar.short_description = 'Progress'
    
    class Media:
        css = {
            'all': ('admin/css/pritechvior_admin.css',)
        }
