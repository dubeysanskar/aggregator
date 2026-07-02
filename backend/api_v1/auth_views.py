from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from accounts.models import User
from .serializers import (
    RegisterSerializer, LoginSerializer, VerifyOTPSerializer,
    ForgotPasswordSerializer, ResetPasswordSerializer, UserProfileSerializer,
)


class RegisterView(APIView):
    """POST /api/v1/auth/register/ — Create new merchant account."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate verification OTPs
        email_otp = user.generate_email_otp()
        phone_otp = user.generate_phone_otp()

        # TODO: Send email_otp via email service
        # TODO: Send phone_otp via SMS service (BhashSMS)

        return Response({
            'message': 'Account created. Please verify your email and phone.',
            'email': user.email,
            'phone': user.phone_number,
            # In debug mode, include OTPs for testing
            'debug_email_otp': email_otp,
            'debug_phone_otp': phone_otp,
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """POST /api/v1/auth/login/ — JWT login."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password']
        )

        if not user:
            return Response(
                {'error': 'Invalid email or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {'error': 'Account is deactivated'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserProfileSerializer(user).data,
        })


class VerifyEmailView(APIView):
    """POST /api/v1/auth/verify-email/ — Verify email with OTP."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = User.objects.get(email=serializer.validated_data['email'])
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if user.verify_email_otp(serializer.validated_data['code']):
            return Response({'message': 'Email verified successfully'})
        return Response({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)


class VerifyPhoneView(APIView):
    """POST /api/v1/auth/verify-phone/ — Verify phone with OTP."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = User.objects.get(email=serializer.validated_data['email'])
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if user.verify_phone_otp(serializer.validated_data['code']):
            return Response({'message': 'Phone verified successfully'})
        return Response({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordView(APIView):
    """POST /api/v1/auth/forgot-password/ — Send password reset code."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = User.objects.get(email=serializer.validated_data['email'])
            code = user.generate_password_reset_code()
            # TODO: Send code via email
            return Response({
                'message': 'Password reset code sent to your email',
                'debug_code': code,
            })
        except User.DoesNotExist:
            # Don't reveal if email exists
            return Response({'message': 'If this email exists, a reset code has been sent'})


class ResetPasswordView(APIView):
    """POST /api/v1/auth/reset-password/ — Reset password with code."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = User.objects.get(email=serializer.validated_data['email'])
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        from django.utils import timezone
        if (
            user.password_reset_code == serializer.validated_data['code']
            and user.password_reset_code_expires
            and user.password_reset_code_expires > timezone.now()
        ):
            user.set_password(serializer.validated_data['new_password'])
            user.password_reset_code = None
            user.password_reset_code_expires = None
            user.save()
            return Response({'message': 'Password reset successfully'})

        return Response({'error': 'Invalid or expired code'}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    """GET /api/v1/auth/profile/ — Get current user profile."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserProfileSerializer(request.user).data)
