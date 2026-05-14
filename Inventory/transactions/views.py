from rest_framework import viewsets, permissions
from .models import Transaction
from .serializers import TransactionSerializer


class TransactionPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.method in permissions.SAFE_METHODS:
            return True

        role = request.user.role
        transaction_type = request.data.get('transaction_type')

        if role == 'admin':
            return True

        if role == 'inventory_manager':
            return transaction_type in ('purchase', 'return', 'adjustment')

        if role == 'staff':
            return transaction_type == 'sell'

        if role == 'sales_manager':
            return transaction_type == 'sell'

        return False


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [TransactionPermission]