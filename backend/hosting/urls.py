# backend/hosting/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Plans & checkout
    path('plans/', views.get_hosting_plans, name='get_hosting_plans'),
    path('plans/<int:plan_id>/', views.get_hosting_plan_detail, name='get_hosting_plan_detail'),
    path('checkout/', views.create_checkout, name='create_checkout'),

    # Stripe (optional / keep if you already use)
    path('checkout/session/', views.create_stripe_checkout_session, name='create_stripe_checkout_session'),
    path('checkout/stripe/webhook/', views.stripe_webhook, name='stripe_webhook'),

    # Domain (Enom)
    path('domain/check/', views.check_domain, name='check_domain'),
    path('domain/suggest/', views.namespinner_suggest, name='namespinner_suggest'),
    path('domain/suggest2/', views.get_name_suggestions, name='get_name_suggestions'),

    # 🔐 Auth (manual)
    path('register/', views.RegisterView.as_view(), name='register'), 
    path('login/', views.login_with_email, name='login'),           
]
