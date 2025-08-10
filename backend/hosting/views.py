from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import HostingPlan, Checkout
from .serializers import HostingPlanSerializer, CheckoutSerializer

import re
import requests
import xml.etree.ElementTree as ET
from urllib.parse import urlencode
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.http import require_GET

@api_view(['GET'])
@permission_classes([AllowAny])
def get_hosting_plans(request):
    category = request.GET.get('category')
    qs = HostingPlan.objects.all()
    if category:
        qs = qs.filter(category=category)
    return Response(HostingPlanSerializer(qs, many=True).data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_hosting_plan_detail(request, plan_id):
    try:
        plan = HostingPlan.objects.get(id=plan_id)
    except HostingPlan.DoesNotExist:
        return Response({'error': 'Plan not found'}, status=status.HTTP_404_NOT_FOUND)
    return Response(HostingPlanSerializer(plan).data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_checkout(request):
    # request.user is the Google-signed-in user (auto-provisioned)
    plan_id = request.data.get('plan_id')
    if not plan_id:
        return Response({'error': 'plan_id is required'}, status=400)
    try:
        plan = HostingPlan.objects.get(id=plan_id)
    except HostingPlan.DoesNotExist:
        return Response({'error': 'Invalid plan ID'}, status=404)
    checkout = Checkout.objects.create(user=request.user, plan=plan)
    return Response(CheckoutSerializer(checkout).data, status=201)

# ---------- Helpers

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

# ---------- 1) /api/domain/check/

@require_GET
def check_domain(request):
    q = (request.GET.get("q") or "").strip().lower()
    if not q:
        return JsonResponse({"error": "Missing ?q (e.g. ?q=example.com)"}, status=400)

    m = DOMAIN_RE.match(q)
    if not m:
        return JsonResponse({"error": "Invalid domain format"}, status=400)

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
        return JsonResponse({"error": f"Upstream error contacting Enom: {e}"}, status=502)

    try:
        root = ET.fromstring(r.text)
        code = (root.findtext("RRPCode") or "").strip()
        text = (root.findtext("RRPText") or "").strip()
        return JsonResponse({
            "domain": q,
            "available": code == RRP_AVAILABLE,
            "code": code,
            "text": text,
        })
    except ET.ParseError:
        return JsonResponse({"error": "Failed to parse Enom XML response"}, status=502)

# ---------- 2) /api/domain/suggest/ (NameSpinner)

@require_GET
def namespinner_suggest(request):
    q = (request.GET.get("q") or "").strip().lower()
    if not q:
        return JsonResponse({"error": "Missing ?q"}, status=400)
    m = DOMAIN_RE.match(q)
    if not m:
        return JsonResponse({"error": "Invalid domain format"}, status=400)

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
        return JsonResponse({"error": f"Upstream error contacting Enom: {e}"}, status=502)

    try:
        root = ET.fromstring(r.text)
        if int(root.findtext("ErrCount") or "0") > 0:
            return JsonResponse({"error": root.findtext(".//errors/Err1") or "NameSpinner failed"}, status=502)

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
        return JsonResponse({"query": q, "tlds": tld_list, "suggestions": suggestions})
    except ET.ParseError:
        return JsonResponse({"error": "Failed to parse Enom XML response"}, status=502)

# ---------- 3) /api/domain/suggest2/ (GetNameSuggestions + price)

@require_GET
def get_name_suggestions(request):
    # Minimal version: just wire the function so imports work.
    # (You can paste the full advanced version I sent earlier if you want pricing.)
    search_term = (request.GET.get("q") or "").strip().lower()
    if not search_term:
        return JsonResponse({"error": "Missing ?q"}, status=400)
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
        return JsonResponse({"error": f"Enom GetNameSuggestions error: {e}"}, status=502)

    # Parse simple key=value text
    pairs = {}
    for line in r.text.splitlines():
        if "=" in line:
            k, v = line.split("=", 1)
            pairs[k.strip()] = v.strip()

    # Collect Sld#, Tld#, Score#
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

    return JsonResponse({"query": search_term, "tlds": tld_list, "count": len(sugs), "suggestions": sugs})