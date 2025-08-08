from django.db import models

class HostingPlan(models.Model):
    CATEGORY_CHOICES = [
        ('web', 'Web Hosting'),
        ('wordpress', 'WordPress Hosting'),
        ('woocommerce', 'WooCommerce Hosting'),
        ('email', 'Email Hosting'),
    ]

    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    billing_cycle = models.CharField(max_length=20, default='monthly')  # e.g. monthly, yearly
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    features = models.TextField(help_text='List of features separated by semicolons')
    is_popular = models.BooleanField(default=False)

    def feature_list(self):
        return [f.strip() for f in self.features.split(';') if f.strip()]

    def __str__(self):
        return f"{self.name} ({self.category})"
