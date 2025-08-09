from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import HostingPlan, Checkout
from .serializers import HostingPlanSerializer, CheckoutSerializer

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

@api_view(['POST'])
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
