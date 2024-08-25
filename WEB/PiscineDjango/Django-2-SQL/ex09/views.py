# views.py
from django.shortcuts import render
from .models import People
from django.http import HttpResponse

def display_table(request):
    try :
        characters = People.objects.filter(homeworld__climate__icontains='windy').order_by('name').select_related('homeworld')

        if not characters:
            # 데이터가 없는 경우, 안내 메시지를 표시합니다.
            context = {
                'message': "No data available, please use the following command line before use: python3 manage.py loaddata ex09_initial_data.json"
            }
        else:
            # 데이터가 있는 경우, 캐릭터 정보를 HTML 테이블로 표시합니다.
            context = {
                'characters': characters
            }
        
        return render(request, 'ex09/display.html', context)
    except Exception as e :
        return HttpResponse("No data available, please use the following command line before use: python3 manage.py loaddata ex09_initial_data.json")