from django.urls import path
from . import views

urlpatterns = [
    path('', views.movie_search, name='ex10'),
]
