from django.contrib import admin
from django.utils.html import format_html
from .models import Payment, Subscription

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('payment_id_display', 'user', 'amount_display', 'status_badge', 'method_badge', 'created_at', 'completed_at')
    list_filter = ('status', 'payment_method', 'currency', 'created_at')
    search_fields = ('payment_id', 'user__username', 'user__email', 'transaction_id')
    readonly_fields = ('payment_id', 'created_at', 'updated_at')
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Payment Information', {
            'fields': ('payment_id', 'user', 'amount', 'currency', 'description')
        }),
        ('Payment Details', {
            'fields': ('status', 'payment_method', 'transaction_id')
        }),
        ('Metadata', {
            'fields': ('metadata',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )
    
    def payment_id_display(self, obj):
        return format_html(
            '<span style="background: var(--color-1); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; font-family: monospace;">{}</span>',
            str(obj.payment_id)[:8] + '...'
        )
    payment_id_display.short_description = 'Payment ID'
    
    def amount_display(self, obj):
        return format_html(
            '<span style="background: var(--color-2); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">{} {}</span>',
            obj.currency,
            obj.amount
        )
    amount_display.short_description = 'Amount'
    
    def status_badge(self, obj):
        colors = {
            'pending': '#858DFF',
            'processing': '#FFC876',
            'completed': '#7ADB78',
            'failed': '#FF776F',
            'cancelled': '#FF98E2',
            'refunded': '#AC6AFF',
        }
        color = colors.get(obj.status, '#757185')
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def method_badge(self, obj):
        colors = {
            'credit_card': '#AC6AFF',
            'debit_card': '#858DFF',
            'paypal': '#FFC876',
            'stripe': '#7ADB78',
            'bank_transfer': '#FF98E2',
            'cryptocurrency': '#FF776F',
        }
        color = colors.get(obj.payment_method, '#757185')
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">{}</span>',
            color,
            obj.get_payment_method_display()
        )
    method_badge.short_description = 'Method'
    
    class Media:
        css = {
            'all': ('admin/css/pritechvior_admin.css',)
        }

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan_badge', 'status_badge', 'price_display', 'auto_renew_badge', 'start_date', 'end_date')
    list_filter = ('plan', 'status', 'auto_renew', 'start_date')
    search_fields = ('user__username', 'user__email')
    date_hierarchy = 'start_date'
    
    fieldsets = (
        ('Subscription Information', {
            'fields': ('user', 'plan', 'status', 'monthly_price')
        }),
        ('Duration', {
            'fields': ('start_date', 'end_date', 'auto_renew')
        }),
    )
    
    def plan_badge(self, obj):
        colors = {
            'basic': '#7ADB78',
            'premium': '#AC6AFF',
            'enterprise': '#FF776F',
        }
        color = colors.get(obj.plan, '#757185')
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">{}</span>',
            color,
            obj.get_plan_display()
        )
    plan_badge.short_description = 'Plan'
    
    def status_badge(self, obj):
        colors = {
            'active': '#7ADB78',
            'cancelled': '#FF776F',
            'expired': '#858DFF',
            'suspended': '#FFC876',
        }
        color = colors.get(obj.status, '#757185')
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def price_display(self, obj):
        return format_html(
            '<span style="background: var(--color-2); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">${}/month</span>',
            obj.monthly_price
        )
    price_display.short_description = 'Price'
    
    def auto_renew_badge(self, obj):
        if obj.auto_renew:
            return format_html(
                '<span style="background: var(--color-4); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">🔄 AUTO</span>'
            )
        return format_html(
            '<span style="background: var(--color-3); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">⏸️ MANUAL</span>'
        )
    auto_renew_badge.short_description = 'Renewal'
    
    class Media:
        css = {
            'all': ('admin/css/pritechvior_admin.css',)
        }
