from django.urls import include, path
from . import views

urlpatterns = [
    path('room_list/', views.chat_room_list, name='chat_room_list'),
    path('room_create/', views.create_chat_room, name='create_chat_room'),
    path('room/<str:room_name>/', views.room, name='chat_room'),
    path('check_room_name/', views.check_room_name, name='check_room_name'),
]