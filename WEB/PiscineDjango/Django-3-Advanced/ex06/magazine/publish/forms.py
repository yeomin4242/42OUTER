from django.forms import ModelForm
from .models import Article

class ArticleForm(ModelForm):
    class Meta:
        model = Article
        fields = ['title', 'content', 'synopsis']  # Exclude 'author' as it will be set in the view