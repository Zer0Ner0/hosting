from django.urls import path
from .views import get_hosting_plans

urlpatterns = [
    path('plans/', get_hosting_plans, name='get_hosting_plans'),
]
