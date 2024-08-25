import { useState } from "react";
import { ISearchDateDto } from "@/pages/SearchPage";
import styled from "styled-components";
import Stars from "../stars/Stars"; // Stars 컴포넌트를 import 합니다.
import { ReactComponent as StarIcon } from "@/assets/icons/star-icon.svg";
import useRouter from "@/hooks/useRouter";

const SearchCard = ({
  profileImages,
  username,
  age,
  rate,
  si,
  gu,
}: ISearchDateDto) => {
  const { goToProfileUserClick } = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Container
      onClick={() => goToProfileUserClick(username)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContainer>
        <ImageStyled src={profileImages} alt={username} />
        <OverlayContainer $isHovered={isHovered}>
          <OverlayStyled>
            {isHovered && (
              <>
                <InfoContainer>
                  <NameStyled>
                    {username}, {age}
                  </NameStyled>

                  <RateContainer>
                    <StarIcon />
                    {rate}
                  </RateContainer>
                </InfoContainer>
                <LocationStyled>
                  {si} {gu}
                </LocationStyled>
              </>
            )}
          </OverlayStyled>
        </OverlayContainer>
      </CardContainer>
    </Container>
  );
};

export default SearchCard;

const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const RateContainer = styled.div`
  display: flex;
  align-items: center;
`;

const NameStyled = styled.div`
  color: var(--white);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
`;

const LocationStyled = styled.div`
  color: var(--brand-sub-1);
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.4;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CardContainer = styled.div`
  position: relative;
  /* max-width: 250px;
  max-height: 300px; */
  width: 100%;
  height: 100%;
  /* width: min(250px, calc(17.5vw - 0.694vw)); // 252px is 17.5% of 1440px
  height: min(300px, calc((17.5vw - 0.694vw) * 1.19)); // maintain aspect ratio */
  border-radius: 15px;
  overflow: hidden;
`;

// const CardContainer = styled.div`
//   position: relative;
//   width: 252px;
//   height: 300px;
//   border-radius: 15px;
//   overflow: hidden;
// `;

const ImageStyled = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const OverlayContainer = styled.div<{ $isHovered: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* background-color: rgba(0, 0, 0, ${(props) =>
    props.$isHovered ? 0.7 : 0.2}); */

  &:hover {
    background: linear-gradient(0deg, #000000 0%, #4b4b4b 28%, #d9d9d9 100%);
  }
  /* &:hover {
    background: linear-gradient(0deg, #000000 0%, #4b4b4b 72%, #d9d9d9 100%);
  } */

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 10px;
  transition: background-color 0.3s ease;
`;

const OverlayStyled = styled.div`
  color: white;
  text-align: left;

  padding: 0 25px;
  padding-bottom: 20px;
`;
