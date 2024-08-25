from django.shortcuts import render
from .models import ChatRoom
from django.http import JsonResponse

def chat_room_list(request):
    if request.user.is_authenticated:
        rooms = ChatRoom.objects.all()
        return render(request, 'chat/room_list.html', {'rooms': rooms})
    return render(request, 'chat/room_list.html')

def create_chat_room(request):
    if request.user.is_authenticated:
        return render(request, "chat/create_room.html")
    return render(request, "chat/room_list.html")

def room(request, room_name):
    if request.user.is_authenticated:
        if not ChatRoom.objects.filter(name=room_name).exists():
            new_room = ChatRoom(name=room_name)
            new_room.save()
        return render(request, 'chat/room.html', {
            'room_name': room_name
        })
    return render(request, 'chat/room.html')

def check_room_name(request):
    if request.user.is_authenticated:
        room_name = request.GET.get('room_name')
        if room_name:
            room_exists = ChatRoom.objects.filter(name=room_name).exists()
            return JsonResponse({'room_exists': room_exists})
        else:
            return JsonResponse({'error': 'No room name provided'}, status=400)
    return render(request, "chat/room_list.html")