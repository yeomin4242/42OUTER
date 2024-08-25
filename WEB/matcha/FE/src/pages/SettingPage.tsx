import InputTemplate from "@/components/template/InputTemplate";
import { useCallback, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { tagItem } from "./LoginPage";
import ImageUploader from "@/components/ImageUpload";
import DropboxTemplate from "@/components/template/DropboxTemplate";
import { GpsState } from "./SignupDetailPage";
import TagList, { TagProps } from "@/components/template/TagTemplate";
import { axiosSettingCreate, axiosSettingModify } from "@/api/axios.custom";
import { SettingDto } from "@/types/tag.dto";
import useRouter from "@/hooks/useRouter";
import GeoLocationHandler from "@/components/location/GeoLocationHandler";
import {
  ageTagList,
  genderTagList,
  HashTagsList,
  locationSiTagList,
  preferenceTagList,
} from "@/types/tags";
import { removeCookie } from "@/api/cookie";
import {
  GenderLableMap,
  mapGender,
  mapPreference,
  PreferenceLableMap,
} from "@/types/maps";
import { GenderType, PreferenceType } from "@/types/tag.enum";
import { LocationData } from "@/components/location/LocationData";

const SettingPage = () => {
  const [signupError, setSignupError] = useState<string | null>(null);
  const { goToMain } = useRouter();
  const [settingData, setSettingData] = useState<SettingDto | undefined>(
    undefined
  );
  const [isModified, setIsModified] = useState(false);
  const [isChangeGps, setIsChangeGps] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [locationGuTagList, setLocationGuTagList] = useState<tagItem[]>([]);
  const [hashTags, setHashTagsError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [signUpTextData, setSignUpTextData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    bio: "",
    username: "",
  });
  const [signUpDropboxData, setSignUpDropboxData] = useState({
    location_si: "",
    location_gu: "",
    gender: "",
    preference: "",
    age: "",
  });
  const [toggleData, setToggleData] = useState({
    twoFactor: false,
    location: false,
  });
  const [gpsState, setGpsState] = useState<GpsState>({
    isAllowed: false,
    error: null,
    hasAttempted: false,
  });

  useEffect(() => {
    trySettingProfile();
  }, []);

  useEffect(() => {
    if (settingData) {
      setImages(settingData.profileImages || []);
      setSelectedTags(settingData.hashtags || []);
      setSignUpTextData({
        firstname: settingData.firstName || "",
        lastname: settingData.lastName || "",
        email: settingData.email || "",
        bio: settingData.biography || "",
        username: settingData.username || "",
      });
      setSignUpDropboxData({
        location_si: settingData.si || "",
        location_gu: settingData.gu || "",
        gender: GenderLableMap[settingData.gender as GenderType] || "",
        preference:
          PreferenceLableMap[settingData.preference as PreferenceType] || "",
        age: settingData.age?.toString() || "",
      });
      setToggleData({
        twoFactor: settingData.isTwofa || false,
        location: settingData.isGpsAllowed || false,
      });
    }
  }, [settingData]);

  const checkModification = useCallback(() => {
    if (!settingData) return false;

    const isProfileModified =
      signUpTextData.firstname !== settingData.firstName ||
      signUpTextData.lastname !== settingData.lastName ||
      signUpTextData.email !== settingData.email ||
      signUpTextData.bio !== settingData.biography ||
      signUpTextData.username !== settingData.username;

    const isDropboxModified =
      signUpDropboxData.location_si !== settingData.si ||
      signUpDropboxData.location_gu !== settingData.gu ||
      signUpDropboxData.gender !== settingData.gender ||
      signUpDropboxData.preference !== settingData.preference ||
      signUpDropboxData.age !== settingData.age?.toString();

    const isToggleModified =
      toggleData.twoFactor !== settingData.isTwofa ||
      toggleData.location !== settingData.isGpsAllowed;

    const isTagsModified =
      JSON.stringify(selectedTags) !== JSON.stringify(settingData.hashtags);
    const isImagesModified =
      JSON.stringify(images) !== JSON.stringify(settingData.profileImages);

    return (
      isProfileModified ||
      isDropboxModified ||
      isToggleModified ||
      isTagsModified ||
      isImagesModified
    );
  }, [
    signUpTextData,
    signUpDropboxData,
    toggleData,
    selectedTags,
    images,
    settingData,
  ]);

  const handleToggle = (field: "twoFactor" | "location", value: boolean) => {
    if (field === "twoFactor"){
      setToggleData((prev) => ({
        ...prev,
        [field]: value,
      }));
      return ;
    }
    if (isChangeGps === false) setIsChangeGps(true);
    if (field === "location" && value === false) {
      setGpsState((prev) => ({
        ...prev,
        isAllowed: false,
        hasAttempted: true,
        error: null,
      }));
    }
    if (field === "location" && value === true) {
      setGpsState((prev) => ({
        ...prev,
        isAllowed: true,
        hasAttempted: true,
        error: null,
      }));
    }
    setToggleData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setSignUpTextData({ ...signUpTextData, [name]: value });
  };

  const handleDropboxChange = (name: string, option: tagItem) => {
    setSignUpDropboxData((prev) => ({ ...prev, [name]: option.label }));
    if (name === "location_si") {
      const selectedArea = LocationData.find(
        (area) => area.name === option.value
      );
      if (selectedArea) {
        const guList: tagItem[] = selectedArea.subArea.map((gu) => ({
          value: gu,
          label: gu,
        }));
        setLocationGuTagList(guList);
        setSignUpDropboxData((prev) => ({ ...prev, location_gu: "" }));
      } else {
        setLocationGuTagList([]);
      }
    }
  };

  const onClickTags = (tag: TagProps) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag.value)) {
        return prev.filter((value) => value !== tag.value);
      } else {
        return [...prev, tag.value];
      }
    });
  };

  const trySettingProfile = async () => {
    try {
      const res = await axiosSettingCreate();
      setSettingData(res.data);
    } catch (error) {
      goToMain();
      removeCookie("jwt");
      alert("로그인을 해주세요");
    }
  };

  const updateProfile = async () => {
    if (images.length < 5) {
      setSignupError("최소 5개의 이미지를 업로드해야 합니다.");
      return;
    }
    if (selectedTags.length < 1) {
      setHashTagsError("최소 1개의 해시태그를 선택해야 합니다.");
      return;
    }
    if (!isModified) {
      return;
    }
    setIsLoading(true);
    try {
      const updatedData: SettingDto = {
        firstName: signUpTextData.firstname,
        lastName: signUpTextData.lastname,
        email: signUpTextData.email,
        username: signUpTextData.username,
        biography: signUpTextData.bio,
        si: signUpDropboxData.location_si,
        gu: signUpDropboxData.location_gu,
        gender: mapGender(signUpDropboxData.gender),
        preference: mapPreference(signUpDropboxData.preference),
        age: parseInt(signUpDropboxData.age),
        isTwofa: toggleData.twoFactor,
        isGpsAllowed: toggleData.location,
        hashtags: selectedTags,
        profileImages: images,
      };

      const res = await axiosSettingModify(updatedData);
      alert("프로필이 업데이트 되었습니다.");
      setIsModified(false);
    } catch (error) {
      console.error("프로필 업데이트 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeoLocationError = (error: string) => {
    setGpsState((prev) => ({ ...prev, error }));
  };

  const handleAddressFound = (si: string, gu: string) => {
    setSignUpDropboxData((prev) => ({
      ...prev,
      location_si: si,
      location_gu: gu,
    }));
  };

  useEffect(() => {
    setIsModified(checkModification());
  }, [
    signUpTextData,
    signUpDropboxData,
    toggleData,
    selectedTags,
    images,
    checkModification,
  ]);

  return (
    <Container>
      <InputDataContainer>
        <LeftContainer>
          <RowContainer>
            <TitleStyled>User Profile</TitleStyled>
            <InputContainer>
              <InputTemplate
                type="firstname"
                label="이름"
                value={signUpTextData.firstname}
                onChange={handleInputChange}
              />
              <InputTemplate
                type="lastname"
                label="성"
                value={signUpTextData.lastname}
                onChange={handleInputChange}
              />
              <InputTemplate
                type="email"
                label="이메일"
                value={signUpTextData.email}
                onChange={handleInputChange}
              />
              <InputTemplate
                type="username"
                label="유저명"
                value={signUpTextData.username}
                onChange={handleInputChange}
                disabled={true}
              />
            </InputContainer>
          </RowContainer>
          <RowContainer>
            <TitleStyled>User Photo</TitleStyled>
            <ImageUploader images={images} setImages={setImages} />
            {signupError && <ErrorStyled>{signupError}</ErrorStyled>}
          </RowContainer>

          <RowContainer>
            <TitleStyled>User Detail</TitleStyled>
            <InputContainer>
              <DropboxTemplate
                options={locationSiTagList}
                type="도/시"
                onSelect={(option) =>
                  handleDropboxChange("location_si", option)
                }
                selectedValue={signUpDropboxData.location_si}
              />
              <DropboxTemplate
                options={locationGuTagList}
                type="시/군/구"
                onSelect={(option) =>
                  handleDropboxChange("location_gu", option)
                }
                selectedValue={signUpDropboxData.location_gu}
                disabled={!signUpDropboxData.location_si}
              />
              <DropboxTemplate
                options={genderTagList}
                type="성별"
                onSelect={(option) => handleDropboxChange("gender", option)}
                selectedValue={signUpDropboxData.gender}
              />
              <DropboxTemplate
                options={preferenceTagList}
                type="취향"
                onSelect={(option) => handleDropboxChange("preference", option)}
                selectedValue={signUpDropboxData.preference}
              />
              <DropboxTemplate
                options={ageTagList}
                type="나이"
                onSelect={(option) => handleDropboxChange("age", option)}
                selectedValue={signUpDropboxData.age}
              />
              <InputTemplate
                type="bio"
                label="약력"
                value={signUpTextData.bio}
                onChange={handleInputChange}
              />
            </InputContainer>
          </RowContainer>
        </LeftContainer>

        <RightContainer>
          <RowContainer>
            <ToggleContainer>
              <TitleStyled>2fa 인증 설정</TitleStyled>
              <TagContainer>
                <TagStyled
                  $selected={toggleData.twoFactor}
                  onClick={() => handleToggle("twoFactor", true)}
                >
                  허용
                </TagStyled>
                <TagStyled
                  $selected={!toggleData.twoFactor}
                  onClick={() => handleToggle("twoFactor", false)}
                >
                  거부
                </TagStyled>
              </TagContainer>

              <TitleStyled>위치 정보 허용</TitleStyled>
              <TagContainer>
                <TagStyled
                  $selected={toggleData.location}
                  onClick={() => handleToggle("location", true)}
                >
                  허용
                </TagStyled>
                <TagStyled
                  $selected={!toggleData.location}
                  onClick={() => handleToggle("location", false)}
                >
                  거부
                </TagStyled>
              </TagContainer>

              {isChangeGps && (
                <GeoLocationHandler
                  isGpsAllowed={gpsState.isAllowed}
                  onGeoLocationError={handleGeoLocationError}
                  onAddressFound={handleAddressFound}
                />
              )}
              {gpsState.error && (
                <ErrorStyled>
                  {gpsState.error}
                  <br />
                  {gpsState.isAllowed
                    ? "브라우저 설정에서 위치 정보 접근을 허용해주세요."
                    : "IP 기반 위치 정보를 사용합니다."}
                </ErrorStyled>
              )}
            </ToggleContainer>
          </RowContainer>

          <RowContainer>
            <TitleStyled>HashTags</TitleStyled>
            <TagList
              tags={HashTagsList}
              onTagSelect={onClickTags}
              selectedTags={selectedTags}
            />
            {hashTags && <ErrorStyled>{hashTags}</ErrorStyled>}
          </RowContainer>
        </RightContainer>
      </InputDataContainer>
      <ButtonStyled onClick={updateProfile} disabled={!isModified || isLoading}>
        {isLoading ? (
          <LoadingSpinner />
        ) : isModified ? (
          "수정하기"
        ) : (
          "변경사항 없음"
        )}
      </ButtonStyled>
      {/* <ButtonStyled onClick={updateProfile} disabled={!isModified}>
        {isModified ? "수정하기" : "변경사항 없음"}
      </ButtonStyled> */}
    </Container>
  );
};

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingSpinner = styled.div`
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: ${rotate} 1s linear infinite;
  margin: 0 auto;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ButtonStyled = styled.button`
  @media screen and (max-width: 768px) {
    width: 90%;
    max-width: none;
  }
  width: 350px;
  font-size: 1.1rem;
  background-color: var(--brand-main-1);
  padding: 12px 0px;

  box-shadow: 4px 4px 3px 0px var(--black);
  margin-top: 30px;
  margin-bottom: 50px;
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
    width: 100%;
    padding-top: 4vh;
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

const RightContainer = styled.div`
  flex: 1;
  @media screen and (max-width: 1360px) {
    flex: 2;
    max-width: 792px;
    /* flex-direction: column;
    align-items: center; */
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

const TagStyled = styled.div<{
  $selected: boolean;
}>`
  padding: 6px 24px;
  border-radius: 2px;
  background-color: ${(props) =>
    props.$selected ? "var(--brand-main-1)" : "#f0f0f0"};
  color: ${(props) => (props.$selected ? "var(--white)" : "var(--black)")};

  display: flex;
  align-items: center;
  transition: all 0.1s ease;
  font-size: 0.9rem;
  line-height: 1.4;
  height: 36px;

  &:hover {
    background-color: var(--brand-sub-1);
    color: #f0f0f0;
  }
`;

const RowContainer = styled.div`
  margin-bottom: 40px;
  border: 1px solid var(--black);
  @media screen and (max-width: 768px) {
    width: 100%;
  }

  padding-right: 38px;
  padding-left: 38px;
  padding-bottom: 38px;
  padding-top: 20px;
  width: 100%;
  /* width: 792px; */
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

  /* display: flex;
  flex-direction: column;
  gap: 20px; */
`;

const InputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  & > div {
    max-width: 350px;
  }

  @media screen and (max-width: 1360px) {
    width: 100%;
    & > div {
      max-width: none;
    }
  }
`;

const ErrorStyled = styled.div`
  /* margin-left: 20px; */
  margin-top: 4px;
  font-weight: 400;
  line-height: 1.4;
  font-size: 0.8rem;
  letter-spacing: -0.025em;
  color: var(--status-error-1);
  width: 250px;
`;

export default SettingPage;
