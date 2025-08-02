from django.contrib import admin
from django.utils.html import format_html
from .models import ChatRoom, Message

class MessageInline(admin.TabularInline):
    model = Message
    extra = 0
    readonly_fields = ('sender', 'created_at')
    fields = ('sender', 'content', 'is_read', 'created_at')

@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_by', 'privacy_badge', 'participants_count', 'messages_count', 'created_at')
    list_filter = ('is_private', 'created_at')
    search_fields = ('name', 'description', 'created_by__username')
    filter_horizontal = ('participants',)
    inlines = [MessageInline]
    
    fieldsets = (
        ('Room Information', {
            'fields': ('name', 'description', 'created_by')
        }),
        ('Settings', {
            'fields': ('is_private', 'participants')
        }),
    )
    
    def privacy_badge(self, obj):
        if obj.is_private:
            return format_html(
                '<span style="background: var(--color-3); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">🔒 PRIVATE</span>'
            )
        return format_html(
            '<span style="background: var(--color-4); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">🌍 PUBLIC</span>'
        )
    privacy_badge.short_description = 'Privacy'
    
    def participants_count(self, obj):
        count = obj.participants.count()
        return format_html(
            '<span style="background: var(--color-1); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">{} users</span>',
            count
        )
    participants_count.short_description = 'Participants'
    
    def messages_count(self, obj):
        count = obj.messages.count()
        return format_html(
            '<span style="background: var(--color-2); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">{} messages</span>',
            count
        )
    messages_count.short_description = 'Messages'
    
    class Media:
        css = {
            'all': ('admin/css/pritechvior_admin.css',)
        }

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('truncated_content', 'sender', 'room', 'read_badge', 'created_at')
    list_filter = ('is_read', 'created_at', 'room')
    search_fields = ('content', 'sender__username', 'room__name')
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at',)
    
    fieldsets = (
        ('Message Information', {
            'fields': ('room', 'sender', 'content')
        }),
        ('Status', {
            'fields': ('is_read', 'created_at')
        }),
    )
    
    def truncated_content(self, obj):
        return format_html(
            '<span title="{}">{}</span>',
            obj.content,
            obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
        )
    truncated_content.short_description = 'Message'
    
    def read_badge(self, obj):
        if obj.is_read:
            return format_html(
                '<span style="background: var(--color-4); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">✓ READ</span>'
            )
        return format_html(
            '<span style="background: var(--color-2); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">📩 UNREAD</span>'
        )
    read_badge.short_description = 'Status'
    
    class Media:
        css = {
            'all': ('admin/css/pritechvior_admin.css',)
        }
