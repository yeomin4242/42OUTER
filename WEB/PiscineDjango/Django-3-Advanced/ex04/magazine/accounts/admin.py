from django.contrib import admin
from favourite.models import UserFavouriteArticle
from publish.models import Article

# Register your models here.
admin.site.register(Article)
admin.site.register(UserFavouriteArticle)