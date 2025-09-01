from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from django.db.models import Q, Count
from django.utils import timezone
from datetime import timedelta
import django_filters.rest_framework as django_filters
from .models import User
from .serializers import UserSerializer

User = get_user_model()


class IsAdminUser(permissions.BasePermission):
    """
    Custom permission to only allow admin users.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            (request.user.is_staff or request.user.is_superuser or 
             getattr(request.user, 'role', None) in ['admin', 'ceo'])
        )


def log_activity(user, action, action_type='system', description='', request=None):
    """
    Utility function to log user activities
    """
    try:
        print(f"Activity: {action} by {user.username}")
    except Exception as e:
        print(f"Error logging activity: {e}")


class UserFilter(django_filters.FilterSet):
    """Filter for users"""
    search = django_filters.CharFilter(method='filter_search')
    date_joined_from = django_filters.DateFilter(field_name='date_joined', lookup_expr='gte')
    date_joined_to = django_filters.DateFilter(field_name='date_joined', lookup_expr='lte')
    
    class Meta:
        model = User
        fields = ['role', 'is_active', 'is_staff']
    
    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(username__icontains=value) |
            Q(email__icontains=value) |
            Q(first_name__icontains=value) |
            Q(last_name__icontains=value)
        )


class UserManagementViewSet(viewsets.ModelViewSet):
    """ViewSet for user management"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [django_filters.DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = UserFilter
    ordering_fields = ['date_joined', 'last_login', 'username', 'email']
    ordering = ['-date_joined']
    
    def perform_create(self, serializer):
        user = serializer.save()
        log_activity(
            user=self.request.user,
            action=f"Created user: {user.username}",
            action_type="user",
            request=self.request
        )
    
    def perform_update(self, serializer):
        user = serializer.save()
        log_activity(
            user=self.request.user,
            action=f"Updated user: {user.username}",
            action_type="user",
            request=self.request
        )
    
    def perform_destroy(self, instance):
        log_activity(
            user=self.request.user,
            action=f"Deleted user: {instance.username}",
            action_type="user",
            request=self.request
        )
        instance.delete()
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a user"""
        user = self.get_object()
        user.is_active = True
        user.save()
        
        log_activity(
            user=request.user,
            action=f"Activated user: {user.username}",
            action_type="user",
            request=request
        )
        
        return Response({
            'message': f'User {user.username} has been activated',
            'is_active': user.is_active
        })
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate a user"""
        user = self.get_object()
        user.is_active = False
        user.save()
        
        log_activity(
            user=request.user,
            action=f"Deactivated user: {user.username}",
            action_type="user",
            request=request
        )
        
        return Response({
            'message': f'User {user.username} has been deactivated',
            'is_active': user.is_active
        })
    
    @action(detail=True, methods=['post'])
    def change_role(self, request, pk=None):
        """Change user role"""
        user = self.get_object()
        new_role = request.data.get('role')
        
        if new_role not in dict(User.ROLE_CHOICES):
            return Response(
                {'error': 'Invalid role'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        old_role = user.role
        user.role = new_role
        user.save()
        
        log_activity(
            user=request.user,
            action=f"Changed user {user.username} role from {old_role} to {new_role}",
            action_type="user",
            request=request
        )
        
        return Response({
            'message': f'User {user.username} role changed to {new_role}',
            'role': new_role
        })
    
    @action(detail=True, methods=['post'])
    def reset_password(self, request, pk=None):
        """Reset user password"""
        user = self.get_object()
        
        # Generate password reset token
        token = default_token_generator.make_token(user)
        
        log_activity(
            user=request.user,
            action=f"Initiated password reset for user: {user.username}",
            action_type="user",
            request=request
        )
        
        # You can implement email sending here
        try:
            frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
            reset_link = f"{frontend_url}/reset-password/{user.id}/{token}/"
            
            if hasattr(settings, 'EMAIL_HOST') and settings.EMAIL_HOST:
                send_mail(
                    'Password Reset Request',
                    f'Click the following link to reset your password: {reset_link}',
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    fail_silently=False,
                )
                message = f'Password reset email sent to {user.email}'
            else:
                message = f'Password reset initiated for {user.username} (email not configured)'
        except Exception as e:
            message = f'Password reset initiated for {user.username} (email sending failed: {str(e)})'
        
        return Response({'message': message})
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get user statistics"""
        # Total users
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        
        # New users this month
        this_month = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        new_this_month = User.objects.filter(date_joined__gte=this_month).count()
        
        # Users by role
        role_stats = User.objects.values('role').annotate(count=Count('id'))
        by_role = {item['role']: item['count'] for item in role_stats}
        
        # Add missing roles with 0 count
        all_roles = dict(User.ROLE_CHOICES)
        for role_key in all_roles.keys():
            if role_key not in by_role:
                by_role[role_key] = 0
        
        # Users by status
        by_status = {
            'active': active_users,
            'inactive': total_users - active_users
        }
        
        return Response({
            'total_users': total_users,
            'active_users': active_users,
            'new_this_month': new_this_month,
            'by_role': by_role,
            'by_status': by_status
        })
    
    @action(detail=False, methods=['post'])
    def bulk_activate(self, request):
        """Bulk activate users"""
        user_ids = request.data.get('user_ids', [])
        if not user_ids:
            return Response({'error': 'No user IDs provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        users = User.objects.filter(id__in=user_ids)
        count = users.update(is_active=True)
        
        log_activity(
            user=request.user,
            action=f"Bulk activated {count} users",
            action_type="user",
            request=request
        )
        
        return Response({'message': f'{count} users activated'})
    
    @action(detail=False, methods=['post'])
    def bulk_deactivate(self, request):
        """Bulk deactivate users"""
        user_ids = request.data.get('user_ids', [])
        if not user_ids:
            return Response({'error': 'No user IDs provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        users = User.objects.filter(id__in=user_ids)
        count = users.update(is_active=False)
        
        log_activity(
            user=request.user,
            action=f"Bulk deactivated {count} users",
            action_type="user",
            request=request
        )
        
        return Response({'message': f'{count} users deactivated'})
    
    @action(detail=False, methods=['delete'])
    def bulk_delete(self, request):
        """Bulk delete users"""
        user_ids = request.data.get('user_ids', [])
        if not user_ids:
            return Response({'error': 'No user IDs provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Don't allow deleting superusers or the current user
        users = User.objects.filter(
            id__in=user_ids
        ).exclude(
            Q(is_superuser=True) | Q(id=request.user.id)
        )
        
        count = users.count()
        usernames = list(users.values_list('username', flat=True))
        users.delete()
        
        log_activity(
            user=request.user,
            action=f"Bulk deleted {count} users: {', '.join(usernames)}",
            action_type="user",
            request=request
        )
        
        return Response({'message': f'{count} users deleted'})