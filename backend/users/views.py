from django.shortcuts import render
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from google.oauth2 import id_token
from google.auth.transport import requests
import secrets
import string

from .models import User, UserProfile, CustomRole, RoleConfiguration
from .serializers import (
    UserRegistrationSerializer,
    CustomTokenObtainPairSerializer,
    UserProfileSerializer,
    UserSerializer,
    GoogleAuthSerializer,
    PasswordChangeSerializer,
    PasswordResetSerializer,
    PasswordResetConfirmSerializer,
    CustomRoleSerializer
)


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom JWT token view with additional user data"""
    serializer_class = CustomTokenObtainPairSerializer


class UserRegistrationView(APIView):
    """User registration endpoint"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate verification token
            user.verification_token = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(32))
            user.save()
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Registration successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'role': user.role,
                    'is_verified': user.is_verified,
                },
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GoogleAuthView(APIView):
    """Google OAuth authentication endpoint"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        if serializer.is_valid():
            google_token = serializer.validated_data['google_token']
            role = serializer.validated_data['role']
            
            try:
                # Verify Google token
                idinfo = id_token.verify_oauth2_token(
                    google_token, 
                    requests.Request(), 
                    settings.GOOGLE_OAUTH2_CLIENT_ID
                )
                
                # Get user info from Google
                email = idinfo['email']
                first_name = idinfo.get('given_name', '')
                last_name = idinfo.get('family_name', '')
                username = email.split('@')[0]
                
                # Check if user exists
                user, created = User.objects.get_or_create(
                    email=email,
                    defaults={
                        'username': username,
                        'first_name': first_name,
                        'last_name': last_name,
                        'role': role,
                        'is_verified': True,  # Google accounts are pre-verified
                    }
                )
                
                if created:
                    # Create user profile for new users
                    UserProfile.objects.create(user=user)
                
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    'message': 'Google authentication successful',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'role': user.role,
                        'is_verified': user.is_verified,
                    },
                    'tokens': {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh),
                    }
                }, status=status.HTTP_200_OK)
                
            except ValueError as e:
                return Response({
                    'error': 'Invalid Google token'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for user profiles"""
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role in ['admin', 'ceo']:
            return UserProfile.objects.all()
        return UserProfile.objects.filter(user=self.request.user)
    
    def get_object(self):
        # If no pk provided, return current user's profile
        if 'pk' not in self.kwargs:
            profile, created = UserProfile.objects.get_or_create(user=self.request.user)
            return profile
        return super().get_object()
    
    @action(detail=False, methods=['get', 'patch'])
    def me(self, request):
        """Get or update current user's profile"""
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        
        if request.method == 'GET':
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        
        elif request.method == 'PATCH':
            serializer = self.get_serializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for users (read-only)"""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = User.objects.filter(is_active=True)
        
        # Filter by role if specified
        role = self.request.query_params.get('role')
        if role:
            queryset = queryset.filter(role=role)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user info"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class PasswordChangeView(APIView):
    """Change password endpoint"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            
            # Check old password
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({
                    'error': 'Invalid old password'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Set new password
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            return Response({
                'message': 'Password changed successfully'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetView(APIView):
    """Password reset request endpoint"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            try:
                user = User.objects.get(email=email)
                
                # Generate reset token
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                
                # Send reset email (implement email sending based on your setup)
                reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"
                
                # For now, just return the reset URL (in production, send via email)
                return Response({
                    'message': 'Password reset email sent',
                    'reset_url': reset_url  # Remove this in production
                }, status=status.HTTP_200_OK)
                
            except User.DoesNotExist:
                # Don't reveal if email exists or not
                return Response({
                    'message': 'If the email exists, a reset link has been sent'
                }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(APIView):
    """Password reset confirmation endpoint"""
    permission_classes = [AllowAny]
    
    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            
            if default_token_generator.check_token(user, token):
                serializer = PasswordResetConfirmSerializer(data=request.data)
                if serializer.is_valid():
                    user.set_password(serializer.validated_data['new_password'])
                    user.save()
                    
                    return Response({
                        'message': 'Password reset successful'
                    }, status=status.HTTP_200_OK)
                
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({
                    'error': 'Invalid or expired token'
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({
                'error': 'Invalid reset link'
            }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout endpoint (blacklist refresh token)"""
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        return Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': 'Invalid token'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def roles_list(request):
    """Get available user roles for registration"""
    # Get configured predefined roles
    predefined_roles = []
    role_configs = RoleConfiguration.objects.filter(is_visible_on_registration=True)
    
    if role_configs.exists():
        # Use configured roles
        for config in role_configs:
            predefined_roles.append({
                'value': config.role_name,
                'label': config.get_role_name_display(),
                'description': config.description,
                'icon': config.icon,
                'type': 'predefined'
            })
    else:
        # Fallback to default roles (excluding admin, treasury, ceo by default for security)
        default_visible_roles = ['guest', 'student', 'parent', 'trainer', 'client', 'designer', 'writer', 'technician']
        for choice in User.ROLE_CHOICES:
            if choice[0] in default_visible_roles:
                predefined_roles.append({
                    'value': choice[0],
                    'label': choice[1],
                    'description': f'Register as a {choice[1].lower()}',
                    'icon': '',
                    'type': 'predefined'
                })
    
    # Get custom roles that are visible
    custom_roles = []
    for custom_role in CustomRole.objects.filter(is_visible_on_registration=True):
        custom_roles.append({
            'value': f'custom_{custom_role.id}',
            'label': custom_role.name,
            'description': custom_role.description,
            'icon': custom_role.icon,
            'type': 'custom'
        })
    
    return Response({
        'predefined_roles': predefined_roles,
        'custom_roles': custom_roles,
        'all_roles': predefined_roles + custom_roles
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_email(request):
    """Email verification endpoint"""
    token = request.data.get('token')
    user = request.user
    
    if user.verification_token == token:
        user.is_verified = True
        user.verification_token = ''
        user.save()
        
        return Response({
            'message': 'Email verified successfully'
        }, status=status.HTTP_200_OK)
    
    return Response({
        'error': 'Invalid verification token'
    }, status=status.HTTP_400_BAD_REQUEST)
