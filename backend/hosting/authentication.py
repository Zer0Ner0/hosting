# backend/hosting/authentication.py
import jwt
from typing import Optional
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions

AUD = getattr(settings, "NEXTAUTH_JWT_AUD", "django")
ISS = getattr(settings, "NEXTAUTH_JWT_ISS", "nextauth")
SECRET = settings.NEXTAUTH_SECRET  # shared HS256 secret with NextAuth

def _pick_email(payload: dict) -> Optional[str]:
    # NextAuth Credentials flow (our frontend) stores user under token.user
    # but email MAY also be top-level depending on config.
    return (
        payload.get("email")
        or (payload.get("user") or {}).get("email")
        or None
    )

def _derive_username(email: Optional[str], sub: Optional[str]) -> str:
    if email:
        base = email.split("@")[0][:150]
    elif sub:
        base = f"user_{str(sub)[:12]}"
    else:
        base = "user"
    # Keep it simple; let DB uniqueness of username handle collisions via suffixing if needed
    candidate = base
    i = 1
    while User.objects.filter(username=candidate).exists():
        suffix = f"_{i}"
        candidate = f"{base[: (150 - len(suffix))]}{suffix}"
        i += 1
    return candidate

class NextAuthJWTAuthentication(BaseAuthentication):
    """
    Accepts Authorization: Bearer <JWT> minted by NextAuth (HS256).
    Tolerates email either at top-level 'email' or nested as 'user.email'.
    Creates a local Django user on first sighting (username derived deterministically).
    """

    def authenticate(self, request):
        auth = request.META.get("HTTP_AUTHORIZATION", "")
        if not auth or not auth.lower().startswith("bearer "):
            return None

        token = auth.split(" ", 1)[1].strip()
        try:
            payload = jwt.decode(
                token,
                SECRET,
                algorithms=["HS256"],
                audience=AUD,
                issuer=ISS,
                leeway=30,  # clock skew tolerance
            )
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Token expired")
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed("Invalid token")

        email = _pick_email(payload)
        sub = payload.get("sub")
        if not (email or sub):
            raise exceptions.AuthenticationFailed("Invalid claims (missing email/sub)")

        # Prefer existing user by email (if present), else create by derived username
        if email:
            user = User.objects.filter(email__iexact=email).first()
            if not user:
                username = _derive_username(email, sub)
                user = User.objects.create_user(username=username, email=email)
        else:
            username = _derive_username(None, sub)
            user, _ = User.objects.get_or_create(username=username, defaults={"email": ""})

        return (user, None)
