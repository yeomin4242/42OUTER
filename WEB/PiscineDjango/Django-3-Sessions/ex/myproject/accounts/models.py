from django.db import models
from django.contrib.auth.models import User

class Tip(models.Model):
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    upvotes = models.ManyToManyField(User, related_name='upvoted_tips')
    downvotes = models.ManyToManyField(User, related_name='downvoted_tips')
    can_delete = models.ManyToManyField(User, related_name='can_delete_tips', blank=True)  # 삭제 권한을 가진 사용자 목록
    can_downvote = models.ManyToManyField(User, related_name='can_downvote_tips', blank=True)  # 다운보트 권한을 가진 사용자 목록
    rep_points = models.IntegerField(default=0)  # 팁의 평가 점수

    def __str__(self):
        return self.content[:20]
