import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { validateMessage } from "@/utils/inputCheckUtils";

export interface IChatSendContentDto {
  message: string;
  username: string;
  time: Date;
}
export interface IChatReciveContentDto {
  message: string;
  sender: string;
  time: Date;
}

const ChatRoom = ({
  chatHistory,
  selectUserImg,
  username,
  sendMessage,
}: {
  chatHistory: IChatReciveContentDto[];
  selectUserImg: string;
  username: string;
  sendMessage: (message: string) => void;
}) => {
  const [inputMessage, setInputMessage] = useState<string>("");
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateMessage(inputMessage) === false) {
      alert("더러운 메세지 보내지 마세요");
      return;
    }

    if (inputMessage.trim() !== "") {
      sendMessage(inputMessage);
      setInputMessage("");
    }
  };
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <Container>
      <>
        <MessageContainer ref={messageContainerRef}>
          {chatHistory.map((message, index) =>
            message.sender !== username ? (
              <MyMessageWrapper key={index}>
                <ContentStyled>{message.message}</ContentStyled>
              </MyMessageWrapper>
            ) : (
              <PartnerMessageWrapper key={index}>
                <img src={selectUserImg} alt="User Avatar" />
                <ContentStyled>{message.message}</ContentStyled>
              </PartnerMessageWrapper>
            )
          )}
        </MessageContainer>
        <ChatInputWrapper onSubmit={handleSendMessage}>
          <ChatInput
            placeholder="write your message ..."
            value={inputMessage}
            maxLength={255}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <SendButton type="submit">Send</SendButton>
        </ChatInputWrapper>
      </>
    </Container>
  );
};

export default ChatRoom;

const Container = styled.div`
  padding-left: 35px;
  padding-right: 40px;
  padding-top: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  height: 100%;
  min-height: 100%;
  position: relative;
  overflow-y: hidden;
`;

const SendButton = styled.button`
  padding: 10px 20px;
  background-color: var(--brand-main-1);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.3s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MessageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* flex-grow: 1; */
  height: 90%;

  overflow-y: auto; // 세로 스크롤 추가
  /* padding-bottom: 20px; // ChatInputWrapper 위 20px 여백 */

  &::-webkit-scrollbar {
    display: none;
  }
  /* IE, Edge, Firefox의 스크롤바 숨기기 */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const MyMessageWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  & > div {
    border-radius: 10px 0 10px 10px;
    background-color: var(--brand-main-1);
    color: var(--white);
  }
`;

const PartnerMessageWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  & > img {
    margin-right: 10px;
    width: 50px;
    height: 50px;
    border-radius: 100px;
  }

  & > div {
    background-color: #eeeeee;
    color: var(--black);
    border-radius: 10px 10px 10px 0px;
  }
`;

const ContentStyled = styled.div`
  /* max-width: 50%; */
  max-width: 347px;
  /* width: 100%; */
  /* border-radius: 10px 0 10px 10px; */
  background-color: var(--vermilion);
  padding: 18px 22px;
  font-size: 0.8rem;
  font-weight: 300;
  line-height: 1.4;
  letter-spacing: -0.025em;

  white-space: normal;

  text-overflow: ellipsis;
  word-break: break-all;
`;

const ChatInput = styled.input`
  background-color: var(--brand-sub-2);
  color: var(--black);
  /* padding: 10px; */
  padding: 10px 20px;
  outline: none;
  width: 100%;
  height: 40px; // 원하는 고정 높이 설정
  /* min-height: 40px; // 최소 높이 설정 */
  max-height: 40px; // 최대 높이 설정 (스크롤 생성을 위해)
  border: 1px solid var(--brand-main-1);
  border-radius: 4px;
  resize: none; // 사용자가 크기를 조절하지 못하게 함
  overflow-y: auto; // 세로 스크롤 허용
  line-height: 20px; // 줄 간격 설정 (선택사항)
`;

const ChatInputWrapper = styled.form`
  margin-top: 20px;
  width: 100%;
  border-radius: 4px;
  position: relative;
  bottom: 20px;
  display: flex;
  /* flex-direction: column; */
`;

const IconContainer = styled.div`
  position: absolute;
  top: 4px;
  right: 10px;
`;
