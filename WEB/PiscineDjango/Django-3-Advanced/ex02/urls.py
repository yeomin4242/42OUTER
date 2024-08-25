from django.urls import path
from .views import PublishView, RegisterView, AddFavouriteView

urlpatterns = [
    path('publish/', PublishView.as_view(), name='publish'),
    path('register/', RegisterView.as_view(), name='register'),
    path('favourite/<int:article_id>', AddFavouriteView.as_view(), name='add_to_favourite'),
]
