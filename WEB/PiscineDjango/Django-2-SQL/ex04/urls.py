from django.urls import path
from . import views

urlpatterns = [
    path('init/', views.create_table),
    path('populate/', views.populate_table),
    path('display/', views.display_table),
    path('remove/', views.remove_table),
]