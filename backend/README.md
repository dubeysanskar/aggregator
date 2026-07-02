# Parcel Uncle Aggregator — Backend (Django)

## Setup
```bash
cd aggregator/backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 8001
```

## Architecture
- `config/` — Django settings, URLs, WSGI
- `accounts/` — User model, auth (registration, login, JWT, OTP verify)
- `merchants/` — Merchant/Seller model, settings, addresses
- `shipments/` — Shipment model, status lifecycle, assignments
- `wallet/` — Wallet, transactions, COD, recharge
- `pricing/` — Rate engine, templates, slabs
- `aggregator/` — Courier partners, serviceability, recommendation engine
- `api_v1/` — REST API endpoints for Next.js frontend
- `services/` — SMS, Email, Geo, Payment services
