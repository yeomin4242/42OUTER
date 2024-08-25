import styled from "styled-components";
import { ProfileDto } from "@/types/tag.dto";
import { useContext, useEffect, useState } from "react";
import {
  axiosProfile,
  axiosProfileMe,
  axiosUserBlock,
  axiosUserRate,
  axiosUserReport,
} from "@/api/axios.custom";
import { useSearchParams } from "react-router-dom";
import { SocketContext } from "./LayoutPage";
import ImageUploader from "@/components/ImageUpload";
import TagList from "@/components/template/TagTemplate";
import Stars from "@/components/stars/Stars";
import useRouter from "@/hooks/useRouter";
import { formatDate, roundToThirdDecimal } from "@/utils/dataUtils";
import { ReactComponent as HeartIcon } from "@/assets/icons/like-heart-icon.svg";
import { HashTagsList } from "@/types/tags";
import { removeCookie } from "@/api/cookie";
import { GenderType, PreferenceType } from "@/types/tag.enum";
import { GenderLableMap, PreferenceLableMap } from "@/types/maps";
import StarsSubmit from "@/components/stars/StarsSubmit";

const ProfilePage = () => {
  const { goToMain, goToChat } = useRouter();
  const [isOnline, setIsOnline] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const [profileData, setProfileData] = useState<ProfileDto>();
  const [images, setImages] = useState<string[]>(
    profileData?.profileImages || []
  );
  const [userRating, setUserRating] = useState(0);
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");
  const socket = useContext(SocketContext);

  const tryToGetProfile = async (username?: string) => {
    try {
      const res = username
        ? await axiosProfile(username)
        : await axiosProfileMe();

      const { isOnline, profileImages, isBlocked, isMatched } = res.data;

      setProfileData(res.data);
      setIsOnline(isOnline);
      setImages(profileImages);
      username && setIsMatched(isMatched);
      if (isBlocked) {
        alert("접근이 불가능한 사용자입니다.");
        goToMain();
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        alert("유저가 없습니다.");
      } else if (error.response?.status === 401) {
        removeCookie("jwt");
        alert("로그인을 해주세요.");
      } else if (error.response?.status === 400) {
        alert("잘못된 접근입니다.");
      }
      goToMain();
    }
  };

  useEffect(() => {
    tryToGetProfile(username || undefined);
  }, [username]);

  useEffect(() => {
    if (socket && username) {
      socket.emit("visitUserProfile", username);

      socket.on("alarm", (data: any) => {
        if (data.alarmType === "MATCHED") {
          setIsMatched(true);
        }
        if (data.alarmType === "UNMATCHED") {
          setIsMatched(false);
        }
        if (data.alarmType === "DISLIKED") {
          setIsMatched(false);
          setProfileData((prevData) => ({
            ...prevData!,
            isReceivedLiked: false,
          }));
        }
        if (data.alarmType === "LIKED") {
          setIsMatched(false);
          setProfileData((prevData) => ({
            ...prevData!,
            isReceivedLiked: true,
          }));
        }
      });

      return () => {
        socket.off("alarm");
      };
    }
  }, [socket]);

  const onClickLikeUser = () => {
    if (profileData?.isSendedLiked !== true) {
      alert("좋아요를 눌렀습니다.");
      if (socket && username) {
        socket.emit("likeUser", username);
        setProfileData((prevData) => ({
          ...prevData!,
          isSendedLiked: true,
        }));
      }
    } else if (profileData?.isSendedLiked === true) {
      alert("좋아요를 취소했습니다.");
      if (socket && username) {
        socket.emit("dislikeUser", username);
        setProfileData((prevData) => ({
          ...prevData!,
          isSendedLiked: false,
        }));
      }
    }
  };

  const onClickBlockUser = async () => {
    if (username) {
      try {
        const res = await axiosUserBlock(username);
        goToMain();
        alert(username + "을 차단했습니다.");
      } catch (error) {
        alert("'좋아요'를 누른 사람은 차단이 불가능 합니다.");
      }
    }
  };

  const tryUserReport = async () => {
    if (username) {
      try {
        const res = await axiosUserReport(username);

        goToMain();
        alert("유저가 신고되었습니다.");
      } catch (error) {
        alert("'좋아요'를 누른 사람은 신고가 불가능 합니다.");
      }
    }
  };

  const handleRatingChange = (newRating: number) => {
    setUserRating(newRating);
  };

  const tryToRateUser = async () => {
    if (username) {
      try {
        const res = await axiosUserRate(userRating, username);
        alert(userRating + " 점을 주었습니다.");
        setProfileData((prevData) => ({
          ...prevData!,
          rate: roundToThirdDecimal(res.data.rateAvg),
        }));
      } catch (error) {
        alert("평점 주기에 실패했습니다.");
      }
    }
  };

  return (
    <Container>
      <InputDataContainer>
        <LeftContainer>
          <UserCardContainer>
            <TitleImageContainer>
              {/* 나중에 선택해서 바꿀수 있게 만들기 */}
              <img src={profileData?.profileImages[0]} alt="Profile" />
            </TitleImageContainer>
            <UserInfoContainer>
              <UserNameStyled>
                <p>
                  {profileData?.username}, {profileData?.age}
                </p>
                <OnlineStatusStyled
                  $isOnline={isOnline}
                  $isReceivedLiked={profileData?.isReceivedLiked}
                >
                  {profileData?.isReceivedLiked && <HeartIcon />}
                </OnlineStatusStyled>
              </UserNameStyled>
              <UserLocationStyled>
                {profileData?.si}, {profileData?.gu}
              </UserLocationStyled>
              <UserLocationStyled>
                {formatDate(profileData?.connectedAt)}
              </UserLocationStyled>
              <UserBioStyled>{profileData?.biography}</UserBioStyled>
              <UserHashtagsStyled>
                <TagList
                  tags={HashTagsList}
                  onTagSelect={() => {}}
                  selectable={false}
                  selectedTags={profileData?.hashtags || []}
                  showSelectedOnly={true}
                />
              </UserHashtagsStyled>
            </UserInfoContainer>
          </UserCardContainer>

          <RowContainer>
            <TitleStyled>유저 사진</TitleStyled>
            <ImageUploader
              images={images}
              setImages={setImages}
              isReadOnly={true}
            />
          </RowContainer>
        </LeftContainer>

        <RightContainer>
          <RowContainer>
            <ToggleContainer>
              <TitleStyled>유저 평점 주기</TitleStyled>
              <StarsContainer>
                <Stars rating={profileData?.rate}></Stars>
                <StarsSubmit
                  initialRating={userRating}
                  onRatingChange={handleRatingChange}
                />
              </StarsContainer>

              <StarSubmitButtonStyled
                onClick={tryToRateUser}
                disabled={!username}
              >
                평점주기
              </StarSubmitButtonStyled>
              <TagContainer></TagContainer>
            </ToggleContainer>
          </RowContainer>

          <FilterContainer>
            {["나이", "평점", "지역", "취향"].map((type) => (
              <FilterItemStyled key={type}>
                <FilterTitleStyled>
                  {/* charAt -> 문자열 쿼리 함수 */}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </FilterTitleStyled>

                <FilterValueContainer>
                  <FilterValueStyled>
                    {type === "나이" && `${profileData?.age}`}
                    {type === "평점" &&
                      `${GenderLableMap[profileData?.gender as GenderType]}`}
                    {type === "취향" &&
                      `${
                        PreferenceLableMap[
                          profileData?.preference as PreferenceType
                        ]
                      }`}
                    {type === "지역" &&
                      (profileData?.si
                        ? `${profileData?.si}${
                            profileData?.gu ? `, ${profileData?.gu}` : ""
                          }`
                        : "Not set")}
                  </FilterValueStyled>
                </FilterValueContainer>
              </FilterItemStyled>
            ))}
          </FilterContainer>
          <ButtonContainer>
            <ButtonStyled
              onClick={onClickLikeUser}
              disabled={!username}
              $isLiked={profileData?.isSendedLiked}
            >
              {profileData?.isSendedLiked ? "좋아요 취소하기" : "좋아요"}
            </ButtonStyled>
            <ButtonStyled onClick={goToChat} disabled={!username || !isMatched}>
              채팅하기
            </ButtonStyled>
            <ButtonStyled onClick={onClickBlockUser} disabled={!username}>
              차단하기
            </ButtonStyled>
            <ButtonStyled onClick={tryUserReport} disabled={!username}>
              신고하기
            </ButtonStyled>
          </ButtonContainer>
        </RightContainer>
      </InputDataContainer>
    </Container>
  );
};

export default ProfilePage;

const UserNameStyled = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.4;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 4px;
`;

const UserLocationStyled = styled.div`
  color: var(--line-gray-1);
  font-size: 0.8rem;
  font-weight: 400;
`;

const UserBioStyled = styled.div`
  line-height: 1.4;
  letter-spacing: -0.025em;
  font-size: 0.9rem;
  font-weight: 400;
  max-width: 380px;
  max-height: 80px;
  height: 80px;
  margin-top: 30px;
  margin-bottom: 40px;
`;

const UserHashtagsStyled = styled.div`
  width: 100%;
`;

const UserInfoContainer = styled.div`
  width: 100%;
`;

const TitleImageContainer = styled.div`
  width: 280px;
  height: 330px;
  flex-shrink: 0;
  border-radius: 10px;
  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 30px;
`;

const ButtonStyled = styled.button<{ disabled: boolean; $isLiked?: boolean }>`
  width: 100%;
  @media screen and (max-width: 768px) {
    width: 100%;
    max-width: none;
  }

  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  color: ${(props) =>
    props.disabled ? "var(--line-gray-3)" : "var(--brand-main-1)"};

  border: 1px solid
    ${(props) =>
      props.disabled ? "var(--line-gray-3)" : "var(--brand-main-1)"};
  &:hover {
    background-color: ${(props) =>
      props.disabled ? "var(--white)" : "var(--brand-main-1)"};
    color: ${(props) =>
      props.disabled ? "var(--line-gray-3)" : "var(--white)"};
  }
  &:hover {
    background-color: var(--brand-main-1);
    color: var(--white);
  }

  font-size: 1.1rem;
  background-color: var(--white);
  padding: 12px 0px;
  border-radius: 4px;
`;

const InputDataContainer = styled.div`
  display: flex;
  padding-top: 6vh;
  gap: 24px;
  justify-content: center;
  border-radius: 10px;
  max-width: 1200px;

  @media screen and (max-width: 1360px) {
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: none;
  }

  @media screen and (max-width: 768px) {
    padding: 4vh 0;
  }
`;

const RightContainer = styled.div`
  flex: 1;

  @media screen and (max-width: 1360px) {
    flex: 2;
    max-width: 792px;
    width: 90%;
  }
`;

const LeftContainer = styled.div`
  flex: 2;
  max-width: 792px;
  width: 90%;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  @media screen and (max-width: 768px) {
    justify-content: center;
  }
`;

const UserCardContainer = styled.div`
  @media screen and (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    /* ## */
    align-items: center;
  }

  border: 1px solid var(--black);
  margin-bottom: 40px;
  padding-right: 38px;
  padding-left: 38px;
  padding-bottom: 38px;
  padding-top: 20px;
  width: 100%;
  display: flex;
  gap: 30px;
`;

const RowContainer = styled.div`
  margin-bottom: 40px;
  border: 1px solid var(--black);
  padding-right: 38px;
  padding-left: 38px;
  padding-bottom: 38px;
  padding-top: 20px;
  width: 100%;

  @media screen and (max-width: 768px) {
    width: 100%;
    padding-left: 20px;
  }
`;

const TitleStyled = styled.div`
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: -0.025em;
  margin-bottom: 20px;

  @media screen and (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ToggleContainer = styled.div`
  & > ${TitleStyled}:nth-of-type(3) {
    margin-top: 30px;
  }
  width: 100%;
`;

const StarsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  width: 100%;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 8px;
  width: 100%;
`;

const FilterItemStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 188px;
  @media screen and (max-width: 1360px) {
    width: calc(50% - 8px);
  }
  border: 1px solid var(--black);
  padding: 10px 20px;
  align-items: flex-end;
`;

const FilterTitleStyled = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.4;
  width: 100%;
  border-bottom: 1px solid var(--black);
`;

const FilterValueContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--black);
  width: 92px;
  height: 43px;
`;

const FilterValueStyled = styled.div`
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.4;
`;

const StarSubmitButtonStyled = styled.button<{ disabled: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: var(--white);
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 400;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  color: ${(props) =>
    props.disabled ? "var(--line-gray-3)" : "var(--brand-main-1)"};

  border: 1px solid
    ${(props) =>
      props.disabled ? "var(--line-gray-3)" : "var(--brand-main-1)"};
  &:hover {
    background-color: ${(props) =>
      props.disabled ? "var(--white)" : "var(--brand-main-1)"};
    color: ${(props) =>
      props.disabled ? "var(--line-gray-3)" : "var(--white)"};
  }
`;

const OnlineStatusStyled = styled.div<{
  $isOnline: boolean;
  $isReceivedLiked?: boolean;
}>`
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 20px;
  background-color: ${(props) =>
    props.$isOnline ? "var(--online)" : "var(--offline)"};
  box-shadow: ${(props) =>
    props.$isOnline
      ? `0 0 0.5rem #fff, 
         inset 0 0 0.5rem #fff, 
         0 0 1rem var(--online),
         inset 0 0 1rem var(--online), 
         0 0 4rem var(--online),
         inset 0 0 2rem var(--online)`
      : `0 0 0.5rem #fff, 
         inset 0 0 0.5rem #fff, 
         0 0 1rem var(--offline),
         inset 0 0 1rem var(--offline), 
         0 0 4rem var(--offline),
         inset 0 0 2rem var(--offline)`};

  &::before {
    content: "";
    position: absolute;
    top: 55px;
    left: 5px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    z-index: 1;
  }

  ${({ $isReceivedLiked }) =>
    $isReceivedLiked &&
    `
    &::before {
      background-color: var(--brand-sub-2);
      animation: pulse 1s infinite;
    }

    @keyframes pulse {
      0% {
        transform: scale(1.3);
        box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7);
      }
      
      70% {
        transform: scale(1.35);
        box-shadow: 0 0 0 10px rgba(255, 82, 82, 0);
      }
      
      100% {
        transform: scale(1.3);
        box-shadow: 0 0 0 0 rgba(255, 82, 82, 0);
      }
    }
  `}

  & > svg {
    position: absolute;
    top: 60px;
    left: 10px;
    transform: translate(-50%, -50%);
    z-index: 2;
    /* color: white; // 하트 아이콘 색상 */
  }
`;

// const OnlineStatusStyled = styled.div<{
//   $isOnline: boolean;
//   $isReceivedLiked?: boolean;
// }>`
//   position: relative;
//   & > svg {
//     z-index: 3;
//   }
//   ${({ $isReceivedLiked }) =>
//     $isReceivedLiked &&
//     `
//     &::after {
//       content: '';
//       position: absolute;
//       top: 20px;
//       right: 5px;
//       z-index: 0;
//       width: 10px;
//       height: 10px;
//       background-color: var(--brand-main-1);
//       border-radius: 50%;
//       animation: pulse 1s infinite;
//     }

//     @keyframes pulse {
//       0% {
//         transform: scale(0.95);
//         box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7);
//       }

//       70% {
//         transform: scale(1);
//         box-shadow: 0 0 0 10px rgba(255, 82, 82, 0);
//       }

//       100% {
//         transform: scale(0.95);
//         box-shadow: 0 0 0 0 rgba(255, 82, 82, 0);
//       }
//     }
//   `}
//   /* } */

//   background-color: ${(props) =>
//     props.$isOnline ? "var(--online)" : "var(--offline)"};
//   width: 20px;
//   height: 20px;
//   border-radius: 20px;
//   box-shadow: ${(props) =>
//     props.$isOnline
//       ? `0 0 0.5rem #fff,
//        inset 0 0 0.5rem #fff,
//        0 0 1rem var(--online),
//        inset 0 0 1rem var(--online),
//        0 0 4rem var(--online),
//        inset 0 0 2rem var(--online)`
//       : `0 0 0.5rem #fff,
//        inset 0 0 0.5rem #fff,
//        0 0 1rem var(--offline),
//        inset 0 0 1rem var(--offline),
//        0 0 4rem var(--offline),
//        inset 0 0 2rem var(--offline)`};
// `;
