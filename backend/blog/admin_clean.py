from django.contrib import admin
from .models import BlogPost, NewsletterSubscription

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'status', 'featured', 'views', 'created_at')
    list_filter = ('status', 'featured', 'category', 'created_at')
    search_fields = ('title', 'content', 'tags', 'author__username')
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Post Information', {
            'fields': ('title', 'slug', 'content')
        }),
        ('Metadata', {
            'fields': ('author', 'category', 'tags', 'featured_image')
        }),
        ('Publication', {
            'fields': ('status', 'featured')
        }),
    )

@admin.register(NewsletterSubscription)
class NewsletterSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('email', 'is_active', 'subscribed_at')
    list_filter = ('is_active', 'subscribed_at')
    search_fields = ('email',)
    readonly_fields = ('subscribed_at',)
