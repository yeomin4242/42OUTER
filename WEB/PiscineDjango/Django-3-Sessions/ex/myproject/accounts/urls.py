from django.urls import path
from . import views


urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('home/', views.home, name='home'),
    path('upvote/<int:tip_id>/', views.upvote_tip, name='upvote'),
    path('downvote/<int:tip_id>/', views.downvote_tip, name='downvote'),
    path('delete/<int:tip_id>/', views.delete_tip, name='delete'),
    path('admin/', views.admin, name='admin'),
    path('admin/delete/<int:userId>/<int:tipId>/', views.delete_admin_request, name='delete_admin_action'),
    path('admin/downvote/<int:userId>/<int:tipId>/', views.downvote_admin_request, name='downvote_admin_action'),
]
