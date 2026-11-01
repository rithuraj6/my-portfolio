from django.contrib import admin
from .models import FeaturedProject, StoryChronicle

@admin.register(FeaturedProject)
class FeaturedProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "primary_language", "stars_count", "is_featured", "created_at")
    list_filter = ("primary_language", "is_featured")
    search_fields = ("title", "description")


@admin.register(StoryChronicle)
class StoryChronicleAdmin(admin.ModelAdmin):
    list_display = ("period", "title", "year", "order")
    list_editable = ("order",)
    search_fields = ("title", "content", "lesson")
