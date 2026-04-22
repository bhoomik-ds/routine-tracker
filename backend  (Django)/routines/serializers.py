import re
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Task, OTPVerification, UserProfile

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'current_goal', 'unit', 'notification_time', 'is_completed', 'streak', 'date']

# ==========================================
# --- OTP & REGISTRATION SERIALIZERS ---
# ==========================================

class SendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()

class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6)

class FinalRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)
    
    # --- UPDATED: Swapped date_of_birth for full_name ---
    full_name = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'full_name', 'password', 'confirm_password')
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        # 1. Check if Passwords match
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})

        # 2. Check Password Security Rules
        password = data['password']
        if len(password) < 8:
            raise serializers.ValidationError({"password": "Password must be at least 8 characters long."})
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            raise serializers.ValidationError({"password": "Password must contain at least one special character."})

        # 3. Check if the Email has been OTP Verified
        email = data['email']
        try:
            otp_record = OTPVerification.objects.get(email=email)
            if not otp_record.is_verified:
                raise serializers.ValidationError({"email": "This email has not been verified yet."})
        except OTPVerification.DoesNotExist:
            raise serializers.ValidationError({"email": "Please verify your email first before registering."})

        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        
        # --- UPDATED: Extract full_name ---
        full_name = validated_data.pop('full_name')
        email = validated_data['email']

        # Create the standard User
        user = User.objects.create_user(
            username=email, 
            email=email,
            password=validated_data['password']
        )

        # --- UPDATED: Save full_name to the linked profile ---
        UserProfile.objects.create(user=user, full_name=full_name)
        OTPVerification.objects.filter(email=email).delete()

        return user

# ==========================================
# --- FORGOT PASSWORD SERIALIZER ---
# ==========================================
class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
            
        password = data['password']
        if len(password) < 8:
            raise serializers.ValidationError({"password": "Password must be at least 8 characters long."})
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            raise serializers.ValidationError({"password": "Password must contain at least one special character."})

        email = data['email']
        try:
            otp_record = OTPVerification.objects.get(email=email)
            if not otp_record.is_verified:
                raise serializers.ValidationError({"email": "This email has not been verified yet."})
        except OTPVerification.DoesNotExist:
            raise serializers.ValidationError({"email": "Please verify your email first before resetting password."})

        return data

    def save(self):
        email = self.validated_data['email']
        password = self.validated_data['password']
        
        user = User.objects.get(email=email)
        user.set_password(password) # Safely hashes the new password
        user.save()
        
        OTPVerification.objects.filter(email=email).delete()
        return user


# ==========================================
# --- USER PROFILE SERIALIZER ---
# ==========================================
class UserSerializer(serializers.ModelSerializer):
    # --- UPDATED: Pull full_name from the profile instead of DOB ---
    full_name = serializers.CharField(source='profile.full_name', read_only=True)
    email = serializers.EmailField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name']