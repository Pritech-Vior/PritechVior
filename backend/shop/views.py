from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg
from django.shortcuts import get_object_or_404
from .models import (
    Category, Brand, ProductType, Platform, Product, ProductReview, ProductImage, 
    Order, OrderItem, Cart, CartItem, Wishlist, WishlistItem, 
    CustomOrderRequest, ProductRequest, ShippingMethod
)
from .serializers import (
    CategorySerializer, BrandSerializer, ProductTypeSerializer, PlatformSerializer,
    ProductSerializer, ProductDetailSerializer, ProductReviewSerializer,
    OrderSerializer, CartSerializer, CartItemSerializer, WishlistSerializer,
    CustomOrderRequestSerializer, ProductRequestSerializer, ShippingMethodSerializer,
    AddToCartSerializer, UpdateCartItemSerializer, CheckoutSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for product categories"""
    queryset = Category.objects.filter(is_active=True).order_by('sort_order', 'name')
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']
    lookup_field = 'slug'

    @action(detail=True, methods=['get'])
    def products(self, request, slug=None):
        """Get products in this category"""
        category = self.get_object()
        products = Product.objects.filter(category=category, status='active')
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)


class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for product brands"""
    queryset = Brand.objects.filter(is_active=True).order_by('sort_order', 'name')
    serializer_class = BrandSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']
    lookup_field = 'slug'

    @action(detail=True, methods=['get'])
    def products(self, request, slug=None):
        """Get products from this brand"""
        brand = self.get_object()
        products = Product.objects.filter(brand=brand, status='active')
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)


class ProductTypeViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for product types"""
    queryset = ProductType.objects.filter(is_active=True).order_by('sort_order', 'name')
    serializer_class = ProductTypeSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']
    lookup_field = 'slug'

    @action(detail=True, methods=['get'])
    def products(self, request, slug=None):
        """Get products of this type"""
        product_type = self.get_object()
        products = Product.objects.filter(product_type=product_type, status='active')
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)


class PlatformViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for platforms"""
    queryset = Platform.objects.filter(is_active=True).order_by('sort_order', 'name')
    serializer_class = PlatformSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description', 'website']
    lookup_field = 'slug'

    @action(detail=True, methods=['get'])
    def requests(self, request, slug=None):
        """Get product requests from this platform"""
        platform = self.get_object()
        product_requests = ProductRequest.objects.filter(platform=platform)
        serializer = ProductRequestSerializer(product_requests, many=True, context={'request': request})
        return Response(serializer.data)


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for ViorMart products
    Provides list and detail views with filtering and search
    """
    queryset = Product.objects.filter(status='active')
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = [
        'category', 'brand', 'featured', 'trending', 'new_arrival', 'best_seller',
        'is_affiliate', 'product_type', 'availability', 'accepts_custom_orders'
    ]
    search_fields = ['name', 'description', 'short_description', 'tags']
    ordering_fields = ['price', 'rating', 'created_at', 'review_count', 'name']
    ordering = ['-featured', '-created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductSerializer

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured products"""
        featured_products = self.queryset.filter(featured=True)
        serializer = self.get_serializer(featured_products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def trending(self, request):
        """Get trending products"""
        trending_products = self.queryset.filter(trending=True)
        serializer = self.get_serializer(trending_products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def new_arrivals(self, request):
        """Get new arrival products"""
        new_products = self.queryset.filter(new_arrival=True)
        serializer = self.get_serializer(new_products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def best_sellers(self, request):
        """Get best selling products"""
        best_sellers = self.queryset.filter(best_seller=True)
        serializer = self.get_serializer(best_sellers, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def categories(self, request):
        """Get available categories with product counts"""
        categories = {}
        for choice in Product.CATEGORY_CHOICES:
            category_key, category_label = choice
            count = self.queryset.filter(category=category_key).count()
            categories[category_key] = {
                'label': category_label,
                'count': count
            }
        return Response(categories)

    @action(detail=False, methods=['get'])
    def brands(self, request):
        """Get available brands with product counts"""
        brands = {}
        for choice in Product.BRAND_CHOICES:
            brand_key, brand_label = choice
            count = self.queryset.filter(brand=brand_key).count()
            if count > 0:  # Only include brands that have products
                brands[brand_key] = {
                    'label': brand_label,
                    'count': count
                }
        return Response(brands)

    @action(detail=True, methods=['get'])
    def similar(self, request, pk=None):
        """Get similar products"""
        product = self.get_object()
        similar_products = self.queryset.filter(
            Q(category=product.category) | Q(brand=product.brand)
        ).exclude(id=product.id)[:8]
        serializer = self.get_serializer(similar_products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search_suggestions(self, request):
        """Get search suggestions based on query"""
        query = request.query_params.get('q', '')
        if len(query) < 2:
            return Response([])
        
        products = self.queryset.filter(
            Q(name__icontains=query) | Q(tags__icontains=query)
        )[:10]
        
        suggestions = [{'name': p.name, 'slug': p.slug} for p in products]
        return Response(suggestions)


class ProductReviewViewSet(viewsets.ModelViewSet):
    """ViewSet for product reviews"""
    queryset = ProductReview.objects.all()
    serializer_class = ProductReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        product_slug = self.kwargs.get('product_slug')
        if product_slug:
            return ProductReview.objects.filter(product__slug=product_slug)
        return ProductReview.objects.all()
    
    def perform_create(self, serializer):
        product_slug = self.kwargs.get('product_slug')
        product = Product.objects.get(slug=product_slug)
        serializer.save(user=self.request.user, product=product)
        
        # Update product rating
        avg_rating = product.reviews.aggregate(avg_rating=Avg('rating'))['avg_rating']
        product.rating = round(avg_rating, 2) if avg_rating else 0
        product.review_count = product.reviews.count()
        product.save()

    @action(detail=True, methods=['post'])
    def mark_helpful(self, request, pk=None, product_slug=None):
        """Mark review as helpful"""
        review = self.get_object()
        review.helpful_count += 1
        review.save()
        return Response({'helpful_count': review.helpful_count})


class CartViewSet(viewsets.ModelViewSet):
    """ViewSet for shopping cart"""
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)
    
    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """Add item to cart"""
        serializer = AddToCartSerializer(data=request.data)
        if serializer.is_valid():
            cart, created = Cart.objects.get_or_create(user=request.user)
            product = get_object_or_404(Product, id=serializer.validated_data['product_id'])
            
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                defaults={
                    'quantity': serializer.validated_data['quantity'],
                    'custom_specifications': serializer.validated_data.get('custom_specifications', {})
                }
            )
            
            if not created:
                cart_item.quantity += serializer.validated_data['quantity']
                cart_item.save()
            
            return Response(CartItemSerializer(cart_item).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['put'])
    def update_item(self, request):
        """Update cart item quantity"""
        item_id = request.data.get('item_id')
        cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
        
        serializer = UpdateCartItemSerializer(data=request.data)
        if serializer.is_valid():
            cart_item.quantity = serializer.validated_data['quantity']
            cart_item.save()
            return Response(CartItemSerializer(cart_item).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['delete'])
    def remove_item(self, request):
        """Remove item from cart"""
        item_id = request.data.get('item_id')
        cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['delete'])
    def clear(self, request):
        """Clear all items from cart"""
        cart = self.get_object()
        cart.items.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class WishlistViewSet(viewsets.ModelViewSet):
    """ViewSet for wishlist"""
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)
    
    def get_object(self):
        wishlist, created = Wishlist.objects.get_or_create(user=self.request.user)
        return wishlist

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """Add item to wishlist"""
        product_id = request.data.get('product_id')
        product = get_object_or_404(Product, id=product_id)
        wishlist = self.get_object()
        
        wishlist_item, created = WishlistItem.objects.get_or_create(
            wishlist=wishlist,
            product=product
        )
        
        if created:
            return Response({'message': 'Product added to wishlist'}, status=status.HTTP_201_CREATED)
        return Response({'message': 'Product already in wishlist'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['delete'])
    def remove_item(self, request):
        """Remove item from wishlist"""
        product_id = request.data.get('product_id')
        wishlist = self.get_object()
        wishlist_item = get_object_or_404(WishlistItem, wishlist=wishlist, product_id=product_id)
        wishlist_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for orders"""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def checkout(self, request):
        """Process checkout"""
        serializer = CheckoutSerializer(data=request.data)
        if serializer.is_valid():
            cart = get_object_or_404(Cart, user=request.user)
            if not cart.items.exists():
                return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create order logic here
            # This would typically involve payment processing
            
            return Response({'message': 'Order created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomOrderRequestViewSet(viewsets.ModelViewSet):
    """ViewSet for custom order requests"""
    serializer_class = CustomOrderRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return CustomOrderRequest.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ProductRequestViewSet(viewsets.ModelViewSet):
    """ViewSet for product requests from external sites"""
    serializer_class = ProductRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ProductRequest.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ShippingMethodViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for shipping methods"""
    queryset = ShippingMethod.objects.filter(is_active=True)
    serializer_class = ShippingMethodSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def calculate_shipping(self, request):
        """Calculate shipping cost for cart"""
        total_weight = request.data.get('total_weight', 0)
        total_amount = request.data.get('total_amount', 0)
        
        shipping_costs = []
        for method in self.queryset:
            cost = method.base_cost + (method.cost_per_kg * total_weight)
            
            # Check for free shipping
            if method.free_shipping_threshold and total_amount >= method.free_shipping_threshold:
                cost = 0
            
            shipping_costs.append({
                'id': method.id,
                'name': method.name,
                'cost': cost,
                'estimated_days': f"{method.estimated_days_min}-{method.estimated_days_max}",
                'free_shipping': cost == 0
            })
        
        return Response(shipping_costs)
