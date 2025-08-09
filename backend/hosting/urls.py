from django.urls import path
from .views import get_hosting_plans, get_hosting_plan_detail, create_checkout

urlpatterns = [
    path('plans/', get_hosting_plans, name='get_hosting_plans'),
    path('plans/<int:plan_id>/', get_hosting_plan_detail, name='get_hosting_plan_detail'),
    path('checkout/', create_checkout, name='create_checkout'),
]
