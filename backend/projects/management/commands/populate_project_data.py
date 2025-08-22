from django.core.management.base import BaseCommand
from projects.models import (
    ProjectCategory, TechnologyStack, ServicePackage, CourseCategory, ProjectTemplate
)


class Command(BaseCommand):
    help = 'Populate initial data for the projects app'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting data population...'))
        
        # Create Project Categories
        self.create_project_categories()
        
        # Create Technology Stacks
        self.create_technology_stacks()
        
        # Create Course Categories
        self.create_course_categories()
        
        # Create Service Packages
        self.create_service_packages()
        
        # Create Project Templates
        self.create_project_templates()
        
        self.stdout.write(self.style.SUCCESS('Data population completed successfully!'))

    def create_project_categories(self):
        """Create project categories"""
        categories = [
            "Web Development",
            "Mobile Development",
            "Desktop Applications",
            "E-Commerce",
            "Content Management",
            "Learning Management",
            "Business Management",
            "Data Analytics",
            "API Development",
            "Database Design",
        ]
        
        for category_name in categories:
            category, created = ProjectCategory.objects.get_or_create(
                name=category_name,
                defaults={
                    'description': f'{category_name} projects and solutions',
                    'icon': 'code'
                }
            )
            if created:
                self.stdout.write(f'Created category: {category_name}')

    def create_technology_stacks(self):
        """Create technology stacks"""
        technologies = [
            # Frontend
            {"name": "React", "category": "frontend", "description": "JavaScript library for building user interfaces"},
            {"name": "Vue.js", "category": "frontend", "description": "Progressive JavaScript framework"},
            {"name": "Angular", "category": "frontend", "description": "Platform for building mobile and desktop web applications"},
            {"name": "Next.js", "category": "frontend", "description": "React framework for production"},
            {"name": "HTML/CSS", "category": "frontend", "description": "Standard web technologies"},
            {"name": "JavaScript", "category": "frontend", "description": "Programming language for web development"},
            {"name": "TypeScript", "category": "frontend", "description": "Typed superset of JavaScript"},
            
            # Backend
            {"name": "Django", "category": "backend", "description": "High-level Python web framework"},
            {"name": "Node.js", "category": "backend", "description": "JavaScript runtime for server-side development"},
            {"name": "Express.js", "category": "backend", "description": "Web framework for Node.js"},
            {"name": "FastAPI", "category": "backend", "description": "Modern, fast web framework for building APIs with Python"},
            {"name": "Flask", "category": "backend", "description": "Lightweight Python web framework"},
            {"name": "Laravel", "category": "backend", "description": "PHP web application framework"},
            {"name": "Spring Boot", "category": "backend", "description": "Java framework for building applications"},
            
            # Database
            {"name": "PostgreSQL", "category": "database", "description": "Advanced open source relational database"},
            {"name": "MySQL", "category": "database", "description": "Popular open source relational database"},
            {"name": "MongoDB", "category": "database", "description": "NoSQL document database"},
            {"name": "SQLite", "category": "database", "description": "Lightweight relational database"},
            {"name": "Redis", "category": "database", "description": "In-memory data structure store"},
            
            # Mobile
            {"name": "React Native", "category": "mobile", "description": "Framework for building native apps using React"},
            {"name": "Flutter", "category": "mobile", "description": "UI toolkit for building natively compiled applications"},
            {"name": "Ionic", "category": "mobile", "description": "Cross-platform mobile app development framework"},
            {"name": "Xamarin", "category": "mobile", "description": "Microsoft platform for building mobile apps"},
            
            # DevOps
            {"name": "Docker", "category": "devops", "description": "Platform for developing, shipping, and running applications"},
            {"name": "AWS", "category": "devops", "description": "Amazon Web Services cloud platform"},
            {"name": "Heroku", "category": "devops", "description": "Cloud platform for deploying applications"},
            {"name": "Vercel", "category": "devops", "description": "Platform for frontend frameworks and static sites"},
        ]
        
        for tech_data in technologies:
            tech, created = TechnologyStack.objects.get_or_create(
                name=tech_data['name'],
                defaults={
                    'category': tech_data['category'],
                    'description': tech_data['description'],
                    'is_active': True
                }
            )
            if created:
                self.stdout.write(f'Created technology: {tech_data["name"]}')

    def create_course_categories(self):
        """Create course categories for students"""
        categories = [
            "Computer Science",
            "Information Technology",
            "Software Engineering",
            "Computer Engineering",
            "Information Systems",
            "Data Science",
            "Cybersecurity",
            "Network Administration",
            "Web Development",
            "Mobile App Development",
            "Biomedical Engineering",
            "Biomedical Technology",
            "Medical Informatics",
            "Health Information Systems",
            "Mining Engineering",
            "Geological Engineering",
            "Mineral Processing",
            "Mining Technology",
            "Civil Engineering",
            "Structural Engineering",
            "Construction Management",
            "Environmental Engineering",
            "Electrical Engineering",
            "Electronics Engineering",
            "Power Systems Engineering",
            "Telecommunications Engineering",
            "Mechatronics Engineering",
            "Automation Engineering",
            "Robotics Engineering",
            "Control Systems Engineering",
            "Mechanical Engineering",
            "Manufacturing Engineering",
            "Industrial Engineering",
            "Aerospace Engineering",
            "Chemical Engineering",
            "Petroleum Engineering",
            "Materials Engineering",
            "Agricultural Engineering",
            "Food Technology",
            "Business Information Systems",
            "Management Information Systems",
            "E-Commerce Technology",
            "Digital Marketing Technology",
        ]
        
        for category_name in categories:
            category, created = CourseCategory.objects.get_or_create(
                name=category_name,
                defaults={'description': f'{category_name} related projects and coursework'}
            )
            if created:
                self.stdout.write(f'Created course category: {category_name}')

    def create_service_packages(self):
        """Create service packages"""
        packages = [
            # Student packages
            {
                'id': 'title-presentation',
                'name': 'Title & Presentation Only',
                'description': 'Basic project title guidance and presentation tips',
                'price': 25000.00,
                'user_type': 'student',
                'order': 1,
                'features': [
                    'Project title suggestion',
                    'Basic presentation outline',
                    'Formatting guidelines',
                    'Email support'
                ]
            },
            {
                'id': 'basic-support',
                'name': 'Basic Academic Support',
                'description': 'Essential support for academic projects',
                'price': 150000.00,
                'user_type': 'student',
                'order': 2,
                'features': [
                    'Project title suggestion',
                    'Project proposal writing',
                    'Complete proposal development',
                    'Implementation with guidance',
                    'Documentation templates',
                    'Presentation preparation',
                    'Defense preparation',
                    'Email support'
                ]
            },
            {
                'id': 'standard-support',
                'name': 'Standard Academic Support',
                'description': 'Comprehensive support for final year projects',
                'price': 300000.00,
                'user_type': 'student',
                'order': 3,
                'features': [
                    'Everything in Basic Support',
                    'Advanced implementation guidance',
                    'Full documentation package',
                    'Progress monitoring',
                    '2 revision rounds',
                    'Priority support',
                    'Quality assurance',
                    'Technical consultation'
                ]
            },
            {
                'id': 'premium-support',
                'name': 'Premium Academic Support',
                'description': 'Full academic journey support with publication',
                'price': 500000.00,
                'user_type': 'student',
                'order': 4,
                'features': [
                    'Everything in Standard Support',
                    'Research methodology guidance',
                    'Data collection assistance',
                    'Complete implementation',
                    'Academic paper writing',
                    'Conference presentation prep',
                    'Publication support',
                    'Defense coaching',
                    'Unlimited revisions'
                ]
            },
            
            # Client packages
            {
                'id': 'basic-development',
                'name': 'Basic Development',
                'description': 'Simple website or application development',
                'price': 800000.00,
                'user_type': 'client',
                'order': 1,
                'features': [
                    'Custom design and development',
                    'Basic functionality',
                    'Mobile responsive',
                    'Basic SEO setup',
                    '3 months support'
                ]
            },
            {
                'id': 'professional-development',
                'name': 'Professional Development',
                'description': 'Advanced features with business integration',
                'price': 1500000.00,
                'user_type': 'client',
                'order': 2,
                'features': [
                    'Advanced custom development',
                    'Database integration',
                    'User authentication',
                    'Payment integration',
                    'API development',
                    '6 months support'
                ]
            },
            
            # Business packages
            {
                'id': 'enterprise-development',
                'name': 'Enterprise Development',
                'description': 'Full-scale enterprise solutions',
                'price': 3000000.00,
                'user_type': 'business',
                'order': 1,
                'features': [
                    'Enterprise-grade development',
                    'Scalable architecture',
                    'Advanced security',
                    'Integration capabilities',
                    'Performance optimization',
                    '12 months support',
                    'Training included'
                ]
            }
        ]
        
        for package_data in packages:
            package, created = ServicePackage.objects.get_or_create(
                id=package_data['id'],
                defaults={
                    'name': package_data['name'],
                    'description': package_data['description'],
                    'user_type': package_data['user_type'],
                    'price': package_data['price'],
                    'order': package_data['order'],
                    'features': package_data['features']
                }
            )
            if created:
                self.stdout.write(f'Created service package: {package_data["name"]}')

    def create_project_templates(self):
        """Create sample project templates"""
        # Get some categories and technologies for the templates
        web_category = ProjectCategory.objects.filter(name="Web Development").first()
        mobile_category = ProjectCategory.objects.filter(name="Mobile Development").first()
        business_category = ProjectCategory.objects.filter(name="Business Management").first()
        
        react_tech = TechnologyStack.objects.filter(name="React").first()
        django_tech = TechnologyStack.objects.filter(name="Django").first()
        react_native_tech = TechnologyStack.objects.filter(name="React Native").first()
        
        templates = [
            {
                'title': 'Student Management System',
                'slug': 'student-management-system',
                'description': 'Complete student management system with attendance, grades, and reporting',
                'category': business_category,
                'base_price': 800000.00,
                'student_price': 200000.00,
                'features': [
                    'Student registration and profiles',
                    'Attendance tracking',
                    'Grade management',
                    'Report generation',
                    'Parent portal',
                    'Teacher dashboard'
                ],
                'estimated_duration': 45,
                'technologies': [react_tech, django_tech] if react_tech and django_tech else []
            },
            {
                'title': 'E-Commerce Platform',
                'slug': 'ecommerce-platform',
                'description': 'Modern e-commerce platform with payment integration',
                'category': web_category,
                'base_price': 1200000.00,
                'student_price': 300000.00,
                'features': [
                    'Product catalog',
                    'Shopping cart',
                    'Payment processing',
                    'Order management',
                    'User accounts',
                    'Admin dashboard'
                ],
                'estimated_duration': 60,
                'technologies': [react_tech, django_tech] if react_tech and django_tech else []
            },
            {
                'title': 'Task Management App',
                'slug': 'task-management-app',
                'description': 'Mobile task management application with team collaboration',
                'category': mobile_category,
                'base_price': 400000.00,
                'student_price': 100000.00,
                'features': [
                    'Task creation and assignment',
                    'Team collaboration',
                    'Progress tracking',
                    'Notifications',
                    'File attachments',
                    'Offline support'
                ],
                'estimated_duration': 30,
                'technologies': [react_native_tech] if react_native_tech else []
            }
        ]
        
        for template_data in templates:
            template, created = ProjectTemplate.objects.get_or_create(
                slug=template_data['slug'],
                defaults={
                    'title': template_data['title'],
                    'description': template_data['description'],
                    'category': template_data['category'],
                    'base_price': template_data['base_price'],
                    'student_price': template_data['student_price'],
                    'features': template_data['features'],
                    'estimated_duration': template_data['estimated_duration'],
                    'is_featured': True,
                    'status': 'active'
                }
            )
            
            if created and template_data['technologies']:
                template.technologies.set(template_data['technologies'])
                self.stdout.write(f'Created project template: {template_data["title"]}')
