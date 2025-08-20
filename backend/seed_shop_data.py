#!/usr/bin/env python
"""
Script to seed the shop app with initial data
"""
import os
import sys
import django
from django.conf import settings

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pritech_vior.settings')
django.setup()

from shop.models import Category, Brand, ProductType, Platform, ShippingMethod

def seed_categories():
    """Create initial categories"""
    categories = [
        {'name': 'Electronics', 'description': 'Electronic devices and accessories'},
        {'name': 'Clothing', 'description': 'Apparel and fashion items'},
        {'name': 'Home & Garden', 'description': 'Home improvement and gardening supplies'},
        {'name': 'Sports & Outdoors', 'description': 'Sports equipment and outdoor gear'},
        {'name': 'Books & Media', 'description': 'Books, music, and media content'},
        {'name': 'Health & Beauty', 'description': 'Health and beauty products'},
        {'name': 'Automotive', 'description': 'Car parts and automotive accessories'},
        {'name': 'Toys & Games', 'description': 'Toys and gaming products'},
    ]
    
    for cat_data in categories:
        category, created = Category.objects.get_or_create(
            name=cat_data['name'],
            defaults={'description': cat_data['description']}
        )
        if created:
            print(f"Created category: {category.name}")
        else:
            print(f"Category already exists: {category.name}")

def seed_brands():
    """Create initial brands"""
    brands = [
        {'name': 'Apple', 'description': 'Technology and consumer electronics', 'website': 'https://apple.com'},
        {'name': 'Samsung', 'description': 'Electronics and technology', 'website': 'https://samsung.com'},
        {'name': 'Nike', 'description': 'Athletic footwear and apparel', 'website': 'https://nike.com'},
        {'name': 'Adidas', 'description': 'Sports clothing and accessories', 'website': 'https://adidas.com'},
        {'name': 'Sony', 'description': 'Electronics and entertainment', 'website': 'https://sony.com'},
        {'name': 'Generic', 'description': 'Generic or unbranded products'},
        {'name': 'Local Brand', 'description': 'Local Tanzanian brands'},
    ]
    
    for brand_data in brands:
        brand, created = Brand.objects.get_or_create(
            name=brand_data['name'],
            defaults={
                'description': brand_data['description'],
                'website': brand_data.get('website', '')
            }
        )
        if created:
            print(f"Created brand: {brand.name}")
        else:
            print(f"Brand already exists: {brand.name}")

def seed_product_types():
    """Create initial product types"""
    product_types = [
        {'name': 'Physical Product', 'description': 'Tangible products that can be shipped'},
        {'name': 'Digital Product', 'description': 'Digital downloads and services'},
        {'name': 'Subscription', 'description': 'Recurring subscription services'},
        {'name': 'Service', 'description': 'Professional services'},
        {'name': 'Custom Product', 'description': 'Made-to-order custom products'},
        {'name': 'Wholesale', 'description': 'Bulk wholesale products'},
    ]
    
    for type_data in product_types:
        product_type, created = ProductType.objects.get_or_create(
            name=type_data['name'],
            defaults={'description': type_data['description']}
        )
        if created:
            print(f"Created product type: {product_type.name}")
        else:
            print(f"Product type already exists: {product_type.name}")

def seed_platforms():
    """Create initial platforms for product requests"""
    platforms = [
        {'name': 'Amazon', 'description': 'Amazon marketplace', 'website': 'https://amazon.com'},
        {'name': 'eBay', 'description': 'eBay marketplace', 'website': 'https://ebay.com'},
        {'name': 'AliExpress', 'description': 'AliExpress marketplace', 'website': 'https://aliexpress.com'},
        {'name': 'Alibaba', 'description': 'Alibaba wholesale platform', 'website': 'https://alibaba.com'},
        {'name': 'Etsy', 'description': 'Handmade and vintage items', 'website': 'https://etsy.com'},
        {'name': 'Wish', 'description': 'Wish marketplace', 'website': 'https://wish.com'},
        {'name': 'Other', 'description': 'Other online platforms'},
    ]
    
    for platform_data in platforms:
        platform, created = Platform.objects.get_or_create(
            name=platform_data['name'],
            defaults={
                'description': platform_data['description'],
                'website': platform_data.get('website', '')
            }
        )
        if created:
            print(f"Created platform: {platform.name}")
        else:
            print(f"Platform already exists: {platform.name}")

def seed_shipping_methods():
    """Create initial shipping methods"""
    shipping_methods = [
        {
            'name': 'Standard Shipping',
            'description': 'Regular delivery within Tanzania',
            'base_cost': 5000.00,  # TZS
            'cost_per_kg': 2000.00,
            'estimated_days_min': 3,
            'estimated_days_max': 7,
            'free_shipping_threshold': 50000.00
        },
        {
            'name': 'Express Shipping',
            'description': 'Fast delivery within Tanzania',
            'base_cost': 10000.00,
            'cost_per_kg': 3000.00,
            'estimated_days_min': 1,
            'estimated_days_max': 3,
            'free_shipping_threshold': 100000.00
        },
        {
            'name': 'International Shipping',
            'description': 'International delivery',
            'base_cost': 25000.00,
            'cost_per_kg': 5000.00,
            'estimated_days_min': 7,
            'estimated_days_max': 21,
            'free_shipping_threshold': 200000.00
        },
        {
            'name': 'Pickup',
            'description': 'Customer pickup from store',
            'base_cost': 0.00,
            'cost_per_kg': 0.00,
            'estimated_days_min': 1,
            'estimated_days_max': 1,
        }
    ]
    
    for method_data in shipping_methods:
        method, created = ShippingMethod.objects.get_or_create(
            name=method_data['name'],
            defaults=method_data
        )
        if created:
            print(f"Created shipping method: {method.name}")
        else:
            print(f"Shipping method already exists: {method.name}")

def main():
    """Run all seeding functions"""
    print("Starting to seed shop data...")
    
    print("\n1. Seeding Categories...")
    seed_categories()
    
    print("\n2. Seeding Brands...")
    seed_brands()
    
    print("\n3. Seeding Product Types...")
    seed_product_types()
    
    print("\n4. Seeding Platforms...")
    seed_platforms()
    
    print("\n5. Seeding Shipping Methods...")
    seed_shipping_methods()
    
    print("\nShop data seeding completed successfully!")
    print("\nYou can now:")
    print("1. Access the Django admin to manage these items")
    print("2. Create products using the dynamic categories, brands, and types")
    print("3. Set up product requests using the available platforms")

if __name__ == "__main__":
    main()
