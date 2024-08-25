from django.urls import path
from . import views
from .views import HomeRedirectView, LogoutRedirectView, RegisterView, UserLoginView

urlpatterns = [
    path('', HomeRedirectView.as_view(), name='home'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', LogoutRedirectView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
]