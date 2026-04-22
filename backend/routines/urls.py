from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, UserProfileView

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),
    # --- NEW: The endpoint React will call to ask "Who am I?" ---
    path('user/me/', UserProfileView.as_view(), name='user_profile'), 
]