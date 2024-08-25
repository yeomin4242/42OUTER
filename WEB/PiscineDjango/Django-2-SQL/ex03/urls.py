from django.urls import path
from . import views

urlpatterns = [
    path('populate/', views.populate_table),
    path('display/', views.display_table),
]