from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User, UserProfile, CustomRole


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    role = serializers.CharField()  # Allow custom role values

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'password', 'password_confirm', 'role')

    def validate_role(self, value):
        """Validate role - can be predefined or custom"""
        # Check if it's a predefined role
        predefined_roles = [choice[0] for choice in User.ROLE_CHOICES]
        if value in predefined_roles:
            return value
        
        # Check if it's a custom role
        if value.startswith('custom_'):
            try:
                custom_role_id = int(value.replace('custom_', ''))
                custom_role = CustomRole.objects.get(id=custom_role_id, is_visible_on_registration=True)
                return value
            except (ValueError, CustomRole.DoesNotExist):
                raise serializers.ValidationError("Invalid custom role.")
        
        raise serializers.ValidationError("Invalid role selection.")

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        role_value = validated_data.pop('role')
        
        # Handle custom roles
        if role_value.startswith('custom_'):
            custom_role_id = int(role_value.replace('custom_', ''))
            custom_role = CustomRole.objects.get(id=custom_role_id)
            user = User.objects.create_user(
                password=password, 
                role='guest',  # Default role for custom role users
                custom_role=custom_role,
                **validated_data
            )
        else:
            # Regular predefined role
            user = User.objects.create_user(password=password, role=role_value, **validated_data)
        
        # Create user profile
        UserProfile.objects.create(user=user)
        
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom JWT serializer with additional user data"""
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['username'] = user.username
        token['role'] = user.role
        token['roles'] = user.get_all_roles()
        token['is_verified'] = user.is_verified
        
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add user data to response
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'role': self.user.role,
            'roles': self.user.get_all_roles(),
            'is_verified': self.user.is_verified,
            'avatar': self.user.avatar.url if self.user.avatar else None,
        }
        
        return data


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile"""
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    role = serializers.CharField(source='user.role', read_only=True)
    roles = serializers.ListField(source='user.get_all_roles', read_only=True)
    avatar = serializers.ImageField(source='user.avatar', required=False)
    bio = serializers.CharField(source='user.bio', required=False)
    phone = serializers.CharField(source='user.phone', required=False)
    skills = serializers.ListField(source='user.skills', required=False)
    interests = serializers.ListField(source='user.interests', required=False)
    
    class Meta:
        model = UserProfile
        fields = [
            'user_id', 'username', 'email', 'first_name', 'last_name',
            'role', 'roles', 'avatar', 'bio', 'phone', 'skills', 'interests',
            'company', 'job_title', 'website', 'linkedin', 'github',
            'education', 'certifications', 'timezone', 'language', 'theme_preference',
            'courses_completed', 'projects_completed', 'total_learning_hours'
        ]
        
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        
        # Update user fields
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        instance.user.save()
        
        # Update profile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance


class UserSerializer(serializers.ModelSerializer):
    """Basic user serializer"""
    roles = serializers.ListField(source='get_all_roles', read_only=True)
    display_name = serializers.CharField(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'roles', 'display_name', 'avatar', 'bio', 'location',
            'is_verified', 'last_active', 'date_joined'
        ]
        read_only_fields = ['id', 'date_joined', 'last_active']


class GoogleAuthSerializer(serializers.Serializer):
    """Serializer for Google OAuth authentication"""
    google_token = serializers.CharField()
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, default='guest')


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for password change"""
    old_password = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])
    new_password_confirm = serializers.CharField()
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords don't match.")
        return attrs


class PasswordResetSerializer(serializers.Serializer):
    """Serializer for password reset request"""
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer for password reset confirmation"""
    token = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])
    new_password_confirm = serializers.CharField()
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        return attrs


class CustomRoleSerializer(serializers.ModelSerializer):
    """Serializer for custom roles"""
    class Meta:
        model = CustomRole
        fields = ['id', 'name', 'permissions']
