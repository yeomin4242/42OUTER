from django.shortcuts import render
from django.db import connection
from django.http import HttpResponse

def create_table(request):
    try :
        # 테이블이 이미 존재하는지 확인하는 쿼리
        table_exists_query = """
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE  table_schema = 'public'
            AND    table_name   = 'ex00_movies'
        );
        """
        with connection.cursor() as cursor:
            cursor.execute(table_exists_query)
            table_exists = cursor.fetchone()[0]
            
            if not table_exists:
                # 테이블이 존재하지 않으면 생성
                cursor.execute("""
                    CREATE TABLE ex00_movies (
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