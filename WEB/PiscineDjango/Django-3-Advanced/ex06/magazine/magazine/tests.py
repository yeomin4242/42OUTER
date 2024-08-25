from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from publish.models import Article
from favourite.models import UserFavouriteArticle

class ArticleAccessTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.article = Article.objects.create(title="Test Article", content="Test Content", author=self.user)

    def test_favourite_view_access_by_unregistered_user(self):
        response = self.client.get(reverse('favourites', kwargs={'user_id': self.user.id}), {})
        self.assertNotEqual(response.status_code, 200)

    def test_publications_view_access_by_unregistered_user(self):
        response = self.client.get(reverse('publications'))
        self.assertNotEqual(response.status_code, 200)

    def test_publish_view_access_by_unregistered_user(self):
        response = self.client.get(reverse('publish'))
        self.assertNotEqual(response.status_code, 200)

    def test_access_new_user_creation_form_by_registered_user(self):
        response = self.client.get(reverse('register'))
        self.assertNotEqual(response.status_code, 200)

    def test_add_same_article_to_favourites_twice_removes_it(self):
        self.client.login(username='testuser', password='12345')
        response1 = self.client.post(reverse('add_to_favourite', kwargs={'article_id': self.article.id}))
        response2 = self.client.post(reverse('add_to_favourite', kwargs={'article_id': self.article.id}))
        self.assertEqual(response1.status_code, response2.status_code)
        self.assertFalse(UserFavouriteArticle.objects.filter(user=self.user, article=self.article).exists())

    def test_template_access_by_registered_users(self):
        self.client.login(username='testuser', password='12345')
        response = self.client.get(reverse('favourites', kwargs={'user_id': self.user.id}), {})
        self.assertEqual(response.status_code, 200)
        response = self.client.get(reverse('publications'))
        self.assertEqual(response.status_code, 200)
        response = self.client.get(reverse('publish'))
        self.assertEqual(response.status_code, 200)
