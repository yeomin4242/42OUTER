# ex02/forms.py

from django import forms

class InputForm(forms.Form):
    text = forms.CharField(label='Input Text', max_length=100)
