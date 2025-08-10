from django.urls import path
from . import views
from .views import get_hosting_plans, get_hosting_plan_detail, create_checkout, check_domain, namespinner_suggest, get_name_suggestions

urlpatterns = [
    path('plans/', get_hosting_plans, name='get_hosting_plans'),
    path('plans/<int:plan_id>/', get_hosting_plan_detail, name='get_hosting_plan_detail'),
    path('checkout/', create_checkout, name='create_checkout'),
    path("api/domain/check/", check_domain, name="check_domain"),
    path("api/domain/suggest/", namespinner_suggest, name="namespinner_suggest"),
    path("api/domain/suggest2/", get_name_suggestions, name="get_name_suggestions"),
]
