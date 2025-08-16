# hosting/backend/hosting/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import HostingPlan, Checkout, Order, OrderItem, Payment, CustomerProfile
import re


# ---------------- Basic response helpers (Swagger) ----------------

class RegisterResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    email = serializers.EmailField()


class CreateCheckoutRequestSerializer(serializers.Serializer):
    plan_id = serializers.IntegerField()


class DomainCheckResponseSerializer(serializers.Serializer):
    domain = serializers.CharField()
    available = serializers.BooleanField()
    code = serializers.CharField()
    text = serializers.CharField()


class DomainSuggestionItemSerializer(serializers.Serializer):
    sld = serializers.CharField()
    tld = serializers.CharField()
    domain = serializers.CharField()
    available = serializers.BooleanField(required=False)
    score = serializers.IntegerField()


class NameSpinnerResponseSerializer(serializers.Serializer):
    query = serializers.CharField()
    tlds = serializers.CharField()
    suggestions = DomainSuggestionItemSerializer(many=True)


class SimpleSuggestionItemSerializer(serializers.Serializer):
    sld = serializers.CharField()
    tld = serializers.CharField()
    domain = serializers.CharField()
    score = serializers.FloatField()


class NameSuggestionsResponseSerializer(serializers.Serializer):
    query = serializers.CharField()
    tlds = serializers.CharField()
    count = serializers.IntegerField()
    suggestions = SimpleSuggestionItemSerializer(many=True)


class StripeCheckoutItemSerializer(serializers.Serializer):
    item_type = serializers.CharField()
    name = serializers.CharField()
    sku = serializers.CharField()
    quantity = serializers.IntegerField()
    unit_amount_cents = serializers.IntegerField()
    currency = serializers.CharField()


class CreateStripeCheckoutRequestSerializer(serializers.Serializer):
    items = StripeCheckoutItemSerializer(many=True)
    success_url = serializers.URLField()
    cancel_url = serializers.URLField()


# ---------------- Model serializers ----------------

class HostingPlanSerializer(serializers.ModelSerializer):
    feature_list = serializers.SerializerMethodField()

    class Meta:
        model = HostingPlan
        fields = [
            "id",
            "name",
            "price",
            "billing_cycle",
            "category",
            "is_popular",
            "feature_list",
        ]

    def get_feature_list(self, obj):
        # expects model to implement feature_list(self) -> list[str]
        return obj.feature_list()


class CheckoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Checkout
        fields = ["id", "user", "plan", "created_at"]
        read_only_fields = ["id", "created_at", "user"]


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            "id",
            "item_type",
            "name",
            "sku",
            "quantity",
            "unit_amount_cents",
            "currency",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "user_ref",
            "currency",
            "total_amount_cents",
            "status",
            "created_at",
            "items",
        ]


class PaymentSerializer(serializers.ModelSerializer):
    order = OrderSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = [
            "id",
            "order",
            "provider",
            "provider_session_id",
            "provider_payment_intent",
            "status",
            "amount_cents",
            "created_at",
        ]


# NOTE: CreateStripeCheckoutResponseSerializer must appear
# AFTER OrderSerializer to avoid NameError on import order.
class CreateStripeCheckoutResponseSerializer(serializers.Serializer):
    checkout_url = serializers.URLField()
    order = OrderSerializer()


# ---------------- Registration payload ----------------

class RegisterSerializer(serializers.Serializer):
    # Personal
    firstName = serializers.CharField(max_length=30)
    lastName = serializers.CharField(max_length=30)
    email = serializers.EmailField()
    phoneCountryCode = serializers.CharField()
    phoneNumber = serializers.CharField()

    # Billing
    company = serializers.CharField(required=False, allow_blank=True)
    street1 = serializers.CharField()
    street2 = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField()
    state = serializers.CharField()
    postcode = serializers.CharField()
    country = serializers.CharField()

    # Additional
    referral = serializers.CharField(required=False, allow_blank=True)
    supportPin = serializers.CharField(required=False, allow_blank=True)

    # Security
    password = serializers.CharField(write_only=True)
    confirmPassword = serializers.CharField(write_only=True)

    # --------- validators ---------

    def validate_email(self, v):
        if User.objects.filter(email__iexact=v).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return v

    def validate_supportPin(self, v):
        if v and not re.fullmatch(r"\d{4}", v):
            raise serializers.ValidationError("PIN must be 4 digits")
        return v

    def validate(self, data):
        pwd = data.get("password") or ""
        if data.get("password") != data.get("confirmPassword"):
            raise serializers.ValidationError({"confirmPassword": "Passwords do not match"})
        # minimal strength check (mirrors frontend)
        if not (
            re.search(r"[a-z]", pwd)
            and re.search(r"[A-Z]", pwd)
            and re.search(r"\d", pwd)
            and re.search(r"[^A-Za-z0-9]", pwd)
            and len(pwd) >= 8
        ):
            raise serializers.ValidationError(
                {"password": "Use upper, lower, number, symbol, min 8 chars"}
            )
        return data

    # --------- creation ---------

    def create(self, validated):
        email = validated["email"].strip().lower()
        user = User.objects.create_user(
            username=email,  # use email as username
            email=email,
            password=validated["password"],
            first_name=validated["firstName"],
            last_name=validated["lastName"],
        )
        CustomerProfile.objects.create(
            user=user,
            phone_country_code=validated["phoneCountryCode"],
            phone_number=validated["phoneNumber"],
            company=validated.get("company", ""),
            street1=validated["street1"],
            street2=validated.get("street2", ""),
            city=validated["city"],
            state=validated["state"],
            postcode=validated["postcode"],
            country=validated["country"],
            referral=validated.get("referral", ""),
            support_pin=validated.get("supportPin", ""),
        )
        return user
