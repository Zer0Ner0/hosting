# backend/hosting/models.py
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator

class HostingPlan(models.Model):
    CATEGORY_CHOICES = [
        ('web', 'Web Hosting'),
        ('wordpress', 'WordPress Hosting'),
        ('woocommerce', 'WooCommerce Hosting'),
        ('email', 'Email Hosting'),
    ]
    BILLING_CHOICES = [('monthly','Monthly'), ('yearly','Yearly')]

    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    billing_cycle = models.CharField(max_length=10, choices=BILLING_CHOICES, default='monthly')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    features = models.TextField(help_text='Semicolon-separated features')
    is_popular = models.BooleanField(default=False)

    def feature_list(self):
        return [f.strip() for f in self.features.split(';') if f.strip()]

    def __str__(self):
        return f"{self.name} ({self.category})"

class Checkout(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    plan = models.ForeignKey(HostingPlan, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.plan.name}"

class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("failed", "Failed"),
        ("canceled", "Canceled"),
    ]
    user_ref = models.CharField(max_length=255, help_text="Email or sub from NextAuth")
    currency = models.CharField(max_length=10, default="usd")
    total_amount_cents = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user_ref} - {self.status}"

class OrderItem(models.Model):
    ITEM_TYPES = [("plan", "Plan"), ("domain", "Domain")]
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    item_type = models.CharField(max_length=20, choices=ITEM_TYPES)
    name = models.CharField(max_length=255)
    sku = models.CharField(max_length=255, help_text="plan_id or domain name")
    quantity = models.PositiveIntegerField(default=1)
    unit_amount_cents = models.PositiveIntegerField()
    currency = models.CharField(max_length=10, default="usd")

    def line_total_cents(self):
        return self.quantity * self.unit_amount_cents

class Payment(models.Model):
    order = models.OneToOneField(Order, related_name="payment", on_delete=models.CASCADE)
    provider = models.CharField(max_length=50, default="stripe")
    provider_session_id = models.CharField(max_length=255, blank=True, null=True)
    provider_payment_intent = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=50, default="pending")
    amount_cents = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

class CustomerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    phone_country_code = models.CharField(max_length=5)
    phone_number = models.CharField(
        max_length=15,
        validators=[RegexValidator(r"^\d+$", "Digits only")],
    )

    company = models.CharField(max_length=255, blank=True)
    street1 = models.CharField(max_length=255)
    street2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postcode = models.CharField(max_length=20)
    country = models.CharField(max_length=100)

    referral = models.CharField(max_length=255, blank=True)
    support_pin = models.CharField(
        max_length=4,
        blank=True,
        validators=[RegexValidator(r"^\d{4}$", "PIN must be 4 digits")],
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} profile"