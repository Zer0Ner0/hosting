# hosting/backend/blog/views.py
from typing import List
from django.db.models import Count, Q
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Tag, BlogPost
from .serializers import TagSerializer, BlogPostListSerializer, BlogPostDetailSerializer


class BlogPostListAPI(generics.ListAPIView):
    serializer_class = BlogPostListSerializer

    def get_queryset(self):
        qs = (
            BlogPost.objects.filter(status=BlogPost.PUBLISHED)
            .select_related("author")
            .prefetch_related("tags")
        )
        tag_slug = self.request.query_params.get("tag")
        if tag_slug:
            qs = qs.filter(tags__slug=tag_slug)
        return qs


class BlogPostDetailAPI(generics.RetrieveAPIView):
    serializer_class = BlogPostDetailSerializer
    lookup_field = "slug"
    queryset = (
        BlogPost.objects.filter(status=BlogPost.PUBLISHED)
        .select_related("author")
        .prefetch_related("tags")
    )


class TagListAPI(generics.ListAPIView):
    serializer_class = TagSerializer

    def get_queryset(self):
        return (
            Tag.objects.annotate(
                published_count=Count("posts", filter=Q(posts__status=BlogPost.PUBLISHED))
            )
            .filter(published_count__gt=0)
            .order_by("name")
        )


class BlogPostRelatedAPI(APIView):
    def get(self, request, slug: str):
        try:
            post = (
                BlogPost.objects.filter(status=BlogPost.PUBLISHED)
                .prefetch_related("tags")
                .get(slug=slug)
            )
        except BlogPost.DoesNotExist:
            return Response({"code": "not_found", "message": "Post not found"}, status=404)

        tag_ids: List[int] = list(post.tags.values_list("id", flat=True))
        if not tag_ids:
            return Response([])

        related = (
            BlogPost.objects.filter(status=BlogPost.PUBLISHED, tags__in=tag_ids)
            .exclude(id=post.id)
            .distinct()
            .order_by("-published_at", "-created_at")[:4]
        )
        data = BlogPostListSerializer(related, many=True).data
        return Response(data)
