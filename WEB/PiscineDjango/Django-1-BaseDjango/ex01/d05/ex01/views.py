from django.shortcuts import render

# Create your views here.
def django_view(request):
    return render(request, 'ex01/django_view.html')

def display_view(request):
    return render(request, 'ex01/display_view.html')

def templates_view(request):
    return render(request, 'ex01/template_view.html')