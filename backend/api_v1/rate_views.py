from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from aggregator.models import CourierPartner, CourierRateCard, CourierServiceability
from .serializers import RateCalculateSerializer


class RateCalculateView(APIView):
    """POST /api/v1/rates/calculate/ — Compare rates across all couriers."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RateCalculateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        couriers = CourierPartner.objects.filter(is_active=True).order_by('priority')
        results = []

        for courier in couriers:
            # Check serviceability
            serviceable = CourierServiceability.objects.filter(
                courier=courier,
                origin_pincode=data['origin_pincode'],
                destination_pincode=data['destination_pincode'],
                is_active=True,
            ).first()

            # If no specific serviceability entry, assume serviceable (for now)
            est_days = serviceable.estimated_days if serviceable else int(courier.avg_delivery_days)
            is_cod_available = serviceable.is_cod_available if serviceable else True

            if data['payment_mode'] == 'COD' and not is_cod_available:
                continue

            # Calculate rate
            rate_card = CourierRateCard.objects.filter(
                courier=courier, is_active=True,
                min_weight_kg__lte=data['weight_kg'],
                max_weight_kg__gte=data['weight_kg'],
            ).first()

            if rate_card:
                base_rate = float(rate_card.base_rate)
                cod_charge = float(rate_card.cod_charge) if data['payment_mode'] == 'COD' else 0
                total_rate = base_rate + cod_charge
            else:
                # Default rate if no rate card
                total_rate = 72 + (float(data['weight_kg']) - 0.5) * 15
                if data['payment_mode'] == 'COD':
                    total_rate += 25
                cod_charge = 25 if data['payment_mode'] == 'COD' else 0

            # Calculate score: cost(30%) + speed(30%) + success(25%) + rto(15%)
            cost_score = max(0, 100 - (total_rate - 50) * 0.5)
            speed_score = max(0, 100 - (est_days - 1) * 20)
            success_score = float(courier.success_rate)
            rto_score = max(0, 100 - float(courier.rto_rate) * 10)
            overall_score = round(cost_score * 0.3 + speed_score * 0.3 + success_score * 0.25 + rto_score * 0.15)

            results.append({
                'courier_code': courier.code,
                'courier_name': courier.name,
                'is_own_fleet': courier.is_own_fleet,
                'rate': round(total_rate, 2),
                'cod_charge': round(cod_charge, 2),
                'estimated_days': est_days,
                'success_rate': float(courier.success_rate),
                'rto_rate': float(courier.rto_rate),
                'score': min(100, overall_score),
            })

        # Sort by score descending
        results.sort(key=lambda x: x['score'], reverse=True)

        # Mark recommended
        if results:
            results[0]['recommended'] = True

        return Response({
            'origin_pincode': data['origin_pincode'],
            'destination_pincode': data['destination_pincode'],
            'weight_kg': float(data['weight_kg']),
            'payment_mode': data['payment_mode'],
            'couriers': results,
        })


class ServiceabilityCheckView(APIView):
    """GET /api/v1/rates/serviceability/?origin=110001&destination=201301"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        origin = request.query_params.get('origin')
        destination = request.query_params.get('destination')

        if not origin or not destination:
            return Response({'error': 'origin and destination pincodes required'}, status=400)

        serviceable_couriers = CourierServiceability.objects.filter(
            origin_pincode=origin,
            destination_pincode=destination,
            is_active=True,
        ).select_related('courier')

        results = [{
            'courier_code': s.courier.code,
            'courier_name': s.courier.name,
            'estimated_days': s.estimated_days,
            'is_cod_available': s.is_cod_available,
        } for s in serviceable_couriers]

        # If no specific entries, list all active couriers as serviceable
        if not results:
            all_couriers = CourierPartner.objects.filter(is_active=True)
            results = [{
                'courier_code': c.code,
                'courier_name': c.name,
                'estimated_days': int(c.avg_delivery_days),
                'is_cod_available': True,
            } for c in all_couriers]

        return Response({
            'origin': origin,
            'destination': destination,
            'serviceable': True,
            'couriers': results,
        })
