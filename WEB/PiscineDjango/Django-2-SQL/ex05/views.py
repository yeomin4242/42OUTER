from django.shortcuts import render
from django.db import connection
from django.http import HttpResponse
from django.db import IntegrityError  # 모델의 제약 조건 위반 시 발생하는 예외
from .models import Movies

def populate_table(request):
    try :

        movie_1 = Movies(
            title='The Phantom Menace',
            episode_nb=1,
            opening_crawl="None",
            director='George Lucas',
            producer='Rick McCallum',
            release_date='1999-05-19'
        )
        
        movie_1.save()

        movie_2 = Movies(
            title='Attack of the Clones',
            episode_nb=2,
            opening_crawl="None",
            director='George Lucas',
            producer='Rick McCallum',
            release_date='2002-05-16'
        )

        movie_2.save()

        movie_3 = Movies(
            title='Revenge of the Sith',
            episode_nb=3,
            opening_crawl='None',
            director='George Lucas',
            producer='Rick McCallum',
            release_date='2005-05-19'
        )

        movie_3.save()

        movie_4 = Movies(
            title='A New Hope',
            episode_nb=4,
            opening_crawl='None',
            director='George Lucas',
            producer='Gary Kurtz, Rick McCallum',
            release_date='1977-05-25'
        )

        movie_4.save()

        movie_5 = Movies(
            title='The Empire Strikes Back',
            episode_nb=5,
            opening_crawl='None',
            director='Irvin Kershner',
            producer='Gary Kutz, Rick McCallum',
            release_date='1980-05-17'
        )

        movie_5.save()

        movie_6 = Movies(
            title='Return of the Jedi',
            episode_nb=6,
            opening_crawl='None',
            director='Richard Marquand',
            producer='Howard G. Kazanjian, George Lucas, Rick McCallum',
            release_date='1983-05-25')

        movie_6.save()

        movie_7 = Movies(
            title='The Force Awakens',
            episode_nb=7,
            opening_crawl='None',
            director='J.J. Abrams',
            producer='Kathleen Kennedy, J.J. Abrams, Bryan Burk',
            release_date='2015-12-11'
        )

        movie_7.save()
        
        return HttpResponse('OK')
    except IntegrityError as e:
        # IntegrityError가 발생한 경우, 예를 들어 중복된 episode_nb가 있을 때
        return HttpResponse(f'Failed to save due to integrity error: {e}')
    except Exception as e:
        # 그 외 다른 오류가 발생한 경우
        return HttpResponse(f'An error occurred: {e}')

    
def display_table(request):
    try:
        movies = Movies.objects.all()
        return render(request, 'ex05/display.html', {'movies': movies})
    except Exception as e:
        return HttpResponse("No data available")

def remove_table(request):
    try :
        if request.method == 'POST':
            Movies.objects.get(title=request.POST.get('title')).delete()
        movies = Movies.objects.all()
        return render(request, 'ex05/remove.html', {'movies': movies})
    except Exception as e:
        return HttpResponse("No data available")
