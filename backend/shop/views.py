from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q, Count, Sum, Avg
from django.utils import timezone
from datetime import timedelta
import django_filters.rest_framework as django_filters
from .models import Product, Order, Category, OrderItem
from .serializers import ProductSerializer, OrderSerializer, CategorySerializer


class IsAdminUser(permissions.BasePermission):
    """
    Custom permission to only allow admin users.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            (request.user.is_staff or request.user.is_superuser or 
             getattr(request.user, 'role', None) in ['admin', 'ceo'])
        )


def log_activity(user, action, action_type='system', description='', request=None):
    """
    Utility function to log user activities
    """
    try:
        # You can implement activity logging here if needed
        print(f"Activity: {action} by {user.username}")
    except Exception as e:
        print(f"Error logging activity: {e}")


class ProductFilter(django_filters.FilterSet):
    """Filter for products"""
    category = django_filters.CharFilter(field_name='category__name', lookup_expr='icontains')
    price_min = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    price_max = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    search = django_filters.CharFilter(method='filter_search')
    in_stock = django_filters.BooleanFilter(method='filter_in_stock')
    
    class Meta:
        model = Product
        fields = ['category', 'status', 'featured']
    
    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(name__icontains=value) |
            Q(description__icontains=value) |
            Q(category__name__icontains=value)
        )
    
    def filter_in_stock(self, queryset, name, value):
        if value:
            return queryset.filter(stock_quantity__gt=0)
        return queryset.filter(stock_quantity=0)


class OrderFilter(django_filters.FilterSet):
    """Filter for orders"""
    customer = django_filters.CharFilter(field_name='user__username', lookup_expr='icontains')
    date_from = django_filters.DateFilter(field_name='created_at', lookup_expr='gte')
    date_to = django_filters.DateFilter(field_name='created_at', lookup_expr='lte')
    search = django_filters.CharFilter(method='filter_search')
    
    class Meta:
        model = Order
        fields = ['status', 'payment_status']
    
    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(id__icontains=value) |
            Q(user__username__icontains=value) |
            Q(user__email__icontains=value)
        )


class ProductViewSet(viewsets.ModelViewSet):
    """ViewSet for product management"""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [django_filters.DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = ProductFilter
    ordering_fields = ['name', 'price', 'stock_quantity', 'created_at']
    ordering = ['-created_at']
    
    def perform_create(self, serializer):
        product = serializer.save()
        log_activity(
            user=self.request.user,
            action=f"Created product: {product.name}",
            action_type="shop",
            request=self.request
        )
    
    def perform_update(self, serializer):
        product = serializer.save()
        log_activity(
            user=self.request.user,
            action=f"Updated product: {product.name}",
            action_type="shop",
            request=self.request
        )
    
    def perform_destroy(self, instance):
        log_activity(
            user=self.request.user,
            action=f"Deleted product: {instance.name}",
            action_type="shop",
            request=self.request
        )
        instance.delete()
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured products"""
        featured_products = self.get_queryset().filter(featured=True, status='active')
        serializer = self.get_serializer(featured_products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Get products with low stock"""
        low_stock_threshold = int(request.query_params.get('threshold', 10))
        low_stock_products = self.get_queryset().filter(
            stock_quantity__lte=low_stock_threshold,
            status='active'
        )
        serializer = self.get_serializer(low_stock_products, many=True)
        return Response(serializer.data)


class OrderViewSet(viewsets.ModelViewSet):
    """ViewSet for order management"""
    queryset = Order.objects.select_related('user').all()
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [django_filters.DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = OrderFilter
    ordering_fields = ['created_at', 'total_amount', 'status']
    ordering = ['-created_at']
    
    def perform_update(self, serializer):
        order = serializer.save()
        log_activity(
            user=self.request.user,
            action=f"Updated order: {str(order.id)[:8]}",
            action_type="order",
            request=self.request
        )
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update order status"""
        order = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        old_status = order.status
        order.status = new_status
        order.save()
        
        log_activity(
            user=request.user,
            action=f"Changed order {str(order.id)[:8]} status from {old_status} to {new_status}",
            action_type="order",
            request=request
        )
        
        serializer = self.get_serializer(order)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get order statistics"""
        # Total orders
        total_orders = Order.objects.count()
        
        # Orders by status
        status_stats = Order.objects.values('status').annotate(count=Count('id'))
        by_status = {item['status']: item['count'] for item in status_stats}
        
        # Revenue statistics
        total_revenue = Order.objects.filter(
            payment_status='completed'
        ).aggregate(total=Sum('total_amount'))['total'] or 0
        
        # This month's statistics
        this_month = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        this_month_orders = Order.objects.filter(created_at__gte=this_month).count()
        this_month_revenue = Order.objects.filter(
            created_at__gte=this_month,
            payment_status='completed'
        ).aggregate(total=Sum('total_amount'))['total'] or 0
        
        return Response({
            'total_orders': total_orders,
            'by_status': by_status,
            'total_revenue': total_revenue,
            'this_month_orders': this_month_orders,
            'this_month_revenue': this_month_revenue,
            'average_order_value': total_revenue / max(total_orders, 1)
        })


class CategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for category management"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUser]
    ordering = ['name']
    
    def perform_create(self, serializer):
        category = serializer.save()
        log_activity(
            user=self.request.user,
            action=f"Created category: {category.name}",
            action_type="shop",
            request=self.request
        )
    
    def perform_update(self, serializer):
        category = serializer.save()
        log_activity(
            user=self.request.user,
            action=f"Updated category: {category.name}",
            action_type="shop",
            request=self.request
        )
    
    def perform_destroy(self, instance):
        log_activity(
            user=self.request.user,
            action=f"Deleted category: {instance.name}",
            action_type="shop",
            request=self.request
        )
        instance.delete()


class ShopAnalyticsAPIView(APIView):
    """API view for shop analytics"""
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        try:
            # Product statistics
            total_products = Product.objects.count()
            active_products = Product.objects.filter(status='active').count()
            out_of_stock = Product.objects.filter(stock_quantity=0).count()
            
            # Order statistics
            total_orders = Order.objects.count()
            completed_orders = Order.objects.filter(payment_status='completed').count()
            pending_orders = Order.objects.filter(status='pending').count()
            
            # Revenue statistics
            total_revenue = Order.objects.filter(
                payment_status='completed'
            ).aggregate(total=Sum('total_amount'))['total'] or 0
            
            # This month's revenue
            this_month = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            this_month_revenue = Order.objects.filter(
                created_at__gte=this_month,
                payment_status='completed'
            ).aggregate(total=Sum('total_amount'))['total'] or 0
            
            # Top selling products
            top_products = Product.objects.annotate(
                order_count=Count('orderitem')
            ).order_by('-order_count')[:5]
            
            top_products_data = []
            for product in top_products:
                revenue = OrderItem.objects.filter(
                    product=product,
                    order__payment_status='completed'
                ).aggregate(
                    total=Sum('price')
                )['total'] or 0
                
                top_products_data.append({
                    'name': product.name,
                    'sales': product.order_count,
                    'revenue': revenue
                })
            
            # Monthly sales data (last 6 months)
            monthly_sales = []
            for i in range(6):
                month_start = (timezone.now().replace(day=1) - timedelta(days=30*i)).replace(day=1)
                month_end = (month_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
                
                month_orders = Order.objects.filter(
                    created_at__range=[month_start, month_end],
                    payment_status='completed'
                ).count()
                
                month_revenue = Order.objects.filter(
                    created_at__range=[month_start, month_end],
                    payment_status='completed'
                ).aggregate(total=Sum('total_amount'))['total'] or 0
                
                monthly_sales.append({
                    'month': month_start.strftime('%b'),
                    'sales': month_orders,
                    'revenue': month_revenue
                })
            
            # Conversion rate (completed orders / total orders)
            conversion_rate = (completed_orders / max(total_orders, 1)) * 100
            
            return Response({
                'total_revenue': total_revenue,
                'total_orders': total_orders,
                'total_products': total_products,
                'conversion_rate': round(conversion_rate, 1),
                'active_products': active_products,
                'out_of_stock': out_of_stock,
                'completed_orders': completed_orders,
                'pending_orders': pending_orders,
                'this_month_revenue': this_month_revenue,
                'top_products': top_products_data,
                'monthly_sales': list(reversed(monthly_sales))
            })
            
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch shop analytics: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PublicShopStatsAPIView(APIView):
    """Public API for basic shop statistics"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        total_products = Product.objects.filter(status='active').count()
        featured_products = Product.objects.filter(status='active', featured=True).count()
        
        return Response({
            'total_products': total_products,
            'featured_products': featured_products,
            'message': 'Discover our amazing products!'
        })