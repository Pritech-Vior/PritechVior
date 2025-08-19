from django.contrib import admin
from .models import (
    Category, BlogPost, BlogLike, BlogComment, 
    BlogImage, BlogDownload, BlogDownloadRequest, NewsletterSubscription
)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'post_count', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    
    def post_count(self, obj):
        return obj.posts.count()
    post_count.short_description = 'Posts'


# Inline admin configurations for better management
class BlogImageInline(admin.TabularInline):
    model = BlogImage
    extra = 1
    fields = ('image', 'image_url', 'caption', 'order')


class BlogDownloadInline(admin.TabularInline):
    model = BlogDownload
    extra = 1
    fields = ('title', 'file', 'file_url', 'file_type', 'is_premium')


class BlogCommentInline(admin.TabularInline):
    model = BlogComment
    extra = 0
    fields = ('user', 'content', 'is_approved')
    readonly_fields = ('user', 'content')
    can_delete = True

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'status', 'featured', 'views', 'like_count_display', 'comment_count_display', 'created_at', 'published_at')
    list_filter = ('status', 'featured', 'categories', 'created_at', 'published_at')
    search_fields = ('title', 'content', 'author__username')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('categories',)
    date_hierarchy = 'created_at'
    list_editable = ('status', 'featured')
    actions = ['make_published', 'make_draft', 'make_featured']
    inlines = [BlogImageInline, BlogDownloadInline, BlogCommentInline]
    
    fieldsets = (
        ('Content', {
            'fields': ('title', 'slug', 'content', 'excerpt')
        }),
        ('Publishing', {
            'fields': ('author', 'status', 'featured', 'published_at')
        }),
        ('Categories & Tags', {
            'fields': ('category', 'categories', 'tags')
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('SEO', {
            'fields': ('meta_description', 'read_time'),
            'classes': ('collapse',)
        }),
        ('Statistics', {
            'fields': ('views',),
            'classes': ('collapse',)
        }),
    )
    
    def like_count_display(self, obj):
        return obj.like_count
    like_count_display.short_description = 'Likes'
    
    def comment_count_display(self, obj):
        return obj.comment_count
    comment_count_display.short_description = 'Comments'
    
    def make_published(self, request, queryset):
        queryset.update(status='published')
    make_published.short_description = "Mark selected posts as published"
    
    def make_draft(self, request, queryset):
        queryset.update(status='draft')
    make_draft.short_description = "Mark selected posts as draft"
    
    def make_featured(self, request, queryset):
        queryset.update(featured=True)
    make_featured.short_description = "Mark selected posts as featured"


@admin.register(BlogLike)
class BlogLikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'post__title')
    date_hierarchy = 'created_at'


@admin.register(BlogComment)
class BlogCommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'content_preview', 'is_approved', 'parent', 'created_at')
    list_filter = ('is_approved', 'created_at')
    search_fields = ('user__username', 'post__title', 'content')
    list_editable = ('is_approved',)
    date_hierarchy = 'created_at'
    actions = ['approve_comments', 'reject_comments']
    
    def content_preview(self, obj):
        return obj.content[:50] + "..." if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content Preview'
    
    def approve_comments(self, request, queryset):
        queryset.update(is_approved=True)
    approve_comments.short_description = "Approve selected comments"
    
    def reject_comments(self, request, queryset):
        queryset.update(is_approved=False)
    reject_comments.short_description = "Reject selected comments"


@admin.register(BlogImage)
class BlogImageAdmin(admin.ModelAdmin):
    list_display = ('post', 'caption', 'order', 'has_image', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('post__title', 'caption')
    list_editable = ('order',)
    ordering = ('post', 'order')
    
    def has_image(self, obj):
        return bool(obj.image or obj.image_url)
    has_image.boolean = True
    has_image.short_description = 'Has Image'


@admin.register(BlogDownload)
class BlogDownloadAdmin(admin.ModelAdmin):
    list_display = ('title', 'post', 'file_type', 'file_size', 'download_count', 'is_premium', 'created_at')
    list_filter = ('is_premium', 'file_type', 'created_at')
    search_fields = ('title', 'post__title', 'description')
    list_editable = ('is_premium',)
    readonly_fields = ('download_count',)


@admin.register(BlogDownloadRequest)
class BlogDownloadRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'download', 'status', 'created_at', 'processed_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username', 'download__title', 'email')
    list_editable = ('status',)
    date_hierarchy = 'created_at'
    actions = ['approve_requests', 'reject_requests', 'mark_as_sent']
    
    def approve_requests(self, request, queryset):
        queryset.update(status='approved')
    approve_requests.short_description = "Approve selected requests"
    
    def reject_requests(self, request, queryset):
        queryset.update(status='rejected')
    reject_requests.short_description = "Reject selected requests"
    
    def mark_as_sent(self, request, queryset):
        queryset.update(status='sent')
    mark_as_sent.short_description = "Mark selected requests as sent"


@admin.register(NewsletterSubscription)
class NewsletterSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'is_active', 'subscribed_at', 'unsubscribed_at')
    list_filter = ('is_active', 'subscribed_at')
    search_fields = ('email', 'name')
    list_editable = ('is_active',)
    date_hierarchy = 'subscribed_at'
    actions = ['activate_subscriptions', 'deactivate_subscriptions']
    
    def activate_subscriptions(self, request, queryset):
        queryset.update(is_active=True, unsubscribed_at=None)
    activate_subscriptions.short_description = "Activate selected subscriptions"
    
    def deactivate_subscriptions(self, request, queryset):
        from django.utils import timezone
        queryset.update(is_active=False, unsubscribed_at=timezone.now())
    deactivate_subscriptions.short_description = "Deactivate selected subscriptions"
