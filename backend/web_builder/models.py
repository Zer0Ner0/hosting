# hosting/backend/web_builder/models.py
from django.conf import settings
from django.db import models


SECTION_CHOICES = [
    ("hero", "Hero"),
    ("features", "Features"),
    ("gallery", "Gallery"),
    ("pricing", "Pricing"),
    ("faq", "FAQ"),
    ("cta", "CTA"),
]


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)

    class Meta:
        abstract = True


class Project(TimestampedModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="projects"
    )
    name = models.CharField(max_length=160)
    template_slug = models.SlugField(max_length=120, db_index=True)
    is_published = models.BooleanField(default=False)
    domain = models.CharField(max_length=255, blank=True, default="")
    settings = models.JSONField(blank=True, null=True)  # theme/options snapshot

    class Meta:
        indexes = [
            models.Index(fields=["user", "template_slug"]),
        ]
        ordering = ["-updated_at", "-id"]

    def __str__(self) -> str:
        return f"{self.name} ({self.user})"


class Page(TimestampedModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="pages")
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=120)
    path = models.CharField(max_length=255, default="/")  # e.g. "/", "/pricing"
    position = models.PositiveIntegerField(default=0)

    meta_title = models.CharField(max_length=255, blank=True, default="")
    meta_description = models.CharField(max_length=300, blank=True, default="")

    class Meta:
        unique_together = ("project", "slug")
        ordering = ["position", "id"]

    def __str__(self) -> str:
        return f"{self.project_id}:{self.slug}"


class Block(TimestampedModel):
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name="blocks")
    key = models.CharField(max_length=32, choices=SECTION_CHOICES)
    enabled = models.BooleanField(default=True)
    position = models.PositiveIntegerField(default=0)
    props = models.JSONField(blank=True, null=True)

    class Meta:
        unique_together = ("page", "key", "position")
        ordering = ["position", "id"]

    def __str__(self) -> str:
        return f"{self.page_id}:{self.key}@{self.position}"
