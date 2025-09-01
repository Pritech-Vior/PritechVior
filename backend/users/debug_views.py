from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def debug_user_info(request):
    """Debug endpoint to check user authentication and permissions"""
    user = request.user
    
    return Response({
        'authenticated': user.is_authenticated,
        'user_id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'is_staff': user.is_staff,
        'is_superuser': user.is_superuser,
        'is_active': user.is_active,
        'all_roles': user.get_all_roles(),
        'has_admin_role': user.role in ['admin', 'ceo', 'treasury'],
        'is_admin_user': user.is_staff or user.is_superuser or user.role in ['admin', 'ceo', 'treasury']
    })


@api_view(['POST'])
@permission_classes([AllowAny])
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
        # Even if token is invalid, return success for logout
        return Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)


class TestAdminPermissionView(APIView):
    """Test view to check admin permissions"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Check admin permissions
        is_admin = (
            user.is_staff or 
            user.is_superuser or 
            user.role in ['admin', 'ceo', 'treasury']
        )
        
        return Response({
            'user': user.username,
            'role': user.role,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            'is_admin': is_admin,
            'message': 'Admin access granted' if is_admin else 'Admin access denied'
        })