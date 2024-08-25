from django.db import models
from django.contrib.auth.models import User
from publish.models import Article

# Create your models here.
class UserFavouriteArticle(models.Model):
    user = models.ForeignKey(User, null=False, on_delete=models.CASCADE, related_name='ex00_favourite_users')
    article = models.ForeignKey(Article, null=False, on_delete=models.CASCADE, related_name='ex00_favourite_articles')

    def __str__(self):
        return self.article.title