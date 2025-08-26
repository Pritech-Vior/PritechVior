from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Project, ProjectRequest, ProjectTemplate, ProjectCategory,
    TechnologyStack, ServicePackage, CourseCategory, ProjectMilestone,
    ProjectRequestCommunication
)

# Inline classes for better admin experience
class ProjectMilestoneInline(admin.TabularInline):
    model = ProjectMilestone
    extra = 1
    fields = ('name', 'description', 'due_date', 'status', 'order', 'amount')

class ProjectRequestCommunicationInline(admin.TabularInline):
    model = ProjectRequestCommunication
    extra = 0
    readonly_fields = ('created_at',)
    fields = ('sender', 'message', 'sender_type', 'created_at')

@admin.register(ProjectCategory)
class ProjectCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'description', 'is_active', 'order')
    list_filter = ('is_active',)
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('is_active', 'order')
    ordering = ('order', 'name')

@admin.register(TechnologyStack)
class TechnologyStackAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('name', 'description')
    list_editable = ('is_active',)
    ordering = ('category', 'name')

@admin.register(ServicePackage)
class ServicePackageAdmin(admin.ModelAdmin):
    list_display = ('name', 'user_type', 'price_display', 'is_active', 'order')
    list_filter = ('user_type', 'is_active')
    search_fields = ('name', 'description')
    list_editable = ('is_active', 'order')
    ordering = ('user_type', 'order')
    
    def price_display(self, obj):
        return f"TSH {obj.price:,}"
    price_display.short_description = 'Price'

@admin.register(CourseCategory)
class CourseCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'user_type', 'is_active')
    list_filter = ('is_active', 'user_type')
    search_fields = ('name', 'description')
    list_editable = ('is_active',)
    ordering = ('name',)

@admin.register(ProjectTemplate)
class ProjectTemplateAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'base_price', 'estimated_duration', 'status', 'is_featured')
    list_filter = ('category', 'status', 'is_featured', 'technologies')
    search_fields = ('title', 'description')
    filter_horizontal = ('technologies',)
    list_editable = ('status', 'is_featured')
    prepopulated_fields = {'slug': ('title',)}
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'slug', 'category')
        }),
        ('Technical Details', {
            'fields': ('technologies', 'estimated_duration')
        }),
        ('Pricing & Features', {
            'fields': ('base_price', 'student_price', 'features', 'customizable_features')
        }),
        ('Status & Display', {
            'fields': ('status', 'is_featured')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'client', 'status_badge', 'priority_badge', 'is_public', 'is_requestable', 'progress_bar', 'start_date', 'end_date', 'created_at')
    list_filter = ('status', 'priority', 'is_public', 'is_requestable', 'start_date', 'created_at', 'category', 'technologies')
    search_fields = ('title', 'description', 'client__username', 'client__email')
    date_hierarchy = 'created_at'
    filter_horizontal = ('assigned_users', 'technologies')
    inlines = [ProjectMilestoneInline]
    
    fieldsets = (
        ('Project Information', {
            'fields': ('title', 'description', 'client', 'category')
        }),
        ('Status & Priority', {
            'fields': ('status', 'priority', 'is_public', 'is_requestable')
        }),
        ('Team & Technologies', {
            'fields': ('assigned_users', 'technologies')
        }),
        ('Timeline & Budget', {
            'fields': ('start_date', 'end_date', 'deadline', 'budget', 'estimated_cost')
        }),
        ('Academic Info (Students)', {
            'fields': ('course_category', 'academic_level'),
            'classes': ('collapse',)
        }),
        ('Additional Details', {
            'fields': ('requirements', 'service_package', 'template'),
            'classes': ('collapse',)
        }),
        ('Repository & Demo', {
            'fields': ('repository_url', 'live_demo_url'),
            'classes': ('collapse',)
        }),
        ('Progress & Contact', {
            'fields': ('progress_percentage', 'contact_phone', 'contact_email'),
            'classes': ('collapse',)
        }),
    )
    
    def status_badge(self, obj):
        colors = {
            'planning': '#858DFF',
            'in_progress': '#FFC876',
            'review': '#AC6AFF',
            'completed': '#7ADB78',
            'on_hold': '#FF98E2',
            'cancelled': '#FF776F',
        }
        color = colors.get(obj.status, '#757185')
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def priority_badge(self, obj):
        colors = {
            'low': '#7ADB78',
            'medium': '#FFC876',
            'high': '#FF98E2',
            'critical': '#FF776F',
        }
        color = colors.get(obj.priority, '#757185')
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">{}</span>',
            color,
            obj.get_priority_display()
        )
    priority_badge.short_description = 'Priority'
    
    def progress_bar(self, obj):
        progress = 0
        if obj.status == 'planning':
            progress = 10
        elif obj.status == 'in_progress':
            progress = 50
        elif obj.status == 'review':
            progress = 80
        elif obj.status == 'completed':
            progress = 100
        elif obj.status == 'on_hold':
            progress = 30
        elif obj.status == 'cancelled':
            progress = 0
            
        return format_html(
            '<div style="width: 100px; height: 8px; background: var(--n-6); border-radius: 4px; overflow: hidden;">'
            '<div style="width: {}%; height: 100%; background: linear-gradient(45deg, var(--color-1), var(--color-2)); transition: width 0.3s ease;"></div>'
            '</div><span style="font-size: 11px; color: var(--n-3); margin-left: 8px;">{}%</span>',
            progress,
            progress
        )
    progress_bar.short_description = 'Progress'

@admin.register(ProjectRequest)
class ProjectRequestAdmin(admin.ModelAdmin):
    list_display = ('title', 'client', 'user_type', 'status_badge', 'budget_range', 'created_at')
    list_filter = ('status', 'user_type', 'request_type', 'created_at', 'service_package')
    search_fields = ('title', 'description', 'client__username', 'client__email')
    date_hierarchy = 'created_at'
    filter_horizontal = ('preferred_technologies',)
    inlines = [ProjectRequestCommunicationInline]
    readonly_fields = ('request_id', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Request Information', {
            'fields': ('request_id', 'title', 'description', 'client', 'user_type', 'request_type')
        }),
        ('Project Details', {
            'fields': ('course_category', 'template', 'service_package', 'preferred_technologies')
        }),
        ('Status & Assignment', {
            'fields': ('status', 'assigned_to')
        }),
        ('Budget & Timeline', {
            'fields': ('budget_range', 'preferred_deadline', 'timeline_flexibility')
        }),
        ('Estimates & Quotes', {
            'fields': ('estimated_cost', 'quoted_price', 'estimated_duration')
        }),
        ('Additional Details', {
            'fields': ('requirements', 'additional_features', 'internal_notes', 'client_notes'),
            'classes': ('collapse',)
        }),
        ('Academic Info (Students)', {
            'fields': ('academic_level', 'institution'),
            'classes': ('collapse',)
        }),
        ('Contact Info', {
            'fields': ('contact_phone', 'contact_email'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'reviewed_at'),
            'classes': ('collapse',)
        }),
    )
    
    def status_badge(self, obj):
        colors = {
            'pending': '#FFC876',
            'reviewing': '#858DFF',
            'quoted': '#AC6AFF',
            'approved': '#7ADB78',
            'rejected': '#FF776F',
            'converted': '#7ADB78',
        }
        color = colors.get(obj.status, '#757185')
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'

@admin.register(ProjectMilestone)
class ProjectMilestoneAdmin(admin.ModelAdmin):
    list_display = ('name', 'project', 'status_badge', 'due_date', 'amount', 'order')
    list_filter = ('status', 'due_date', 'project__status')
    search_fields = ('name', 'description', 'project__title')
    date_hierarchy = 'due_date'
    list_editable = ('order',)
    
    def status_badge(self, obj):
        colors = {
            'pending': '#FFC876',
            'in_progress': '#858DFF',
            'completed': '#7ADB78',
            'paid': '#7ADB78',
            'overdue': '#FF776F',
        }
        color = colors.get(obj.status, '#757185')
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'

@admin.register(ProjectRequestCommunication)
class ProjectRequestCommunicationAdmin(admin.ModelAdmin):
    list_display = ('request', 'sender', 'sender_type', 'created_at')
    list_filter = ('sender_type', 'is_internal', 'created_at')
    search_fields = ('message', 'request__title', 'sender__username')
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at',)
    
    fieldsets = (
        ('Communication Details', {
            'fields': ('request', 'sender', 'sender_type', 'message', 'is_internal')
        }),
        ('Attachments', {
            'fields': ('attachments',),
            'classes': ('collapse',)
        }),
        ('Timestamp', {
            'fields': ('created_at',)
        }),
    )

# Custom admin site configuration
admin.site.site_header = "PritechVior Projects Administration"
admin.site.site_title = "PritechVior Projects Admin"
admin.site.index_title = "Welcome to PritechVior Projects Administration"

class Media:
    css = {
        'all': ('admin/css/pritechvior_admin.css',)
    }
