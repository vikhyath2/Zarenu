# profiles/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, VolunteerOpportunity, VolunteerHistory

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name', 'date_joined', 'last_login']
        read_only_fields = ['id', 'username', 'date_joined', 'last_login']
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    # FIXED: Removed source='full_name' since it's redundant
    full_name = serializers.CharField(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'user', 'full_name', 'phone', 'bio', 'location', 'profile_picture',
            'volunteer_skills', 'volunteer_interests', 'availability', 
            'volunteer_hours', 'certifications', 'notification_preferences',
            'privacy_settings', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'volunteer_hours']

class VolunteerOpportunitySerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = VolunteerOpportunity
        fields = [
            'id', 'title', 'description', 'organization', 'location',
            'skills_required', 'date_posted', 'deadline', 'hours_required', 'created_by'
        ]
        read_only_fields = ['id', 'date_posted', 'created_by']

class VolunteerHistorySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    opportunity = VolunteerOpportunitySerializer(read_only=True)
    
    class Meta:
        model = VolunteerHistory
        fields = [
            'id', 'user', 'opportunity', 'hours_contributed', 'start_date',
            'end_date', 'status', 'feedback', 'rating', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']