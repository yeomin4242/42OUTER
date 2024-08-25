from django.forms import ModelForm
from ex00.models import Article
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class ArticleForm(ModelForm):
    class Meta:
        model = Article
        fields = ['title', 'content', 'synopsis']  # Exclude 'author' as it will be set in the view

class UserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'password1', 'password2']
