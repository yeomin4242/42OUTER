from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from .forms import RegisterForm, LoginForm
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from .models import Tip
from .forms import TipForm
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.http import HttpResponseBadRequest
from django.contrib.auth.models import User
import random
from django.conf import settings

# 사용자 등록 뷰
def register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            auth_login(request, user)  # 사용자 등록 후 자동 로그인
            return redirect('home')
    else:
        form = RegisterForm()
    return render(request, 'accounts/register.html', {'form': form})

# 로그인 뷰
def login(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Wrong Username or Password.')
    else:
        form = LoginForm()
    return render(request, 'accounts/login.html', {'form': form})

# 로그아웃 뷰
def logout(request):
    auth_logout(request)
    return redirect('home')

def home(request):
    if request.user.is_authenticated:
        tips = Tip.objects.all().order_by('-date')  # 로그인된 사용자의 팁만 표시
        can_delete = has_permission_to_delete(request.user)
        can_downvote = has_permission_to_downvote(request.user)
    else:
        tips = None
        can_delete = False
        can_downvote = False
        if 'user_name' not in request.session :
            user_name = random.choice(settings.USER_NAMES)
            request.session['user_name'] = user_name
            request.session.set_expiry(42)

    form = TipForm(request.POST) if request.method == 'POST' and request.user.is_authenticated else TipForm()
    if request.method == 'POST' and request.user.is_authenticated:
        if form.is_valid() and Tip.objects.filter(content=form.cleaned_data['content']).count() == 0:
            tip = form.save(commit=False)
            tip.author = request.user
            tip.save()
            return redirect('home')

    return render(request, 'accounts/home.html', {'tips': tips, 'form': form, 'can_delete': can_delete, 'can_downvote': can_downvote})


@login_required
@require_POST  # POST 요청만 허용
def upvote_tip(request, tip_id):
    tip = get_object_or_404(Tip, id=tip_id)
    if request.user.is_authenticated:
        # 다운보트가 되어 있으면 제거
        tip.downvotes.remove(request.user)
        # 업보트 상태를 토글
        if request.user in tip.upvotes.all():
            tip.upvotes.remove(request.user)
        else:
            tip.upvotes.add(request.user)
        tip.rep_points = tip.upvotes.count() * 5 - tip.downvotes.count() * 2
        tip.save()
    return redirect('home')

@login_required
@require_POST  # POST 요청만 허용
def downvote_tip(request, tip_id):
    tip = get_object_or_404(Tip, id=tip_id)
    if request.user.is_authenticated and (tip.author == request.user or request.user in tip.can_downvote.all() or has_permission_to_downvote(request.user)):
        # 업보트가 되어 있으면 제거
        tip.upvotes.remove(request.user)
        # 다운보트 상태를 토글
        if request.user in tip.downvotes.all():
            tip.downvotes.remove(request.user)
        else:
            tip.downvotes.add(request.user)
        tip.rep_points = tip.upvotes.count() * 5 - tip.downvotes.count() * 2
        tip.save()
    return redirect('home')

@login_required
@require_POST  # POST 요청만 허용
def delete_tip(request, tip_id):
    tip = get_object_or_404(Tip, pk=tip_id)
    if request.user.is_authenticated and (tip.author == request.user or request.user in tip.can_delete.all() or has_permission_to_delete(request.user)):
        tip.delete()
    return redirect('home')

@login_required
@require_POST
def delete_admin_request(request, userId, tipId):
    if request.user.is_superuser:
        tip = get_object_or_404(Tip, id=tipId)
        user = get_object_or_404(User, id=userId)
        if 'has_permission' in request.POST:
            tip.can_delete.add(user)  # 사용자에게 삭제 권한 부여
        else:
            tip.can_delete.remove(user)  # 사용자의 삭제 권한 제거
        tip.save()
    if request.user.is_superuser:
        users = User.objects.exclude(id=request.user.id)
        return render(request, 'accounts/admin.html', {'users': users, 'tips': Tip.objects.all()})
    else:
        return render(request, 'accounts/home.html')

    
@login_required
@require_POST
def downvote_admin_request(request, userId, tipId):
    if request.user.is_superuser:
        tip = get_object_or_404(Tip, id=tipId)
        user = get_object_or_404(User, id=userId)
        if 'has_permission' in request.POST:
            tip.can_downvote.add(user)  # 사용자에게 다운보트 권한 부여
        else:
            tip.can_downvote.remove(user)  # 사용자의 다운보트 권한 제거
        tip.save()
    if request.user.is_superuser:
        users = User.objects.exclude(id=request.user.id)
        return render(request, 'accounts/admin.html', {'users': users, 'tips': Tip.objects.all()})
    else:
        return render(request, 'accounts/home.html')

@login_required
def admin(request):
    if request.user.is_superuser:
        # 현재 로그인한 사용자를 제외한 모든 사용자를 가져옵니다.
        users = User.objects.exclude(id=request.user.id)
        return render(request, 'accounts/admin.html', {'users': users, 'tips': Tip.objects.all()})
    else:
        return render(request, 'accounts/admin.html')
    
def has_permission_to_delete(user) :
    if user :
        total_points = 0
        for tip in Tip.objects.filter(author=user):
            total_points += tip.rep_points
        if total_points >= 30:
            return True
    return False

def has_permission_to_downvote(user) :
    if user :
        total_points = 0
        for tip in Tip.objects.filter(author=user):
            total_points += tip.rep_points
        if total_points >= 15:
            return True
    return False
