import sys
import os

# Add the project directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

# Set the Django settings module environment variable
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pritech_vior.settings')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
