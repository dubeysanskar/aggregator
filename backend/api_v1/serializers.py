from rest_framework import serializers
from shipments.models import Shipment, ShipmentStatusHistory
from merchants.models import Merchant, PickupAddress
from wallet.models import Wallet, WalletTransaction
from aggregator.models import CourierPartner


class ShipmentListSerializer(serializers.ModelSerializer):
    courier_name = serializers.SerializerMethodField()

    class Meta:
        model = Shipment
        fields = [
            'uid', 'tracking_id', 'recipient_name', 'recipient_phone',
            'delivery_city', 'delivery_pincode', 'weight_kg',
            'payment_mode', 'cod_amount', 'shipping_charge', 'status',
            'courier_name', 'courier_awb', 'created_at', 'delivered_at',
        ]

    def get_courier_name(self, obj):
        return obj.courier_partner.name if obj.courier_partner else 'Unassigned'


class ShipmentDetailSerializer(serializers.ModelSerializer):
    courier_name = serializers.SerializerMethodField()
    status_history = serializers.SerializerMethodField()

    class Meta:
        model = Shipment
        fields = '__all__'

    def get_courier_name(self, obj):
        return obj.courier_partner.name if obj.courier_partner else 'Unassigned'

    def get_status_history(self, obj):
        history = obj.status_history.all().order_by('-created_at')
        return ShipmentStatusHistorySerializer(history, many=True).data


class ShipmentCreateSerializer(serializers.Serializer):
    # Pickup
    pickup_address_uid = serializers.UUIDField(required=False)
    pickup_contact_name = serializers.CharField(max_length=255, required=False)
    pickup_contact_phone = serializers.CharField(max_length=15, required=False)
    pickup_address = serializers.CharField(required=False)
    pickup_city = serializers.CharField(max_length=100, required=False)
    pickup_pincode = serializers.CharField(max_length=10, required=False)

    # Delivery
    recipient_name = serializers.CharField(max_length=255)
    recipient_phone = serializers.CharField(max_length=15)
    recipient_email = serializers.EmailField(required=False)
    delivery_address = serializers.CharField()
    delivery_city = serializers.CharField(max_length=100)
    delivery_state = serializers.CharField(max_length=100, required=False, default='')
    delivery_pincode = serializers.CharField(max_length=10)

    # Package
    weight_kg = serializers.DecimalField(max_digits=6, decimal_places=2)
    length_cm = serializers.DecimalField(max_digits=6, decimal_places=1, required=False)
    width_cm = serializers.DecimalField(max_digits=6, decimal_places=1, required=False)
    height_cm = serializers.DecimalField(max_digits=6, decimal_places=1, required=False)
    product_description = serializers.CharField(max_length=500, required=False, default='')

    # Payment
    payment_mode = serializers.ChoiceField(choices=['PREPAID', 'COD'])
    cod_amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=0)

    # Courier
    courier_code = serializers.CharField(max_length=20, required=False)


class ShipmentStatusHistorySerializer(serializers.ModelSerializer):
    changed_by_name = serializers.SerializerMethodField()

    class Meta:
        model = ShipmentStatusHistory
        fields = ['uid', 'from_status', 'to_status', 'changed_by_name', 'notes', 'location', 'created_at']

    def get_changed_by_name(self, obj):
        return obj.changed_by.get_full_name() if obj.changed_by else 'System'


class PickupAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupAddress
        fields = ['uid', 'label', 'contact_name', 'contact_phone', 'address_line_1',
                  'address_line_2', 'city', 'state', 'pincode', 'is_default', 'is_active']


class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ['uid', 'balance', 'total_credited', 'total_debited', 'updated_at']


class WalletTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletTransaction
        fields = ['uid', 'transaction_type', 'amount', 'balance_after', 'description',
                  'reference_id', 'created_at']


class CourierPartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourierPartner
        fields = ['uid', 'name', 'code', 'avg_delivery_days', 'success_rate',
                  'rto_rate', 'is_active', 'is_own_fleet']


class RateCalculateSerializer(serializers.Serializer):
    origin_pincode = serializers.CharField(max_length=10)
    destination_pincode = serializers.CharField(max_length=10)
    weight_kg = serializers.DecimalField(max_digits=6, decimal_places=2)
    payment_mode = serializers.ChoiceField(choices=['PREPAID', 'COD'], default='PREPAID')


class MerchantProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone_number', read_only=True)
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')

    class Meta:
        model = Merchant
        fields = ['uid', 'company_name', 'brand_name', 'gst_number', 'website',
                  'plan', 'email', 'phone', 'first_name', 'last_name',
                  'total_shipments', 'created_at']
