from django.contrib import admin
from django.utils.html import format_html
from .models import Project, ProjectMilestone, ProjectRequest

class ProjectMilestoneInline(admin.TabularInline):
    model = ProjectMilestone
    extra = 0
    fields = ('name', 'amount', 'due_date', 'status')

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'client', 'status_badge', 'priority_badge', 'start_date', 'end_date', 'created_at')
    list_filter = ('status', 'priority', 'start_date', 'created_at')
    search_fields = ('title', 'description', 'client__username', 'client__email')
    date_hierarchy = 'created_at'
    inlines = [ProjectMilestoneInline]
    
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

@admin.register(ProjectMilestone)
class ProjectMilestoneAdmin(admin.ModelAdmin):
    list_display = ('name', 'project', 'amount', 'due_date', 'status', 'completed_date')
    list_filter = ('status', 'due_date')
    search_fields = ('name', 'project__title', 'description')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(ProjectRequest)
class ProjectRequestAdmin(admin.ModelAdmin):
    list_display = ('title', 'client', 'project_type', 'budget', 'status', 'created_at')
    list_filter = ('project_type', 'status', 'created_at')
    search_fields = ('title', 'description', 'client__username')
    readonly_fields = ('created_at', 'updated_at')
    
    def status_badge(self, obj):
        colors = {
            'pending': '#FFC876',
            'reviewing': '#858DFF',
            'approved': '#7ADB78',
            'rejected': '#FF776F',
            'converted': '#AC6AFF'
        }
        color = colors.get(obj.status, '#757185')
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'
