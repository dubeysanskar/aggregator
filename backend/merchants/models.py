from django.db import models
from django.conf import settings
import uuid


class Merchant(models.Model):
    """Merchant/Seller profile — cloned from LekyaLogistics seller.Seller."""

    uid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='merchant')
    company_name = models.CharField(max_length=255)
    brand_name = models.CharField(max_length=255, blank=True, null=True)
    gst_number = models.CharField(max_length=20, blank=True, null=True)
    website = models.URLField(blank=True, null=True)

    # Plan
    plan = models.CharField(max_length=20, choices=[
        ('FREE', 'Free'), ('STARTER', 'Starter'), ('PRO', 'Pro'), ('ENTERPRISE', 'Enterprise')
    ], default='FREE')

    # Stats
    total_shipments = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'merchants_merchant'

    def __str__(self):
        return self.company_name


class PickupAddress(models.Model):
    """Merchant's pickup addresses."""

    uid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    merchant = models.ForeignKey(Merchant, on_delete=models.CASCADE, related_name='pickup_addresses')
    label = models.CharField(max_length=100)  # e.g. "Warehouse 1"
    contact_name = models.CharField(max_length=255)
    contact_phone = models.CharField(max_length=15)
    address_line_1 = models.CharField(max_length=255)
    address_line_2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    is_default = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'merchants_pickup_address'

    def __str__(self):
        return f"{self.label} ({self.pincode})"
