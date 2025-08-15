from django.contrib import admin
from django.utils.html import format_html
from .models import Project, ProjectMilestone, ProjectRequest

class ProjectMilestoneInline(admin.TabularInline):
    model = ProjectMilestone
    extra = 0
    fields = ('title', 'description', 'due_date', 'status', 'completed_date')

from django.contrib import admin
from django.utils.html import format_html
from .models import Project, ProjectMilestone, ProjectRequest

class ProjectMilestoneInline(admin.TabularInline):
    model = ProjectMilestone
    extra = 0
    fields = ('name', 'amount', 'due_date', 'status')

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'client', 'status_badge', 'priority_badge', 'progress_bar', 'start_date', 'end_date', 'created_at')
    list_filter = ('status', 'priority', 'start_date', 'created_at')
    search_fields = ('title', 'description', 'client__username', 'client__email')
    date_hierarchy = 'created_at'
    inlines = [ProjectMilestoneInline]
    filter_horizontal = ('assigned_users',)
    
    fieldsets = (
        ('Project Information', {
            'fields': ('title', 'description', 'client')
        }),
        ('Status & Priority', {
            'fields': ('status', 'priority')
        }),
        ('Team & Timeline', {
            'fields': ('assigned_users', 'start_date', 'end_date')
        }),
        ('Budget', {
            'fields': ('budget',)
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
    
    inlines = [ProjectMilestoneInline]
    
    class Media:
        css = {
            'all': ('admin/css/pritechvior_admin.css',)
        }

@admin.register(ProjectMilestone)
class ProjectMilestoneAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'status_badge', 'due_date', 'completed_date')
    list_filter = ('status', 'due_date')
    search_fields = ('title', 'project__title')
    
    def status_badge(self, obj):
        colors = {
            'pending': '#FFC876',
            'in_progress': '#858DFF',
            'completed': '#7ADB78',
            'cancelled': '#FF776F'
        }
        color = colors.get(obj.status, '#757185')
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'

@admin.register(ProjectRequest)
class ProjectRequestAdmin(admin.ModelAdmin):
    list_display = ('project_title', 'client', 'project_type', 'budget_range', 'status_badge', 'submitted_at')
    list_filter = ('project_type', 'status', 'submitted_at')
    search_fields = ('project_title', 'description', 'client__username')
    readonly_fields = ('submitted_at',)
    
    def status_badge(self, obj):
        colors = {
            'pending': '#FFC876',
            'reviewed': '#858DFF',
            'approved': '#7ADB78',
            'rejected': '#FF776F'
        }
        color = colors.get(obj.status, '#757185')
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'
