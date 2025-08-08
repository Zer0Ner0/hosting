from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import HostingPlan
from .serializers import HostingPlanSerializer

@api_view(['GET'])
def get_hosting_plans(request):
    category = request.GET.get('category')
    queryset = HostingPlan.objects.all()
    if category:
        queryset = queryset.filter(category=category)
    serializer = HostingPlanSerializer(queryset, many=True)
    return Response(serializer.data)
