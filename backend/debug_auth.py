"""
Debug script to test JWT authentication
"""
import os
import django
import sys

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pritech_vior.settings')
django.setup()

from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model

User = get_user_model()

def test_jwt_authentication():
    """Test JWT token creation and validation"""
    print("Testing JWT Authentication...")
    
    # Get or create a test user
    user, created = User.objects.get_or_create(
        username='testuser',
        defaults={
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'role': 'guest'
        }
    )
    
    if created:
        user.set_password('testpass123')
        user.save()
        print(f"Created test user: {user.username}")
    else:
        print(f"Using existing user: {user.username}")
    
    # Create an access token
    token = AccessToken.for_user(user)
    print(f"Generated token: {str(token)}")
    
    # Validate the token
    try:
        decoded_token = AccessToken(str(token))
        token_user_id = decoded_token['user_id']
        token_user = User.objects.get(id=token_user_id)
        print(f"Token validation successful. User: {token_user.username}")
        return True
    except Exception as e:
        print(f"Token validation failed: {e}")
        return False

if __name__ == "__main__":
    test_jwt_authentication()
