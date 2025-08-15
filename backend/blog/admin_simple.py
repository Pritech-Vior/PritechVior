from django.contrib import admin
from .models import BlogPost, NewsletterSubscription

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'status', 'featured', 'views', 'created_at')
    list_filter = ('category', 'status', 'featured', 'created_at')
    search_fields = ('title', 'content', 'author__username')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('views', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Post Information', {
            'fields': ('title', 'slug', 'content', 'excerpt', 'author')
        }),
        ('Classification', {
            'fields': ('category', 'tags', 'status', 'featured')
        }),
        ('Media', {
            'fields': ('featured_image',)
        }),
        ('Statistics', {
            'fields': ('views',),
            'classes': ('collapse',)
        }),
    )

@admin.register(NewsletterSubscription)
class NewsletterSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('email', 'is_active', 'subscribed_at')
    list_filter = ('is_active', 'subscribed_at')
    search_fields = ('email',)
    readonly_fields = ('subscribed_at',)
