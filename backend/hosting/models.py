from django.db import models
from django.contrib.auth.models import User

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