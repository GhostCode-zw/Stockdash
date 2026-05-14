from rest_framework import serializers
from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    performed_by_username = serializers.CharField(source='performed_by.username', read_only=True)

    class Meta:
        model = Transaction
        fields = [
            'id', 'product', 'product_name', 'transaction_type', 'quantity',
            'notes', 'reference_number', 'performed_by', 'performed_by_username',
            'created_at',
        ]
        read_only_fields = ['created_at', 'product_name', 'performed_by_username']

