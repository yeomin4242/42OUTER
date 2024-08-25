from django.urls import path
from .views import FavouritesView, AddFavouriteView
from django.utils.translation import gettext_lazy as _

urlpatterns = [
    path(_('favourites/<int:user_id>'), FavouritesView.as_view(), name='favourites'),
    path(_('favourite/<int:article_id>'), AddFavouriteView.as_view(), name='add_to_favourite'),
]