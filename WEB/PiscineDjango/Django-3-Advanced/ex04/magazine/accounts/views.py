from django.contrib.auth import logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.urls import reverse_lazy
from django.views.generic import CreateView, RedirectView
from django.contrib.auth.views import LoginView
from django.contrib.auth.forms import AuthenticationForm


# Create your views here.
class HomeRedirectView(RedirectView):  # RedirectView를 상속받아 특정 URL로 리다이렉트하는 뷰를 정의
    url = reverse_lazy('article_list')  # 리다이렉트할 URL을 'article_list'라는 이름의 URL 패턴으로 지연된(lazy) 방식으로 역참조

class UserLoginView(LoginView):
    template_name = 'publish/article_list.html'  # 로그인 폼이 있는 템플릿의 경로
    redirect_authenticated_user = True  # 이미 인증된 사용자는 success_url로 리다이렉트

    def get_success_url(self):
        # 성공적인 로그인 후 리다이렉션할 URL 설정
        # 'next' 파라미터가 있으면 해당 URL로, 아니면 기본 URL로 리다이렉트
        return self.request.GET.get('next', reverse_lazy('home'))

class LogoutRedirectView(RedirectView):
    url = reverse_lazy('home')  # 로그아웃 후 리다이렉트할 URL

    def get(self, request, *args, **kwargs):
        logout(request)
        return super().get(request, *args, **kwargs)
    
class RegisterView(CreateView):
    model = User
    form_class = UserCreationForm
    template_name = 'accounts/register.html'
    success_url = reverse_lazy('login')  # Adjust as necessary