# profiles/admin.py
from django.contrib import admin
from django.contrib.auth.models import User  # Add this import
from .models import UserProfile, VolunteerOpportunity, VolunteerHistory

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'location', 'volunteer_hours', 'created_at')
    list_filter = ('created_at', 'location', 'volunteer_hours')
    search_fields = ('user__username', 'user__email', 'user__first_name', 'user__last_name', 'phone')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Basic Info', {
            'fields': ('phone', 'bio', 'location', 'profile_picture')
        }),
        ('Volunteer Info', {
            'fields': ('volunteer_skills', 'volunteer_interests', 'availability', 'volunteer_hours', 'certifications')
        }),
        ('Preferences', {
            'fields': ('notification_preferences', 'privacy_settings')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(VolunteerOpportunity)
class VolunteerOpportunityAdmin(admin.ModelAdmin):
    list_display = ('title', 'organization', 'location', 'hours_required', 'date_posted', 'created_by')
    list_filter = ('date_posted', 'organization', 'location')
    search_fields = ('title', 'description', 'organization', 'location')
    readonly_fields = ('date_posted',)

@admin.register(VolunteerHistory)
class VolunteerHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'opportunity', 'hours_contributed', 'status', 'start_date', 'rating')
    list_filter = ('status', 'start_date', 'rating')
    search_fields = ('user__username', 'opportunity__title')
    readonly_fields = ('created_at',)

#  User admin to see email/login data
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    fieldsets = (
        ('Quick Profile Info', {
            'fields': ('phone', 'location', 'volunteer_hours'),
            'classes': ('collapse',)
        }),
    )

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['email', 'first_name', 'last_name', 'date_joined', 'last_login', 'is_active']
    list_filter = ['date_joined', 'last_login', 'is_active', 'is_staff']
    search_fields = ['email', 'first_name', 'last_name', 'username']
    readonly_fields = ['date_joined', 'last_login']
    inlines = [UserProfileInline]
    
    fieldsets = (
        ('Login Info', {
            'fields': ('username', 'email', 'password')
        }),
        ('Personal Info', {
            'fields': ('first_name', 'last_name')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
            'classes': ('collapse',)
        }),
        ('Important Dates', {
            'fields': ('last_login', 'date_joined'),
            'classes': ('collapse',)
        }),
    )

# Unregister the default User admin and register our custom one
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)