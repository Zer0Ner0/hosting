# hosting/backend/web_builder/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Project, Page, Block
from .serializers import (
    ProjectSerializer,
    PageSerializer,
    BlockSerializer,
    SyncBlocksSerializer,
)


class IsOwner(permissions.BasePermission):
    """Object-level permission: only owners can access their objects."""

    def has_object_permission(self, request, view, obj) -> bool:
        if isinstance(obj, Project):
            return obj.user_id == request.user.id
        if isinstance(obj, Page):
            return obj.project.user_id == request.user.id
        if isinstance(obj, Block):
            return obj.page.project.user_id == request.user.id
        return False


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user).order_by("-updated_at", "-id")


class PageViewSet(viewsets.ModelViewSet):
    serializer_class = PageSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        qs = Page.objects.filter(project__user=self.request.user)
        project_id = self.request.query_params.get("project")
        if project_id:
            try:
                qs = qs.filter(project_id=int(project_id))
            except ValueError:
                qs = qs.none()
        return qs.order_by("position", "id")

    @action(detail=True, methods=["post"], url_path="sync-blocks")
    def sync_blocks(self, request, pk=None):
        page = self.get_object()
        ser = SyncBlocksSerializer(data=request.data, context={"request": request, "page": page})
        ser.is_valid(raise_exception=True)
        result = ser.save()
        return Response({"code": "ok", "message": "Blocks synced.", **result}, status=status.HTTP_200_OK)


class BlockViewSet(viewsets.ModelViewSet):
    serializer_class = BlockSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        qs = Block.objects.filter(page__project__user=self.request.user)
        page_id = self.request.query_params.get("page")
        if page_id:
            try:
                qs = qs.filter(page_id=int(page_id))
            except ValueError:
                qs = qs.none()
        return qs.order_by("position", "id")
