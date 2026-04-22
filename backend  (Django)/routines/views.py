import random
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import viewsets, permissions, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User

from .models import Task, OTPVerification
from .serializers import (
    TaskSerializer, 
    UserSerializer,
    SendOTPSerializer,
    VerifyOTPSerializer,
    FinalRegisterSerializer,
    ResetPasswordSerializer # NEW
)

# ==========================================
# --- REGISTRATION OTP VIEWS ---
# ==========================================
class SendOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            # Registration Check: Fail if user ALREADY exists
            if User.objects.filter(email=email).exists():
                return Response({"error": "An account with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)

            otp_code = str(random.randint(100000, 999999))
            
            OTPVerification.objects.update_or_create(
                email=email,
                defaults={'otp_code': otp_code, 'is_verified': False, 'created_at': timezone.now()}
            )

            subject = "Your Routine Tracker Security Code"
            message = f"Hello,\n\nYour 6-digit registration code is: {otp_code}\n\nThis code will expire in 10 minutes."
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])

            return Response({"message": "OTP sent to your email."}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(APIView):
    # We reuse this view for BOTH Registration and Forgot Password!
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            code = serializer.validated_data['otp_code']

            try:
                otp_record = OTPVerification.objects.get(email=email, otp_code=code)
                
                if otp_record.is_expired():
                    return Response({"error": "This OTP has expired. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)
                
                otp_record.is_verified = True
                otp_record.save()
                
                return Response({"message": "Email verified successfully."}, status=status.HTTP_200_OK)

            except OTPVerification.DoesNotExist:
                return Response({"error": "Invalid OTP code."}, status=status.HTTP_400_BAD_REQUEST)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FinalRegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = FinalRegisterSerializer


# ==========================================
# --- NEW: FORGOT PASSWORD VIEWS ---
# ==========================================
class ForgotPasswordSendOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            # Forgot Password Check: Fail if user DOES NOT exist
            if not User.objects.filter(email=email).exists():
                return Response({"error": "No account found with this email."}, status=status.HTTP_400_BAD_REQUEST)

            otp_code = str(random.randint(100000, 999999))
            
            OTPVerification.objects.update_or_create(
                email=email,
                defaults={'otp_code': otp_code, 'is_verified': False, 'created_at': timezone.now()}
            )

            subject = "Routine Tracker Password Reset"
            message = f"Hello,\n\nYour 6-digit password reset code is: {otp_code}\n\nThis code will expire in 10 minutes."
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])

            return Response({"message": "Password reset OTP sent to your email."}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==========================================
# --- USER PROFILE & TASK VIEWS ---
# ==========================================
class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# ==========================================
# --- USER PROFILE & TASK VIEWS ---
# ==========================================
class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        user = request.user
        data = request.data

        # 1. Update the Base User Model (Username)
        if 'username' in data:
            user.username = data['username']
        user.save()

        # 2. Update the Linked Profile Model (Full Name instead of DOB)
        if 'full_name' in data: # <--- CHANGED THIS
            profile = user.profile
            profile.full_name = data['full_name'] # <--- CHANGED THIS
            profile.save()

        # Return the freshly updated data back to React
        serializer = UserSerializer(user)
        return Response(serializer.data)