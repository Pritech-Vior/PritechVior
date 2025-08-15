from django.db import models
from django.conf import settings
from django.utils.text import slugify

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('laptops', 'Laptops'),
        ('services', 'Services'),
        ('accessories', 'Accessories'),
        ('software', 'Software'),
        ('hardware', 'Hardware'),
        ('books', 'Books'),
    ]
    
    BRAND_CHOICES = [
        ('dell', 'Dell'),
        ('hp', 'HP'),
        ('microsoft', 'Microsoft'),
        ('adobe', 'Adobe'),
        ('logitech', 'Logitech'),
        ('pritechvior', 'PritechVior'),
        ('apple', 'Apple'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('out_of_stock', 'Out of Stock'),
    ]
    
    # Basic Information
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField()
    short_description = models.CharField(max_length=500, blank=True)
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Categorization
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='software')
    brand = models.CharField(max_length=20, choices=BRAND_CHOICES, default='other')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    # Features
    featured = models.BooleanField(default=False)
    in_stock = models.BooleanField(default=True)
    stock_quantity = models.PositiveIntegerField(default=0)
    
    # Ratings & Reviews
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    review_count = models.PositiveIntegerField(default=0)
    
    # Affiliate Information
    is_affiliate = models.BooleanField(default=False)
    affiliate_source = models.CharField(max_length=100, blank=True)
    affiliate_url = models.URLField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    @property
    def discount_percentage(self):
        """Calculate discount percentage if original_price exists"""
        if self.original_price and self.original_price > self.price:
            return round(((self.original_price - self.price) / self.original_price) * 100, 1)
        return 0
    
    @property
    def is_on_sale(self):
        """Check if product is on sale"""
        return self.original_price and self.original_price > self.price
    
    def __str__(self):
        return self.name


class ProductReview(models.Model):
    """Product reviews to support rating system"""
    RATING_CHOICES = [
        (1, '1 Star'),
        (2, '2 Stars'), 
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    ]
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='product_reviews')
    rating = models.IntegerField(choices=RATING_CHOICES)
    review_text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['product', 'user']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.product.name} ({self.rating} stars)"

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
