from django.contrib import admin
from .models import ChatRoom, Message

class MessageInline(admin.TabularInline):
    model = Message
    extra = 0
    readonly_fields = ('sender', 'created_at')
    fields = ('sender', 'content', 'is_read', 'created_at')

@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_by', 'is_private', 'participants_count', 'messages_count', 'created_at')
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
    
    def participants_count(self, obj):
        return obj.participants.count()
    participants_count.short_description = 'Participants'
    
    def messages_count(self, obj):
        return obj.messages.count()
    messages_count.short_description = 'Messages'

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('truncated_content', 'sender', 'room', 'is_read', 'created_at')
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
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    truncated_content.short_description = 'Message'
