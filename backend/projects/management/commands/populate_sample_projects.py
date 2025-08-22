from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import datetime, timedelta
from decimal import Decimal
import random

from projects.models import (
    Project, ProjectRequest, ProjectTemplate, ProjectCategory,
    TechnologyStack, ServicePackage, CourseCategory, ProjectMilestone,
    ProjectRequestCommunication
)

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate database with sample projects, requests, and related data'

    def handle(self, *args, **options):
        self.stdout.write('Starting sample projects population...')
        
        # Create some sample users if they don't exist
        self.create_sample_users()
        
        # Create sample project requests
        self.create_sample_project_requests()
        
        # Create sample projects
        self.create_sample_projects()
        
        self.stdout.write(self.style.SUCCESS('Sample projects population completed successfully!'))

    def create_sample_users(self):
        """Create sample users for testing"""
        self.stdout.write('Creating sample users...')
        
        # Create admin user if doesn't exist
        if not User.objects.filter(username='admin').exists():
            admin_user = User.objects.create_superuser(
                username='admin',
                email='admin@pritechvior.com',
                password='admin123',
                first_name='Admin',
                last_name='User'
            )
            self.stdout.write(f'Created admin user: {admin_user.username}')

        # Create sample clients
        sample_clients = [
            {
                'username': 'john_student',
                'email': 'john@student.ac.tz',
                'first_name': 'John',
                'last_name': 'Mwamba',
                'password': 'student123'
            },
            {
                'username': 'sarah_business',
                'email': 'sarah@techcorp.co.tz',
                'first_name': 'Sarah',
                'last_name': 'Hassan',
                'password': 'business123'
            },
            {
                'username': 'david_client',
                'email': 'david@gmail.com',
                'first_name': 'David',
                'last_name': 'Kimaro',
                'password': 'client123'
            },
            {
                'username': 'grace_student',
                'email': 'grace@udsm.ac.tz',
                'first_name': 'Grace',
                'last_name': 'Mkoba',
                'password': 'student123'
            }
        ]

        for client_data in sample_clients:
            if not User.objects.filter(username=client_data['username']).exists():
                user = User.objects.create_user(**client_data)
                self.stdout.write(f'Created user: {user.username}')

        # Create sample staff members
        sample_staff = [
            {
                'username': 'project_manager',
                'email': 'pm@pritechvior.com',
                'first_name': 'Michael',
                'last_name': 'Mwalimu',
                'password': 'staff123',
                'is_staff': True
            },
            {
                'username': 'developer1',
                'email': 'dev1@pritechvior.com',
                'first_name': 'Emmanuel',
                'last_name': 'Ngowi',
                'password': 'staff123',
                'is_staff': True
            },
            {
                'username': 'developer2',
                'email': 'dev2@pritechvior.com',
                'first_name': 'Amina',
                'last_name': 'Said',
                'password': 'staff123',
                'is_staff': True
            }
        ]

        for staff_data in sample_staff:
            if not User.objects.filter(username=staff_data['username']).exists():
                user = User.objects.create_user(**staff_data)
                self.stdout.write(f'Created staff user: {user.username}')

    def create_sample_project_requests(self):
        """Create sample project requests"""
        self.stdout.write('Creating sample project requests...')
        
        # Get users and other dependencies
        try:
            student_user = User.objects.get(username='john_student')
            business_user = User.objects.get(username='sarah_business')
            client_user = User.objects.get(username='david_client')
            staff_user = User.objects.get(username='project_manager')
            
            web_category = ProjectCategory.objects.get(slug='web-development')
            mobile_category = ProjectCategory.objects.get(slug='mobile-development')
            ecommerce_category = ProjectCategory.objects.get(slug='e-commerce')
            
            # Get available technologies
            react_tech = TechnologyStack.objects.filter(name__icontains='React').first()
            django_tech = TechnologyStack.objects.filter(name__icontains='Django').first()
            javascript_tech = TechnologyStack.objects.filter(name__icontains='JavaScript').first()
            
            # Get service packages
            student_package = ServicePackage.objects.filter(user_type='student').first()
            business_package = ServicePackage.objects.filter(user_type='business').first()
            
            # Get course category
            course_category = CourseCategory.objects.first()
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error getting dependencies: {e}'))
            return

        sample_requests = [
            {
                'title': 'Student Management System for University',
                'description': 'Need a web-based student management system for my final year project. Should include student registration, course enrollment, grade management, and reporting features.',
                'client': student_user,
                'user_type': 'student',
                'status': 'reviewing',
                'course_category': course_category,
                'academic_level': 'undergraduate',
                'institution': 'University of Dar es Salaam',
                'service_package': student_package,
                'budget_range': 'TSH 50,000 - 100,000',
                'preferred_deadline': timezone.now().date() + timedelta(days=45),
                'timeline_flexibility': 'somewhat_flexible',
                'requirements': 'Must include user authentication, responsive design, and basic reporting features.',
                'additional_features': 'Would like to have email notifications and data export functionality.',
                'contact_phone': '+255 754 123 456',
                'contact_email': 'john@student.ac.tz',
                'assigned_to': staff_user,
                'estimated_cost': Decimal('75000.00'),
                'estimated_duration': 30,
                'technologies': [tech for tech in [react_tech, django_tech] if tech]
            },
            {
                'title': 'E-Commerce Mobile App for Local Business',
                'description': 'Looking for a mobile app to sell traditional Tanzanian crafts online. Need both customer app and admin panel for inventory management.',
                'client': business_user,
                'user_type': 'business',
                'status': 'quoted',
                'service_package': business_package,
                'budget_range': 'TSH 2,000,000 - 5,000,000',
                'preferred_deadline': timezone.now().date() + timedelta(days=90),
                'timeline_flexibility': 'flexible',
                'requirements': 'Mobile app for Android and iOS, payment integration with mobile money, inventory management, order tracking.',
                'additional_features': 'Push notifications, analytics dashboard, customer reviews and ratings.',
                'contact_phone': '+255 789 456 123',
                'contact_email': 'sarah@techcorp.co.tz',
                'assigned_to': staff_user,
                'estimated_cost': Decimal('3500000.00'),
                'quoted_price': Decimal('3200000.00'),
                'estimated_duration': 75,
                'technologies': [tech for tech in [javascript_tech, django_tech] if tech]
            },
            {
                'title': 'Personal Portfolio Website',
                'description': 'Need a modern, responsive portfolio website to showcase my photography work. Should have gallery, about section, and contact form.',
                'client': client_user,
                'user_type': 'client',
                'status': 'approved',
                'budget_range': 'TSH 300,000 - 500,000',
                'preferred_deadline': timezone.now().date() + timedelta(days=21),
                'timeline_flexibility': 'strict',
                'requirements': 'Responsive design, image gallery with lightbox, contact form, SEO optimized.',
                'additional_features': 'Blog section, social media integration, Google Analytics.',
                'contact_phone': '+255 713 789 456',
                'contact_email': 'david@gmail.com',
                'assigned_to': staff_user,
                'estimated_cost': Decimal('400000.00'),
                'quoted_price': Decimal('380000.00'),
                'estimated_duration': 14,
                'technologies': [tech for tech in [react_tech] if tech]
            },
            {
                'title': 'Library Management System',
                'description': 'Academic project for Information Systems course. Need a web application for managing library books, members, and borrowing records.',
                'client': User.objects.get(username='grace_student'),
                'user_type': 'student',
                'status': 'pending',
                'course_category': course_category,
                'academic_level': 'undergraduate',
                'institution': 'University of Dodoma',
                'service_package': student_package,
                'budget_range': 'TSH 60,000 - 120,000',
                'preferred_deadline': timezone.now().date() + timedelta(days=60),
                'timeline_flexibility': 'flexible',
                'requirements': 'Book catalog, member management, borrowing/return tracking, search functionality.',
                'additional_features': 'Fine calculation, book reservation system, reports generation.',
                'contact_phone': '+255 765 234 567',
                'contact_email': 'grace@udsm.ac.tz',
                'estimated_duration': 35,
                'technologies': [react_tech, django_tech]
            }
        ]

        for request_data in sample_requests:
            technologies = request_data.pop('technologies', [])
            request_obj = ProjectRequest.objects.create(**request_data)
            if technologies:
                request_obj.preferred_technologies.set(technologies)
            
            # Add some communication records
            self.create_sample_communications(request_obj)
            
            self.stdout.write(f'Created project request: {request_obj.title}')

    def create_sample_communications(self, project_request):
        """Create sample communications for a project request"""
        try:
            staff_user = User.objects.get(username='project_manager')
            
            # Initial client message
            ProjectRequestCommunication.objects.create(
                request=project_request,
                sender=project_request.client,
                sender_type='client',
                message=f"Hello, I'm interested in getting help with {project_request.title.lower()}. Please let me know if you need any additional information.",
                created_at=project_request.created_at + timedelta(minutes=30)
            )
            
            # Staff response
            ProjectRequestCommunication.objects.create(
                request=project_request,
                sender=staff_user,
                sender_type='staff',
                message="Thank you for your request! We've reviewed your requirements and will provide a detailed quote within 24 hours. The project looks feasible and aligns well with our expertise.",
                created_at=project_request.created_at + timedelta(hours=4)
            )
            
            if project_request.status in ['quoted', 'approved']:
                # Follow-up message
                ProjectRequestCommunication.objects.create(
                    request=project_request,
                    sender=staff_user,
                    sender_type='staff',
                    message=f"We've prepared a detailed quote for your project. The estimated cost is TSH {project_request.estimated_cost:,} and will take approximately {project_request.estimated_duration} days to complete. Please review and let us know if you have any questions.",
                    created_at=project_request.created_at + timedelta(days=1)
                )
        except Exception as e:
            self.stdout.write(f'Error creating communications: {e}')

    def create_sample_projects(self):
        """Create sample projects"""
        self.stdout.write('Creating sample projects...')
        
        try:
            # Get users and dependencies
            student_user = User.objects.get(username='john_student')
            business_user = User.objects.get(username='sarah_business')
            client_user = User.objects.get(username='david_client')
            
            pm_user = User.objects.get(username='project_manager')
            dev1_user = User.objects.get(username='developer1')
            dev2_user = User.objects.get(username='developer2')
            
            web_category = ProjectCategory.objects.get(slug='web-development')
            mobile_category = ProjectCategory.objects.get(slug='mobile-development')
            ecommerce_category = ProjectCategory.objects.get(slug='e-commerce')
            
            # Get available technologies
            react_tech = TechnologyStack.objects.filter(name__icontains='React').first()
            django_tech = TechnologyStack.objects.filter(name__icontains='Django').first()
            javascript_tech = TechnologyStack.objects.filter(name__icontains='JavaScript').first()
            
            course_category = CourseCategory.objects.first()
            
            # Get the approved request to convert to project
            approved_request = ProjectRequest.objects.filter(status='approved').first()
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error getting dependencies: {e}'))
            return

        sample_projects = [
            {
                'title': 'PritechVior Company Website Redesign',
                'description': 'Complete redesign and development of the company website with modern UI/UX, responsive design, and content management system.',
                'client': business_user,
                'user_type': 'business',
                'category': web_category,
                'status': 'in_progress',
                'priority': 'high',
                'project_manager': pm_user,
                'start_date': timezone.now().date() - timedelta(days=15),
                'end_date': timezone.now().date() + timedelta(days=30),
                'deadline': timezone.now().date() + timedelta(days=35),
                'budget': Decimal('2500000.00'),
                'estimated_cost': Decimal('2300000.00'),
                'progress_percentage': 65,
                'requirements': 'Modern responsive design, CMS integration, SEO optimization, contact forms, service pages, portfolio showcase.',
                'contact_phone': '+255 789 456 123',
                'contact_email': 'sarah@techcorp.co.tz',
                'technologies': [tech for tech in [react_tech, django_tech] if tech],
                'assigned_users': [dev1_user, dev2_user]
            },
            {
                'title': 'Student Grade Management System',
                'description': 'Web-based system for managing student grades, courses, and academic records for university use.',
                'client': student_user,
                'user_type': 'student',
                'category': web_category,
                'course_category': course_category,
                'academic_level': 'undergraduate',
                'status': 'review',
                'priority': 'medium',
                'project_manager': pm_user,
                'start_date': timezone.now().date() - timedelta(days=25),
                'end_date': timezone.now().date() + timedelta(days=5),
                'deadline': timezone.now().date() + timedelta(days=10),
                'budget': Decimal('85000.00'),
                'estimated_cost': Decimal('75000.00'),
                'progress_percentage': 85,
                'requirements': 'User authentication, grade entry, report generation, student dashboard, admin panel.',
                'contact_phone': '+255 754 123 456',
                'contact_email': 'john@student.ac.tz',
                'technologies': [tech for tech in [django_tech, javascript_tech] if tech],
                'technologies': [react_tech, django_tech],
                'assigned_users': [dev1_user],
                'source_request': approved_request
            },
            {
                'title': 'Real Estate Listing Platform',
                'description': 'Online platform for listing and searching real estate properties in Tanzania with advanced filtering and map integration.',
                'client': client_user,
                'user_type': 'client',
                'category': web_category,
                'status': 'completed',
                'priority': 'medium',
                'project_manager': pm_user,
                'start_date': timezone.now().date() - timedelta(days=60),
                'end_date': timezone.now().date() - timedelta(days=5),
                'deadline': timezone.now().date() - timedelta(days=3),
                'budget': Decimal('1800000.00'),
                'estimated_cost': Decimal('1650000.00'),
                'progress_percentage': 100,
                'requirements': 'Property listings, search and filtering, map integration, user accounts, admin panel, payment integration.',
                'contact_phone': '+255 713 789 456',
                'contact_email': 'david@gmail.com',
                'technologies': [tech for tech in [react_tech, django_tech, javascript_tech] if tech],
                'assigned_users': [dev1_user, dev2_user],
                'repository_url': 'https://github.com/pritechvior/realestate-platform',
                'live_demo_url': 'https://realestate.pritechvior.com'
            },
            {
                'title': 'Mobile Banking App UI/UX Design',
                'description': 'Design and prototype for a mobile banking application with focus on user experience and accessibility.',
                'client': business_user,
                'user_type': 'business',
                'category': mobile_category,
                'status': 'planning',
                'priority': 'critical',
                'project_manager': pm_user,
                'start_date': timezone.now().date() + timedelta(days=7),
                'end_date': timezone.now().date() + timedelta(days=42),
                'deadline': timezone.now().date() + timedelta(days=45),
                'budget': Decimal('4500000.00'),
                'estimated_cost': Decimal('4200000.00'),
                'progress_percentage': 5,
                'requirements': 'Mobile UI/UX design, prototype development, user testing, accessibility compliance, security considerations.',
                'contact_phone': '+255 789 456 123',
                'contact_email': 'sarah@techcorp.co.tz',
                'technologies': [react_tech],
                'assigned_users': [dev2_user]
            }
        ]

        for project_data in sample_projects:
            technologies = project_data.pop('technologies', [])
            assigned_users = project_data.pop('assigned_users', [])
            source_request = project_data.pop('source_request', None)
            
            project = Project.objects.create(**project_data)
            
            if technologies:
                project.technologies.set(technologies)
            if assigned_users:
                project.assigned_users.set(assigned_users)
            
            # Link to source request if exists
            if source_request:
                source_request.converted_project = project
                source_request.status = 'converted'
                source_request.save()
            
            # Create milestones for each project
            self.create_sample_milestones(project)
            
            self.stdout.write(f'Created project: {project.title}')

    def create_sample_milestones(self, project):
        """Create sample milestones for a project"""
        base_amount = float(project.budget or project.estimated_cost or 1000000) / 4
        
        milestones_data = [
            {
                'name': 'Project Initiation & Planning',
                'description': 'Initial requirements gathering, project planning, and setup',
                'amount': Decimal(str(base_amount * 0.25)),
                'order': 1
            },
            {
                'name': 'Design & Architecture',
                'description': 'UI/UX design, system architecture, and technical specifications',
                'amount': Decimal(str(base_amount * 0.25)),
                'order': 2
            },
            {
                'name': 'Development Phase 1',
                'description': 'Core functionality development and basic features implementation',
                'amount': Decimal(str(base_amount * 0.30)),
                'order': 3
            },
            {
                'name': 'Final Development & Deployment',
                'description': 'Final features, testing, bug fixes, and deployment',
                'amount': Decimal(str(base_amount * 0.20)),
                'order': 4
            }
        ]

        # Calculate milestone dates based on project timeline
        if project.start_date and project.end_date:
            total_days = (project.end_date - project.start_date).days
            milestone_interval = total_days // 4
            
            for i, milestone_data in enumerate(milestones_data):
                due_date = project.start_date + timedelta(days=(i + 1) * milestone_interval)
                
                # Set status based on project progress and due date
                status = 'pending'
                completed_date = None
                
                if project.status == 'completed':
                    status = 'completed'
                    completed_date = due_date - timedelta(days=random.randint(1, 5))
                elif project.status in ['in_progress', 'review']:
                    progress_ratio = project.progress_percentage / 100
                    milestone_progress = (i + 1) / 4
                    
                    if milestone_progress <= progress_ratio:
                        status = 'completed'
                        completed_date = due_date - timedelta(days=random.randint(1, 3))
                    elif milestone_progress <= progress_ratio + 0.25:
                        status = 'in_progress'
                    elif due_date < timezone.now().date():
                        status = 'overdue'
                
                ProjectMilestone.objects.create(
                    project=project,
                    name=milestone_data['name'],
                    description=milestone_data['description'],
                    amount=milestone_data['amount'],
                    due_date=due_date,
                    completed_date=completed_date,
                    status=status,
                    order=milestone_data['order']
                )
