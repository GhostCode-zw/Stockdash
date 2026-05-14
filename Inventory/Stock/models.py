from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name


class Product(models.Model):

    RISK_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('normal', 'Normal'),
        ('urgent', 'Urgent'),
    ]

   
    sku = models.CharField(max_length=100, unique=True)  
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)


    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,       
        related_name='products'
    )

  
    price = models.DecimalField(max_digits=10, decimal_places=2)

    
    quantity = models.PositiveIntegerField(default=0)
    reorder_level = models.PositiveIntegerField(default=10)  

   
    risk_level = models.CharField(
        max_length=20,
        choices=RISK_CHOICES,
        default='low'
    )
    order_priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default='normal'
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"[{self.sku}] {self.name}"

    def is_low_stock(self):
       
        return self.quantity <= self.reorder_level