"""SMS Service — cloned from LekyaLogistics services/sms_service.py"""

import requests
from django.conf import settings


class SmsService:
    """BhashSMS wrapper for sending OTP and notification SMS."""

    API_URL = 'http://login.bhashsms.com/api/sendmsg.php'

    @staticmethod
    def send_sms(phone_number, message, template_id=None):
        """Send SMS via BhashSMS API."""
        if not settings.SMS_API_KEY:
            print(f"[SMS] (no API key) To: {phone_number} | {message}")
            return True

        params = {
            'user': settings.SMS_API_KEY,
            'pass': '',
            'sender': settings.SMS_SENDER_ID,
            'phone': phone_number,
            'text': message,
            'priority': 'ndnd',
            'stype': 'normal',
        }

        if template_id:
            params['Ede_id'] = template_id

        try:
            response = requests.get(SmsService.API_URL, params=params, timeout=10)
            return response.status_code == 200
        except Exception as e:
            print(f"[SMS] Error: {e}")
            return False

    @staticmethod
    def send_otp(phone_number, otp):
        """Send OTP SMS."""
        message = f"Use OTP {otp} to verify your Parcel Uncle account. Valid for 5 minutes. Do not share. - Parcel Uncle"
        return SmsService.send_sms(phone_number, message)

    @staticmethod
    def send_shipment_notification(phone_number, tracking_id, status_message):
        """Send shipment status notification."""
        message = f"Your shipment {tracking_id} {status_message} - Parcel Uncle"
        return SmsService.send_sms(phone_number, message)
