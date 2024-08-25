from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView, DetailView, RedirectView
from django.contrib.auth import logout
from ex00.models import Article, UserFavouriteArticle
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

class PublicationView(ListView):
    model = Article
    template_name = 'ex01/publication.html'

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Article.objects.filter(author=self.request.user)
        else:
            return Article.objects.none()

class ArticleDetailView(DetailView):
    model = Article
    template_name = 'ex01/article_detail.html'
    context_object_name = 'article'

class FavouritesView(ListView):
    model = UserFavouriteArticle
    template_name = 'ex01/favourites.html'
    context_object_name = 'favourites'

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        user = get_object_or_404(User, id=user_id)
        return UserFavouriteArticle.objects.filter(user=user)

class LogoutRedirectView(RedirectView):
    url = reverse_lazy('home')  # 로그아웃 후 리다이렉트할 URL

    def get(self, request, *args, **kwargs):
        logout(request)
        return super().get(request, *args, **kwargs)