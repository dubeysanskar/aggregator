"""Courier recommendation engine — scores and ranks couriers for each shipment."""

from aggregator.models import CourierPartner, CourierRateCard, CourierServiceability


def get_courier_recommendations(origin_pincode, dest_pincode, weight_kg, payment_mode='PREPAID'):
    """
    Score each courier by: cost(30%) + speed(30%) + success(25%) + rto(15%)
    Returns sorted list of courier options with rates and scores.
    """
    couriers = CourierPartner.objects.filter(is_active=True).order_by('priority')
    results = []

    for courier in couriers:
        # Check serviceability
        service = CourierServiceability.objects.filter(
            courier=courier,
            origin_pincode=origin_pincode,
            destination_pincode=dest_pincode,
            is_active=True,
        ).first()

        est_days = service.estimated_days if service else int(courier.avg_delivery_days)
        is_cod = service.is_cod_available if service else True

        if payment_mode == 'COD' and not is_cod:
            continue

        # Get rate
        rate_card = CourierRateCard.objects.filter(
            courier=courier, is_active=True,
            min_weight_kg__lte=weight_kg,
            max_weight_kg__gte=weight_kg,
        ).first()

        if rate_card:
            rate = float(rate_card.base_rate)
            cod_fee = float(rate_card.cod_charge) if payment_mode == 'COD' else 0
        else:
            rate = 72 + max(0, (float(weight_kg) - 0.5)) * 15
            cod_fee = 25 if payment_mode == 'COD' else 0

        total_rate = rate + cod_fee

        # Score
        cost_s = max(0, 100 - (total_rate - 50) * 0.5)
        speed_s = max(0, 100 - (est_days - 1) * 20)
        success_s = float(courier.success_rate)
        rto_s = max(0, 100 - float(courier.rto_rate) * 10)
        score = round(cost_s * 0.3 + speed_s * 0.3 + success_s * 0.25 + rto_s * 0.15)

        results.append({
            'courier': courier,
            'rate': round(total_rate, 2),
            'cod_charge': round(cod_fee, 2),
            'estimated_days': est_days,
            'score': min(100, score),
        })

    results.sort(key=lambda x: x['score'], reverse=True)
    return results


def select_best_courier(origin_pincode, dest_pincode, weight_kg, payment_mode='PREPAID'):
    """Select the top-scored courier."""
    recommendations = get_courier_recommendations(
        origin_pincode, dest_pincode, weight_kg, payment_mode
    )
    if recommendations:
        return recommendations[0]
    return None
