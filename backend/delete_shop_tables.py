#!/usr/bin/env python
"""
Script to delete all shop tables from the database
"""
import os
import sys
import django
from django.conf import settings
from django.db import connection

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pritech_vior.settings')
django.setup()

def delete_shop_tables():
    """Delete all shop-related tables from the database"""
    with connection.cursor() as cursor:
        # Get all table names that start with 'shop_'
        cursor.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name LIKE 'shop_%'
        """)
        
        tables = cursor.fetchall()
        
        if not tables:
            print("No shop tables found.")
            return
        
        print(f"Found {len(tables)} shop tables to delete:")
        for table in tables:
            print(f"  - {table[0]}")
        
        # Disable foreign key constraints temporarily
        cursor.execute("PRAGMA foreign_keys = OFF")
        
        # Drop all shop tables
        for table in tables:
            table_name = table[0]
            print(f"Dropping table: {table_name}")
            cursor.execute(f"DROP TABLE IF EXISTS {table_name}")
        
        # Re-enable foreign key constraints
        cursor.execute("PRAGMA foreign_keys = ON")
        
        print("\nAll shop tables have been deleted successfully!")
        print("You can now run: python manage.py migrate shop")

if __name__ == "__main__":
    delete_shop_tables()
