from django.urls import path
from .views import django_view, display_view, templates_view

urlpatterns = [
    path('django/', django_view, name='django_intro'),  # URL for the Django introduction view.
    path('display/', display_view, name='display_page'),  # URL for the display view, matching the provided template.
    path('templates/', templates_view, name='template_engine'),  # URL for the templates view.
]
