from django.db import models
from django.conf import settings
import uuid


class Wallet(models.Model):
    """Merchant wallet — cloned from LekyaLogistics payment.Wallet."""

    uid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wallet')
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_credited = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_debited = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'wallet_wallet'

    def __str__(self):
        return f"Wallet: {self.user.email} (₹{self.balance})"

    def credit(self, amount, description='', transaction_type='RECHARGE'):
        """Add funds to wallet."""
        from django.db.models import F
        Wallet.objects.filter(pk=self.pk).update(
            balance=F('balance') + amount,
            total_credited=F('total_credited') + amount,
        )
        self.refresh_from_db()
        return WalletTransaction.objects.create(
            wallet=self,
            transaction_type=transaction_type,
            amount=amount,
            balance_after=self.balance,
            description=description,
        )

    def debit(self, amount, description='', transaction_type='SHIPMENT'):
        """Deduct funds from wallet."""
        from django.db.models import F
        if self.balance < amount:
            raise ValueError('Insufficient wallet balance')
        Wallet.objects.filter(pk=self.pk).update(
            balance=F('balance') - amount,
            total_debited=F('total_debited') + amount,
        )
        self.refresh_from_db()
        return WalletTransaction.objects.create(
            wallet=self,
            transaction_type=transaction_type,
            amount=-amount,
            balance_after=self.balance,
            description=description,
        )


class WalletTransaction(models.Model):
    """Wallet transaction log — cloned from LekyaLogistics."""

    TRANSACTION_TYPES = [
        ('RECHARGE', 'Recharge'),
        ('SHIPMENT', 'Shipment Charge'),
        ('REFUND', 'Refund'),
        ('COD_SETTLEMENT', 'COD Settlement'),
        ('ADJUSTMENT', 'Adjustment'),
    ]

    uid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)  # positive=credit, negative=debit
    balance_after = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.CharField(max_length=500, blank=True)
    reference_id = models.CharField(max_length=100, blank=True, null=True)  # e.g. Razorpay order ID
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'wallet_transaction'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.transaction_type}: ₹{self.amount}"
