from rest_framework import viewsets, permissions
from .serializers import ProductSerializer, CategorySerializer
from .models import Product, Category


class IsAdminOrInventoryManager(permissions.BasePermission):
    """Can modify stock IN — add/edit products"""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:  # GET, HEAD, OPTIONS
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.role in (
            'admin', 'inventory_manager'
        )


class IsAdminOnly(permissions.BasePermission):
    """Delete is admin only"""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        if request.method == 'DELETE':
            return request.user.role == 'admin'
        return request.user.is_authenticated and request.user.role in (
            'admin', 'inventory_manager'
        )


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrInventoryManager]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOnly]