from django.db import models

class FeaturedProject(models.Model):
    """Optional database model for custom featured projects."""
    title = models.CharField(max_length=200)
    description = models.TextField()
    github_url = models.URLField(blank=True, null=True)
    live_demo_url = models.URLField(blank=True, null=True)
    primary_language = models.CharField(max_length=100, default="Python")
    stars_count = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-stars_count", "-created_at"]

    def __str__(self):
        return self.title


class StoryChronicle(models.Model):
    """Optional database model for custom story chapters."""
    period = models.CharField(max_length=120)
    year = models.CharField(max_length=50)
    title = models.CharField(max_length=200)
    tagline = models.CharField(max_length=255)
    content = models.TextField()
    lesson = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.period} - {self.title}"
