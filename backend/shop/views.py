from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, ProductReview
from .serializers import ProductSerializer, ProductDetailSerializer, ProductReviewSerializer


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for ViorMart products
    Provides list and detail views with filtering and search
    """
    queryset = Product.objects.filter(status='active')
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'brand', 'featured', 'is_affiliate']
    search_fields = ['name', 'description', 'short_description']
    ordering_fields = ['price', 'rating', 'created_at', 'review_count']
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


class ProductReviewViewSet(viewsets.ModelViewSet):
    """ViewSet for product reviews"""
    queryset = ProductReview.objects.all()
    serializer_class = ProductReviewSerializer
    
    def get_queryset(self):
        product_id = self.kwargs.get('product_pk')
        if product_id:
            return ProductReview.objects.filter(product_id=product_id)
        return ProductReview.objects.all()
    
    def perform_create(self, serializer):
        product_id = self.kwargs.get('product_pk')
        product = Product.objects.get(id=product_id)
        serializer.save(user=self.request.user, product=product)
