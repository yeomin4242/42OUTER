from django.shortcuts import render
from django.http import HttpResponse
from django.db import connection
import csv

# Create your views here.
def create_table(request):
    try :
        # 테이블이 이미 존재하는지 확인하는 쿼리
        planet_table_query = """
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE  table_schema = 'public'
            AND    table_name   = 'ex08_planets'
        );
        """
        with connection.cursor() as cursor:
            cursor.execute(planet_table_query)
            table_exists = cursor.fetchone()[0]
            
            if not table_exists:
                # 테이블이 존재하지 않으면 생성
                cursor.execute("""
                    CREATE TABLE ex08_planets (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(64) UNIQUE NOT NULL,
                        climate VARCHAR(64) ,
                        diameter INT ,
                        orbital_period INT ,
                        population BIGINT NULL ,
                        rotation_period INT ,
                        surface_water FLOAT ,
                        terrain VARCHAR(128) 
                    );
                """)

        people_table_query = """
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE  table_schema = 'public'
            AND    table_name   = 'ex08_people'
        );
        """
        with connection.cursor() as cursor:
            cursor.execute(people_table_query)
            table_exists = cursor.fetchone()[0]

            if not table_exists:
                # 테이블이 존재하지 않으면 생성
                cursor.execute("""
                    CREATE TABLE ex08_people (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(64) UNIQUE NOT NULL,
                        birth_year VARCHAR(32),
                        gender VARCHAR(32),
                        eye_color VARCHAR(32),
                        hair_color VARCHAR(32),
                        height INT,
                        mass FLOAT,
                        homeworld VARCHAR(64),
                        CONSTRAINT fk_homeworld FOREIGN KEY (homeworld)
                            REFERENCES ex08_planets(name)
                    );
                """)
        message = 'OK'
        return HttpResponse(message)
    except Exception as e :
        return HttpResponse(f"An error occurred: {str(e)}")

def populate_table(request):
    planet_table_query = """
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE  table_schema = 'public'
            AND    table_name   = 'ex08_planets'
        );
    """
    people_table_query = """
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE  table_schema = 'public'
            AND    table_name   = 'ex08_people'
        );
        """
    try:
        with connection.cursor() as cursor:

            cursor.execute(planet_table_query)
            planet_table_exists = cursor.fetchone()[0]

            cursor.execute(people_table_query)
            people_table_exists = cursor.fetchone()[0]

            if not planet_table_exists or not people_table_exists:
                return HttpResponse('No data available') 

            with connection.cursor() as cursor:
                with open('ex08/planets.csv', 'r') as file:
                    reader = csv.reader(file, delimiter='\t')
                    for row in reader:
                        if row[0] == 'NULL' :
                            raise Exception("No data available")
                        cursor.execute("""
                            INSERT INTO ex08_planets (name, climate, diameter, orbital_period, population, rotation_period, surface_water, terrain)
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                            ON CONFLICT (name) DO UPDATE SET
                            climate = EXCLUDED.climate,
                            diameter = EXCLUDED.diameter,
                            orbital_period = EXCLUDED.orbital_period,
                            population = EXCLUDED.population,
                            rotation_period = EXCLUDED.rotation_period,
                            surface_water = EXCLUDED.surface_water,
                            terrain = EXCLUDED.terrain;
                            """, (
                                    row[0],
                                    row[1] if row[1] != 'NULL' else None,
                                    row[2] if row[2] != 'NULL' else None,
                                    row[3] if row[3] != 'NULL' else None,
                                    row[4] if row[4] != 'NULL' else None,
                                    row[5] if row[5] != 'NULL' else None,
                                    row[6] if row[6] != 'NULL' else None,
                                    row[7] if row[7] != 'NULL' else None
                                ))
            
            with connection.cursor() as cursor:
                with open('ex08/people.csv', 'r') as file:
                    reader = csv.reader(file, delimiter='\t')
                    for row in reader:
                        if row[0] == 'NULL' :
                            raise Exception("No data available")
                        cursor.execute("""
                            INSERT INTO ex08_people (name, birth_year, gender, eye_color, hair_color, height, mass, homeworld)
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                            ON CONFLICT (name) DO UPDATE SET
                            birth_year = EXCLUDED.birth_year,
                            gender = EXCLUDED.gender,
                            eye_color = EXCLUDED.eye_color,
                            hair_color = EXCLUDED.hair_color,
                            height = EXCLUDED.height,
                            mass = EXCLUDED.mass,
                            homeworld = EXCLUDED.homeworld;
                            """, (
                                    row[0],
                                    row[1] if row[1] != 'NULL' else None,
                                    row[2] if row[2] != 'NULL' else None,
                                    row[3] if row[3] != 'NULL' else None,
                                    row[4] if row[4] != 'NULL' else None,
                                    row[5] if row[5] != 'NULL' else None,
                                    row[6] if row[6] != 'NULL' else None,
                                    row[7] if row[7] != 'NULL' else None
                            ))

        return HttpResponse("OK")

    except Exception as e:
        return HttpResponse(f"An error occurred: {str(e)}")
    
def display_table(request):
    try:
        planet_table_query = """
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE  table_schema = 'public'
            AND    table_name   = 'ex08_planets'
        );
        """
        people_table_query = """
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE  table_schema = 'public'
                AND    table_name   = 'ex08_people'
            );
            """
        with connection.cursor() as cursor:

            cursor.execute(planet_table_query)
            planet_table_exists = cursor.fetchone()[0]

            cursor.execute(people_table_query)
            people_table_exists = cursor.fetchone()[0]

            if not planet_table_exists or not people_table_exists:
                return HttpResponse('No data available') 

            query = """
            SELECT p.name AS character_name, h.name AS homeworld_name, h.climate
            FROM ex08_people p
            JOIN ex08_planets h ON p.homeworld = h.name
            WHERE h.climate LIKE '%windy%' OR h.climate LIKE '%moderately windy%'
            ORDER BY p.name ASC;
            """
            
            with connection.cursor() as cursor:
                cursor.execute(query)
                results = cursor.fetchall()
            
            return render(request, 'ex08/display.html', {'characters': results})
        
    except Exception as e:
        # 예외 처리 시, 에러 메시지 반환
        return HttpResponse(f"An error occurred: {str(e)}")
