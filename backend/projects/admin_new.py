from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import (
    ProjectCategory, TechnologyStack, ProjectTemplate, 
    ServicePackage, ProjectRequest, ProjectCustomization
)


@admin.register(ProjectCategory)
class ProjectCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'user_type', 'is_active', 'created_at')
    list_filter = ('user_type', 'is_active', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('is_active',)
    ordering = ('user_type', 'name')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'description', 'icon')
        }),
        ('Configuration', {
            'fields': ('user_type', 'is_active')
        }),
    )


@admin.register(TechnologyStack)
class TechnologyStackAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'is_active', 'created_at')
    list_filter = ('category', 'is_active', 'created_at')
    search_fields = ('name', 'description')
    list_editable = ('is_active',)
    ordering = ('category', 'name')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'category', 'icon')
        }),
        ('Configuration', {
            'fields': ('is_active',)
        }),
    )


@admin.register(ProjectTemplate)
class ProjectTemplateAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'category', 'get_pricing_display', 'is_featured', 'is_active', 'created_at')
    list_filter = ('category', 'is_featured', 'is_active', 'created_at', 'technologies')
    search_fields = ('title', 'description', 'slug')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('is_featured', 'is_active')
    filter_horizontal = ('technologies',)
    ordering = ('-is_featured', '-created_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'description', 'category')
        }),
        ('Pricing', {
            'fields': ('student_price', 'client_price', 'business_price')
        }),
        ('Technical Details', {
            'fields': ('technologies', 'features', 'requirements')
        }),
        ('Media & Documentation', {
            'fields': ('image', 'demo_url', 'github_url', 'documentation_url')
        }),
        ('Configuration', {
            'fields': ('is_featured', 'is_active', 'estimated_duration', 'complexity_level')
        }),
    )
    
    def get_pricing_display(self, obj):
        return format_html(
            'Student: <strong>TSH {:,}</strong><br>'
            'Client: <strong>TSH {:,}</strong><br>'
            'Business: <strong>TSH {:,}</strong>',
            obj.student_price, obj.client_price, obj.business_price
        )
    get_pricing_display.short_description = 'Pricing'
    
    def view_on_site(self, obj):
        return f'/project/{obj.slug}/'


@admin.register(ServicePackage)
class ServicePackageAdmin(admin.ModelAdmin):
    list_display = ('name', 'user_type', 'price_display', 'is_active', 'created_at')
    list_filter = ('user_type', 'is_active', 'created_at')
    search_fields = ('name', 'description')
    list_editable = ('is_active',)
    ordering = ('user_type', 'price')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'user_type')
        }),
        ('Pricing & Features', {
            'fields': ('price', 'features')
        }),
        ('Configuration', {
            'fields': ('is_active',)
        }),
    )
    
    def price_display(self, obj):
        return f"TSH {obj.price:,}"
    price_display.short_description = 'Price'


class ProjectCustomizationInline(admin.TabularInline):
    model = ProjectCustomization
    extra = 0
    readonly_fields = ('created_at',)


@admin.register(ProjectRequest)
class ProjectRequestAdmin(admin.ModelAdmin):
    list_display = ('get_request_title', 'user_type', 'request_type', 'status', 'estimated_cost', 'created_at')
    list_filter = ('user_type', 'request_type', 'status', 'created_at', 'project_category')
    search_fields = ('project_title', 'contact_name', 'contact_email', 'description')
    readonly_fields = ('created_at', 'updated_at', 'estimated_cost')
    list_editable = ('status',)
    ordering = ('-created_at',)
    inlines = [ProjectCustomizationInline]
    
    fieldsets = (
        ('Request Information', {
            'fields': ('request_type', 'user_type', 'status')
        }),
        ('Project Details', {
            'fields': ('project_title', 'description', 'project_category', 'base_template')
        }),
        ('Requirements', {
            'fields': ('requirements', 'technologies', 'budget_range', 'timeline', 'course_category')
        }),
        ('Contact Information', {
            'fields': ('contact_name', 'contact_email', 'contact_phone', 'institution')
        }),
        ('Additional Services', {
            'fields': ('selected_services', 'additional_notes')
        }),
        ('Pricing', {
            'fields': ('estimated_cost',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_request_title(self, obj):
        title = obj.project_title or f"{obj.get_request_type_display()} Request"
        return title[:50] + "..." if len(title) > 50 else title
    get_request_title.short_description = 'Title'
    
    def save_model(self, request, obj, form, change):
        if not change:  # New object
            obj.estimated_cost = obj.calculate_estimated_cost()
        super().save_model(request, obj, form, change)


@admin.register(ProjectCustomization)
class ProjectCustomizationAdmin(admin.ModelAdmin):
    list_display = ('project_request', 'customization_type', 'created_at')
    list_filter = ('customization_type', 'created_at')
    search_fields = ('project_request__project_title', 'description')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Customization Details', {
            'fields': ('project_request', 'customization_type', 'description', 'additional_cost')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
