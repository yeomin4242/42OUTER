from django.urls import path
from . import views

urlpatterns = [
    path('init/', views.create_table),
]