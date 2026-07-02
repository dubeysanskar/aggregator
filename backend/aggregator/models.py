from django.db import models
import uuid


class CourierPartner(models.Model):
    """Courier partner configuration — NEW for aggregator."""

    uid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True)  # e.g. 'pu_fleet', 'delhivery'
    logo = models.ImageField(upload_to='courier_logos', blank=True, null=True)

    # API Integration
    api_base_url = models.URLField(blank=True, null=True)
    api_key = models.CharField(max_length=255, blank=True, null=True)
    api_secret = models.CharField(max_length=255, blank=True, null=True)

    # Performance metrics (updated periodically)
    avg_delivery_days = models.DecimalField(max_digits=4, decimal_places=1, default=2.0)
    success_rate = models.DecimalField(max_digits=5, decimal_places=2, default=90.0)
    rto_rate = models.DecimalField(max_digits=5, decimal_places=2, default=5.0)

    # Config
    is_active = models.BooleanField(default=True)
    is_own_fleet = models.BooleanField(default=False)  # True for Parcel Uncle Fleet
    priority = models.IntegerField(default=10)  # lower = higher priority
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'aggregator_courier_partner'
        ordering = ['priority']

    def __str__(self):
        return self.name


class CourierServiceability(models.Model):
    """Which courier serves which pincodes — NEW for aggregator."""

    courier = models.ForeignKey(CourierPartner, on_delete=models.CASCADE, related_name='serviceability')
    origin_pincode = models.CharField(max_length=10)
    destination_pincode = models.CharField(max_length=10)
    estimated_days = models.IntegerField(default=3)
    is_cod_available = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'aggregator_serviceability'
        unique_together = ['courier', 'origin_pincode', 'destination_pincode']
        indexes = [
            models.Index(fields=['origin_pincode', 'destination_pincode']),
        ]

    def __str__(self):
        return f"{self.courier.name}: {self.origin_pincode} → {self.destination_pincode}"


class CourierRateCard(models.Model):
    """Pricing per courier per weight/zone — NEW for aggregator."""

    courier = models.ForeignKey(CourierPartner, on_delete=models.CASCADE, related_name='rate_cards')
    zone = models.CharField(max_length=20, choices=[
        ('LOCAL', 'Local'), ('REGIONAL', 'Regional'),
        ('METRO', 'Metro'), ('NATIONAL', 'National'),
        ('SPECIAL', 'Special'),
    ])
    min_weight_kg = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    max_weight_kg = models.DecimalField(max_digits=6, decimal_places=2, default=0.5)
    base_rate = models.DecimalField(max_digits=8, decimal_places=2)
    additional_per_kg = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    cod_charge = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'aggregator_rate_card'

    def __str__(self):
        return f"{self.courier.name} - {self.zone}: ₹{self.base_rate}"
