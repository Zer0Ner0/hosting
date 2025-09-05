from django.core.management.base import BaseCommand
from hosting.models import HostingPlan

PLANS = [
    {
        "name": "Starter Email",
        "category": "email",
        "billing_cycle": "monthly",
        # Use your own pricing if desired; shown here for convenience.
        "price": 3.95,
        "features": "\n".join([
            "50 GB Email Storage",
            "2 Email Accounts",
            "POP3/IMAP/SMTP",
            "Web Based Email",
            "Superior Spam Protection",
            "Premium Email Deliverability",
            "Integrated Calendar",
            "FREE Migration",
            "30-Day Money-Back",
        ]),
    },
    {
        "name": "Plus Email",
        "category": "email",
        "billing_cycle": "monthly",
        "price": 5.50,
        "features": "\n".join([
            "75 GB Email Storage",
            "5 Email Accounts",
            "POP3/IMAP/SMTP",
            "Web Based Email",
            "Superior Spam Protection",
            "Premium Email Deliverability",
            "Integrated Calendar",
            "FREE Migration",
            "30-Day Money-Back",
        ]),
    },
    {
        "name": "Turbo Email",
        "category": "email",
        "billing_cycle": "monthly",
        "price": 7.72,
        "features": "\n".join([
            "100 GB Email Storage",
            "10 Email Accounts",
            "POP3/IMAP/SMTP",
            "Web Based Email",
            "Superior Spam Protection",
            "Premium Email Deliverability",
            "Integrated Calendar",
            "FREE Migration",
            "30-Day Money-Back",
        ]),
    },
    {
        "name": "Business Email",
        "category": "email",
        "billing_cycle": "monthly",
        "price": 13.28,
        "features": "\n".join([
            "150 GB Email Storage",
            "20 Email Accounts",
            "POP3/IMAP/SMTP",
            "Web Based Email",
            "Superior Spam Protection",
            "Premium Email Deliverability",
            "Integrated Calendar",
            "FREE Migration",
            "30-Day Money-Back",
        ]),
    },
]

class Command(BaseCommand):
    help = "Seed Email Hosting plans (names & benefits) to mirror Hosting Malaysia’s structure."

    def add_arguments(self, parser):
        parser.add_argument("--reset", action="store_true", help="Delete existing 'email' plans before seeding")

    def handle(self, *args, **opts):
        if opts.get("reset"):
            n = HostingPlan.objects.filter(category="email").delete()[0]
            self.stdout.write(self.style.WARNING(f"Deleted {n} existing email plans."))

        for payload in PLANS:
            obj, created = HostingPlan.objects.update_or_create(
                category="email",
                name=payload["name"],
                defaults={
                    "price": payload.get("price"),
                    "billing_cycle": payload.get("billing_cycle", "monthly"),
                    "features": payload.get("features", ""),
                },
            )
            status = "CREATED" if created else "UPDATED"
            self.stdout.write(self.style.SUCCESS(f"{status}: {obj.name}"))

        self.stdout.write(self.style.SUCCESS("Email plans seeding complete."))
