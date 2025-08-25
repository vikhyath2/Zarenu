# profiles/auth_views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .models import UserProfile
from .serializers import UserProfileSerializer
import json

@api_view(['POST'])
@permission_classes([AllowAny])
def social_login(request):
    """Handle social login from frontend"""
    try:
        data = request.data
        provider = data.get('provider')
        access_token = data.get('access_token')
        user_data = data.get('user_data', {})
        
        if not provider or not access_token:
            return Response({
                'success': False,
                'error': 'Provider and access_token are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # For now, we'll use the user_data from frontend
        # Later you can verify the token with the actual provider
        email = user_data.get('email')
        first_name = user_data.get('first_name', '')
        last_name = user_data.get('last_name', '')
        
        if not email:
            return Response({
                'success': False,
                'error': 'Email is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user exists
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email,
                'first_name': first_name,
                'last_name': last_name,
            }
        )
        
        # Update user info if needed
        if not created:
            if first_name and not user.first_name:
                user.first_name = first_name
            if last_name and not user.last_name:
                user.last_name = last_name
            user.save()
        
        # Create or get user profile
        profile, profile_created = UserProfile.objects.get_or_create(user=user)
        
        # Get or create auth token
        token, token_created = Token.objects.get_or_create(user=user)
        
        # Serialize user profile
        profile_serializer = UserProfileSerializer(profile)
        
        return Response({
            'success': True,
            'message': 'Login successful',
            'data': {
                'token': token.key,
                'user': profile_serializer.data,
                'is_new_user': created,
                'provider': provider
            }
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def social_logout(request):
    """Handle social logout"""
    try:
        # For token-based auth, just return success
        # The frontend will clear the token
        return Response({
            'success': True,
            'message': 'Logout successful'
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)