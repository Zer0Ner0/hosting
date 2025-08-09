from rest_framework import serializers
from .models import BlogPost

class BlogPostListSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'excerpt', 'cover_image_url', 'author_name', 'tags', 'published_at']

class BlogPostDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'excerpt', 'content', 'cover_image_url', 'author_name', 'tags', 'published_at', 'created_at', 'updated_at']
