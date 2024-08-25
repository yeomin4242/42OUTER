from django.shortcuts import render
from .models import People, Movies, Planets
from .forms import MovieSearchForm
from django.http import HttpResponse


def movie_search(request):
    try :

        if request.method == 'POST':
            form = MovieSearchForm(request.POST)
            if form.is_valid():
                results = []
                min_date = form.cleaned_data['min_release_date']
                max_date = form.cleaned_data['max_release_date']
                planet_diameter = form.cleaned_data['planet_diameter']
                character_gender = form.cleaned_data['character_gender']

                # if min_date == max_date :
                #     return render(request, 'ex10/movie_search_results.html', {'results': results})

                characters = People.objects.filter(gender=character_gender, homeworld__diameter__gt=planet_diameter, films__release_date__range=(min_date, max_date)).distinct()

                for character in characters:
                    for film in character.films.filter(release_date__range=(min_date, max_date)):
                        results.append(f"{film.title} - {character.name} - {character.gender} - {character.homeworld.name} - {character.homeworld.diameter}")

                return render(request, 'ex10/movie_search_results.html', {'results': results})
        else:
            form = MovieSearchForm()

        return render(request, 'ex10/movie_search.html', {'form': form})
    except Exception as e:
        return HttpResponse(f"An error occurred: {str(e)}")
