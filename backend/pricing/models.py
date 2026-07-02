from django.db import models
import uuid


class PricingTemplate(models.Model):
    """Rate card template — cloned from LekyaLogistics pricing.PricingTemplate."""

    uid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100)
    is_default = models.BooleanField(default=False)
    gst_enabled = models.BooleanField(default=True)
    gst_rate = models.DecimalField(max_digits=5, decimal_places=2, default=18.0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'pricing_template'

    def __str__(self):
        return self.name
