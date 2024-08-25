# ex02/views.py

from django.shortcuts import render, redirect
from django.conf import settings
from .forms import InputForm
import datetime

def input_view(request):
    if request.method == 'POST':
        form = InputForm(request.POST)
        if form.is_valid():
            text = form.cleaned_data['text']
            timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            log_entry = f"{timestamp}: {text}\n"
            with open(settings.LOGS_FILE, 'a') as file:
                file.write(log_entry)
            # 폼 제출 후 리다이렉트를 사용하여 PRG 패턴 구현
            return redirect('input_form')  # 'input_form'은 해당 뷰의 URL 이름입니다.
    else:
        form = InputForm()
    
    history = []
    try:
        with open(settings.LOGS_FILE, 'r') as file:
            for line in file:
                history.append(line.strip())
    except FileNotFoundError:
        pass

    return render(request, 'ex02/input_form.html', {'form': form, 'history': history})
