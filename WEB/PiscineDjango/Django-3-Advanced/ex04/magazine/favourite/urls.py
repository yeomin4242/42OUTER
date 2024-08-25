from django.urls import path
from .views import FavouritesView, AddFavouriteView

urlpatterns = [
    path('favourites/<int:user_id>', FavouritesView.as_view(), name='favourites'),
    path('favourite/<int:article_id>', AddFavouriteView.as_view(), name='add_to_favourite'),
]