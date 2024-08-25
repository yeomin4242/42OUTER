from django.urls import path
from . import views
from .views import HomeRedirectView, LogoutRedirectView, RegisterView, UserLoginView, LanguageView
from django.utils.translation import gettext_lazy as _

urlpatterns = [
    path(_(''), HomeRedirectView.as_view(), name='home'),
    path(_('login/'), UserLoginView.as_view(), name='login'),
    path(_('logout/'), LogoutRedirectView.as_view(), name='logout'),
    path(_('register/'), RegisterView.as_view(), name='register'),
    path(_('language/'), LanguageView.as_view(), name='profile'),
]