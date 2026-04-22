from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse # <--- NEW: Import HttpResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from routines.views import (
    SendOTPView, 
    VerifyOTPView, 
    FinalRegisterView,
    ForgotPasswordSendOTPView, 
    ResetPasswordView          
)

# --- NEW: Simple view to handle the empty root URL ---
def api_root(request):
    return HttpResponse("Welcome to the Routine Tracker API. The server is running perfectly!")

urlpatterns = [
    # --- NEW: Map the root URL to our simple view ---
    path('', api_root, name='api_root'),
    
    path('admin/', admin.site.urls),
    path('api/', include('routines.urls')),
    
    # Auth Endpoints (Login/Tokens)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Registration Endpoints
    path('api/auth/send-otp/', SendOTPView.as_view(), name='send_otp'),
    path('api/auth/verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('api/auth/register/', FinalRegisterView.as_view(), name='final_register'),

    # Forgot Password Endpoints
    path('api/auth/forgot-password/send-otp/', ForgotPasswordSendOTPView.as_view(), name='forgot_password_send_otp'),
    path('api/auth/forgot-password/reset/', ResetPasswordView.as_view(), name='reset_password'),
]