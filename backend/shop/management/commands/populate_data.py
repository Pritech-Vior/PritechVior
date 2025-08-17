from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from shop.models import Product, ProductReview
from elearning.models import Course, CourseReview, Lesson
from archive.models import Archive
from blog.models import BlogPost, Category, NewsletterSubscription
from projects.models import Project, ProjectMilestone, ProjectRequest
from decimal import Decimal
import json

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate database with sample data matching frontend requirements'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')
        
        # Create users
        self.create_users()
        
        # Create ViorMart (Shop) data
        self.create_shop_data()
        
        # Create ThinkForge (E-Learning) data
        self.create_elearning_data()
        
        # Create Archive data
        self.create_archive_data()
        
        # Create Blog data
        self.create_blog_data()
        
        # Create Project data
        self.create_project_data()
        
        self.stdout.write(self.style.SUCCESS('Successfully created sample data!'))

    def create_users(self):
        """Create sample users with different roles"""
        users_data = [
            {'username': 'admin', 'email': 'admin@pritechvior.co.tz', 'role': 'admin', 'first_name': 'Admin', 'last_name': 'User'},
            {'username': 'instructor1', 'email': 'instructor@pritechvior.co.tz', 'role': 'trainer', 'first_name': 'John', 'last_name': 'Smith'},
            {'username': 'student1', 'email': 'student@example.com', 'role': 'student', 'first_name': 'Alice', 'last_name': 'Johnson'},
            {'username': 'client1', 'email': 'client@company.com', 'role': 'client', 'first_name': 'Bob', 'last_name': 'Williams'},
            {'username': 'designer1', 'email': 'designer@pritechvior.co.tz', 'role': 'designer', 'first_name': 'Sarah', 'last_name': 'Davis'},
        ]
        
        for user_data in users_data:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults={
                    'email': user_data['email'],
                    'role': user_data['role'],
                    'first_name': user_data['first_name'],
                    'last_name': user_data['last_name'],
                    'is_active': True,
                }
            )
            if created:
                user.set_password('password123')
                user.save()
                self.stdout.write(f'Created user: {user.username}')

    def create_shop_data(self):
        """Create ViorMart products"""
        products_data = [
            {
                'name': 'MacBook Pro 14-inch M3',
                'description': 'Latest MacBook Pro with M3 chip, perfect for development and creative work',
                'price': Decimal('4500000.00'),
                'original_price': Decimal('4800000.00'),
                'category': 'laptops',
                'brand': 'apple',
                'featured': True,
                'rating': Decimal('4.9'),
                'review_count': 128,
                'is_affiliate': True,
                'affiliate_source': 'Amazon',
            },
            {
                'name': 'Custom Website Development',
                'description': 'Professional website development service for businesses and startups',
                'price': Decimal('800000.00'),
                'category': 'services',
                'brand': 'pritechvior',
                'featured': True,
                'rating': Decimal('5.0'),
                'review_count': 45,
                'is_affiliate': False,
            },
            {
                'name': 'Logitech MX Master 3S Mouse',
                'description': 'Advanced wireless mouse for professionals and creatives',
                'price': Decimal('180000.00'),
                'original_price': Decimal('200000.00'),
                'category': 'accessories',
                'brand': 'logitech',
                'featured': False,
                'rating': Decimal('4.8'),
                'review_count': 89,
                'is_affiliate': True,
                'affiliate_source': 'Amazon',
            },
        ]
        
        for product_data in products_data:
            product, created = Product.objects.get_or_create(
                name=product_data['name'],
                defaults=product_data
            )
            if created:
                self.stdout.write(f'Created product: {product.name}')

    def create_elearning_data(self):
        """Create ThinkForge courses"""
        instructor = User.objects.filter(role='trainer').first()
        if not instructor:
            instructor = User.objects.filter(role='admin').first()
        
        courses_data = [
            {
                'title': 'Full-Stack Web Development with MERN',
                'description': 'Complete course covering MongoDB, Express.js, React, and Node.js development',
                'category': 'programming',
                'difficulty': 'intermediate',
                'price': Decimal('150000.00'),
                'duration_weeks': 12,
                'module_count': 8,
                'project_count': 3,
                'enrollment_count': 245,
                'rating': Decimal('4.9'),
                'featured': True,
                'status': 'published',
                'instructor': instructor,
            },
            {
                'title': 'Digital Marketing for Tanzanian Businesses',
                'description': 'Learn effective digital marketing strategies tailored for the Tanzanian market',
                'category': 'marketing',
                'difficulty': 'beginner',
                'price': Decimal('85000.00'),
                'duration_weeks': 8,
                'module_count': 6,
                'project_count': 2,
                'enrollment_count': 189,
                'rating': Decimal('4.7'),
                'featured': False,
                'status': 'published',
                'instructor': instructor,
            },
            {
                'title': 'Mobile App Development with React Native',
                'description': 'Build cross-platform mobile applications for Android and iOS',
                'category': 'mobile_development',
                'difficulty': 'intermediate',
                'price': Decimal('200000.00'),
                'duration_weeks': 10,
                'module_count': 10,
                'project_count': 4,
                'enrollment_count': 156,
                'rating': Decimal('4.8'),
                'featured': True,
                'status': 'published',
                'instructor': instructor,
            },
        ]
        
        for course_data in courses_data:
            course, created = Course.objects.get_or_create(
                title=course_data['title'],
                defaults=course_data
            )
            if created:
                self.stdout.write(f'Created course: {course.title}')
                
                # Create sample lessons for each course
                lessons_data = [
                    {'title': 'Introduction and Setup', 'order': 1, 'duration_minutes': 30, 'is_free': True},
                    {'title': 'Core Concepts', 'order': 2, 'duration_minutes': 45, 'is_free': False},
                    {'title': 'Hands-on Project', 'order': 3, 'duration_minutes': 60, 'is_free': False},
                ]
                
                for lesson_data in lessons_data:
                    lesson_data['course'] = course
                    lesson_data['content'] = f"Lesson content for {lesson_data['title']}"
                    Lesson.objects.create(**lesson_data)

    def create_archive_data(self):
        """Create Archive items"""
        admin_user = User.objects.filter(role='admin').first()
        
        archive_data = [
            {
                'title': 'Microsoft Office 2021 Professional',
                'description': 'Complete office productivity suite with Word, Excel, PowerPoint, and Outlook for professional use',
                'version': '2021',
                'category': 'productivity',
                'file_size_display': '3.2 GB',
                'license': 'licensed',
                'platforms': ['windows', 'macos'],
                'download_count': 15420,
                'rating': Decimal('4.9'),
                'featured': True,
                'requirements': 'Windows 10 or later, 4GB RAM, 4GB storage',
                'archived_by': admin_user,
            },
            {
                'title': 'Adobe Photoshop CC 2024',
                'description': 'Industry-standard photo editing and graphic design software for creative professionals',
                'version': '2024',
                'category': 'design',
                'file_size_display': '2.8 GB',
                'license': 'licensed',
                'platforms': ['windows', 'macos'],
                'download_count': 8750,
                'rating': Decimal('4.8'),
                'featured': True,
                'requirements': 'Windows 10 64-bit, 8GB RAM, 20GB storage',
                'archived_by': admin_user,
            },
            {
                'title': 'Visual Studio Code',
                'description': 'Free, powerful code editor with IntelliSense, debugging, and Git integration',
                'version': '1.89.1',
                'category': 'development',
                'file_size_display': '85 MB',
                'license': 'free',
                'platforms': ['windows', 'macos', 'linux'],
                'download_count': 12300,
                'rating': Decimal('4.9'),
                'featured': True,
                'requirements': 'Windows 7 or later, 1GB RAM',
                'archived_by': admin_user,
            },
        ]
        
        for item_data in archive_data:
            archive, created = Archive.objects.get_or_create(
                title=item_data['title'],
                defaults=item_data
            )
            if created:
                self.stdout.write(f'Created archive item: {archive.title}')

    def create_blog_data(self):
        """Create Blog posts and categories"""
        # Create categories
        categories_data = [
            {'name': 'Web Development', 'description': 'Articles about web development technologies and practices'},
            {'name': 'Business', 'description': 'Business insights and strategies'},
            {'name': 'Technology', 'description': 'Latest technology trends and news'},
        ]
        
        for cat_data in categories_data:
            Category.objects.get_or_create(name=cat_data['name'], defaults=cat_data)
        
        # Create blog posts
        author = User.objects.filter(role='admin').first()
        
        posts_data = [
            {
                'title': 'Building Scalable Web Applications with React and Node.js',
                'excerpt': 'Learn how to create modern, scalable web applications using the latest technologies and best practices.',
                'content': '''In today's digital landscape, building scalable web applications is crucial for business success. This comprehensive guide will walk you through the process of creating modern web applications using React for the frontend and Node.js for the backend.

We'll cover essential topics including:

1. Setting up your development environment
2. Creating a robust React architecture
3. Implementing RESTful APIs with Node.js
4. Database design and optimization
5. Authentication and security best practices
6. Deployment strategies and scaling techniques

By the end of this tutorial, you'll have a solid understanding of how to build production-ready web applications that can handle thousands of users.''',
                'author': author,
                'category': 'web_development',
                'read_time': '8 min read',
                'featured': True,
                'status': 'published',
                'tags': ['React', 'Node.js', 'JavaScript', 'Tutorial'],
                'image': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
            },
            {
                'title': 'Digital Transformation for Tanzanian SMEs',
                'excerpt': 'A comprehensive guide to digital transformation strategies specifically tailored for small and medium enterprises in Tanzania.',
                'content': '''Digital transformation is no longer optional for businesses in Tanzania. Small and medium enterprises (SMEs) must embrace digital technologies to remain competitive in today's market.

This guide explores:

1. Understanding the digital landscape in Tanzania
2. Identifying transformation opportunities
3. Building digital capabilities
4. Overcoming common challenges
5. Measuring success and ROI

We'll also share real-world case studies of successful digital transformations by Tanzanian SMEs.''',
                'author': author,
                'category': 'business',
                'read_time': '12 min read',
                'featured': False,
                'status': 'published',
                'tags': ['Digital Transformation', 'SME', 'Tanzania', 'Strategy'],
                'image': 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
            },
        ]
        
        for post_data in posts_data:
            post, created = BlogPost.objects.get_or_create(
                title=post_data['title'],
                defaults=post_data
            )
            if created:
                self.stdout.write(f'Created blog post: {post.title}')

    def create_project_data(self):
        """Create sample projects"""
        client = User.objects.filter(role='client').first()
        admin = User.objects.filter(role='admin').first()
        
        if not client or not admin:
            return
        
        projects_data = [
            {
                'title': 'E-Commerce Mobile App',
                'description': 'Cross-platform mobile application for e-commerce with advanced features',
                'project_type': 'enterprise',
                'category': 'mobile',
                'status': 'in_progress',
                'priority': 'high',
                'client': client,
                'project_manager': admin,
                'budget': Decimal('45000.00'),
                'progress_percentage': 75,
                'technology_stack': ['React Native', 'Node.js', 'MongoDB', 'PayPal API'],
                'requirements': 'Cross-platform mobile application for e-commerce with payment integration, user authentication, and real-time notifications.',
            },
            {
                'title': 'University Portal System',
                'description': 'Comprehensive student management system for university operations',
                'project_type': 'final_year',
                'category': 'web',
                'status': 'review',
                'priority': 'medium',
                'client': client,
                'project_manager': admin,
                'budget': Decimal('8500.00'),
                'progress_percentage': 90,
                'technology_stack': ['MERN Stack', 'Redux', 'JWT Authentication'],
                'requirements': 'Student management system with grade tracking, course enrollment, and administrative features.',
            },
        ]
        
        for project_data in projects_data:
            project, created = Project.objects.get_or_create(
                title=project_data['title'],
                defaults=project_data
            )
            if created:
                self.stdout.write(f'Created project: {project.title}')
                
                # Create milestones for each project
                milestones_data = [
                    {'name': 'Project Setup', 'amount': Decimal('10000.00'), 'status': 'completed', 'order': 1},
                    {'name': 'Core Development', 'amount': Decimal('20000.00'), 'status': 'in_progress', 'order': 2},
                    {'name': 'Testing & Deployment', 'amount': Decimal('15000.00'), 'status': 'pending', 'order': 3},
                ]
                
                for milestone_data in milestones_data:
                    milestone_data['project'] = project
                    milestone_data['due_date'] = '2025-12-31'
                    ProjectMilestone.objects.create(**milestone_data)
