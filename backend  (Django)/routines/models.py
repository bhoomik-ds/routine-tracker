from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tasks")
    title = models.CharField(max_length=255)
    
    # DDA (Dynamic Difficulty Adjustment) Fields
    current_goal = models.FloatField(default=0.0)  # e.g., 30.0
    unit = models.CharField(max_length=50)         # e.g., "mins" or "pages"
    
    # ==========================================
    # --- HOW WEB NOTIFICATIONS WORK (BACKEND) ---
    # This field stores the exact time (e.g., 14:30:00). 
    # React will read this time and trigger the browser's Push Notification API when the clock matches!
    # null=True, blank=True means the reminder is completely optional.
    # ==========================================
    notification_time = models.TimeField(null=True, blank=True)
    
    # Progress Tracking
    is_completed = models.BooleanField(default=False)
    streak = models.PositiveIntegerField(default=0)
    
    # Date tracking to reset tasks daily
    date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.user.username}"


# ==========================================
# --- USER PROFILE MODEL ---
# ==========================================
class UserProfile(models.Model):
    # OneToOneField ensures one user has exactly one profile
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    
    # --- UPDATED: Replaced date_of_birth with full_name ---
    full_name = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"


# ==========================================
# --- OTP VERIFICATION MODEL ---
# ==========================================
class OTPVerification(models.Model):
    email = models.EmailField(unique=True)
    otp_code = models.CharField(max_length=6)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        # Security Feature: OTP expires after 10 minutes
        expiration_time = self.created_at + timedelta(minutes=10)
        return timezone.now() > expiration_time

    def __str__(self):
        return f"{self.email} - {'Verified' if self.is_verified else 'Pending'}"