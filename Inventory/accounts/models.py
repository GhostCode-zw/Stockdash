from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('staff', 'Staff'),
        ('inventory_manager', 'Inventory Manager'),
        ('sales_manager', 'Sales Manager'),
        ('viewer', 'Viewer'),
    ]
   

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='viewer'
    )



    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)

    
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

