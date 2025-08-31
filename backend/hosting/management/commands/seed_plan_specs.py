# hosting/backend/hosting/management/commands/seed_plan_specs.py
from __future__ import annotations

from typing import Dict, List, Tuple, Literal
from django.core.management.base import BaseCommand
from django.db import transaction

from hosting.models import HostingPlan, PlanSpec  # PlanSpec = FK to HostingPlan

Icon = Literal["text", "check", "times"]

# The left column (labels) in exact display order
LABELS: List[str] = [
    "Storage Space",
    "Inodes (Website Files) Allowed",
    "Websites Allowed",
    "Datacenter Locations",
    "CPU Cores",
    "RAM",
    "Free Domain Name",
    "SuperHero Optimized",
    "1-Click WordPress Hosting",
    "Free and Auto SSL (https)",
    "LiteSpeed Cache",
    "Monthly Bandwidth",
    "Parked Domains",
    "Sub Domains",
    "Email Accounts",
    "cPanel Mailbox Quota",
    "Dedicated IP Address",
    "cPanel",
    "Jailed SSH Access",
    "Quic.Cloud CDN",
    "Unlimited FTP Accounts",
    "Unlimited Databases",
    "Multiple PHP Versions",
    "Perl",
    "Web Mail",
    "Nightly/Weekly Backups",
    "Email Sending Limit (Per Hour)",
]

# Helper to shorten tuples: (icon, value) where icon in {"text", "check", "times"}
T = Tuple[Icon, str]

# Values per plan, aligned with LABELS above
# (icon, value): "text" = show value, "check"/"times" = show icon only (value ignored)
PLAN_ROWS: Dict[str, List[T]] = {
    "Starter Cloud": [
        ("text", "Unlimited NVMe RAID 1 (US)"),
        ("text", "250,000"),
        ("text", "1"),
        ("text", "US"),
        ("text", "1"),
        ("text", "1GB"),
        ("times", ""),
        ("text", "Free LiteSpeed!"),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("text", "Unlimited"),
        ("text", "Unlimited"),
        ("text", "Unlimited"),
        ("text", "Unlimited"),
        ("text", "1GB"),
        ("times", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("text", "50"),
    ],
    "Plus Cloud": [
        ("text", "Unlimited NVMe RAID 1 (US)"),
        ("text", "250,000"),
        ("text", "7"),
        ("text", "US"),
        ("text", "2"),
        ("text", "2GB"),
        ("times", ""),
        ("text", "Free LiteSpeed!"),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("text", "Unlimited"),
        ("text", "Unlimited"),
        ("text", "Unlimited"),
        ("text", "Unlimited"),
        ("text", "2GB"),
        ("times", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("text", "50"),
    ],
    "Turbo Cloud": [
        ("text", "Unlimited NVMe RAID 1 (US)"),
        ("text", "500,000"),
        ("text", "Unlimited"),
        ("text", "US"),
        ("text", "3"),
        ("text", "3GB"),
        # Free Domain Name note in your HTML is a text: "24 or 36 month term"
        ("text", "24 or 36 month term"),
        ("text", "Free LiteSpeed!"),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("text", "Unlimited"),
        ("text", "Unlimited"),
        ("text", "Unlimited"),
        ("text", "Unlimited"),
        ("text", "Unlimited"),
        ("times", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("text", "350"),
    ],
    "Business Cloud": [
        ("text", "Unlimited NVMe RAID 1 (US)"),
        ("text", "500,000"),
        ("text", "Unlimited"),
        ("text", "US"),
        ("text", "4"),
        ("text", "4GB"),
        ("text", "24 or 36 month term"),
        ("text", "Free LiteSpeed!"),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("text", "Unlimited"),
        ("text", "Unlimited"),
        ("text", "Unlimited"),
        ("text", "Unlimited"),
        ("text", "Unlimited"),
        ("times", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("text", "350"),
    ],
}


class Command(BaseCommand):
    help = "Seed comparison specs (PlanSpec) for HostingPlan (web category)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete existing PlanSpec rows for affected plans before seeding.",
        )
        parser.add_argument(
            "--category",
            default="web",
            help="Category to seed (default: web).",
        )

    @transaction.atomic
    def handle(self, *args, **opts):
        category = opts["category"]
        reset = opts["reset"]

        # Find all plans we care about by name within the chosen category
        wanted_names = set(PLAN_ROWS.keys())
        plans = (
            HostingPlan.objects
            .filter(category=category, name__in=wanted_names)
            .order_by("id")
        )
        found_names = {p.name for p in plans}

        missing = wanted_names - found_names
        if missing:
            self.stdout.write(self.style.WARNING(
                f"Warning: The following plans were not found in category '{category}': {sorted(missing)}"
            ))

        if reset and plans.exists():
            PlanSpec.objects.filter(plan__in=plans).delete()
            self.stdout.write(self.style.WARNING("Existing PlanSpec rows deleted for matched plans."))

        # Seed per plan
        for plan in plans:
            rows = PLAN_ROWS.get(plan.name, [])
            if not rows:
                self.stdout.write(self.style.WARNING(f"Skip: no rows configured for plan '{plan.name}'"))
                continue

            created, updated = 0, 0
            for idx, (icon, value) in enumerate(rows, start=1):
                label = LABELS[idx - 1]
                order = idx * 10  # 10, 20, 30…

                obj, was_created = PlanSpec.objects.update_or_create(
                    plan=plan,
                    label=label,
                    defaults={
                        "value": value if icon == "text" else "",
                        "icon": icon,
                        "order": order,
                    },
                )
                created += int(was_created)
                updated += int(not was_created)

            self.stdout.write(self.style.SUCCESS(
                f"{plan.name}: {created} created, {updated} updated PlanSpec rows."
            ))

        self.stdout.write(self.style.SUCCESS("Done."))
