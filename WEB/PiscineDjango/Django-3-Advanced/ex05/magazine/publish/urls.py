from django.urls import path
from .views import ArticleListView, ArticleDetailView, PublicationView, PublishView
from django.utils.translation import gettext_lazy as _

urlpatterns = [
    path(_('articles/'), ArticleListView.as_view(), name='article_list'),
    path(_('article/<int:pk>/'), ArticleDetailView.as_view(), name='article_detail'),
    path(_('publications/'), PublicationView.as_view(), name='publications'),
    path(_('publish/'), PublishView.as_view(), name='publish'),
]