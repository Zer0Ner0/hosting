# hosting/backend/web_builder/serializers.py
from typing import Any, Dict, List
from django.db import transaction
from rest_framework import serializers
from .models import Project, Page, Block, SECTION_CHOICES


class ProjectSerializer(serializers.ModelSerializer):
    pages_count = serializers.IntegerField(source="pages.count", read_only=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "template_slug",
            "is_published",
            "domain",
            "settings",
            "pages_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)


class PageSerializer(serializers.ModelSerializer):
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())

    class Meta:
        model = Page
        fields = [
            "id",
            "project",
            "name",
            "slug",
            "path",
            "position",
            "meta_title",
            "meta_description",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]

    def validate_project(self, project: Project) -> Project:
        # Ensure page belongs to the authenticated user
        req = self.context["request"]
        if project.user_id != req.user.id:
            raise serializers.ValidationError("Invalid project.")
        return project


class BlockSerializer(serializers.ModelSerializer):
    page = serializers.PrimaryKeyRelatedField(queryset=Page.objects.all())

    class Meta:
        model = Block
        fields = [
            "id",
            "page",
            "key",
            "enabled",
            "position",
            "props",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]

    def validate_page(self, page: Page) -> Page:
        req = self.context["request"]
        if page.project.user_id != req.user.id:
            raise serializers.ValidationError("Invalid page.")
        return page

    def validate_key(self, value: str) -> str:
        allowed = {k for k, _ in SECTION_CHOICES}
        if value not in allowed:
            raise serializers.ValidationError("Unknown block key.")
        return value


class SyncBlocksSerializer(serializers.Serializer):
    """For POST /pages/{id}/sync-blocks/"""

    replace = serializers.BooleanField(required=False, default=True)
    blocks = serializers.ListField(child=serializers.DictField(), allow_empty=True)

    def validate_blocks(self, blocks: List[Dict[str, Any]]):
        allowed = {k for k, _ in SECTION_CHOICES}
        cleaned = []
        for i, b in enumerate(blocks):
            key = b.get("key")
            if key not in allowed:
                raise serializers.ValidationError(f"Invalid key at index {i}.")
            enabled = bool(b.get("enabled", True))
            position = int(b.get("position", i))
            props = b.get("props", None)
            cleaned.append({"key": key, "enabled": enabled, "position": position, "props": props})
        return cleaned

    def save(self, **kwargs):
        page: Page = self.context["page"]
        req = self.context["request"]

        if page.project.user_id != req.user.id:
            raise serializers.ValidationError("Invalid page.")

        data = self.validated_data
        replace: bool = data["replace"]
        items: List[Dict[str, Any]] = data["blocks"]

        with transaction.atomic():
            if replace:
                page.blocks.all().delete()
            blocks = [
                Block(page=page, key=i["key"], enabled=i["enabled"], position=i["position"], props=i["props"])
                for i in items
            ]
            if blocks:
                Block.objects.bulk_create(blocks)
        return {"count": len(items)}
