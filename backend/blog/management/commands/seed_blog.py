# backend/blog/management/commands/seed_blog.py
from __future__ import annotations

from datetime import timedelta
from typing import Dict, List

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandParser
from django.db import transaction
from django.utils import timezone

from blog.models import BlogPost, Tag

User = get_user_model()


POSTS: List[Dict] = [
    {
        "title": "How to Choose the Perfect Domain Name (with Malaysian examples)",
        "excerpt": "Short, memorable, and easy to pronounce — plus .com vs .my and when to use each.",
        "cover_image": "https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?q=80&w=1400&auto=format&fit=crop",
        "tags": ["Domains", "Branding", "DNS"],
        "days_ago": 2,
        "content": """## 5 quick rules
1. Keep it short (≤ 15 chars)  
2. Avoid hyphens & double letters  
3. Pass the **radio test** (easy to say & spell)  
4. Match your market (e.g., `.com` for global, `.my` for Malaysia)  
5. Check trademarks

### Examples
- `kedaimakan.my` — location/market fit  
- `gojekl.com` — short + city hint

### Next steps
Use our search box and add the domain to checkout. We’ll handle DNS + SSL for you.""",
    },
    {
        "title": "Shared vs Cloud Hosting: Which One for Your SME?",
        "excerpt": "Understand resources, isolation, and cost so you don’t overpay (or underpower) your site.",
        "cover_image": "https://images.unsplash.com/photo-1493217465235-252dd9c0d632?q=80&w=1400&auto=format&fit=crop",
        "tags": ["Hosting", "Performance", "Pricing"],
        "days_ago": 4,
        "content": """### TL;DR
- **Shared**: cheapest, great for brochure sites & blogs  
- **Cloud**: scalable, better isolation, traffic spikes ready

### What we recommend
Start shared, monitor, then move to cloud when CPU > 60% or TTFB > 600ms for 3+ days.""",
    },
    {
        "title": "WordPress Hosting: 7 Tweaks for 2× Speed",
        "excerpt": "From object caching to image formats — practical wins you can do in 30 minutes.",
        "cover_image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1400&auto=format&fit=crop",
        "tags": ["WordPress", "Performance", "Caching"],
        "days_ago": 5,
        "content": """1) Enable server-side caching  
2) Install a page cache plugin  
3) Serve images in WebP  
4) Disable unused plugins  
5) Use a lightweight theme  
6) Preload key fonts  
7) Turn on HTTP/2 + Brotli

> We preconfigure OPCache & Brotli on our WordPress plans.""",
    },
    {
        "title": "WooCommerce Hosting Checklist for Faster Checkouts",
        "excerpt": "DB tuning, PHP workers, and cart fragments — remove bottlenecks that kill conversion.",
        "cover_image": "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1400&auto=format&fit=crop",
        "tags": ["WooCommerce", "Performance", "MySQL"],
        "days_ago": 7,
        "content": """### Key checks
- Increase **PHP workers** for concurrency  
- Turn on **object cache** for sessions  
- Optimize MySQL (innodb_buffer_pool_size)  
- Limit heavy plugins at checkout

We provide tuned MySQL defaults on Business plans.""",
    },
    {
        "title": "Setting Up Professional Email with Your Domain",
        "excerpt": "MX, SPF, DKIM, DMARC — the 4 DNS records that protect your brand and deliverability.",
        "cover_image": "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?q=80&w=1400&auto=format&fit=crop",
        "tags": ["Email", "DNS", "Security"],
        "days_ago": 9,
        "content": """Add these DNS records:
- **MX** → your mail server
- **SPF** → allowed senders
- **DKIM** → cryptographic signature
- **DMARC** → policy & reporting

We generate these for you during email setup.""",
    },
    {
        "title": "Beginner’s Guide to DNS: A, CNAME, and MX Explained",
        "excerpt": "Everything you need to point your domain correctly without breaking your site.",
        "cover_image": "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1400&auto=format&fit=crop",
        "tags": ["DNS", "Domains"],
        "days_ago": 11,
        "content": """- **A** record → IPv4 address
- **CNAME** → alias to another hostname
- **MX** → mail delivery
- **TXT** → verification & SPF

Always set a low TTL while testing (e.g., 300s).""",
    },
    {
        "title": "SSL, HTTPS, and HSTS: Why Your Site Still Shows ‘Not Secure’",
        "excerpt": "Fix mixed content and redirect loops. Lock your padlock the right way.",
        "cover_image": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1400&auto=format&fit=crop",
        "tags": ["Security", "SSL"],
        "days_ago": 13,
        "content": """Checklist:
1) Issue certificate (Let’s Encrypt)  
2) Force HTTPS at the edge  
3) Fix **mixed content** (http assets)  
4) Enable **HSTS** after verifying all subdomains work

We auto-renew your SSL and enable HTTP/2 by default.""",
    },
    {
        "title": "Next.js + Django: A Production-Ready Stack for Hosting Sites",
        "excerpt": "CSR where it matters, API via DRF, and HS256 session sharing with NextAuth.",
        "cover_image": "https://images.unsplash.com/photo-1522252234503-e356532cafd5?q=80&w=1400&auto=format&fit=crop",
        "tags": ["Next.js", "Django", "MySQL"],
        "days_ago": 14,
        "content": """Architecture:
- Next.js (RSC) UI + client islands
- DRF for typed endpoints
- HS256 appToken shared secret (NextAuth ↔ Django)
- MySQL for plans & orders

See our `/checkout` flow for a reference impl.""",
    },
    {
        "title": "Integrating Enom Domain Search: Step-by-Step",
        "excerpt": "NameSpinner & GetNameSuggestions, with batched availability + optional price.",
        "cover_image": "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop",
        "tags": ["Enom", "Domains", "API"],
        "days_ago": 16,
        "content": """Endpoints we expose:
- `/api/domain/check/?domain=` → RRP 210/211
- `/api/domain/suggest/` → NameSpinner
- `/api/domain/suggest2/?includePrice=1` → GetNameSuggestions + Check V2

Frontend `DomainSearchBox.tsx` wires these up.""",
    },
    {
        "title": "Transparent Pricing: How We Calculate Your Hosting Bill",
        "excerpt": "No surprises. What affects your invoice and how to lower it.",
        "cover_image": "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=1400&auto=format&fit=crop",
        "tags": ["Pricing", "Hosting"],
        "days_ago": 18,
        "content": """Your bill = base plan + add-ons (domain, email, backup) − any promo.

**Tips to save**
- Choose yearly billing
- Use free SSL + free migration
- Right-size plan (we’ll help you pick)""",
    },
    {
        "title": "Staging vs Production: Safe Deploys for WordPress & WooCommerce",
        "excerpt": "Avoid breaking live sites — use a staging branch, DB diff, and safe plugin updates.",
        "cover_image": "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=1400&auto=format&fit=crop",
        "tags": ["WordPress", "DevOps"],
        "days_ago": 20,
        "content": """Flow:
1) Clone to staging
2) Update themes/plugins
3) Test checkout (Woo)
4) DB + uploads sync to prod
5) Maintenance window (if needed)

We include one-click staging on Pro plans.""",
    },
]


class Command(BaseCommand):
    help = "Seed demo tags and blog posts. Use --reset to wipe & reseed; --author-email to assign posts to a specific user."

    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete existing blog posts and tags before seeding.",
        )
        parser.add_argument(
            "--author-email",
            type=str,
            help="Email of the author user to assign. If missing, will use first superuser or create a content user.",
        )

    def get_author(self, email: str | None) -> User:
        if email:
            try:
                return User.objects.get(email=email)
            except User.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"User with email {email} not found, falling back…"))
        # Prefer a superuser
        su = User.objects.filter(is_superuser=True).first()
        if su:
            return su
        # Or any user
        any_user = User.objects.first()
        if any_user:
            return any_user
        # Or create a content user
        u = User.objects.create_user(
            username="content",
            email="content@myhosting.local",
            password=None,
        )
        u.set_unusable_password()
        u.save(update_fields=["password"])
        return u

    @transaction.atomic
    def handle(self, *args, **options):
        reset: bool = bool(options.get("reset"))
        email: str | None = options.get("author_email")

        if reset:
            self.stdout.write("Reset requested: deleting existing blog data…")
            # M2M table is auto-cleared via cascades when posts are deleted
            BlogPost.objects.all().delete()
            Tag.objects.all().delete()

        author = self.get_author(email)
        self.stdout.write(f"Using author: {author} ({getattr(author, 'email', '')})")

        # Create tags first (case-insensitive uniqueness by name)
        tag_cache: Dict[str, Tag] = {}
        for post in POSTS:
            for tag_name in post["tags"]:
                key = tag_name.strip().lower()
                if key not in tag_cache:
                    tag_obj, _ = Tag.objects.get_or_create(name=tag_name.strip())
                    tag_cache[key] = tag_obj

        created_posts = 0
        now = timezone.now()

        for p in POSTS:
            bp, created = BlogPost.objects.get_or_create(
                title=p["title"],
                defaults={
                    "excerpt": p["excerpt"],
                    "content": p["content"],
                    "cover_image": p.get("cover_image"),
                    "author": author,
                    "status": BlogPost.PUBLISHED,
                    "published_at": now - timedelta(days=int(p["days_ago"])),
                },
            )
            # If existed, ensure it's published & has a date
            if not created:
                if bp.status != BlogPost.PUBLISHED:
                    bp.status = BlogPost.PUBLISHED
                if not bp.published_at:
                    bp.published_at = now - timedelta(days=int(p["days_ago"]))
                bp.excerpt = p["excerpt"]
                bp.content = p["content"]
                bp.cover_image = p.get("cover_image")
                bp.author = author
                bp.save()

            # M2M tags
            bp.tags.set([tag_cache[t.strip().lower()] for t in p["tags"]])
            created_posts += int(created)

        self.stdout.write(self.style.SUCCESS(f"Done. Tags: {Tag.objects.count()}, Posts created: {created_posts}, Total posts: {BlogPost.objects.count()}"))
