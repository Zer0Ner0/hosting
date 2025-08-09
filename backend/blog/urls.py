from django.urls import path
from .views import BlogPostListView, BlogPostDetailView, BlogTagListView, RelatedPostsView

urlpatterns = [
    path('', BlogPostListView.as_view(), name='blog-root'),
    path('posts/', BlogPostListView.as_view(), name='blogpost-list'),
    path('posts/<slug:slug>/', BlogPostDetailView.as_view(), name='blogpost-detail'),
    path('tags/', BlogTagListView.as_view(), name='blog-tags'),
    path('posts/<slug:slug>/related/', RelatedPostsView.as_view(), name='blogpost-related'),
]
