# backend/hosting_backend/api/views.py
import requests
from django.http import JsonResponse
from rest_framework.decorators import api_view

ENOM_USERNAME = 'your_enom_username'
ENOM_PASSWORD = 'your_enom_password'

@api_view(['POST'])
def domain_check(request):
    domain = request.data.get('domain')
    if not domain:
        return JsonResponse({'error': 'No domain provided'}, status=400)

    params = {
        'command': 'check',
        'uid': ENOM_USERNAME,
        'pw': ENOM_PASSWORD,
        'sld': domain.split('.')[0],
        'tld': domain.split('.')[-1],
        'responsetype': 'json'
    }

    try:
        response = requests.get('https://reseller.enom.com/interface.asp', params=params)
        data = response.json()
        available = data.get('interface_response', {}).get('RRPCode') == '210'
        return JsonResponse({'available': available})
    except Exception:
        return JsonResponse({'error': 'API error'}, status=500)
