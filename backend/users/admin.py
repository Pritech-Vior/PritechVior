from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User, CustomRole
@admin.register(CustomRole)
class CustomRoleAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    filter_horizontal = ('permissions',)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'get_full_name', 'role_badge', 'custom_role', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('role', 'custom_role', 'is_staff', 'is_active', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Role Information', {'fields': ('role', 'custom_role')}),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Role Information', {'fields': ('role', 'custom_role')}),
    )
    
    def role_badge(self, obj):
        colors = {
            'admin': '#AC6AFF',
            'project_manager': '#FFC876', 
            'developer': '#7ADB78',
            'designer': '#FF98E2',
            'treasury': '#858DFF',
            'sales_marketing': '#FF776F',
            'customer_support': '#FFC876',
            'instructor': '#7ADB78',
            'student': '#858DFF',
            'client': '#AC6AFF',
            'learner': '#FF98E2',
            'guest': '#757185',
        }
        color = colors.get(obj.role, '#757185')
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">{}</span>',
            color,
            obj.get_role_display()
        )
    role_badge.short_description = 'Role'
    
    class Media:
        css = {
            'all': ('admin/css/pritechvior_admin.css',)
        }
