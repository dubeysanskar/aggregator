from django.db import models
from django.conf import settings
import uuid
from .choices import STATUS_CHOICES, PAYMENT_MODE_CHOICES


class Shipment(models.Model):
    """Core shipment model — cloned from LekyaLogistics shipment.Shipment, adapted for aggregator."""

    uid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    tracking_id = models.CharField(max_length=30, unique=True, db_index=True)
    merchant = models.ForeignKey('merchants.Merchant', on_delete=models.CASCADE, related_name='shipments')

    # Pickup
    pickup_contact_name = models.CharField(max_length=255)
    pickup_contact_phone = models.CharField(max_length=15)
    pickup_address = models.TextField()
    pickup_city = models.CharField(max_length=100)
    pickup_state = models.CharField(max_length=100, blank=True)
    pickup_pincode = models.CharField(max_length=10)

    # Delivery
    recipient_name = models.CharField(max_length=255)
    recipient_phone = models.CharField(max_length=15)
    recipient_email = models.EmailField(blank=True, null=True)
    delivery_address = models.TextField()
    delivery_city = models.CharField(max_length=100)
    delivery_state = models.CharField(max_length=100, blank=True)
    delivery_pincode = models.CharField(max_length=10)

    # Package
    weight_kg = models.DecimalField(max_digits=6, decimal_places=2)
    length_cm = models.DecimalField(max_digits=6, decimal_places=1, null=True, blank=True)
    width_cm = models.DecimalField(max_digits=6, decimal_places=1, null=True, blank=True)
    height_cm = models.DecimalField(max_digits=6, decimal_places=1, null=True, blank=True)
    product_description = models.CharField(max_length=500, blank=True)

    # Payment
    payment_mode = models.CharField(max_length=10, choices=PAYMENT_MODE_CHOICES, default='PREPAID')
    cod_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_charge = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # Status
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='CREATED')

    # Courier assignment (aggregator specific)
    courier_partner = models.ForeignKey('aggregator.CourierPartner', on_delete=models.SET_NULL, null=True, blank=True)
    courier_awb = models.CharField(max_length=50, blank=True, null=True)  # courier's own tracking number
    courier_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'shipments_shipment'
        ordering = ['-created_at']

    def __str__(self):
        return self.tracking_id


class ShipmentStatusHistory(models.Model):
    """Track every status change — cloned from LekyaLogistics."""

    uid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE, related_name='status_history')
    from_status = models.CharField(max_length=30, blank=True)
    to_status = models.CharField(max_length=30)
    changed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'shipments_status_history'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.shipment.tracking_id}: {self.from_status} → {self.to_status}"
