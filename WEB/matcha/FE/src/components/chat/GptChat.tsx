import { sendMessageToClaude } from "@/api/axios.custom";
import React, { useState } from "react";
import styled from "styled-components";
import Loading from "./Loading";
import { validateMessage } from "@/utils/inputCheckUtils";

interface IChatContentDto {
  message: string;
  username: string;
  time: string;
}

const GptChat: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<IChatContentDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateMessage(input) === false) {
      alert("더러운 메세지 보내지 마세요");
      return;
    }

    const newUserMessage: IChatContentDto = {
      message: input,
      username: "User",
      time: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const replyPromise = sendMessageToClaude(input);

      // 10초 타이머 설정
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), 10000)
      );

      const reply = await Promise.race([replyPromise, timeoutPromise]);

      const newAssistantMessage: IChatContentDto = {
        message: reply as string,
        username: "Claude",
        time: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newAssistantMessage]);
    } catch (error) {
      console.error("Failed to get response from Claude:", error);
      const errorMessage: IChatContentDto = {
        message: "Failed to get response. Please try again.",
        username: "System",
        time: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <MessageContainer>
        {messages.map((message, index) =>
          message.username === "User" ? (
            <MyMessageWrapper key={index}>
              <ContentStyled>{message.message}</ContentStyled>
            </MyMessageWrapper>
          ) : (
            <PartnerMessageWrapper key={index}>
              <img src="/path/to/claude/image.png" alt="Claude" />
              <ContentStyled>{message.message}</ContentStyled>
            </PartnerMessageWrapper>
          )
        )}
        {isLoading && <Loading />}
      </MessageContainer>
      <ChatInputWrapper onSubmit={handleSubmit}>
        <ChatInput
          value={input}
          maxLength={255}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Claude something..."
          disabled={isLoading}
        />
        <SendButton type="submit" disabled={isLoading}>
          Send
        </SendButton>
      </ChatInputWrapper>
    </Container>
  );
};

export default GptChat;

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

const Container = styled.div`
  /* max-width: px; */
  /* padding: 20px 20px; */
  padding-left: 35px;
  padding-right: 40px;
  padding-top: 40px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  height: 100%;
  /* overflow-y: auto; */
  position: relative;
  overflow-y: hidden;
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
  /* text-overflow: ellipsis;
  word-break: break-all; */
`;

const ChatInput = styled.input`
  background-color: var(--brand-sub-2);
  color: var(--black);
  padding: 10px;
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
