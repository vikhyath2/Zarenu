from django.urls import path
from . import social_auth

app_name = 'auth'

urlpatterns = [
    path('social/login/', social_auth.social_login, name='social_login'),
    path('social/logout/', social_auth.social_logout, name='social_logout'),
    path('profile/', social_auth.get_user_profile, name='get_profile'),
    path('social/link/', social_auth.link_social_account, name='link_social'),
    path('social/unlink/', social_auth.unlink_social_account, name='unlink_social'),
]