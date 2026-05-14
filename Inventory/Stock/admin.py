from django.contrib import admin
from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('sku', 'name', 'category', 'quantity', 'price', 'risk_level', 'is_low_stock')
    list_filter = ('category', 'risk_level', 'order_priority')
    search_fields = ('sku', 'name')
    readonly_fields = ('created_at', 'updated_at')