import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
from .models import ChatMessage, ChatRoom
from channels.db import database_sync_to_async
from django.utils import timezone
import asyncio

class ChatConsumer(AsyncWebsocketConsumer):
    room_user_list = {}

    async def connect(self):
        self.user = self.scope["user"]
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"
        
        if not self.user.is_authenticated:
            await self.close()
            return
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        # 사용자 목록 업데이트
        if self.room_name not in self.room_user_list:
            self.room_user_list[self.room_name] = set()
        self.room_user_list[self.room_name].add(self.user.username)
        
        # 새로운 사용자 목록을 채팅방에 방송
        await self.broadcast_user_list()

        # Broadcast that a new user has joined
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": f"{self.user.username} has joined the chat"
            }
        )

        # ChatRoom 인스턴스를 찾습니다. 여기서는 'room_name'이 ChatRoom 모델의 필드라고 가정합니다.
        chat_room = await database_sync_to_async(ChatRoom.objects.get)(name=self.room_name)

        # Perform ChatMessage query using the found ChatRoom instance
        last_messages = await self.get_last_messages(chat_room) # 여기서 수정됨

        # Send the last three messages to the user
        for user, message in last_messages:
            await self.send(text_data=json.dumps({
                'message': f"{user}: {message}",
            }))

    async def disconnect(self, close_code):
        # Leave room group
        if self.room_name in self.room_user_list and self.user.username in self.room_user_list[self.room_name]:
            self.room_user_list[self.room_name].remove(self.user.username)
            if not self.room_user_list[self.room_name]:
                del self.room_user_list[self.room_name]
        
        # 업데이트된 사용자 목록을 채팅방에 방송
        await self.broadcast_user_list()

        # Broadcast that a new user has joined
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": f"{self.user.username} has left the chat"
            }
        )

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        # 메시지를 데이터베이스에 저장
        await self.store_message(message)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": f"{self.user.username}: {message}"
            }
        )

    @database_sync_to_async
    def store_message(self, message):
        # ChatMessage 모델에 메시지 저장
        ChatMessage.objects.create(
            room=ChatRoom.objects.get(name=self.room_name),  # 채팅방 이름으로 ChatRoom 인스턴스를 가져옴
            user=self.user,
            message=message,
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message}))

    # 비동기 처리를 위한 함수를 정의합니다.
    async def get_last_messages(self, chat_room):
    # Django ORM 쿼리를 수행합니다. 이 함수는 동기 함수입니다.
        def get_messages():
            return list(ChatMessage.objects.filter(room=chat_room).order_by('-created')[:3][::-1])

        # 비동기적으로 메시지 목록을 가져옵니다.
        messages = await database_sync_to_async(get_messages)()

        # 메시지 객체의 필드에 비동기적으로 접근합니다.
        async def get_message_data(message):
            user = await database_sync_to_async(lambda: message.user)()
            message = await database_sync_to_async(lambda: message.message)()
            return user, message

        # 모든 메시지에 대해 비동기적으로 사용자 이름과 메시지 텍스트를 가져옵니다.
        messages_data = await asyncio.gather(*[get_message_data(message) for message in messages])

        return messages_data

    async def broadcast_user_list(self):
        # 채팅방에 있는 모든 사용자에게 사용자 목록 방송
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "user_list",
                "user_list": list(self.room_user_list.get(self.room_name, []))
            }
        )

    # 사용자 목록 메시지 처리
    async def user_list(self, event):
        user_list = event["user_list"]
        # WebSocket을 통해 사용자 목록 전송
        await self.send(text_data=json.dumps({
            'user_list': user_list
        }))