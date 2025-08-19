from django.core.management.base import BaseCommand
from users.models import RoleConfiguration


class Command(BaseCommand):
    help = 'Create default role configurations'

    def handle(self, *args, **options):
        # Default role configurations
        default_roles = [
            {
                'role_name': 'guest',
                'is_visible_on_registration': True,
                'display_order': 1,
                'description': 'General access to public content and basic features',
                'icon': 'user'
            },
            {
                'role_name': 'student',
                'is_visible_on_registration': True,
                'display_order': 2,
                'description': 'Access to educational content, courses, and learning materials',
                'icon': 'academic-cap'
            },
            {
                'role_name': 'parent',
                'is_visible_on_registration': True,
                'display_order': 3,
                'description': 'Monitor and support student progress and activities',
                'icon': 'users'
            },
            {
                'role_name': 'trainer',
                'is_visible_on_registration': True,
                'display_order': 4,
                'description': 'Create and manage educational content and courses',
                'icon': 'academic-cap'
            },
            {
                'role_name': 'client',
                'is_visible_on_registration': True,
                'display_order': 5,
                'description': 'Access to client-specific services and project management',
                'icon': 'briefcase'
            },
            {
                'role_name': 'designer',
                'is_visible_on_registration': True,
                'display_order': 6,
                'description': 'Creative tools and design project management',
                'icon': 'color-swatch'
            },
            {
                'role_name': 'writer',
                'is_visible_on_registration': True,
                'display_order': 7,
                'description': 'Content creation and writing project management',
                'icon': 'pencil'
            },
            {
                'role_name': 'technician',
                'is_visible_on_registration': True,
                'display_order': 8,
                'description': 'Technical support and system maintenance access',
                'icon': 'cog'
            },
            {
                'role_name': 'admin',
                'is_visible_on_registration': False,
                'display_order': 9,
                'description': 'Full administrative access to all system features',
                'icon': 'shield-check'
            },
            {
                'role_name': 'treasury',
                'is_visible_on_registration': False,
                'display_order': 10,
                'description': 'Financial management and treasury operations',
                'icon': 'currency-dollar'
            },
            {
                'role_name': 'ceo',
                'is_visible_on_registration': False,
                'display_order': 11,
                'description': 'Executive access to all company operations and data',
                'icon': 'crown'
            },
        ]

        created_count = 0
        for role_data in default_roles:
            role_config, created = RoleConfiguration.objects.get_or_create(
                role_name=role_data['role_name'],
                defaults=role_data
            )
            
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created role configuration: {role_config.role_name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Role configuration already exists: {role_config.role_name}')
                )

        if created_count > 0:
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created {created_count} role configurations')
            )
        else:
            self.stdout.write(
                self.style.WARNING('All role configurations already exist')
            )
