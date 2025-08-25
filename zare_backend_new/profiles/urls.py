# profiles/urls.py
from django.urls import path
from . import views, auth_views  # Add auth_views import

app_name = 'profiles'

urlpatterns = [
    # User profile endpoints
    path('profile/', views.get_user_profile, name='get_profile'),
    path('profile/update/', views.update_user_profile, name='update_profile'),
    path('users/', views.get_all_users, name='all_users'),
    
    # Volunteer opportunities
    path('opportunities/', views.get_volunteer_opportunities, name='opportunities'),
    path('opportunities/create/', views.create_volunteer_opportunity, name='create_opportunity'),
    path('opportunities/<int:opportunity_id>/apply/', views.apply_for_opportunity, name='apply_opportunity'),
    
    # Volunteer history
    path('history/', views.get_user_volunteer_history, name='user_history'),
    
    # Social authentication endpoints - ADD THESE
    path('social/login/', auth_views.social_login, name='social_login'),
    path('social/logout/', auth_views.social_logout, name='social_logout'),
]