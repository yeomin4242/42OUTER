from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Article(models.Model):
    title = models.CharField(max_length=64, null=False)
    author = models.ForeignKey(User, null=False, on_delete=models.CASCADE, related_name='articles')
    created = models.DateTimeField(auto_now_add=True, null=False)
    synopsis = models.TextField(max_length=312, null=False)
    content = models.TextField(null=False)

    def __str__(self):
        return self.title

class UserFavouriteArticle(models.Model):
    user = models.ForeignKey(User, null=False, on_delete=models.CASCADE, related_name='ex00_favourite_users')
    article = models.ForeignKey(Article, null=False, on_delete=models.CASCADE, related_name='ex00_favourite_articles')

    def __str__(self):
        return self.article.title