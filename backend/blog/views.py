from rest_framework import generics, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import BlogPost
from .serializers import BlogPostListSerializer, BlogPostDetailSerializer

class BlogPostListView(generics.ListAPIView):
    serializer_class = BlogPostListSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'excerpt', 'tags']
    ordering_fields = ['published_at', 'title']

    def get_queryset(self):
        qs = BlogPost.objects.filter(published=True)
        tag = self.request.query_params.get('tag')
        if tag:
            qs = qs.filter(tags__contains=[tag])
        return qs

class BlogPostDetailView(generics.RetrieveAPIView):
    serializer_class = BlogPostDetailSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return BlogPost.objects.filter(published=True)

class BlogTagListView(APIView):
    def get(self, request):
        tags = set()
        for post in BlogPost.objects.filter(published=True).only('tags'):
            for t in (post.tags or []):
                tags.add(t)
        return Response(sorted(tags))

class RelatedPostsView(generics.ListAPIView):
    serializer_class = BlogPostListSerializer

    def get_queryset(self):
        slug = self.kwargs.get('slug')
        try:
            post = BlogPost.objects.get(slug=slug, published=True)
        except BlogPost.DoesNotExist:
            return BlogPost.objects.none()
        tag_list = post.tags or []
        if not tag_list:
            return BlogPost.objects.filter(published=True).exclude(id=post.id)[:5]
        q = Q()
        for t in tag_list:
            q |= Q(tags__contains=[t])
        return BlogPost.objects.filter(published=True).filter(q).exclude(id=post.id).order_by('-published_at')[:5]
