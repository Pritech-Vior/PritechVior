#!/usr/bin/env python
import os
import sys
import django

# Add the parent directory to the path so we can import Django settings
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pritech_vior.settings')
django.setup()

from django.db import connection

def clear_migrations_and_apply():
    cursor = connection.cursor()
    
    # List of all possible project-related tables including many-to-many tables
    tables_to_drop = [
        'projects_projectrequestcommunication',
        'projects_projectmilestone', 
        'projects_projectrequest',
        'projects_project',
        'projects_projecttemplate',
        'projects_projectcategory',
        'projects_technologystack',
        'projects_servicepackage',
        'projects_coursecategory',
        'projects_project_assigned_users',
        'projects_project_technologies',
        'projects_projecttemplate_technologies',
        'projects_projectrequest_preferred_technologies',
        'projects_projectrequest_service_package',
        'projects_project_service_package',
        'projects_projectrequest_template',
        'projects_project_template'
    ]
    
    # Drop all tables
    for table in tables_to_drop:
        try:
            cursor.execute(f'DROP TABLE IF EXISTS {table}')
            print(f'✓ Dropped table: {table}')
        except Exception as e:
            print(f'Note: Could not drop {table}: {e}')
    
    # Clear project migration records
    try:
        cursor.execute('DELETE FROM django_migrations WHERE app = "projects"')
        print('✓ Cleared project migration records')
    except Exception as e:
        print(f'Note: Could not clear migration records: {e}')
    
    # Close the cursor
    cursor.close()
    
    print('✓ All project tables and migration records cleared')
    print('Now run: python manage.py migrate projects')

if __name__ == '__main__':
    clear_migrations_and_apply()
