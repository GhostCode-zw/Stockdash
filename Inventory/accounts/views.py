from django.shortcuts import render
from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, RegisterSerializer

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    """Users API.

    - Staff: can list, create, update (PATCH), and delete users.
    - Non-staff: can only read their own user record.
    """

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Support both Django staff users and users with role='admin'
        if self.request.user.is_staff or getattr(self.request.user, 'role', None) == 'admin':
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)

    def get_permissions(self):
        # Enforce admin-only mutations (PATCH/DELETE/POST/PUT)
        if self.action in {"create", "update", "partial_update", "destroy"}:
            # Allow mutations for Django staff OR role='admin'
            if getattr(self.request.user, 'is_staff', False) or getattr(self.request.user, 'role', None) == 'admin':
                return [permissions.AllowAny()]
            return [permissions.IsAdminUser()]
        return super().get_permissions()


class RegisterView(generics.CreateAPIView):
    """
    API endpoint for user registration.
    Creates new user with hashed password and returns user data.
    """
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        # Debug: verify password presence without logging plaintext
        # (Remove after fixing)
        if hasattr(request, 'data'):
            pw_present = bool(request.data.get('password'))
            print('RegisterView.create(): password_present=', pw_present, 'keys=', list(request.data.keys()))

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate JWT tokens for new user
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(access_token),
        }, status=status.HTTP_201_CREATED)


from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
