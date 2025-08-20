#!/usr/bin/env python
"""
Script to seed sample products using the dynamic shop system
"""
import os
import sys
import django
from django.conf import settings
from decimal import Decimal
import uuid

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pritech_vior.settings')
django.setup()

from shop.models import Category, Brand, ProductType, Product, ProductImage
from django.contrib.auth import get_user_model

User = get_user_model()

def seed_sample_products():
    """Create sample products with dynamic categories, brands, and types"""
    
    # Get categories, brands, and product types
    electronics = Category.objects.get(name='Electronics')
    clothing = Category.objects.get(name='Clothing')
    home_garden = Category.objects.get(name='Home & Garden')
    sports = Category.objects.get(name='Sports & Outdoors')
    books = Category.objects.get(name='Books & Media')
    health = Category.objects.get(name='Health & Beauty')
    
    apple = Brand.objects.get(name='Apple')
    samsung = Brand.objects.get(name='Samsung')
    nike = Brand.objects.get(name='Nike')
    adidas = Brand.objects.get(name='Adidas')
    sony = Brand.objects.get(name='Sony')
    generic = Brand.objects.get(name='Generic')
    local = Brand.objects.get(name='Local Brand')
    
    physical = ProductType.objects.get(name='Physical Product')
    digital = ProductType.objects.get(name='Digital Product')
    custom = ProductType.objects.get(name='Custom Product')
    
    sample_products = [
        # Electronics
        {
            'name': 'iPhone 15 Pro',
            'description': 'Latest Apple iPhone with advanced camera system and A17 Pro chip. Featuring titanium design, action button, and USB-C connectivity.',
            'short_description': 'Apple iPhone 15 Pro with titanium design and advanced features.',
            'price': Decimal('2850000.00'),  # ~$1200 in TZS
            'original_price': Decimal('3000000.00'),
            'currency': 'TZS',
            'category': electronics,
            'brand': apple,
            'product_type': physical,
            'stock_quantity': 15,
            'featured': True,
            'new_arrival': True,
            'specifications': {
                'screen_size': '6.1 inches',
                'storage': '128GB',
                'camera': '48MP Main, 12MP Ultra Wide',
                'battery': 'Up to 23 hours video playback',
                'color_options': ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium']
            },
            'tags': 'smartphone, apple, iphone, titanium, camera, 5g',
            'weight': Decimal('0.187'),
            'dimensions': '14.7 x 7.1 x 0.8 cm'
        },
        {
            'name': 'Samsung Galaxy S24 Ultra',
            'description': 'Samsung flagship smartphone with S Pen, exceptional camera system, and Galaxy AI features.',
            'short_description': 'Samsung Galaxy S24 Ultra with S Pen and Galaxy AI.',
            'price': Decimal('2650000.00'),
            'original_price': Decimal('2800000.00'),
            'currency': 'TZS',
            'category': electronics,
            'brand': samsung,
            'product_type': physical,
            'stock_quantity': 12,
            'featured': True,
            'best_seller': True,
            'specifications': {
                'screen_size': '6.8 inches',
                'storage': '256GB',
                'camera': '200MP Main, 50MP Periscope Telephoto',
                'battery': '5000mAh',
                'color_options': ['Titanium Gray', 'Titanium Black', 'Titanium Violet', 'Titanium Yellow']
            },
            'tags': 'smartphone, samsung, galaxy, s-pen, camera, android',
            'weight': Decimal('0.232'),
            'dimensions': '16.3 x 7.9 x 0.86 cm'
        },
        {
            'name': 'Sony WH-1000XM5 Wireless Headphones',
            'description': 'Industry-leading noise canceling wireless headphones with exceptional sound quality and 30-hour battery life.',
            'short_description': 'Sony premium noise-canceling wireless headphones.',
            'price': Decimal('850000.00'),
            'currency': 'TZS',
            'category': electronics,
            'brand': sony,
            'product_type': physical,
            'stock_quantity': 25,
            'trending': True,
            'specifications': {
                'type': 'Over-ear wireless',
                'noise_canceling': 'Yes, Industry-leading',
                'battery_life': '30 hours',
                'connectivity': 'Bluetooth 5.2, NFC',
                'weight': '250g'
            },
            'tags': 'headphones, sony, wireless, noise-canceling, bluetooth',
            'weight': Decimal('0.250'),
        },
        
        # Clothing
        {
            'name': 'Nike Air Max 270',
            'description': 'Nike Air Max 270 lifestyle shoes featuring the largest heel Air unit in Nike history for exceptional comfort.',
            'short_description': 'Nike Air Max 270 lifestyle shoes with maximum Air cushioning.',
            'price': Decimal('385000.00'),
            'currency': 'TZS',
            'category': clothing,
            'brand': nike,
            'product_type': physical,
            'stock_quantity': 35,
            'best_seller': True,
            'specifications': {
                'type': 'Lifestyle Shoes',
                'material': 'Mesh and synthetic upper',
                'sole': 'Rubber outsole with Air Max cushioning',
                'sizes': ['38', '39', '40', '41', '42', '43', '44', '45'],
                'color_options': ['Black/White', 'White/Black', 'Navy/White', 'Red/Black']
            },
            'tags': 'shoes, nike, air max, lifestyle, comfort, sneakers',
            'weight': Decimal('0.650'),
        },
        {
            'name': 'Adidas Ultraboost 23',
            'description': 'Adidas Ultraboost 23 running shoes with responsive BOOST midsole and Primeknit upper for ultimate comfort.',
            'short_description': 'Adidas Ultraboost 23 running shoes with BOOST technology.',
            'price': Decimal('425000.00'),
            'currency': 'TZS',
            'category': clothing,
            'brand': adidas,
            'product_type': physical,
            'stock_quantity': 28,
            'new_arrival': True,
            'specifications': {
                'type': 'Running Shoes',
                'material': 'Primeknit upper',
                'sole': 'BOOST midsole, Continental rubber outsole',
                'sizes': ['38', '39', '40', '41', '42', '43', '44', '45'],
                'color_options': ['Core Black', 'Cloud White', 'Solar Yellow', 'Pulse Blue']
            },
            'tags': 'shoes, adidas, ultraboost, running, boost, primeknit',
            'weight': Decimal('0.680'),
        },
        
        # Local Products
        {
            'name': 'Tanzanian Kitenge Dress',
            'description': 'Beautiful handmade Kitenge dress featuring traditional Tanzanian patterns. Perfect for cultural events and celebrations.',
            'short_description': 'Traditional Tanzanian Kitenge dress with vibrant patterns.',
            'price': Decimal('75000.00'),
            'currency': 'TZS',
            'category': clothing,
            'brand': local,
            'product_type': custom,
            'stock_quantity': 20,
            'accepts_custom_orders': True,
            'custom_order_lead_time': 7,
            'specifications': {
                'material': 'Cotton Kitenge fabric',
                'pattern': 'Traditional Tanzanian designs',
                'sizes': ['S', 'M', 'L', 'XL', 'XXL'],
                'care': 'Hand wash or gentle machine wash',
                'origin': 'Made in Tanzania'
            },
            'tags': 'kitenge, dress, tanzanian, traditional, cultural, handmade',
        },
        {
            'name': 'Makonde Wood Carving Set',
            'description': 'Authentic Makonde wood carvings handcrafted by local artisans. Set includes various figurines representing Tanzanian culture.',
            'short_description': 'Authentic Makonde wood carvings by local artisans.',
            'price': Decimal('125000.00'),
            'currency': 'TZS',
            'category': home_garden,
            'brand': local,
            'product_type': physical,
            'stock_quantity': 8,
            'specifications': {
                'material': 'Ebony wood',
                'origin': 'Makonde tribe, Tanzania',
                'set_includes': '3 figurines of different sizes',
                'finish': 'Natural wood finish',
                'care': 'Dust with soft cloth, avoid moisture'
            },
            'tags': 'makonde, wood carving, tanzanian, art, handmade, cultural',
        },
        
        # Home & Garden
        {
            'name': 'Smart Home Security Camera',
            'description': 'WiFi-enabled security camera with night vision, motion detection, and smartphone app control.',
            'short_description': 'Smart WiFi security camera with night vision and app control.',
            'price': Decimal('185000.00'),
            'currency': 'TZS',
            'category': home_garden,
            'brand': generic,
            'product_type': physical,
            'stock_quantity': 22,
            'specifications': {
                'resolution': '1080p Full HD',
                'connectivity': 'WiFi 2.4GHz',
                'features': 'Night vision, Motion detection, Two-way audio',
                'storage': 'Cloud storage and SD card support',
                'app': 'iOS and Android compatible'
            },
            'tags': 'security camera, smart home, wifi, night vision, surveillance',
        },
        
        # Health & Beauty
        {
            'name': 'Organic Baobab Oil',
            'description': 'Pure organic baobab oil sourced from Tanzanian baobab trees. Rich in vitamins and perfect for skin and hair care.',
            'short_description': 'Pure organic baobab oil from Tanzania for skin and hair.',
            'price': Decimal('45000.00'),
            'currency': 'TZS',
            'category': health,
            'brand': local,
            'product_type': physical,
            'stock_quantity': 40,
            'specifications': {
                'volume': '50ml',
                'origin': 'Tanzanian baobab trees',
                'certification': 'Organic certified',
                'benefits': 'Anti-aging, moisturizing, hair conditioning',
                'usage': 'Face, body, and hair care'
            },
            'tags': 'baobab oil, organic, tanzanian, skincare, haircare, natural',
        },
        
        # Digital Products
        {
            'name': 'Swahili Language Learning Course',
            'description': 'Comprehensive digital Swahili language learning course with audio lessons, exercises, and cultural insights.',
            'short_description': 'Digital Swahili language learning course with audio and exercises.',
            'price': Decimal('85000.00'),
            'currency': 'TZS',
            'category': books,
            'brand': local,
            'product_type': digital,
            'stock_quantity': 999,  # Digital product - unlimited
            'specifications': {
                'format': 'Digital download',
                'duration': '20 hours of content',
                'levels': 'Beginner to Intermediate',
                'includes': 'Audio files, PDF materials, Exercise sheets',
                'language': 'English and Swahili',
                'access': 'Lifetime access'
            },
            'tags': 'swahili, language learning, digital course, tanzania, education',
        }
    ]
    
    created_count = 0
    for product_data in sample_products:
        # Check if product already exists
        if not Product.objects.filter(name=product_data['name']).exists():
            product = Product.objects.create(**product_data)
            created_count += 1
            print(f"Created product: {product.name} - {product.price} {product.currency}")
        else:
            print(f"Product already exists: {product_data['name']}")
    
    print(f"\nCreated {created_count} new products successfully!")
    return created_count

def main():
    """Run the product seeding"""
    print("Starting to seed sample products...")
    print("=" * 50)
    
    created_count = seed_sample_products()
    
    print("=" * 50)
    print(f"Product seeding completed!")
    print(f"Total products created: {created_count}")
    print("\nYou can now:")
    print("1. View products in the Django admin")
    print("2. Test the dynamic category/brand/type system")
    print("3. Create additional products using the admin interface")
    print("4. Test product requests with the available platforms")

if __name__ == "__main__":
    main()
