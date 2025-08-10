import jwt
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions

class NextAuthJWTAuthentication(BaseAuthentication):
    """
    Accepts Authorization: Bearer <appToken> minted by NextAuth (HS256).
    Creates a local Django user on first seen (username derived from email/sub).
    """
    def authenticate(self, request):
        auth = request.META.get("HTTP_AUTHORIZATION", "")
        if not auth.startswith("Bearer "):
            return None
        token = auth.split(" ", 1)[1].strip()
        try:
            payload = jwt.decode(
                token,
                settings.NEXTAUTH_SECRET,
                algorithms=["HS256"],
                audience="django",
                issuer="nextauth",
            )
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Token expired")
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed("Invalid token")

        email = payload.get("email")
        sub = payload.get("sub")
        if not (email or sub):
            raise exceptions.AuthenticationFailed("Invalid claims")

        # derive a stable username
        base = (email or sub).split("@")[0][:150]
        username = base or f"user_{sub[:12]}"
        user, _ = User.objects.get_or_create(
            username=username,
            defaults={"email": email or ""},
        )
        return (user, None)
