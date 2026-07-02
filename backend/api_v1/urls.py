from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .auth_views import (
    RegisterView, LoginView, VerifyEmailView, VerifyPhoneView,
    ForgotPasswordView, ResetPasswordView, ProfileView,
)
from .dashboard_views import DashboardOverviewView
from .shipment_views import (
    ShipmentListView, ShipmentCreateView, ShipmentDetailView,
    ShipmentCancelView, ShipmentTrackView,
)
from .wallet_views import (
    WalletBalanceView, WalletRechargeView, WalletRechargeVerifyView,
    WalletTransactionListView,
)
from .rate_views import RateCalculateView, ServiceabilityCheckView
from .other_views import (
    NDRListView, NDRActionView, CODDashboardView,
    ReportsOverviewView, SettingsProfileView,
    PickupAddressListView, PickupAddressDetailView,
)

urlpatterns = [
    # ── Auth ──
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', LoginView.as_view(), name='auth_login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='auth_refresh'),
    path('auth/verify-email/', VerifyEmailView.as_view(), name='auth_verify_email'),
    path('auth/verify-phone/', VerifyPhoneView.as_view(), name='auth_verify_phone'),
    path('auth/forgot-password/', ForgotPasswordView.as_view(), name='auth_forgot_password'),
    path('auth/reset-password/', ResetPasswordView.as_view(), name='auth_reset_password'),
    path('auth/profile/', ProfileView.as_view(), name='auth_profile'),

    # ── Dashboard ──
    path('dashboard/overview/', DashboardOverviewView.as_view(), name='dashboard_overview'),

    # ── Shipments ──
    path('shipments/', ShipmentListView.as_view(), name='shipment_list'),
    path('shipments/create/', ShipmentCreateView.as_view(), name='shipment_create'),
    path('shipments/<str:tracking_id>/', ShipmentDetailView.as_view(), name='shipment_detail'),
    path('shipments/<str:tracking_id>/cancel/', ShipmentCancelView.as_view(), name='shipment_cancel'),
    path('shipments/<str:tracking_id>/track/', ShipmentTrackView.as_view(), name='shipment_track'),

    # ── Wallet ──
    path('wallet/balance/', WalletBalanceView.as_view(), name='wallet_balance'),
    path('wallet/recharge/', WalletRechargeView.as_view(), name='wallet_recharge'),
    path('wallet/recharge/verify/', WalletRechargeVerifyView.as_view(), name='wallet_recharge_verify'),
    path('wallet/transactions/', WalletTransactionListView.as_view(), name='wallet_transactions'),

    # ── Rates ──
    path('rates/calculate/', RateCalculateView.as_view(), name='rate_calculate'),
    path('rates/serviceability/', ServiceabilityCheckView.as_view(), name='serviceability_check'),

    # ── NDR ──
    path('ndr/', NDRListView.as_view(), name='ndr_list'),
    path('ndr/<str:tracking_id>/action/', NDRActionView.as_view(), name='ndr_action'),

    # ── COD ──
    path('cod/dashboard/', CODDashboardView.as_view(), name='cod_dashboard'),

    # ── Reports ──
    path('reports/overview/', ReportsOverviewView.as_view(), name='reports_overview'),

    # ── Settings ──
    path('settings/profile/', SettingsProfileView.as_view(), name='settings_profile'),
    path('settings/addresses/', PickupAddressListView.as_view(), name='settings_addresses'),
    path('settings/addresses/<uuid:uid>/', PickupAddressDetailView.as_view(), name='settings_address_detail'),
]
