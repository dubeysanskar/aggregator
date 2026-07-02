from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import UserManager
import uuid
from django.utils import timezone
from datetime import timedelta
import random


class User(AbstractUser):
    """Custom user model — cloned from LekyaLogistics account.User, adapted for aggregator."""

    uid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    # Auth fields
    username = models.CharField(max_length=150, null=True, blank=True)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, unique=True)

    # Profile
    profile_picture = models.ImageField(upload_to='profile_pictures', blank=True, null=True)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    pincode = models.CharField(max_length=10, blank=True, null=True)

    # Email Verification
    is_email_verified = models.BooleanField(default=False)
    email_verification_code = models.CharField(max_length=6, blank=True, null=True)
    email_verification_code_expires = models.DateTimeField(blank=True, null=True)

    # Phone Verification
    is_phone_verified = models.BooleanField(default=False)
    phone_verification_code = models.CharField(max_length=6, blank=True, null=True)
    phone_verification_code_expires = models.DateTimeField(blank=True, null=True)

    # Password Reset
    password_reset_code = models.CharField(max_length=255, blank=True, null=True)
    password_reset_code_expires = models.DateTimeField(blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['phone_number']

    objects = UserManager()

    class Meta:
        db_table = 'accounts_user'

    def __str__(self):
        return self.get_full_name() or self.email

    @property
    def is_verified(self):
        return self.is_email_verified and self.is_phone_verified

    def generate_email_otp(self):
        """Generate 6-digit email verification OTP."""
        code = str(random.randint(100000, 999999))
        self.email_verification_code = code
        self.email_verification_code_expires = timezone.now() + timedelta(minutes=10)
        self.save(update_fields=['email_verification_code', 'email_verification_code_expires'])
        return code

    def generate_phone_otp(self):
        """Generate 6-digit phone verification OTP."""
        code = str(random.randint(100000, 999999))
        self.phone_verification_code = code
        self.phone_verification_code_expires = timezone.now() + timedelta(minutes=5)
        self.save(update_fields=['phone_verification_code', 'phone_verification_code_expires'])
        return code

    def verify_email_otp(self, code):
        """Verify email OTP. Returns True if valid."""
        if (
            self.email_verification_code == code
            and self.email_verification_code_expires
            and self.email_verification_code_expires > timezone.now()
        ):
            self.is_email_verified = True
            self.email_verification_code = None
            self.email_verification_code_expires = None
            self.save(update_fields=['is_email_verified', 'email_verification_code', 'email_verification_code_expires'])
            return True
        return False

    def verify_phone_otp(self, code):
        """Verify phone OTP. Returns True if valid."""
        if (
            self.phone_verification_code == code
            and self.phone_verification_code_expires
            and self.phone_verification_code_expires > timezone.now()
        ):
            self.is_phone_verified = True
            self.phone_verification_code = None
            self.phone_verification_code_expires = None
            self.save(update_fields=['is_phone_verified', 'phone_verification_code', 'phone_verification_code_expires'])
            return True
        return False

    def generate_password_reset_code(self):
        """Generate password reset code."""
        code = str(random.randint(100000, 999999))
        self.password_reset_code = code
        self.password_reset_code_expires = timezone.now() + timedelta(minutes=10)
        self.save(update_fields=['password_reset_code', 'password_reset_code_expires'])
        return code
