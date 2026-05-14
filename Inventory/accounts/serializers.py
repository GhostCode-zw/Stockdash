from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Read-only user info — returned after login or profile fetch"""

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']
        # no password here — this serializer only reads


class RegisterSerializer(serializers.ModelSerializer):
    """Handles new user registration"""

    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role']

    def create(self, validated_data):
        password = validated_data.pop('password')

        # Ensure newly created users are active (so they show in admin portal)
        validated_data.setdefault('is_active', True)

        user = User(**validated_data)
        user.set_password(password)  # hashes the password
        user.save()
        return user



from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        token['role'] = getattr(user, 'role', None)  # Safe access
        return token
