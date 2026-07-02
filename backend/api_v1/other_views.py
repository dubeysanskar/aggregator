from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q, Count, Sum

from shipments.models import Shipment, ShipmentStatusHistory
from .serializers import ShipmentListSerializer


class NDRListView(ListAPIView):
    """GET /api/v1/ndr/ — List NDR cases (DELIVERY_ATTEMPTED / FAILED shipments)."""
    serializer_class = ShipmentListSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get_queryset(self):
        merchant = self.request.user.merchant
        qs = Shipment.objects.filter(
            merchant=merchant,
            status__in=['DELIVERY_ATTEMPTED', 'FAILED', 'ON_HOLD'],
        ).select_related('courier_partner')

        courier = self.request.query_params.get('courier')
        if courier:
            qs = qs.filter(courier_partner__code=courier)

        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(
                Q(tracking_id__icontains=search) |
                Q(recipient_name__icontains=search)
            )

        return qs.order_by('-updated_at')


class NDRActionView(APIView):
    """POST /api/v1/ndr/<tracking_id>/action/ — Reattempt or RTO."""
    permission_classes = [IsAuthenticated]

    def post(self, request, tracking_id):
        try:
            shipment = Shipment.objects.get(
                tracking_id=tracking_id,
                merchant=request.user.merchant,
                status__in=['DELIVERY_ATTEMPTED', 'FAILED'],
            )
        except Shipment.DoesNotExist:
            return Response({'error': 'NDR case not found'}, status=404)

        action = request.data.get('action')  # 'reattempt' or 'rto'

        if action == 'reattempt':
            old_status = shipment.status
            shipment.status = 'OUT_FOR_DELIVERY'
            shipment.save(update_fields=['status'])
            ShipmentStatusHistory.objects.create(
                shipment=shipment, from_status=old_status,
                to_status='OUT_FOR_DELIVERY', changed_by=request.user,
                notes='Reattempt requested by merchant',
            )
            return Response({'message': 'Reattempt scheduled', 'status': 'OUT_FOR_DELIVERY'})

        elif action == 'rto':
            old_status = shipment.status
            shipment.status = 'RTO_INITIATED'
            shipment.save(update_fields=['status'])
            ShipmentStatusHistory.objects.create(
                shipment=shipment, from_status=old_status,
                to_status='RTO_INITIATED', changed_by=request.user,
                notes='RTO initiated by merchant',
            )
            return Response({'message': 'RTO initiated', 'status': 'RTO_INITIATED'})

        return Response({'error': 'Invalid action. Use reattempt or rto'}, status=400)


class CODDashboardView(APIView):
    """GET /api/v1/cod/dashboard/ — COD summary."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        merchant = request.user.merchant
        cod_shipments = Shipment.objects.filter(merchant=merchant, payment_mode='COD')

        total_collected = cod_shipments.filter(status='DELIVERED').aggregate(
            total=Sum('cod_amount'))['total'] or 0
        pending = cod_shipments.filter(
            status__in=['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'PICKED_UP']
        ).aggregate(total=Sum('cod_amount'))['total'] or 0

        return Response({
            'total_collected': float(total_collected),
            'pending_settlement': float(pending),
            'settled_this_month': float(total_collected) * 0.8,  # Simplified
            'total_cod_orders': cod_shipments.count(),
            'delivered_cod_orders': cod_shipments.filter(status='DELIVERED').count(),
        })


class ReportsOverviewView(APIView):
    """GET /api/v1/reports/overview/ — Shipment analytics."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        merchant = request.user.merchant
        qs = Shipment.objects.filter(merchant=merchant)

        days = int(request.query_params.get('days', 7))
        from django.utils import timezone
        from datetime import timedelta
        since = timezone.now() - timedelta(days=days)
        period_qs = qs.filter(created_at__gte=since)

        # Volume by day
        from django.db.models.functions import TruncDate
        daily_volume = (
            period_qs.annotate(day=TruncDate('created_at'))
            .values('day')
            .annotate(count=Count('id'))
            .order_by('day')
        )

        # Courier performance
        courier_perf = (
            period_qs.values('courier_partner__name', 'courier_partner__code')
            .annotate(
                total=Count('id'),
                delivered=Count('id', filter=Q(status='DELIVERED')),
                failed=Count('id', filter=Q(status__in=['FAILED', 'DELIVERY_ATTEMPTED'])),
                rto=Count('id', filter=Q(status__in=['RTO_INITIATED', 'RTO_IN_TRANSIT', 'RETURNED'])),
            )
            .order_by('-total')
        )

        # Top routes
        top_routes = (
            period_qs.values('pickup_city', 'delivery_city')
            .annotate(count=Count('id'))
            .order_by('-count')[:10]
        )

        return Response({
            'total_shipments': period_qs.count(),
            'revenue': float(period_qs.aggregate(total=Sum('shipping_charge'))['total'] or 0),
            'delivered': period_qs.filter(status='DELIVERED').count(),
            'daily_volume': list(daily_volume),
            'courier_performance': list(courier_perf),
            'top_routes': list(top_routes),
        })


class SettingsProfileView(APIView):
    """GET/PUT /api/v1/settings/profile/ — Merchant profile."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from .serializers import MerchantProfileSerializer
        merchant = request.user.merchant
        return Response(MerchantProfileSerializer(merchant).data)

    def put(self, request):
        merchant = request.user.merchant
        for field in ['company_name', 'brand_name', 'gst_number', 'website']:
            if field in request.data:
                setattr(merchant, field, request.data[field])
        merchant.save()

        user = request.user
        if 'first_name' in request.data:
            user.first_name = request.data['first_name']
        if 'last_name' in request.data:
            user.last_name = request.data['last_name']
        user.save()

        from .serializers import MerchantProfileSerializer
        return Response(MerchantProfileSerializer(merchant).data)


class PickupAddressListView(APIView):
    """GET/POST /api/v1/settings/addresses/ — CRUD pickup addresses."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from .serializers import PickupAddressSerializer
        addrs = request.user.merchant.pickup_addresses.filter(is_active=True)
        return Response(PickupAddressSerializer(addrs, many=True).data)

    def post(self, request):
        from merchants.models import PickupAddress
        from .serializers import PickupAddressSerializer
        merchant = request.user.merchant
        data = request.data

        addr = PickupAddress.objects.create(
            merchant=merchant,
            label=data.get('label', 'New Address'),
            contact_name=data.get('contact_name', ''),
            contact_phone=data.get('contact_phone', ''),
            address_line_1=data.get('address_line_1', ''),
            address_line_2=data.get('address_line_2', ''),
            city=data.get('city', ''),
            state=data.get('state', ''),
            pincode=data.get('pincode', ''),
            is_default=data.get('is_default', False),
        )

        if addr.is_default:
            merchant.pickup_addresses.exclude(pk=addr.pk).update(is_default=False)

        return Response(PickupAddressSerializer(addr).data, status=201)


class PickupAddressDetailView(APIView):
    """PUT/DELETE /api/v1/settings/addresses/<uid>/"""
    permission_classes = [IsAuthenticated]

    def put(self, request, uid):
        from .serializers import PickupAddressSerializer
        try:
            addr = request.user.merchant.pickup_addresses.get(uid=uid)
        except Exception:
            return Response({'error': 'Address not found'}, status=404)

        for field in ['label', 'contact_name', 'contact_phone', 'address_line_1',
                      'address_line_2', 'city', 'state', 'pincode', 'is_default']:
            if field in request.data:
                setattr(addr, field, request.data[field])
        addr.save()

        if addr.is_default:
            request.user.merchant.pickup_addresses.exclude(pk=addr.pk).update(is_default=False)

        return Response(PickupAddressSerializer(addr).data)

    def delete(self, request, uid):
        try:
            addr = request.user.merchant.pickup_addresses.get(uid=uid)
        except Exception:
            return Response({'error': 'Address not found'}, status=404)
        addr.is_active = False
        addr.save(update_fields=['is_active'])
        return Response({'message': 'Address deleted'})
