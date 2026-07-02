"""Shipment statuses — cloned from LekyaLogistics shipment/choices.py"""

STATUS_CHOICES = [
    ('CREATED', 'Created'),
    ('PENDING', 'Pending'),
    ('PAID', 'Paid'),
    ('READY_TO_SHIP', 'Ready to Ship'),
    ('ASSIGNED', 'Assigned'),
    ('ACCEPTED', 'Accepted'),
    ('PICKED_UP', 'Picked Up'),
    ('IN_TRANSIT', 'In Transit'),
    ('OUT_FOR_DELIVERY', 'Out for Delivery'),
    ('DELIVERY_ATTEMPTED', 'Delivery Attempted'),
    ('DELIVERED', 'Delivered'),
    ('RTO_INITIATED', 'RTO Initiated'),
    ('RTO_IN_TRANSIT', 'RTO In Transit'),
    ('RETURNED', 'Returned'),
    ('FAILED', 'Failed'),
    ('ON_HOLD', 'On Hold'),
    ('CANCELLED', 'Cancelled'),
    ('LOST', 'Lost'),
]

TERMINAL_STATUSES = ['DELIVERED', 'RETURNED', 'CANCELLED', 'LOST']
ACTIVE_STATUSES = ['CREATED', 'PENDING', 'PAID', 'READY_TO_SHIP', 'ASSIGNED', 'ACCEPTED',
                   'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERY_ATTEMPTED']

PAYMENT_MODE_CHOICES = [
    ('PREPAID', 'Prepaid'),
    ('COD', 'Cash on Delivery'),
]
