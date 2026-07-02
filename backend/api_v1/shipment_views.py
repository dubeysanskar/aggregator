import random
import string

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from django.utils import timezone

from shipments.models import Shipment, ShipmentStatusHistory
from aggregator.models import CourierPartner
from .serializers import (
    ShipmentListSerializer, ShipmentDetailSerializer,
    ShipmentCreateSerializer, ShipmentStatusHistorySerializer,
)


def generate_tracking_id():
    """Generate PU + 10 digits tracking ID."""
    digits = ''.join(random.choices(string.digits, k=10))
    return f'PU{digits}'


class ShipmentPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class ShipmentListView(ListAPIView):
    """
    GET /api/v1/shipments/ — List shipments with filters.
    Filters: ?status=IN_TRANSIT,DELIVERED  ?courier=pu_fleet  ?payment_mode=COD
             ?date_from=2026-06-01  ?date_to=2026-06-30  ?search=PU942
             ?ordering=-created_at
    """
    serializer_class = ShipmentListSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = ShipmentPagination

    def get_queryset(self):
        merchant = self.request.user.merchant
        qs = Shipment.objects.filter(merchant=merchant).select_related('courier_partner')

        # Status filter
        statuses = self.request.query_params.get('status')
        if statuses:
            qs = qs.filter(status__in=statuses.split(','))

        # Courier filter
        courier = self.request.query_params.get('courier')
        if courier:
            qs = qs.filter(courier_partner__code__in=courier.split(','))

        # Payment mode
        payment_mode = self.request.query_params.get('payment_mode')
        if payment_mode:
            qs = qs.filter(payment_mode=payment_mode.upper())

        # Date range
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        if date_from:
            qs = qs.filter(created_at__date__gte=date_from)
        if date_to:
            qs = qs.filter(created_at__date__lte=date_to)

        # Search
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(
                Q(tracking_id__icontains=search) |
                Q(recipient_name__icontains=search) |
                Q(recipient_phone__icontains=search) |
                Q(delivery_city__icontains=search)
            )

        # Ordering
        ordering = self.request.query_params.get('ordering', '-created_at')
        qs = qs.order_by(ordering)

        return qs


class ShipmentCreateView(APIView):
    """POST /api/v1/shipments/ — Create a new shipment."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ShipmentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        merchant = request.user.merchant
        wallet = request.user.wallet

        # Resolve pickup address
        pickup_uid = data.get('pickup_address_uid')
        if pickup_uid:
            try:
                addr = merchant.pickup_addresses.get(uid=pickup_uid, is_active=True)
                pickup_contact_name = addr.contact_name
                pickup_contact_phone = addr.contact_phone
                pickup_address = f"{addr.address_line_1}, {addr.city}"
                pickup_city = addr.city
                pickup_pincode = addr.pincode
            except Exception:
                return Response({'error': 'Invalid pickup address'}, status=400)
        else:
            pickup_contact_name = data.get('pickup_contact_name', '')
            pickup_contact_phone = data.get('pickup_contact_phone', '')
            pickup_address = data.get('pickup_address', '')
            pickup_city = data.get('pickup_city', '')
            pickup_pincode = data.get('pickup_pincode', '')

        # Select courier
        courier_code = data.get('courier_code')
        courier = None
        if courier_code:
            try:
                courier = CourierPartner.objects.get(code=courier_code, is_active=True)
            except CourierPartner.DoesNotExist:
                return Response({'error': 'Invalid courier'}, status=400)
        else:
            # Auto-select best courier (own fleet first, then by priority)
            courier = CourierPartner.objects.filter(is_active=True).order_by('priority').first()

        # Calculate rate (simplified — uses base rate from rate card)
        shipping_charge = 72  # Default rate
        if courier:
            from aggregator.models import CourierRateCard
            rate_card = CourierRateCard.objects.filter(
                courier=courier, is_active=True,
                min_weight_kg__lte=data['weight_kg'],
                max_weight_kg__gte=data['weight_kg'],
            ).first()
            if rate_card:
                shipping_charge = float(rate_card.base_rate)
                if data['payment_mode'] == 'COD':
                    shipping_charge += float(rate_card.cod_charge)

        # Check wallet balance
        if float(wallet.balance) < shipping_charge:
            return Response({
                'error': 'Insufficient wallet balance',
                'balance': float(wallet.balance),
                'required': shipping_charge,
            }, status=400)

        # Create shipment
        tracking_id = generate_tracking_id()
        while Shipment.objects.filter(tracking_id=tracking_id).exists():
            tracking_id = generate_tracking_id()

        shipment = Shipment.objects.create(
            tracking_id=tracking_id,
            merchant=merchant,
            pickup_contact_name=pickup_contact_name,
            pickup_contact_phone=pickup_contact_phone,
            pickup_address=pickup_address,
            pickup_city=pickup_city,
            pickup_pincode=pickup_pincode,
            recipient_name=data['recipient_name'],
            recipient_phone=data['recipient_phone'],
            recipient_email=data.get('recipient_email', ''),
            delivery_address=data['delivery_address'],
            delivery_city=data['delivery_city'],
            delivery_state=data.get('delivery_state', ''),
            delivery_pincode=data['delivery_pincode'],
            weight_kg=data['weight_kg'],
            length_cm=data.get('length_cm'),
            width_cm=data.get('width_cm'),
            height_cm=data.get('height_cm'),
            product_description=data.get('product_description', ''),
            payment_mode=data['payment_mode'],
            cod_amount=data.get('cod_amount', 0),
            shipping_charge=shipping_charge,
            courier_partner=courier,
            courier_rate=shipping_charge,
            status='CREATED',
        )

        # Create status history
        ShipmentStatusHistory.objects.create(
            shipment=shipment,
            from_status='',
            to_status='CREATED',
            changed_by=request.user,
            notes='Shipment created',
        )

        # Debit wallet
        wallet.debit(shipping_charge, description=f'Shipment {tracking_id}')

        # Update merchant stats
        from django.db.models import F
        from merchants.models import Merchant
        Merchant.objects.filter(pk=merchant.pk).update(total_shipments=F('total_shipments') + 1)

        return Response(ShipmentDetailSerializer(shipment).data, status=201)


class ShipmentDetailView(APIView):
    """GET /api/v1/shipments/<tracking_id>/ — Shipment detail."""
    permission_classes = [IsAuthenticated]

    def get(self, request, tracking_id):
        try:
            shipment = Shipment.objects.select_related('courier_partner').get(
                tracking_id=tracking_id, merchant=request.user.merchant
            )
        except Shipment.DoesNotExist:
            return Response({'error': 'Shipment not found'}, status=404)
        return Response(ShipmentDetailSerializer(shipment).data)


class ShipmentCancelView(APIView):
    """POST /api/v1/shipments/<tracking_id>/cancel/ — Cancel shipment."""
    permission_classes = [IsAuthenticated]

    def post(self, request, tracking_id):
        try:
            shipment = Shipment.objects.get(
                tracking_id=tracking_id, merchant=request.user.merchant
            )
        except Shipment.DoesNotExist:
            return Response({'error': 'Shipment not found'}, status=404)

        non_cancellable = ['DELIVERED', 'RETURNED', 'CANCELLED', 'LOST']
        if shipment.status in non_cancellable:
            return Response({'error': f'Cannot cancel shipment with status {shipment.status}'}, status=400)

        old_status = shipment.status
        shipment.status = 'CANCELLED'
        shipment.save(update_fields=['status'])

        ShipmentStatusHistory.objects.create(
            shipment=shipment,
            from_status=old_status,
            to_status='CANCELLED',
            changed_by=request.user,
            notes=request.data.get('reason', 'Cancelled by merchant'),
        )

        # Refund wallet
        wallet = request.user.wallet
        wallet.credit(float(shipment.shipping_charge), description=f'Refund: {tracking_id}', transaction_type='REFUND')

        return Response({'message': 'Shipment cancelled', 'tracking_id': tracking_id})


class ShipmentTrackView(APIView):
    """GET /api/v1/shipments/<tracking_id>/track/ — Tracking timeline."""
    permission_classes = [IsAuthenticated]

    def get(self, request, tracking_id):
        try:
            shipment = Shipment.objects.get(tracking_id=tracking_id)
        except Shipment.DoesNotExist:
            return Response({'error': 'Shipment not found'}, status=404)

        history = shipment.status_history.all().order_by('-created_at')
        return Response({
            'tracking_id': shipment.tracking_id,
            'status': shipment.status,
            'courier': shipment.courier_partner.name if shipment.courier_partner else 'Unassigned',
            'origin': f"{shipment.pickup_city} ({shipment.pickup_pincode})",
            'destination': f"{shipment.delivery_city} ({shipment.delivery_pincode})",
            'timeline': ShipmentStatusHistorySerializer(history, many=True).data,
        })
