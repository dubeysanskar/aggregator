from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Count, Sum, Avg
from django.utils import timezone
from datetime import timedelta

from shipments.models import Shipment, ShipmentStatusHistory
from shipments.choices import STATUS_CHOICES


class DashboardOverviewView(APIView):
    """GET /api/v1/dashboard/overview/ — Dashboard stats."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        merchant = getattr(request.user, 'merchant', None)
        if not merchant:
            return Response({'error': 'Merchant profile not found'}, status=400)

        days = int(request.query_params.get('days', 7))
        since = timezone.now() - timedelta(days=days)
        qs = Shipment.objects.filter(merchant=merchant, created_at__gte=since)

        total = qs.count()
        by_status = dict(qs.values_list('status').annotate(c=Count('id')).values_list('status', 'c'))

        # Revenue
        revenue = qs.aggregate(total=Sum('shipping_charge'))['total'] or 0

        # Recent shipments
        recent = qs.order_by('-created_at')[:5]
        recent_data = [{
            'tracking_id': s.tracking_id,
            'recipient_name': s.recipient_name,
            'delivery_city': s.delivery_city,
            'status': s.status,
            'created_at': s.created_at.isoformat(),
            'courier': s.courier_partner.name if s.courier_partner else 'Unassigned',
        } for s in recent.select_related('courier_partner')]

        # Courier performance
        courier_perf = (
            qs.values('courier_partner__name')
            .annotate(
                total=Count('id'),
                delivered=Count('id', filter=Q(status='DELIVERED')),
            )
            .order_by('-total')[:5]
        )

        return Response({
            'total_shipments': total,
            'in_transit': by_status.get('IN_TRANSIT', 0),
            'delivered': by_status.get('DELIVERED', 0),
            'ndr': by_status.get('DELIVERY_ATTEMPTED', 0) + by_status.get('FAILED', 0),
            'rto': by_status.get('RTO_INITIATED', 0) + by_status.get('RTO_IN_TRANSIT', 0) + by_status.get('RETURNED', 0),
            'out_for_delivery': by_status.get('OUT_FOR_DELIVERY', 0),
            'revenue': float(revenue),
            'recent_shipments': recent_data,
            'courier_performance': list(courier_perf),
            'period_days': days,
        })
