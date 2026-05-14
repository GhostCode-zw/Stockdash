from django.db import models
from django.contrib.auth import get_user_model


class Transaction(models.Model):

    TRANSACTION_TYPES = [
        ('purchase', 'Purchase'),      
        ('sell', 'Sell'),              
        ('return', 'Return'),         
        ('adjustment', 'Adjustment'), 
        ('transfer', 'Transfer'),     
    ]

    product = models.ForeignKey(
        'Stock.Product',
        on_delete=models.PROTECT,  
        related_name='transactions'
    )
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    quantity = models.PositiveIntegerField()
    notes = models.TextField(blank=True)
    reference_number = models.CharField(max_length=100, blank=True)  
    performed_by = models.ForeignKey(
        get_user_model(),
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='transactions'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']  

    def __str__(self):
        return f"{self.get_transaction_type_display()} - {self.product.name} ({self.quantity} units)"

    def save(self, *args, **kwargs):
       
        if self.transaction_type in ('purchase', 'return'):
            self.product.quantity += self.quantity
        elif self.transaction_type in ('sell', 'adjustment', 'transfer'):
            self.product.quantity -= self.quantity

        self.product.save()
        super().save(*args, **kwargs)