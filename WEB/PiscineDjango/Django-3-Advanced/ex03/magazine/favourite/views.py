from django.shortcuts import get_object_or_404, redirect
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.urls import reverse_lazy
from django.views.generic import CreateView, ListView
from .models import UserFavouriteArticle

# Create your views here.
class FavouritesView(ListView):
    model = UserFavouriteArticle
    template_name = 'favourite/favourites.html'
    context_object_name = 'favourites'

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        user = get_object_or_404(User, id=user_id)
        return UserFavouriteArticle.objects.filter(user=user)

class AddFavouriteView(LoginRequiredMixin, CreateView):
    success_url = reverse_lazy('publications')  # 필요에 따라 조정

    def post(self, request, *args, **kwargs):
        article_id = self.kwargs.get('article_id')
        user = request.user
        # 이미 즐겨찾기에 추가된 경우를 체크
        if not UserFavouriteArticle.objects.filter(user=user, article_id=article_id).exists():
            UserFavouriteArticle.objects.create(user=user, article_id=article_id)
        else :
            UserFavouriteArticle.objects.filter(user=user, article_id=article_id).delete()
        return redirect(self.success_url)