from django.contrib import admin
from .models import HostingPlan

@admin.register(HostingPlan)
class HostingPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'billing_cycle', 'is_popular')
    list_filter = ('category', 'is_popular')
    search_fields = ('name',)
