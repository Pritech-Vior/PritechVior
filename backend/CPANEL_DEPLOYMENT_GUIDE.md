# cPanel Django Deployment Guide

## Prerequisites

- cPanel hosting with Python support
- SSH access (recommended) or File Manager
- Domain/subdomain configured

## Step 1: Upload Files

Upload your entire `backend` folder to your cPanel hosting. You can either:

- Use File Manager in cPanel
- Use FTP/SFTP client
- Use SSH with git clone

## Step 2: Setup Python Environment

### Via SSH Terminal (Recommended):

```bash
# Navigate to your domain's public folder
cd public_html/your-domain-folder

# Create Python virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Install additional packages if needed
pip install gunicorn
pip install whitenoise
```

### Via cPanel Python App Manager (Alternative):

1. Go to cPanel → Software → Python
2. Create Python App
3. Set Python version (3.8+ recommended)
4. Set App directory to your backend folder
5. Install packages from requirements.txt

## Step 3: Database Setup

### For SQLite (Current setup):

```bash
# Navigate to your backend directory
cd /path/to/your/backend

# Activate virtual environment
source venv/bin/activate

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput
```

### For MySQL (Production recommended):

1. Create MySQL database in cPanel
2. Update settings.py with database credentials
3. Run migrations as above

## Step 4: Configure Settings for Production

Create a `production_settings.py` or update `settings.py`:

```python
# Add to settings.py
import os

# Security settings
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com', 'your-server-ip']

# Database (if using MySQL)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'your_database_name',
        'USER': 'your_database_user',
        'PASSWORD': 'your_database_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Add whitenoise for static files
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Add this
    # ... other middleware
]

# CORS settings (if needed for frontend)
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
]

# Security settings
SECURE_SSL_REDIRECT = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
```

## Step 5: Setup Passenger WSGI

The `passenger_wsgi.py` file is already created. Make sure it's in your app root directory.

## Step 6: Configure cPanel Python App

1. Go to cPanel → Software → Python
2. Click "Create Application"
3. Fill in:
   - Python version: 3.8+
   - Application root: `/path/to/your/backend`
   - Application URL: `your-domain.com/api` (or subdomain)
   - Application startup file: `passenger_wsgi.py`
   - Application Entry point: `application`

## Step 7: Environment Variables

Set environment variables in cPanel Python app or create `.env` file:

```bash
DJANGO_SETTINGS_MODULE=pritech_vior.settings
SECRET_KEY=your-secret-key
DEBUG=False
```

## Step 8: Final Commands

```bash
# Navigate to your backend directory
cd /path/to/your/backend

# Activate virtual environment
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput

# Test the application
python manage.py check --deploy
```

## Step 9: Setup .htaccess (if needed)

Create `.htaccess` in your domain root:

```apache
RewriteEngine On
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ /path/to/your/backend/passenger_wsgi.py/$1 [QSA,L]

# Handle static files
RewriteCond %{REQUEST_URI} ^/static/
RewriteRule ^static/(.*)$ /path/to/your/backend/staticfiles/$1 [L]

# Handle media files
RewriteCond %{REQUEST_URI} ^/media/
RewriteRule ^media/(.*)$ /path/to/your/backend/media/$1 [L]
```

## Step 10: Restart Application

In cPanel Python App Manager:

1. Find your application
2. Click "Restart"
3. Check logs for any errors

## Troubleshooting Commands

```bash
# Check Python version
python --version

# Check installed packages
pip list

# Check Django installation
python -c "import django; print(django.get_version())"

# Run Django check
python manage.py check

# Check database connection
python manage.py dbshell

# View application logs
tail -f logs/error.log
tail -f logs/access.log
```

## Common Issues and Solutions

1. **Import Errors**: Make sure all dependencies are in requirements.txt
2. **Static Files Not Loading**: Run `collectstatic` and check STATIC_ROOT
3. **Database Connection**: Verify database credentials and permissions
4. **Permission Errors**: Check file permissions (755 for directories, 644 for files)
5. **Module Not Found**: Ensure virtual environment is activated

## Security Checklist

- [ ] DEBUG = False in production
- [ ] Strong SECRET_KEY
- [ ] ALLOWED_HOSTS configured
- [ ] Database credentials secure
- [ ] Static files served properly
- [ ] CORS configured if needed
- [ ] SSL/HTTPS enabled

## Support URLs

- Django Admin: `https://yourdomain.com/api/admin/`
- API Base: `https://yourdomain.com/api/`
- Health Check: `https://yourdomain.com/api/health/` (if implemented)

Your Django backend should now be live on cPanel!
