"""Seed default courier partners and rate cards."""

from django.core.management.base import BaseCommand
from aggregator.models import CourierPartner, CourierRateCard


class Command(BaseCommand):
    help = 'Seed default courier partners and rate cards'

    def handle(self, *args, **options):
        couriers_data = [
            {
                'name': 'Parcel Uncle Fleet',
                'code': 'pu_fleet',
                'avg_delivery_days': 1.4,
                'success_rate': 96.2,
                'rto_rate': 1.8,
                'is_own_fleet': True,
                'priority': 1,
            },
            {
                'name': 'Delhivery',
                'code': 'delhivery',
                'avg_delivery_days': 2.1,
                'success_rate': 91.5,
                'rto_rate': 4.2,
                'is_own_fleet': False,
                'priority': 2,
            },
            {
                'name': 'Xpressbees',
                'code': 'xpressbees',
                'avg_delivery_days': 2.4,
                'success_rate': 89.8,
                'rto_rate': 5.1,
                'is_own_fleet': False,
                'priority': 3,
            },
            {
                'name': 'Blue Dart',
                'code': 'bluedart',
                'avg_delivery_days': 1.6,
                'success_rate': 94.0,
                'rto_rate': 2.5,
                'is_own_fleet': False,
                'priority': 4,
            },
            {
                'name': 'Shadowfax',
                'code': 'shadowfax',
                'avg_delivery_days': 2.8,
                'success_rate': 87.3,
                'rto_rate': 6.8,
                'is_own_fleet': False,
                'priority': 5,
            },
        ]

        # Default rate cards per zone
        rate_cards = {
            'LOCAL': {'base_rate': 45, 'additional_per_kg': 10, 'cod_charge': 20, 'min': 0, 'max': 0.5},
            'REGIONAL': {'base_rate': 65, 'additional_per_kg': 15, 'cod_charge': 25, 'min': 0, 'max': 0.5},
            'METRO': {'base_rate': 55, 'additional_per_kg': 12, 'cod_charge': 22, 'min': 0, 'max': 0.5},
            'NATIONAL': {'base_rate': 85, 'additional_per_kg': 20, 'cod_charge': 30, 'min': 0, 'max': 0.5},
        }

        for data in couriers_data:
            courier, created = CourierPartner.objects.update_or_create(
                code=data['code'],
                defaults=data,
            )
            action = 'Created' if created else 'Updated'
            self.stdout.write(f'{action} courier: {courier.name}')

            # Create rate cards
            for zone, rates in rate_cards.items():
                # 0-0.5 kg slab
                CourierRateCard.objects.update_or_create(
                    courier=courier, zone=zone, min_weight_kg=0, max_weight_kg=0.5,
                    defaults={
                        'base_rate': rates['base_rate'],
                        'additional_per_kg': rates['additional_per_kg'],
                        'cod_charge': rates['cod_charge'],
                    }
                )
                # 0.5-1 kg slab
                CourierRateCard.objects.update_or_create(
                    courier=courier, zone=zone, min_weight_kg=0.5, max_weight_kg=1.0,
                    defaults={
                        'base_rate': rates['base_rate'] + 15,
                        'additional_per_kg': rates['additional_per_kg'],
                        'cod_charge': rates['cod_charge'],
                    }
                )
                # 1-2 kg slab
                CourierRateCard.objects.update_or_create(
                    courier=courier, zone=zone, min_weight_kg=1.0, max_weight_kg=2.0,
                    defaults={
                        'base_rate': rates['base_rate'] + 30,
                        'additional_per_kg': rates['additional_per_kg'],
                        'cod_charge': rates['cod_charge'],
                    }
                )
                # 2-5 kg slab
                CourierRateCard.objects.update_or_create(
                    courier=courier, zone=zone, min_weight_kg=2.0, max_weight_kg=5.0,
                    defaults={
                        'base_rate': rates['base_rate'] + 60,
                        'additional_per_kg': rates['additional_per_kg'],
                        'cod_charge': rates['cod_charge'],
                    }
                )

        self.stdout.write(self.style.SUCCESS(f'Seeded {len(couriers_data)} couriers with rate cards'))
