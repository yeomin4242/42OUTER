from django.urls import path
from .views import PublicationView, ArticleDetailView, FavouritesView, LogoutRedirectView
from django.contrib.auth.views import LogoutView

urlpatterns = [
    path('publications/', PublicationView.as_view(), name='publications'),
    path('article/<int:pk>/', ArticleDetailView.as_view(), name='article_detail'),
    path('logout/', LogoutRedirectView.as_view(), name='logout'),
    path('favourites/<int:user_id>', FavouritesView.as_view(), name='favourites'),
]
