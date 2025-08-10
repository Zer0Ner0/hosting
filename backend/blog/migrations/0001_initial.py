# hosting/backend/blog/migrations/0001_initial.py
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="Tag",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=50, unique=True)),
                ("slug", models.SlugField(blank=True, max_length=60, unique=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"ordering": ["name"]},
        ),
        migrations.CreateModel(
            name="BlogPost",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=200)),
                ("slug", models.SlugField(blank=True, max_length=220, unique=True)),
                ("excerpt", models.TextField(blank=True)),
                ("content", models.TextField()),
                ("cover_image", models.URLField(blank=True, null=True)),
                ("status", models.CharField(choices=[("draft", "Draft"), ("published", "Published")], default="draft", max_length=20)),
                ("published_at", models.DateTimeField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("author", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="blog_posts", to="auth.user")),
            ],
            options={"ordering": ["-published_at", "-created_at"]},
        ),
        migrations.AddField(
            model_name="blogpost",
            name="tags",
            field=models.ManyToManyField(blank=True, related_name="posts", to="blog.tag"),
        ),
        migrations.AddIndex(
            model_name="blogpost",
            index=models.Index(fields=["status", "published_at"], name="blog_blogpo_status__b88a67_idx"),
        ),
        migrations.AddIndex(
            model_name="blogpost",
            index=models.Index(fields=["slug"], name="blog_blogpo_slug_2b8fb6_idx"),
        ),
    ]
