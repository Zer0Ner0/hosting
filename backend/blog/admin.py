# hosting/backend/blog/admin.py
from django.contrib import admin
from .models import Tag, BlogPost


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "created_at")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "published_at", "author")
    list_filter = ("status", "tags")
    search_fields = ("title", "excerpt", "content")
    date_hierarchy = "published_at"
    prepopulated_fields = {"slug": ("title",)}
    autocomplete_fields = ("tags",)
    raw_id_fields = ("author",)
