from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

from wallet.models import Wallet, WalletTransaction
from .serializers import WalletSerializer, WalletTransactionSerializer


class WalletBalanceView(APIView):
    """GET /api/v1/wallet/balance/ — Current balance + stats."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        return Response(WalletSerializer(wallet).data)


class WalletRechargeView(APIView):
    """POST /api/v1/wallet/recharge/ — Create Razorpay order for recharge."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        amount = request.data.get('amount')
        if not amount or float(amount) < 100:
            return Response({'error': 'Minimum recharge is ₹100'}, status=400)

        amount = float(amount)

        # TODO: Create Razorpay order
        # For now, directly credit wallet (dev mode)
        wallet = request.user.wallet
        tx = wallet.credit(amount, description='Wallet Recharge', transaction_type='RECHARGE')

        return Response({
            'message': f'₹{amount} added to wallet',
            'balance': float(wallet.balance),
            'transaction': WalletTransactionSerializer(tx).data,
        })


class WalletRechargeVerifyView(APIView):
    """POST /api/v1/wallet/recharge/verify/ — Verify Razorpay payment."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # TODO: Verify Razorpay signature
        return Response({'message': 'Payment verified'})


class WalletTransactionPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'


class WalletTransactionListView(ListAPIView):
    """GET /api/v1/wallet/transactions/ — Transaction history."""
    serializer_class = WalletTransactionSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = WalletTransactionPagination

    def get_queryset(self):
        wallet = self.request.user.wallet
        qs = WalletTransaction.objects.filter(wallet=wallet)

        tx_type = self.request.query_params.get('type')
        if tx_type:
            qs = qs.filter(transaction_type=tx_type.upper())

        date_from = self.request.query_params.get('date_from')
        if date_from:
            qs = qs.filter(created_at__date__gte=date_from)

        date_to = self.request.query_params.get('date_to')
        if date_to:
            qs = qs.filter(created_at__date__lte=date_to)

        return qs.order_by('-created_at')
