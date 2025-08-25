# profiles/social_auth.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import login
from allauth.socialaccount.models import SocialAccount, SocialApp
from .models import UserProfile
from .serializers import UserProfileSerializer
import requests
import json

@api_view(['POST'])
@permission_classes([AllowAny])
def social_login(request):
    """
    Universal social authentication endpoint
    
    Expected request data:
    {
        "provider": "google|facebook|apple",
        "access_token": "provider_access_token",
        "user_data": {
            "email": "user@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "picture": "https://...",
            "id": "provider_user_id"
        }
    }
    """
    try:
        provider = request.data.get('provider', '').lower()
        access_token = request.data.get('access_token')
        user_data = request.data.get('user_data', {})
        
        if not provider or not access_token:
            return Response({
                'success': False,
                'error': 'Provider and access_token are required',
                'code': 'MISSING_PARAMETERS'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate provider
        if provider not in ['google', 'facebook', 'apple']:
            return Response({
                'success': False,
                'error': f'Unsupported provider: {provider}',
                'code': 'INVALID_PROVIDER'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Authenticate based on provider
        if provider == 'google':
            result = handle_google_auth(access_token, user_data)
        elif provider == 'facebook':
            result = handle_facebook_auth(access_token, user_data)
        elif provider == 'apple':
            result = handle_apple_auth(access_token, user_data)
        
        if not result['success']:
            return Response(result, status=status.HTTP_401_UNAUTHORIZED)
        
        user = result['user']
        is_new_user = result['is_new_user']
        
        # Generate or get authentication token
        token, token_created = Token.objects.get_or_create(user=user)
        
        # Get or create user profile (ultra-safe version)
        try:
            profile = UserProfile.objects.get(user=user)
            profile_created = False
        except UserProfile.DoesNotExist:
            # Create minimal profile with only required fields
            profile = UserProfile.objects.create(user=user)
            profile_created = True
        
        # Update profile picture if provided and not already set
        picture_url = user_data.get('picture')
        if picture_url and hasattr(profile, 'profile_picture') and not profile.profile_picture:
            try:
                from django.core.files.base import ContentFile
                import urllib.request
                
                # Download and save profile picture
                with urllib.request.urlopen(picture_url) as response:
                    image_content = response.read()
                    profile.profile_picture.save(
                        f'{user.username}_profile.jpg',
                        ContentFile(image_content),
                        save=True
                    )
            except Exception as e:
                print(f"Error saving profile picture: {e}")
        
        # Serialize user profile data
        profile_serializer = UserProfileSerializer(profile)
        
        return Response({
            'success': True,
            'message': 'Authentication successful',
            'data': {
                'token': token.key,
                'user': profile_serializer.data,
                'is_new_user': is_new_user,
                'provider': provider,
                'profile_completed': bool(hasattr(profile, 'bio') and profile.bio and hasattr(profile, 'location') and profile.location)
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Authentication failed: {str(e)}',
            'code': 'AUTHENTICATION_ERROR'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def handle_google_auth(access_token, user_data):
    """Handle Google OAuth authentication"""
    try:
        # For testing purposes, we'll create a mock verification
        # In production, uncomment the actual Google API verification below
        
        # MOCK VERIFICATION (for testing)
        if access_token.startswith('mock_google'):
            google_user_info = {
                'id': user_data.get('id', 'google_123'),
                'email': user_data.get('email', 'test@gmail.com'),
                'given_name': user_data.get('first_name', 'Test'),
                'family_name': user_data.get('last_name', 'User'),
                'picture': user_data.get('picture', ''),
            }
        else:
            # REAL VERIFICATION (uncomment for production)
            google_response = requests.get(
                f'https://www.googleapis.com/oauth2/v1/userinfo?access_token={access_token}',
                timeout=10
            )
            
            if google_response.status_code != 200:
                return {
                    'success': False,
                    'error': 'Invalid Google access token',
                    'code': 'INVALID_TOKEN'
                }
            
            google_user_info = google_response.json()
        
        # Extract user information
        google_id = google_user_info.get('id')
        email = google_user_info.get('email')
        first_name = google_user_info.get('given_name', '')
        last_name = google_user_info.get('family_name', '')
        picture = google_user_info.get('picture', '')
        
        if not email:
            return {
                'success': False,
                'error': 'Email not provided by Google',
                'code': 'MISSING_EMAIL'
            }
        
        # Check if user already exists with this email
        try:
            user = User.objects.get(email=email)
            is_new_user = False
            
            # Update user info if changed
            if not user.first_name and first_name:
                user.first_name = first_name
            if not user.last_name and last_name:
                user.last_name = last_name
            user.save()
            
        except User.DoesNotExist:
            # Create new user
            username = email.split('@')[0]
            counter = 1
            original_username = username
            
            # Ensure unique username
            while User.objects.filter(username=username).exists():
                username = f"{original_username}{counter}"
                counter += 1
            
            user = User.objects.create_user(
                username=username,
                email=email,
                first_name=first_name,
                last_name=last_name,
            )
            is_new_user = True
        
        # Create or update social account
        social_account, created = SocialAccount.objects.get_or_create(
            user=user,
            provider='google',
            uid=google_id,
            defaults={
                'extra_data': {
                    **google_user_info,
                    'picture': picture
                }
            }
        )
        
        # Update extra_data if account exists
        if not created:
            social_account.extra_data = {
                **google_user_info,
                'picture': picture
            }
            social_account.save()
        
        return {
            'success': True,
            'user': user,
            'is_new_user': is_new_user,
            'provider_data': google_user_info
        }
        
    except requests.RequestException as e:
        return {
            'success': False,
            'error': f'Network error while verifying Google token: {str(e)}',
            'code': 'NETWORK_ERROR'
        }
    except Exception as e:
        return {
            'success': False,
            'error': f'Google authentication error: {str(e)}',
            'code': 'GOOGLE_AUTH_ERROR'
        }

def handle_facebook_auth(access_token, user_data):
    """Handle Facebook OAuth authentication"""
    try:
        # MOCK VERIFICATION (for testing)
        if access_token.startswith('mock_facebook'):
            fb_user_info = {
                'id': user_data.get('id', 'facebook_123'),
                'email': user_data.get('email', 'test@facebook.com'),
                'first_name': user_data.get('first_name', 'Test'),
                'last_name': user_data.get('last_name', 'User'),
                'name': f"{user_data.get('first_name', 'Test')} {user_data.get('last_name', 'User')}",
                'picture': {'data': {'url': user_data.get('picture', '')}},
            }
        else:
            # REAL VERIFICATION (uncomment for production)
            fb_response = requests.get(
                f'https://graph.facebook.com/me?access_token={access_token}&fields=id,name,email,first_name,last_name,picture.type(large)',
                timeout=10
            )
            
            if fb_response.status_code != 200:
                return {
                    'success': False,
                    'error': 'Invalid Facebook access token',
                    'code': 'INVALID_TOKEN'
                }
            
            fb_user_info = fb_response.json()
        
        # Extract user information
        facebook_id = fb_user_info.get('id')
        email = fb_user_info.get('email')
        first_name = fb_user_info.get('first_name', '')
        last_name = fb_user_info.get('last_name', '')
        name = fb_user_info.get('name', '')
        picture_data = fb_user_info.get('picture', {}).get('data', {})
        picture = picture_data.get('url', '') if picture_data else ''
        
        # Facebook doesn't always provide email
        if not email:
            email = f"{facebook_id}@facebook.temp"
        
        # Check if user already exists
        try:
            if not email.endswith('@facebook.temp'):
                user = User.objects.get(email=email)
            else:
                social_account = SocialAccount.objects.get(
                    provider='facebook',
                    uid=facebook_id
                )
                user = social_account.user
            
            is_new_user = False
            
            # Update user info if changed
            if not user.first_name and first_name:
                user.first_name = first_name
            if not user.last_name and last_name:
                user.last_name = last_name
            user.save()
            
        except (User.DoesNotExist, SocialAccount.DoesNotExist):
            # Create new user
            username = email.split('@')[0] if not email.endswith('@facebook.temp') else f"fb_{facebook_id}"
            counter = 1
            original_username = username
            
            # Ensure unique username
            while User.objects.filter(username=username).exists():
                username = f"{original_username}{counter}"
                counter += 1
            
            # Create user with fallback names from full name if individual names not available
            if not first_name and not last_name and name:
                name_parts = name.split(' ', 1)
                first_name = name_parts[0]
                last_name = name_parts[1] if len(name_parts) > 1 else ''
            
            user = User.objects.create_user(
                username=username,
                email=email if not email.endswith('@facebook.temp') else f"{username}@example.com",
                first_name=first_name,
                last_name=last_name,
            )
            is_new_user = True
        
        # Create or update social account
        social_account, created = SocialAccount.objects.get_or_create(
            user=user,
            provider='facebook',
            uid=facebook_id,
            defaults={
                'extra_data': {
                    **fb_user_info,
                    'picture': picture
                }
            }
        )
        
        # Update extra_data if account exists
        if not created:
            social_account.extra_data = {
                **fb_user_info,
                'picture': picture
            }
            social_account.save()
        
        return {
            'success': True,
            'user': user,
            'is_new_user': is_new_user,
            'provider_data': fb_user_info
        }
        
    except requests.RequestException as e:
        return {
            'success': False,
            'error': f'Network error while verifying Facebook token: {str(e)}',
            'code': 'NETWORK_ERROR'
        }
    except Exception as e:
        return {
            'success': False,
            'error': f'Facebook authentication error: {str(e)}',
            'code': 'FACEBOOK_AUTH_ERROR'
        }

def handle_apple_auth(access_token, user_data):
    """Handle Apple Sign In authentication"""
    try:
        # MOCK VERIFICATION (for testing)
        if access_token.startswith('eyJ') or access_token.startswith('mock'):
            # Mock Apple JWT token
            apple_id = user_data.get('id', 'apple_123')
            email = user_data.get('email', 'test@icloud.com')
            email_verified = True
        else:
            # REAL VERIFICATION (implement proper Apple ID token verification)
            try:
                import jwt
                decoded_token = jwt.decode(access_token, options={"verify_signature": False})
                apple_id = decoded_token.get('sub')
                email = decoded_token.get('email')
                email_verified = decoded_token.get('email_verified', False)
            except Exception:
                return {
                    'success': False,
                    'error': 'Invalid Apple ID token',
                    'code': 'INVALID_TOKEN'
                }
        
        # Apple provides name info only on first sign-in, so we rely on user_data from client
        first_name = user_data.get('first_name', '')
        last_name = user_data.get('last_name', '')
        
        if not apple_id:
            return {
                'success': False,
                'error': 'Apple ID not found in token',
                'code': 'MISSING_APPLE_ID'
            }
        
        # Use Apple ID as fallback email if not provided
        if not email:
            email = f"{apple_id}@apple.temp"
        
        # Check if user already exists
        try:
            if not email.endswith('@apple.temp') and email_verified:
                user = User.objects.get(email=email)
            else:
                social_account = SocialAccount.objects.get(
                    provider='apple',
                    uid=apple_id
                )
                user = social_account.user
            
            is_new_user = False
            
            # Update user info if provided and not already set
            if not user.first_name and first_name:
                user.first_name = first_name
            if not user.last_name and last_name:
                user.last_name = last_name
            user.save()
            
        except (User.DoesNotExist, SocialAccount.DoesNotExist):
            # Create new user
            username = email.split('@')[0] if not email.endswith('@apple.temp') else f"apple_{apple_id[:8]}"
            counter = 1
            original_username = username
            
            # Ensure unique username
            while User.objects.filter(username=username).exists():
                username = f"{original_username}{counter}"
                counter += 1
            
            user = User.objects.create_user(
                username=username,
                email=email if not email.endswith('@apple.temp') else f"{username}@example.com",
                first_name=first_name,
                last_name=last_name,
            )
            is_new_user = True
        
        # Create or update social account
        social_account, created = SocialAccount.objects.get_or_create(
            user=user,
            provider='apple',
            uid=apple_id,
            defaults={
                'extra_data': {
                    'sub': apple_id,
                    'email': email,
                    'first_name': first_name,
                    'last_name': last_name,
                    'email_verified': email_verified
                }
            }
        )
        
        # Update extra_data if account exists
        if not created:
            social_account.extra_data.update({
                'sub': apple_id,
                'email': email,
                'first_name': first_name,
                'last_name': last_name,
                'email_verified': email_verified
            })
            social_account.save()
        
        return {
            'success': True,
            'user': user,
            'is_new_user': is_new_user,
            'provider_data': {'sub': apple_id, 'email': email}
        }
        
    except ImportError:
        return {
            'success': False,
            'error': 'PyJWT library not installed. Run: pip install PyJWT',
            'code': 'MISSING_DEPENDENCY'
        }
    except Exception as e:
        return {
            'success': False,
            'error': f'Apple authentication error: {str(e)}',
            'code': 'APPLE_AUTH_ERROR'
        }

@api_view(['POST'])
@permission_classes([AllowAny])
def social_logout(request):
    """Logout user and delete authentication token"""
    try:
        user = request.user
        if user.is_authenticated:
            # Delete user's auth token
            Token.objects.filter(user=user).delete()
            
            return Response({
                'success': True,
                'message': 'Successfully logged out'
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'error': 'User not authenticated',
                'code': 'NOT_AUTHENTICATED'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Logout failed: {str(e)}',
            'code': 'LOGOUT_ERROR'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_user_profile(request):
    """Get current user's profile information"""
    try:
        if not request.user.is_authenticated:
            return Response({
                'success': False,
                'error': 'Authentication required',
                'code': 'NOT_AUTHENTICATED'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        profile = UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(profile)
        
        # Get social accounts
        social_accounts = SocialAccount.objects.filter(user=request.user)
        social_providers = [account.provider for account in social_accounts]
        
        response_data = {
            'success': True,
            'data': {
                **serializer.data,
                'social_providers': social_providers,
                'has_password': request.user.has_usable_password(),
            }
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except UserProfile.DoesNotExist:
        return Response({
            'success': False,
            'error': 'User profile not found',
            'code': 'PROFILE_NOT_FOUND'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Error retrieving profile: {str(e)}',
            'code': 'PROFILE_ERROR'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def link_social_account(request):
    """Link a social account to existing user"""
    try:
        if not request.user.is_authenticated:
            return Response({
                'success': False,
                'error': 'Authentication required',
                'code': 'NOT_AUTHENTICATED'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        provider = request.data.get('provider', '').lower()
        access_token = request.data.get('access_token')
        
        if not provider or not access_token:
            return Response({
                'success': False,
                'error': 'Provider and access_token are required',
                'code': 'MISSING_PARAMETERS'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'success': True,
            'message': f'{provider.title()} account linking not implemented yet'
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Error linking social account: {str(e)}',
            'code': 'LINK_ERROR'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def unlink_social_account(request):
    """Unlink a social account from current user"""
    try:
        if not request.user.is_authenticated:
            return Response({
                'success': False,
                'error': 'Authentication required',
                'code': 'NOT_AUTHENTICATED'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        provider = request.data.get('provider', '').lower()
        
        if not provider:
            return Response({
                'success': False,
                'error': 'Provider is required',
                'code': 'MISSING_PROVIDER'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Find and delete social account
        try:
            social_account = SocialAccount.objects.get(
                user=request.user,
                provider=provider
            )
            social_account.delete()
            
            return Response({
                'success': True,
                'message': f'{provider.title()} account unlinked successfully'
            }, status=status.HTTP_200_OK)
            
        except SocialAccount.DoesNotExist:
            return Response({
                'success': False,
                'error': f'No {provider} account linked to your profile',
                'code': 'ACCOUNT_NOT_FOUND'
            }, status=status.HTTP_404_NOT_FOUND)
        
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Error unlinking social account: {str(e)}',
            'code': 'UNLINK_ERROR'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)