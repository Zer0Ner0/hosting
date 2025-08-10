# hosting/backend/web_builder/admin.py
from django.contrib import admin
from .models import Project, Page, Block


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "user", "template_slug", "is_published", "domain", "updated_at")
    list_filter = ("is_published", "template_slug", "updated_at")
    search_fields = ("name", "domain", "template_slug", "user__email", "user__username")


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ("id", "project", "slug", "path", "position", "updated_at")
    list_filter = ("updated_at",)
    search_fields = ("slug", "path", "project__name")
    ordering = ("project", "position", "id")


@admin.register(Block)
class BlockAdmin(admin.ModelAdmin):
    list_display = ("id", "page", "key", "enabled", "position", "updated_at")
    list_filter = ("key", "enabled", "updated_at")
    search_fields = ("page__slug",)
    ordering = ("page", "position", "id")
