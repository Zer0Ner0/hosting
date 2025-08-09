from rest_framework import serializers
from .models import HostingPlan, Checkout

class HostingPlanSerializer(serializers.ModelSerializer):
    feature_list = serializers.SerializerMethodField()
    class Meta:
        model = HostingPlan
        fields = ['id','name','price','billing_cycle','category','is_popular','feature_list']
    def get_feature_list(self, obj):
        return obj.feature_list()

class CheckoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Checkout
        fields = ['id', 'user', 'plan', 'created_at']
        read_only_fields = ['id', 'created_at', 'user']
