"""
Root wsgi.py fallback
Allows 'gunicorn wsgi:application' or 'gunicorn wsgi:app'
"""
from app import application, app
