# backend/hosting/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.password_validation import validate_password
from django.db import IntegrityError
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q
from typing import Optional
from .models import HostingPlan, PlanSpec, Checkout, Order, OrderItem, Payment
from .serializers import (
    HostingPlanSerializer,
    HostingPlanWithSpecsSerializer,
    CheckoutSerializer,
    OrderSerializer,
    RegisterResponseSerializer,
    RegisterSerializer,
    CreateCheckoutRequestSerializer,
    DomainCheckResponseSerializer,
    NameSpinnerResponseSerializer,
    NameSuggestionsResponseSerializer,
    CreateStripeCheckoutRequestSerializer,
    CreateStripeCheckoutResponseSerializer,
)
from rest_framework.views import APIView
import re
import requests
import xml.etree.ElementTree as ET
from urllib.parse import urlencode
from django.conf import settings
import stripe
from django.views.decorators.csrf import csrf_exempt
from drf_spectacular.utils import (
    extend_schema,
    OpenApiParameter,
    OpenApiResponse,
    OpenApiTypes,
)


# ---------------- Plans ----------------

@extend_schema(
    tags=["Plans"],
    parameters=[
        OpenApiParameter(name="category", type=OpenApiTypes.STR, required=False, location=OpenApiParameter.QUERY,
                         description="Filter by plan category (e.g. web, wordpress, woocommerce, email)")
    ],
    responses={200: HostingPlanSerializer(many=True)},
    summary="List hosting plans",
)
@api_view(['GET'])
@permission_classes([AllowAny])
def get_hosting_plans(request):
    category = request.GET.get('category')
    qs = HostingPlan.objects.all()
    if category:
        qs = qs.filter(category=category)
    return Response(HostingPlanSerializer(qs, many=True).data)

@extend_schema(
    tags=["Plans"],
    summary="Get comparison specs for plans (by category)",
    responses={200: HostingPlanWithSpecsSerializer(many=True)},
)
@api_view(['GET'])
@permission_classes([AllowAny])
def get_plan_specs(request):
    """
    Returns all plans within an optional ?category=… along with their PlanSpec rows.
    Frontend can build the left column by deduping labels across all specs in 'order'.
    """
    category = request.GET.get('category')
    qs = HostingPlan.objects.all()
    if category:
        qs = qs.filter(category=category)
    qs = qs.prefetch_related("specs")
    data = HostingPlanWithSpecsSerializer(qs, many=True).data
    return Response(data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_hosting_plan_detail(request, plan_id):
    try:
        plan = HostingPlan.objects.get(id=plan_id)
    except HostingPlan.DoesNotExist:
        return Response({'error': 'Plan not found'}, status=status.HTTP_404_NOT_FOUND)
    return Response(HostingPlanSerializer(plan).data)

@extend_schema(
    tags=["Plans"],
    request=CreateCheckoutRequestSerializer,
    responses={201: CheckoutSerializer, 400: OpenApiResponse(description="Missing or invalid plan_id")},
    summary="Create checkout (protected)",
    description="Creates a Checkout record for the authenticated user and selected plan.",
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_checkout(request):
    plan_id = request.data.get('plan_id')
    if not plan_id:
        return Response({'error': 'plan_id is required'}, status=400)
    try:
        plan = HostingPlan.objects.get(id=plan_id)
    except HostingPlan.DoesNotExist:
        return Response({'error': 'Invalid plan ID'}, status=404)
    checkout = Checkout.objects.create(user=request.user, plan=plan)
    return Response(CheckoutSerializer(checkout).data, status=201)

# ---------- Helpers (unchanged) ----------

DOMAIN_RE = re.compile(r"^(?P<sld>[a-z0-9-]{1,63})\.(?P<tld>[a-z0-9.-]{2,63})$", re.I)
RRP_AVAILABLE = "210"

def _enom_get(params: dict, response_type: str = "xml"):
    base = settings.ENOM_BASE_URL.rstrip("/")
    p = {
        **params,
        "uid": settings.ENOM_UID,
        "pw": settings.ENOM_TOKEN,
        "responsetype": response_type,
    }
    url = f"{base}/interface.asp?{urlencode(p)}"
    return requests.get(url, timeout=getattr(settings, "ENOM_TIMEOUT", 10))

# ---------------- Domain ----------------

@extend_schema(
    tags=["Domain"],
    parameters=[
        OpenApiParameter(name="q", type=OpenApiTypes.STR, required=True, location=OpenApiParameter.QUERY,
                         description="Domain to check (e.g. example.com)"),
    ],
    responses={200: DomainCheckResponseSerializer, 400: OpenApiResponse(description="Invalid input"), 502: OpenApiResponse(description="Upstream error")},
    summary="Check if a domain is available",
)
@api_view(["GET"])
@permission_classes([AllowAny])
def check_domain(request):
    q = (request.GET.get("q") or "").strip().lower()
    if not q:
        return Response({"error": "Missing ?q (e.g. ?q=example.com)"}, status=400)

    m = DOMAIN_RE.match(q)
    if not m:
        return Response({"error": "Invalid domain format"}, status=400)

    params = {
        "command": "check",
        "SLD": m.group("sld"),
        "TLD": m.group("tld"),
        "Version": "1",
    }
    try:
        r = _enom_get(params, response_type="xml")
        r.raise_for_status()
    except requests.RequestException as e:
        return Response({"error": f"Upstream error contacting Enom: {e}"}, status=502)

    try:
        root = ET.fromstring(r.text)
        code = (root.findtext("RRPCode") or "").strip()
        text = (root.findtext("RRPText") or "").strip()
        return Response({
            "domain": q,
            "available": code == RRP_AVAILABLE,
            "code": code,
            "text": text,
        })
    except ET.ParseError:
        return Response({"error": "Failed to parse Enom XML response"}, status=502)

@extend_schema(
    tags=["Domain"],
    parameters=[
        OpenApiParameter(name="q", type=OpenApiTypes.STR, required=True, location=OpenApiParameter.QUERY, description="Seed domain (e.g. example.com)"),
        OpenApiParameter(name="tlds", type=OpenApiTypes.STR, required=False, location=OpenApiParameter.QUERY, description="Comma list of TLDs (default: com,net,tv,cc)"),
        OpenApiParameter(name="max", type=OpenApiTypes.INT, required=False, location=OpenApiParameter.QUERY, description="Max results (default: 20)"),
        OpenApiParameter(name="hyphens", type=OpenApiTypes.BOOL, required=False, location=OpenApiParameter.QUERY, description="Allow hyphens (default: false)"),
        OpenApiParameter(name="numbers", type=OpenApiTypes.BOOL, required=False, location=OpenApiParameter.QUERY, description="Allow numbers (default: true)"),
        OpenApiParameter(name="basic", type=OpenApiTypes.STR, required=False, location=OpenApiParameter.QUERY, description="Basic relevance (Low/Medium/High)"),
        OpenApiParameter(name="related", type=OpenApiTypes.STR, required=False, location=OpenApiParameter.QUERY, description="Related relevance"),
        OpenApiParameter(name="similar", type=OpenApiTypes.STR, required=False, location=OpenApiParameter.QUERY, description="Similar relevance"),
        OpenApiParameter(name="topical", type=OpenApiTypes.STR, required=False, location=OpenApiParameter.QUERY, description="Topical relevance"),
    ],
    responses={200: NameSpinnerResponseSerializer, 400: OpenApiResponse(description="Invalid input"), 502: OpenApiResponse(description="Upstream error")},
    summary="Get domain suggestions (NameSpinner)",
)
@api_view(["GET"])
@permission_classes([AllowAny])
def namespinner_suggest(request):
    q = (request.GET.get("q") or "").strip().lower()
    if not q:
        return Response({"error": "Missing ?q"}, status=400)
    m = DOMAIN_RE.match(q)
    if not m:
        return Response({"error": "Invalid domain format"}, status=400)

    sld, tld = m.group("sld"), m.group("tld")
    tld_list = (request.GET.get("tlds") or "com,net,tv,cc").lower()
    params = {
        "command": "NameSpinner",
        "SLD": sld,
        "TLD": tld,
        "TLDList": tld_list,
        "MaxResults": request.GET.get("max", "20"),
        "UseHyphens": str(request.GET.get("hyphens", "false")).capitalize(),
        "UseNumbers": str(request.GET.get("numbers", "true")).capitalize(),
        "Basic": request.GET.get("basic", "Medium"),
        "Related": request.GET.get("related", "High"),
        "Similar": request.GET.get("similar", "Medium"),
        "Topical": request.GET.get("topical", "Medium"),
    }
    try:
        r = _enom_get(params, response_type="xml")
        r.raise_for_status()
    except requests.RequestException as e:
        return Response({"error": f"Upstream error contacting Enom: {e}"}, status=502)

    try:
        root = ET.fromstring(r.text)
        if int(root.findtext("ErrCount") or "0") > 0:
            return Response({"error": root.findtext(".//errors/Err1") or "NameSpinner failed"}, status=502)

        suggestions = []
        for d in root.findall(".//namespin/domains/domain"):
            name = (d.get("name") or "").lower()
            for k in ["com", "net", "tv", "cc"]:
                if k not in tld_list.replace(" ", "").split(","):
                    continue
                suggestions.append({
                    "sld": name,
                    "tld": k,
                    "domain": f"{name}.{k}",
                    "available": (d.get(k) or "").lower() == "y",
                    "score": int(d.get(f"{k}score") or "0"),
                })
        suggestions.sort(key=lambda x: x["score"], reverse=True)
        return Response({"query": q, "tlds": tld_list, "suggestions": suggestions})
    except ET.ParseError:
        return Response({"error": "Failed to parse Enom XML response"}, status=502)

@extend_schema(
    tags=["Domain"],
    parameters=[
        OpenApiParameter(name="q", type=OpenApiTypes.STR, required=True, location=OpenApiParameter.QUERY, description="Search term or domain (e.g. example)"),
        OpenApiParameter(name="tlds", type=OpenApiTypes.STR, required=False, location=OpenApiParameter.QUERY, description="Comma list of TLDs (default: com,net,org,io,co,xyz)"),
        OpenApiParameter(name="max", type=OpenApiTypes.INT, required=False, location=OpenApiParameter.QUERY, description="Max results (default: 40)"),
        OpenApiParameter(name="spinType", type=OpenApiTypes.INT, required=False, location=OpenApiParameter.QUERY, description="Spin type 0-4"),
        OpenApiParameter(name="premium", type=OpenApiTypes.BOOL, required=False, location=OpenApiParameter.QUERY, description="Include premium"),
        OpenApiParameter(name="allga", type=OpenApiTypes.BOOL, required=False, location=OpenApiParameter.QUERY, description="Include all GA TLDs"),
        OpenApiParameter(name="adult", type=OpenApiTypes.BOOL, required=False, location=OpenApiParameter.QUERY, description="Allow adult terms"),
    ],
    responses={200: NameSuggestionsResponseSerializer, 400: OpenApiResponse(description="Invalid input"), 502: OpenApiResponse(description="Upstream error")},
    summary="Get domain suggestions (GetNameSuggestions)",
)
@api_view(["GET"])
@permission_classes([AllowAny])
def get_name_suggestions(request):
    search_term = (request.GET.get("q") or "").strip().lower()
    if not search_term:
        return Response({"error": "Missing ?q"}, status=400)
    tld_list = (request.GET.get("tlds") or "com,net,org,io,co,xyz").lower()

    try:
        r = _enom_get({
            "command": "GetNameSuggestions",
            "SearchTerm": search_term.split(".", 1)[0],
            "TldList": tld_list,
            "MaxResult": request.GET.get("max", "40"),
            "SpinType": request.GET.get("spinType", "0"),
            "Premium": request.GET.get("premium", "false"),
            "AllGA": request.GET.get("allga", "true"),
            "Adult": request.GET.get("adult", "false"),
        }, response_type="text")
        r.raise_for_status()
    except requests.RequestException as e:
        return Response({"error": f"Enom GetNameSuggestions error: {e}"}, status=502)

    pairs = {}
    for line in r.text.splitlines():
        if "=" in line:
            k, v = line.split("=", 1)
            pairs[k.strip()] = v.strip()

    def collect(prefix):
        out = {}
        for k, v in pairs.items():
            if k.startswith(prefix) and k[len(prefix):].isdigit():
                out[int(k[len(prefix):])] = v
        return out

    slds = collect("Sld")
    tlds = collect("Tld")
    scores = collect("Score")

    sugs = []
    for i in sorted(set(slds) & set(tlds)):
        sld = (slds[i] or "").lower()
        tld = (tlds[i] or "").lower().lstrip(".")
        try:
            score = float(scores.get(i, "0") or "0")
        except ValueError:
            score = 0.0
        sugs.append({"sld": sld, "tld": tld, "domain": f"{sld}.{tld}", "score": score})

    return Response({"query": search_term, "tlds": tld_list, "count": len(sugs), "suggestions": sugs})

# ---------------- Stripe/Orders ----------------

stripe.api_key = settings.STRIPE_SECRET_KEY

def _get_user_ref(request):
    email = getattr(request.user, "email", None)
    if email:
        return email
    if isinstance(getattr(request, "auth", None), dict):
        return request.auth.get("email") or request.auth.get("sub") or "guest"
    return "guest"

@extend_schema(
    tags=["Plans"],
    request=CreateStripeCheckoutRequestSerializer,
    responses={201: CreateStripeCheckoutResponseSerializer, 400: OpenApiResponse(description="Bad payload")},
    summary="Create Stripe Checkout Session (protected)",
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_stripe_checkout_session(request):
    """
    Payload example:
    {
      "items": [
        {"item_type":"plan","name":"Web Basic","sku":"plan_3","quantity":1,"unit_amount_cents":299,"currency":"usd"},
        {"item_type":"domain","name":"amirmz.com","sku":"amirmz.com","quantity":1,"unit_amount_cents":999,"currency":"usd"}
      ],
      "success_url": "http://localhost:3000/checkout?success=1&order_id={ORDER_ID}",
      "cancel_url": "http://localhost:3000/cart?canceled=1"
    }
    """
    data = request.data
    items = data.get("items", [])
    success_url = data.get("success_url")
    cancel_url = data.get("cancel_url")
    if not items or not success_url or not cancel_url:
        return Response({"detail": "items, success_url, cancel_url required"}, status=400)

    user_ref = _get_user_ref(request)
    order = Order.objects.create(user_ref=user_ref, currency=settings.STRIPE_CURRENCY, status="pending")
    total = 0
    for it in items:
        qty = int(it.get("quantity", 1))
        amt = int(it.get("unit_amount_cents"))
        OrderItem.objects.create(
            order=order,
            item_type=it.get("item_type"),
            name=it.get("name"),
            sku=it.get("sku"),
            quantity=qty,
            unit_amount_cents=amt,
            currency=it.get("currency", settings.STRIPE_CURRENCY),
        )
        total += qty * amt
    order.total_amount_cents = total
    order.save()

    line_items = [
        {
            "quantity": oi.quantity,
            "price_data": {
                "currency": oi.currency,
                "product_data": {"name": oi.name, "metadata": {"sku": oi.sku, "item_type": oi.item_type}},
                "unit_amount": oi.unit_amount_cents,
            },
        }
        for oi in order.items.all()
    ]

    session = stripe.checkout.Session.create(
        mode="payment",
        line_items=line_items,
        success_url=success_url.replace("{ORDER_ID}", str(order.id)),
        cancel_url=cancel_url,
        metadata={"order_id": str(order.id)},
    )
    Payment.objects.create(order=order, provider_session_id=session.id, status="pending", amount_cents=total)
    return Response({"checkout_url": session.url, "order": OrderSerializer(order).data}, status=status.HTTP_201_CREATED)

@extend_schema(
    tags=["Plans"],
    auth=[],  # Stripe posts here
    request=OpenApiTypes.OBJECT,
    responses={200: OpenApiResponse(description="Acknowledged"), 400: OpenApiResponse(description="Invalid signature")},
    summary="Stripe webhook",
    description="Stripe calls this endpoint. You don't call it directly from the client.",
)
@csrf_exempt
@api_view(["POST"])
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE", "")
    try:
        event = stripe.Webhook.construct_event(
            payload=payload, sig_header=sig_header, secret=settings.STRIPE_WEBHOOK_SECRET
        )
    except Exception as e:
        return Response({"detail": str(e)}, status=400)

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        order_id = session.get("metadata", {}).get("order_id")
        if order_id:
            try:
                order = Order.objects.get(id=order_id)
                order.status = "paid"
                order.save()
                pay = order.payment
                pay.status = "succeeded"
                pay.provider_payment_intent = session.get("payment_intent")
                pay.save()
            except Order.DoesNotExist:
                pass
    return Response({"received": True}, status=200)

# ---------------- Auth ----------------

class RegisterView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        tags=["Auth"],
        request=RegisterSerializer,
        responses={201: RegisterResponseSerializer},
        auth=[],  # public endpoint
        summary="Create a new user account",
        description="Registers a user and creates a CustomerProfile with billing details.",
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"id": user.id, "email": user.email}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def _safe_username_from_email(email: str) -> str:
    base = email.split("@")[0][:150]
    candidate = base
    i = 1
    while User.objects.filter(username=candidate).exists():
        suffix = f"_{i}"
        candidate = f"{base[: (150 - len(suffix))]}{suffix}"
        i += 1
    return candidate

@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    """
    Create a new account.
    Accepts extra fields but uses only: email, password, confirmPassword, firstName, lastName.
    Returns: {id, email, name}
    """
    data = request.data or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    confirm = data.get("confirmPassword") or ""
    first_name = (data.get("firstName") or "").strip()
    last_name = (data.get("lastName") or "").strip()

    if not email or not password:
        return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)
    if confirm and confirm != password:
        return Response({"error": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(email__iexact=email).exists():
        return Response({"error": "Email already in use."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        validate_password(password)
    except Exception as e:
        # e is a ValidationError or list of messages
        return Response({"error": " ".join([str(x) for x in (e.messages if hasattr(e, 'messages') else [e])])},
                        status=status.HTTP_400_BAD_REQUEST)

    username = _safe_username_from_email(email)
    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )
    except IntegrityError:
        return Response({"error": "Could not create user."}, status=status.HTTP_400_BAD_REQUEST)

    name = (user.get_full_name() or "").strip()
    return Response({"id": user.id, "email": user.email, "name": name}, status=status.HTTP_201_CREATED)

@api_view(["POST"])
@permission_classes([AllowAny])
def login_with_email(request):
    """
    Authenticate by email (or username) + password.
    Returns: {id, email, name} for NextAuth Credentials authorize() to accept.
    """
    data = request.data or {}
    identifier = (data.get("email") or data.get("username") or "").strip()
    password = data.get("password") or ""

    if not identifier or not password:
        return Response({"error": "Email/username and password are required."},
                        status=status.HTTP_400_BAD_REQUEST)

    username = identifier
    if "@" in identifier:
        user_obj = User.objects.filter(email__iexact=identifier).first()
        username = user_obj.username if user_obj else identifier  # fall through

    user = authenticate(request, username=username, password=password)
    if not user:
        return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

    name = (user.get_full_name() or "").strip()
    return Response({"id": user.id, "email": user.email, "name": name}, status=status.HTTP_200_OK)