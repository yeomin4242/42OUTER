from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from django.db import connection
from django.http import HttpResponse
from django.db import IntegrityError  # 모델의 제약 조건 위반 시 발생하는 예외

def create_table(request):
    try:
        # 테이블이 이미 존재하는지 확인하는 쿼리
        table_exists_query = """
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE  table_schema = 'public'
            AND    table_name   = 'ex02_movies'
        );
        """
        with connection.cursor() as cursor:
            cursor.execute(table_exists_query)
            table_exists = cursor.fetchone()[0]
            
            if not table_exists:
                # 테이블이 존재하지 않으면 생성
                cursor.execute("""
                    CREATE TABLE ex02_movies (
                        title VARCHAR(64) UNIQUE NOT NULL, 
                        episode_nb SERIAL PRIMARY KEY, 
                        opening_crawl TEXT, 
                        director VARCHAR(32) NOT NULL, 
                        producer VARCHAR(128) NOT NULL, 
                        release_date DATE NOT NULL
                    );
                """)
        message = 'OK'
        return HttpResponse(message)
    except Exception as e:
        return HttpResponse(f'An error occurred: {e}')

def populate_table(request):
    table_exists_query = """
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE  table_schema = 'public'
        AND    table_name   = 'ex02_movies'
    );
    """
    try:
        with connection.cursor() as cursor:
            cursor.execute(table_exists_query)
            table_exists = cursor.fetchone()[0]
        
            if not table_exists:
                return HttpResponse('No data available')
            
            movies = [
                ('The Phantom Menace', 1, 'None', 'George Lucas', 'Rick McCallum', '1999-05-19'),
                ('Attack of the Clones', 2, 'None', 'George Lucas', 'Rick McCallum', '2002-05-16'),
                ('Revenge of the Sith', 3, 'None', 'George Lucas', 'Rick McCallum', '2005-05-19'),
                ('A New Hope', 4, 'None', 'George Lucas', 'Gary Kurtz, Rick McCallum', '1977-05-25'),
                ('The Empire Strikes Back', 5, 'None', 'Irvin Kershner', 'Gary Kutz, Rick McCallum', '1980-05-17'),
                ('Return of the Jedi', 6, 'None', 'Richard Marquand', 'Howard G. Kazanjian, George Lucas, Rick McCallum', '1983-05-25'),
                ('The Force Awakens', 7, 'None', 'J.J. Abrams', 'Kathleen Kennedy, J.J. Abrams, Bryan Burk', '2015-12-11'),
            ]
            
            insert_query = """
            INSERT INTO ex02_movies (title, episode_nb, opening_crawl, director, producer, release_date)
            VALUES (%s, %s, %s, %s, %s, %s)
            """
            for movie in movies:
                cursor.execute(insert_query, movie)
                
            return HttpResponse('OK')
    except IntegrityError as e:
        # IntegrityError가 발생한 경우, 예를 들어 중복된 episode_nb가 있을 때
        return HttpResponse(f'Failed to save due to integrity error: {e}')
    except Exception as e:
        # 그 외 다른 오류가 발생한 경우
        return HttpResponse(f'An error occurred: {e}')

def display_table(request):
    try :
        table_exists_query = """
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE  table_schema = 'public'
            AND    table_name   = 'ex02_movies'
        );
        """
        with connection.cursor() as cursor:
            cursor.execute(table_exists_query)
            table_exists = cursor.fetchone()[0]
            
            if table_exists:
                # 테이블이 존재하면 모든 레코드를 가져옴
                cursor.execute('SELECT * FROM ex02_movies')
                movies = cursor.fetchall()
                return render(request, 'ex02/display.html', {'movies': movies})
            else:
                return HttpResponse('No data available')
    except Exception as e:
        return HttpResponse(f'An error occurred: {e}')