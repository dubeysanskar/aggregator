from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'phone_number', 'first_name', 'last_name', 'company_name', 'is_email_verified', 'is_phone_verified', 'date_joined')
    list_filter = ('is_email_verified', 'is_phone_verified', 'is_staff')
    search_fields = ('email', 'phone_number', 'first_name', 'last_name', 'company_name')
    ordering = ('-date_joined',)
