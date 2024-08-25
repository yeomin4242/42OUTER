from django.urls import path
from .views import ArticleListView, ArticleDetailView, PublicationView, PublishView


urlpatterns = [
    path('articles/', ArticleListView.as_view(), name='article_list'),
    path('article/<int:pk>/', ArticleDetailView.as_view(), name='article_detail'),
    path('publications/', PublicationView.as_view(), name='publications'),
    path('publish/', PublishView.as_view(), name='publish'),
]