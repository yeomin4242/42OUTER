from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

def account_view(request):
    if request.user.is_authenticated:
        return render(request, 'account/logged_in.html', {'user': request.user})
    else:
        return render(request, 'account/login_form.html')

def login_view(request):
    # 'X-Requested-With' 헤더가 'XMLHttpRequest'인지 확인하여 AJAX 요청인지 확인
    if request.method == "POST" and request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        # 사용자 인증 시도
        user = authenticate(username=username, password=password)
        
        if user is not None:
            # 인증 성공 시 로그인 처리
            login(request, user)
            return JsonResponse({"success": True})
        else:
            # 인증 실패 시 에러 메시지 반환
            return JsonResponse({"error": "Invalid credentials"})
    # POST 요청이 아니거나 AJAX 요청이 아닌 경우 에러 메시지 반환
    return JsonResponse({"error": "Invalid request"})

def logout_view(request):
    if request.method == "POST" and request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        logout(request)
        return JsonResponse({"success": True})
    return JsonResponse({"error": "Invalid request"})

