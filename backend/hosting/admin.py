# backend/hosting/admin.py
from django.contrib import admin
from .models import HostingPlan, PlanSpec, CustomerProfile
from django.contrib import admin

class PlanSpecInline(admin.TabularInline):
    model = PlanSpec
    extra = 1
    fields = ("order", "label", "value", "icon")
    ordering = ("order",)

@admin.register(HostingPlan)
class HostingPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'billing_cycle', 'is_popular')
    list_filter = ('category', 'is_popular')
    search_fields = ('name',)
    inlines = [PlanSpecInline]

@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "phone_country_code", "phone_number", "country", "created_at")
    search_fields = ("user__email", "phone_number", "company", "city", "state", "country")