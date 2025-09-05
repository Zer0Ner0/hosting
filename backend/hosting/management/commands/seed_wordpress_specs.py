# hosting/backend/hosting/management/commands/seed_plan_specs.py
from __future__ import annotations

from typing import Dict, List, Tuple, Literal
from django.core.management.base import BaseCommand
from django.db import transaction

from hosting.models import HostingPlan, PlanSpec  # PlanSpec = FK to HostingPlan

Icon = Literal["text", "check", "times"]

# The left column (labels) in exact display order
LABELS: List[str] = [
    "Storage",
    "Optimized",
    "LiteSpeed Cache",
    "Free and Auto SSL (https)",
    "Monthly Bandwidth",
    "Parked Domains",
    "Sub Domains",
    "Email Accounts",
    "cPanel",
    "Nightly/Weekly Backups",
    "Auto-Installed WordPress",
    "WordPress Optimized",
]

# Helper to shorten tuples: (icon, value) where icon in {"text", "check", "times"}
T = Tuple[Icon, str]

# Values per plan, aligned with LABELS above
# (icon, value): "text" = show value, "check"/"times" = show icon only (value ignored)
PLAN_ROWS: Dict[str, List[T]] = {
    "Web Hosting": [
        ("text", "Unlimited NVMe RAID 1"),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("text", "Unlimited"),
        ("text", "Unlimited"),
        ("text", "Unlimited"),
        ("text", "Unlimited"),
        ("check", ""),
        ("check", ""),
        ("times", ""),
        ("times", ""),
    ],
    "WordPress Hosting": [
        ("text", "Unlimited NVMe RAID 1"),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("text", "Unlimited"),
        ("text", "Unlimited"),
        ("text", "Unlimited"),
        ("text", "Unlimited"),
        ("check", ""),
        ("check", ""),
        ("check", ""),
        ("check", ""),
    ],
}


class Command(BaseCommand):
    help = "Seed comparison specs (PlanSpec) for WordPress category."

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete existing PlanSpec rows for affected plans before seeding.",
        )
        parser.add_argument(
            "--category",
            default="wordpress",
            help="Category to seed (default: wordpress).",
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
