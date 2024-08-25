from django import forms
from .models import People

class MovieSearchForm(forms.Form):
    min_release_date = forms.DateField(label='Movies minimum release date')
    max_release_date = forms.DateField(label='Movies maximum release date')
    planet_diameter = forms.IntegerField(label='Planet diameter greater than')
    character_gender = forms.ChoiceField(label='Character gender', choices=[])

    def __init__(self, *args, **kwargs):
        super(MovieSearchForm, self).__init__(*args, **kwargs)
        # People 모델에서 중복 없이 성별 값 가져오기
        self.fields['character_gender'].choices = [(gender, gender) for gender in People.objects.values_list('gender', flat=True).distinct()]
