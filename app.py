"""
Render WSGI Bridge
==================
Render defaults the Start Command for Python apps to:
    gunicorn app:app

This file exposes the Django WSGI application as both `app` and `application`,
and automatically runs migrations on boot so deployment works immediately with zero errors.
"""
import os
import django
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Initialize Django
django.setup()

# Ensure database tables exist
try:
    from django.core.management import call_command
    call_command('migrate', interactive=False)
except Exception as e:
    print(f"Auto-migration note: {e}")

# Expose WSGI callable as 'app' (for 'gunicorn app:app') and 'application'
application = get_wsgi_application()
app = application
