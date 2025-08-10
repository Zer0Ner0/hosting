# hosting/backend/blog/urls.py
from django.urls import path
from .views import (
    BlogPostListAPI,
    BlogPostDetailAPI,
    TagListAPI,
    BlogPostRelatedAPI,
)

urlpatterns = [
    path("posts/", BlogPostListAPI.as_view(), name="blogpost-list"),
    path("posts/<slug:slug>/", BlogPostDetailAPI.as_view(), name="blogpost-detail"),
    path("tags/", TagListAPI.as_view(), name="blog-tags"),
    path("posts/<slug:slug>/related/", BlogPostRelatedAPI.as_view(), name="blogpost-related"),
]
