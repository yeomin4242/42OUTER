from django.shortcuts import render
from django.views.generic import ListView, DetailView, CreateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from .models import Article
from .forms import ArticleForm

# Create your views here.
class ArticleListView(ListView):  # ListView를 상속받아 Article 객체의 목록을 보여주는 뷰를 정의
    model = Article  # 이 뷰에서 사용할 모델을 Article로 지정
    template_name = 'publish/article_list.html'  # 이 뷰가 사용할 템플릿 파일 경로를 지정

    def get_queryset(self):
        return Article.objects.order_by('-created')

class ArticleDetailView(DetailView):
    model = Article
    template_name = 'publish/article_detail.html'
    context_object_name = 'article'

class PublicationView(ListView):
    model = Article
    template_name = 'publish/publication.html'

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Article.objects.filter(author=self.request.user).order_by('-created')
        else:
            return Article.objects.none()
        
class PublishView(LoginRequiredMixin, CreateView):
    model = Article
    form_class = ArticleForm
    template_name = 'publish/publish.html'
    success_url = reverse_lazy('publications')  # Adjust as necessary

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)