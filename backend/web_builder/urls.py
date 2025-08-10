# hosting/backend/web_builder/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, PageViewSet, BlockViewSet

router = DefaultRouter()
router.register(r"projects", ProjectViewSet, basename="builder-project")
router.register(r"pages", PageViewSet, basename="builder-page")
router.register(r"blocks", BlockViewSet, basename="builder-block")

urlpatterns = [
    path("", include(router.urls)),
]
