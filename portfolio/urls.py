from django.urls import path
from . import views

app_name = "portfolio"

urlpatterns = [
    path("", views.home_view, name="home"),
    path("story/", views.story_view, name="story"),
    path("projects/", views.projects_view, name="projects"),
    path("contact/", views.contact_view, name="contact"),
    path("api/github-stats/", views.github_stats_api, name="github_stats_api"),
    path("validate-email-domain/",views.validate_email_domain,name="validate_email_domain",),
]
