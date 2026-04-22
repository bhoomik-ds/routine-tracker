from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Task

@admin.register(Task)
class TaskAdmin(ModelAdmin):
    list_display = ["title", "user", "current_goal", "unit", "is_completed", "streak", "date"]
    list_filter = ["is_completed", "date", "user"]
    search_fields = ["title", "user__username"]
    
    # This makes the admin dashboard look cleaner with Unfold
    compressed_fields = True 
    warn_unsaved_form = True