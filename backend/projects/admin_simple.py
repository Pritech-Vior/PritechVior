from django.contrib import admin
from .models import Project, ProjectMilestone, ProjectRequest

class ProjectMilestoneInline(admin.TabularInline):
    model = ProjectMilestone
    extra = 0
    fields = ('name', 'amount', 'due_date', 'status')

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'client', 'status', 'priority', 'start_date', 'end_date', 'created_at')
    list_filter = ('status', 'priority', 'project_type', 'category', 'created_at')
    search_fields = ('title', 'description', 'client__username', 'client__email')
    date_hierarchy = 'created_at'
    inlines = [ProjectMilestoneInline]
    
    fieldsets = (
        ('Project Information', {
            'fields': ('title', 'description', 'requirements')
        }),
        ('Classification', {
            'fields': ('project_type', 'category', 'status', 'priority')
        }),
        ('Team & Client', {
            'fields': ('client', 'lead_developer', 'team_members')
        }),
        ('Timeline & Budget', {
            'fields': ('start_date', 'end_date', 'budget')
        }),
        ('Technical Details', {
            'fields': ('tech_stack', 'features'),
            'classes': ('collapse',)
        }),
    )

@admin.register(ProjectMilestone)
class ProjectMilestoneAdmin(admin.ModelAdmin):
    list_display = ('name', 'project', 'amount', 'due_date', 'status', 'completed_date')
    list_filter = ('status', 'due_date')
    search_fields = ('name', 'project__title', 'description')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Milestone Information', {
            'fields': ('project', 'name', 'description', 'order')
        }),
        ('Financial', {
            'fields': ('amount', 'status')
        }),
        ('Timeline', {
            'fields': ('due_date', 'completed_date')
        }),
        ('Deliverables', {
            'fields': ('deliverables',),
            'classes': ('collapse',)
        }),
    )

@admin.register(ProjectRequest)
class ProjectRequestAdmin(admin.ModelAdmin):
    list_display = ('title', 'client', 'project_type', 'budget', 'status', 'created_at')
    list_filter = ('project_type', 'status', 'created_at')
    search_fields = ('title', 'description', 'client__username')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Request Information', {
            'fields': ('title', 'description', 'requirements')
        }),
        ('Classification', {
            'fields': ('project_type', 'priority', 'status')
        }),
        ('Client & Assignment', {
            'fields': ('client', 'assigned_to')
        }),
        ('Project Details', {
            'fields': ('budget', 'deadline', 'technology')
        }),
        ('Conversion', {
            'fields': ('converted_project',),
            'classes': ('collapse',)
        }),
    )
