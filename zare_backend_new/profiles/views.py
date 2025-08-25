# profiles/views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import UserProfile, VolunteerOpportunity, VolunteerHistory
from .serializers import UserProfileSerializer, VolunteerOpportunitySerializer, VolunteerHistorySerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """Get current user's complete profile"""
    try:
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile)
        
        return Response({
            'success': True,
            'profile': serializer.data
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    """Update user profile"""
    try:
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        
        # Update user basic info
        user = request.user
        if 'first_name' in request.data:
            user.first_name = request.data['first_name']
        if 'last_name' in request.data:
            user.last_name = request.data['last_name']
        if 'email' in request.data:
            user.email = request.data['email']
        user.save()
        
        # Update profile
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            
            return Response({
                'success': True,
                'message': 'Profile updated successfully',
                'profile': serializer.data
            })
        else:
            return Response({
                'success': False,
                'error': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_users(request):
    """Get all users with profiles (admin only)"""
    try:
        if not request.user.is_staff:
            return Response({
                'success': False,
                'error': 'Admin access required'
            }, status=status.HTTP_403_FORBIDDEN)
        
        profiles = UserProfile.objects.all().order_by('-created_at')
        serializer = UserProfileSerializer(profiles, many=True)
        
        return Response({
            'success': True,
            'count': len(serializer.data),
            'profiles': serializer.data
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def get_volunteer_opportunities(request):
    """Get all volunteer opportunities"""
    try:
        opportunities = VolunteerOpportunity.objects.all().order_by('-date_posted')
        serializer = VolunteerOpportunitySerializer(opportunities, many=True)
        
        return Response({
            'success': True,
            'count': len(serializer.data),
            'opportunities': serializer.data
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_volunteer_opportunity(request):
    """Create a new volunteer opportunity"""
    try:
        serializer = VolunteerOpportunitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            
            return Response({
                'success': True,
                'message': 'Opportunity created successfully',
                'opportunity': serializer.data
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'success': False,
                'error': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_volunteer_history(request):
    """Get current user's volunteer history"""
    try:
        history = VolunteerHistory.objects.filter(user=request.user).order_by('-created_at')
        serializer = VolunteerHistorySerializer(history, many=True)
        
        return Response({
            'success': True,
            'count': len(serializer.data),
            'history': serializer.data
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_for_opportunity(request, opportunity_id):
    """Apply for a volunteer opportunity"""
    try:
        opportunity = VolunteerOpportunity.objects.get(id=opportunity_id)
        
        # Check if user already applied
        if VolunteerHistory.objects.filter(user=request.user, opportunity=opportunity).exists():
            return Response({
                'success': False,
                'error': 'You have already applied for this opportunity'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create application
        history = VolunteerHistory.objects.create(
            user=request.user,
            opportunity=opportunity,
            start_date=request.data.get('start_date'),
            status='applied'
        )
        
        serializer = VolunteerHistorySerializer(history)
        
        return Response({
            'success': True,
            'message': 'Application submitted successfully',
            'application': serializer.data
        }, status=status.HTTP_201_CREATED)
        
    except VolunteerOpportunity.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Opportunity not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)