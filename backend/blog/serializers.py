# hosting/backend/blog/serializers.py
from typing import Any
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Tag, BlogPost

User = get_user_model()


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name", "slug")


class UserMiniSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "full_name", "email")

    def get_full_name(self, obj: Any) -> str:
        name = f"{getattr(obj, 'first_name', '')} {getattr(obj, 'last_name', '')}".strip()
        return name or getattr(obj, "username", "")
    

class BlogPostListSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = BlogPost
        fields = ("id", "title", "slug", "excerpt", "cover_image", "published_at", "tags")


class BlogPostDetailSerializer(BlogPostListSerializer):
    author = UserMiniSerializer(read_only=True)
    content = serializers.CharField()

    class Meta(BlogPostListSerializer.Meta):
        fields = BlogPostListSerializer.Meta.fields + ("author", "content")
