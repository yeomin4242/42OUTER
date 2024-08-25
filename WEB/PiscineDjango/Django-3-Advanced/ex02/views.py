from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.edit import CreateView
from ex00.models import Article, UserFavouriteArticle
from .forms import ArticleForm, UserCreationForm
from django.urls import reverse_lazy
from django.contrib.auth.models import User
from django.shortcuts import redirect

class PublishView(LoginRequiredMixin, CreateView):
    model = Article
    form_class = ArticleForm
    template_name = 'ex02/publish.html'
    success_url = reverse_lazy('publications')  # Adjust as necessary

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)

class RegisterView(CreateView):
    model = User
    form_class = UserCreationForm
    template_name = 'ex02/register.html'
    success_url = reverse_lazy('login')  # Adjust as necessary

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
