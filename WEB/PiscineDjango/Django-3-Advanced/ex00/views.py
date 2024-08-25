from django.urls import reverse_lazy
from django.views.generic import ListView, RedirectView
from django.contrib.auth.views import LoginView
from .models import Article

class ArticleListView(ListView):  # ListView를 상속받아 Article 객체의 목록을 보여주는 뷰를 정의
    model = Article  # 이 뷰에서 사용할 모델을 Article로 지정
    template_name = 'ex00/article_list.html'  # 이 뷰가 사용할 템플릿 파일 경로를 지정

class HomeRedirectView(RedirectView):  # RedirectView를 상속받아 특정 URL로 리다이렉트하는 뷰를 정의
    url = reverse_lazy('article_list')  # 리다이렉트할 URL을 'article_list'라는 이름의 URL 패턴으로 지연된(lazy) 방식으로 역참조

class UserLoginView(LoginView):  # LoginView를 상속받아 사용자 로그인 처리를 위한 뷰를 정의
    template_name = 'ex00/login.html'  # 로그인 페이지를 렌더링할 때 사용할 템
    success_url=reverse_lazy('home')