from django.contrib import admin
from .models import BlogPost

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'published', 'published_at', 'author_name')
    list_filter = ('published', 'author_name', 'published_at')
    search_fields = ('title', 'excerpt', 'content')
    prepopulated_fields = {"slug": ("title",)}
