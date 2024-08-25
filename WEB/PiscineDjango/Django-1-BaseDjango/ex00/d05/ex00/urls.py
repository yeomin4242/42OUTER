from django.contrib import admin
from django.urls import path
from .views import ex00

urlpatterns = [
    path('', ex00)
]
