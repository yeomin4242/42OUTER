import { formatTimeRemaining } from "@/utils/dataUtils";
import styled from "styled-components";

interface Props {
  imageSource: string;
}

const Image: React.FC<Props> = ({ imageSource }) => {
  return <img src={imageSource} />;
};

export interface IChatRoomDto {
  username: string;
  profileImage: string;
  createdAt: string; // date형식
  lastContent: string; // last chat
}

interface ChatListProps extends IChatRoomDto {
  isSelected: boolean;
  index: number;
  handler: (index: number) => void;
}

const ChatList = ({
  username,
  profileImage,
  createdAt,
  lastContent,
  isSelected,
  index,
  handler,
}: // handler,
ChatListProps) => {
  return (
    <Container $isSelected={isSelected} onClick={() => handler(index)}>
      <ImageWrapper>
        {/* <Image imageSource={img} /> */}
        <img src={profileImage} />
      </ImageWrapper>
      <ColumnWrapper>
        <RowWrapper>
          <NicknameStyled>{username}</NicknameStyled>
          <LastTimeStyled>{formatTimeRemaining(createdAt)}</LastTimeStyled>
        </RowWrapper>
        <RowWrapper>
          <LastChatStyled>{lastContent}</LastChatStyled>
        </RowWrapper>
      </ColumnWrapper>
    </Container>
  );
};

export default ChatList;

const Container = styled.div<{ $isSelected: boolean }>`
  padding: 10px 10px;
  display: flex;
  align-items: center;
  width: 100%;

  /* background-color: ${(props) =>
    props.$isSelected ? "var(--light-gray)" : "white"}; */
  /* box-shadow: ${(props) =>
    props.$isSelected ? "0 0 10px var(--light-gray)" : "none"}; */

  background-color: ${(props) =>
    props.$isSelected ? "var(--brand-sub-2)" : "#f3f3f3"};
  border-bottom: 1px solid var(--line-gray-3);
  &:hover {
    background-color: var(--brand-sub-2);
  }
`;

const ImageWrapper = styled.div`
  & > img {
    width: 50px;
    height: 50px;
    border-radius: 100px;
  }
  margin-right: 10px;
  object-fit: cover;
`;

const NicknameStyled = styled.div`
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.4;
`;

const LastChatStyled = styled.div`
  /* width: 80%; */
  width: 250px;
  margin-top: 4px;
  color: var(--light-gray);
  font-size: 0.8rem;
  font-weight: 300;
  line-height: 1.4;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
`;

const LastTimeStyled = styled.div`
  color: var(--light-gray);
  font-size: 0.8rem;
  font-weight: 300;
  line-height: 1.4;
`;

const RowWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
