from users.models import User
from projects.models import Project
from blog.models import BlogPost
from shop.models import Order

def admin_statistics(request):
    """
    Context processor to add statistics to admin templates
    """
    if request.path.startswith('/admin/'):
        try:
            return {
                'user_count': User.objects.count(),
                'project_count': Project.objects.filter(status__in=['planning', 'in_progress', 'review']).count(),
                'blog_count': BlogPost.objects.filter(status='published').count(),
                'order_count': Order.objects.filter(status__in=['pending', 'processing', 'shipped']).count(),
            }
        except:
            # Return zeros if models don't exist yet (during migrations)
            return {
                'user_count': 0,
                'project_count': 0,
                'blog_count': 0,
                'order_count': 0,
            }
    return {}
