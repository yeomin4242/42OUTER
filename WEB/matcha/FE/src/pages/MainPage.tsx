import styled from "styled-components";
import { ReactComponent as BigHeartIcon } from "@/assets/icons/big-heart-icon.svg";

const MainPage = () => {
  return (
    <Container>
      <Title>Find your Real Connections</Title>
      <IconContainer>
        <BigHeartIcon />
      </IconContainer>
    </Container>
  );
};

export default MainPage;

const IconContainer = styled.div`
  width: 351px;
  height: 321px;
  @media screen and (max-width: 768px) {
    width: 300px;
    height: 271px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  /* margin-top: 100px; */
`;

const Title = styled.div`
  font-size: 2.5rem;
  font-weight: 600;
  line-height: 1.4;
`;
