from django.contrib import admin
from django.contrib.admin import AdminSite
from django.template.response import TemplateResponse
from django.urls import path
from django.db.models import Count
from users.models import User
from projects.models import Project
from blog.models import BlogPost
from shop.models import Order

class PritechViorAdminSite(AdminSite):
    site_header = 'PritechVior Administration'
    site_title = 'PritechVior Admin'
    index_title = 'Dashboard Overview'
    
    def index(self, request, extra_context=None):
        """
        Display the main admin index page with custom statistics
        """
        extra_context = extra_context or {}
        
        # Get statistics
        extra_context.update({
            'user_count': User.objects.count(),
            'project_count': Project.objects.filter(status__in=['planning', 'in_progress', 'review']).count(),
            'blog_count': BlogPost.objects.filter(status='published').count(),
            'order_count': Order.objects.filter(status__in=['pending', 'processing', 'shipped']).count(),
        })
        
        return super().index(request, extra_context)

# Override the default admin site
admin_site = PritechViorAdminSite(name='pritechvior_admin')

# Customize admin site settings
admin.site.site_header = 'PritechVior Administration'
admin.site.site_title = 'PritechVior Admin'
admin.site.index_title = 'Dashboard Overview'
