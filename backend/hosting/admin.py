# backend/hosting/admin.py
from django.contrib import admin
from .models import HostingPlan, CustomerProfile

@admin.register(HostingPlan)
class HostingPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'billing_cycle', 'is_popular')
    list_filter = ('category', 'is_popular')
    search_fields = ('name',)

@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "phone_country_code", "phone_number", "country", "created_at")
    search_fields = ("user__email", "phone_number", "company", "city", "state", "country")