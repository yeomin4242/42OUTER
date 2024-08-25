import styled from "styled-components";
import TestImage2 from "@/assets/icons/gpt-icon.svg";
import ChatList, { IChatRoomDto } from "@/components/chat/ChatList";
import ChatRoom, {
  IChatReciveContentDto,
  IChatSendContentDto,
} from "@/components/chat/ChatRoom";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "./LayoutPage";
import GptChat from "@/components/chat/GptChat";
import useRouter from "@/hooks/useRouter";
import { axiosCheckJWT } from "@/api/axios.custom";
import { removeCookie } from "@/api/cookie";

// 이미지 경로 어떻게 받을지 생각해두기

const gptChatList: IChatRoomDto = {
  username: "Chatgpt",
  profileImage: TestImage2,
  lastContent: "Hello, I'm Chatgpt",
  createdAt: "",
};

// const ChatPage: FC = () => { ... }

const ChatPage = () => {
  const { goToMain } = useRouter();
  const [selectUser, setSelectUser] = useState<string>("Chatgpt");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [chatRoom, setChatRoom] = useState<IChatRoomDto[]>([gptChatList]);
  const [chatHistory, setChatHistory] = useState<IChatReciveContentDto[]>([]);
  const [showChatRoom, setShowChatRoom] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const socket = useContext(SocketContext);

  const tryAuthCheck = async () => {
    try {
      const res = await axiosCheckJWT();
    } catch (error: any) {
      alert("로그인을 해주세요");
      removeCookie("jwt");
      goToMain();
    }
  };
  useEffect(() => {
    tryAuthCheck();
    // onClickChatRoom(0);
  }, []);

  useEffect(() => {
    if (socket) {
      const fetchChatList = () => {
        return new Promise<void>((resolve) => {
          socket.emit("getChatList");
          socket.on("getChatList", (newChatRooms: IChatRoomDto[]) => {
            updateChatRoom(newChatRooms);
            resolve();
          });
        });
      };

      (async () => {
        setIsLoading(true);
        await fetchChatList();
        setIsLoading(false);
      })();

      // 내가 메세지 보내는 경우 -> sendMessage , username, message
      socket.on("sendMessage", (newMessage: IChatReciveContentDto) => {
        setChatHistory((prev) => [...prev, newMessage]);
      });

      socket.on("kick", (data: any) => {
        if (data.alarmType === "UNMATCHED") {
          alert("상대방이 너 싫어한대");
          goToMain();
        }
      });

      return () => {
        // 페이지 이동 또는 컴포넌트 언마운트 시 실행
        if (selectUser) {
          socket.emit("leaveRoom");
        }
        socket.off("getChatList");
        socket.off("sendMessage");
        socket.off("kick");
      };
    }
  }, [socket]);

  const onClickChatRoom = async (index: number) => {
    setSelectedIndex(index);
    const selectedUser = chatRoom[index].username;
    setSelectUser(selectedUser);
    setShowChatRoom(true);
    if (selectedUser === "Chatgpt") {
      return;
    }
    socket.emit("leaveRoom", { username: selectUser });
    if (socket) {
      setIsLoading(true);
      socket.emit("joinChatRoom", selectedUser);
      await new Promise<void>((resolve) => {
        socket.once("getMessages", (messages: IChatReciveContentDto[]) => {
          setChatHistory(messages);
          setIsLoading(false);
          resolve();
        });
      });
    }
  };

  const sendMessage = (message: string) => {
    if (socket && selectUser) {
      const newMessage: IChatSendContentDto = {
        message,
        username: selectUser,
        time: new Date(),
      };
      socket.emit("sendMessage", newMessage);
    }
  };

  const updateChatRoom = (newChatRooms: IChatRoomDto[]) => {
    setChatRoom(() => {
      const filteredNewChatRooms = newChatRooms.filter(
        (room) => room.username !== gptChatList.username
      );
      return [gptChatList, ...filteredNewChatRooms];
    });
  };

  const handleBackButton = () => {
    setShowChatRoom(false);
    if (socket) {
      socket.emit("leaveRoom", { username: selectUser });
    }
  };

  if (isLoading) {
    return <Container>Loading chat rooms...</Container>;
  }

  return (
    <Container>
      <ChatLobbyWrapper $show={!showChatRoom}>
        {chatRoom.map((chatList, index) => (
          <ChatList
            key={index}
            {...chatList}
            isSelected={selectedIndex === index}
            index={index}
            handler={onClickChatRoom}
          />
        ))}
      </ChatLobbyWrapper>
      <ChatRoomWrapper $show={showChatRoom}>
        <BackButton onClick={handleBackButton}>Back</BackButton>
        {selectUser === "Chatgpt" ? (
          <GptChat />
        ) : (
          <ChatRoom
            chatHistory={chatHistory}
            // selectUserImg={chatRoom[selectedIndex]?.profileImage}
            selectUserImg={chatRoom[selectedIndex ?? 0]?.profileImage}
            username={selectUser}
            sendMessage={sendMessage}
          />
        )}
      </ChatRoomWrapper>
    </Container>
  );
};

export default ChatPage;

const Container = styled.div`
  display: flex;
  padding: 20px 30px;
  gap: 24px;
  height: calc(100% - 120px);
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px;
  }
`;

const ChatLobbyWrapper = styled.div<{ $show: boolean }>`
  max-width: 384px;
  width: 100%;
  /* height: 100%; */
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 4px;
  padding: 10px 10px;
  border: 1px solid var(--black);

  @media (max-width: 768px) {
    max-width: 100%;
    display: ${(props) => (props.$show ? "flex" : "none")};
  }
`;

const ChatRoomWrapper = styled.div<{ $show: boolean }>`
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  border: 1px solid var(--black);
  max-width: 792px;
  width: 100%;
  height: 100%;

  /* overflow-y: scroll; */
  /* 오버레이 스크롤바 사용 */
  overflow-y: overlay;
  scrollbar-width: thin;
  scrollbar-color: var(--brand-main-1) var(--brand-sub-2);

  @media (max-width: 768px) {
    max-width: 100%;
    display: ${(props) => (props.$show ? "block" : "none")};
  }
`;

const BackButton = styled.button`
  display: none;
  padding: 10px;
  margin: 10px;
  /* background-color: #f0f0f0; */
  background-color: var(--brand-main-1);
  color: var(--white);
  font-size: 1rem;
  letter-spacing: -0.025em;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  z-index: 2;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
  }
`;
