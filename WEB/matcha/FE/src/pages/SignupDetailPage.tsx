import styled, { keyframes } from "styled-components";
import { useState } from "react";
import { tagItem } from "@/pages/SignUpPage";
import TagList, { TagProps } from "@/components/template/TagTemplate";
import InputTemplate from "@/components/template/InputTemplate";
import ImageUpload from "@/components/ImageUpload";
import DropboxTemplate from "@/components/template/DropboxTemplate";
import GeoLocationHandler from "@/components/location/GeoLocationHandler";
import { axiosUserCreate } from "@/api/axios.custom";
import { SignupDto } from "@/types/tag.dto";
import useRouter from "@/hooks/useRouter";
import {
  genderTagList,
  HashTagsList,
  locationSiTagList,
  preferenceTagList,
} from "@/types/tags";
import { LocationData } from "@/components/location/LocationData";
import Loading from "@/components/chat/Loading";
import { GenderReverseMap, mapGender, mapPreference } from "@/types/maps";

// TODO : 다른 곳으로 정리
export interface AgeTagItem {
  value: string;
  label: string;
}

export interface GpsState {
  isAllowed: boolean;
  error: string | null;
  hasAttempted: boolean;
}

const ageTagList: AgeTagItem[] = Array.from({ length: 81 }, (_, index) => {
  const age = index + 20;
  return {
    value: age.toString(),
    label: `${age}세`,
  };
});

const SignupDetailPage = () => {
  const { goToMain } = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [hashTags, setHashTagsError] = useState<string | null>(null);
  const [locationGuTagList, setLocationGuTagList] = useState<tagItem[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [inputError, setInputError] = useState<boolean>(false);
  const [signUpTextData, setSignUpTextData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    bio: "",
  });
  const [signUpDropboxData, setSignUpDropboxData] = useState({
    location_si: "",
    location_gu: "",
    gender: "",
    preference: "",
    age: "",
  });

  const [gpsState, setGpsState] = useState<GpsState>({
    isAllowed: false,
    error: null,
    hasAttempted: false,
  });

  const handleGpsAllow = () => {
    setLocationGuTagList([]);
    if (!gpsState.isAllowed) {
      setGpsState((prev) => ({
        ...prev,
        isAllowed: true,
        hasAttempted: true,
        error: null,
      }));
    }
  };

  const handleGpsDeny = () => {
    setLocationGuTagList([]);
    if (gpsState.isAllowed) {
      setGpsState((prev) => ({
        ...prev,
        isAllowed: false,
        hasAttempted: true,
        error: null,
      }));
    }
  };

  const isFormValid = () => {
    return (
      signUpTextData.firstname.trim() !== "" &&
      signUpTextData.lastname.trim() !== "" &&
      signUpTextData.username.trim() !== "" &&
      signUpTextData.bio.trim() !== "" &&
      signUpDropboxData.location_si !== "" &&
      signUpDropboxData.location_gu !== "" &&
      signUpDropboxData.gender !== "" &&
      signUpDropboxData.preference !== "" &&
      signUpDropboxData.age !== "" &&
      inputError !== true
    );
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
        // 'si'가 변경되면 'gu' 초기화
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

  const trySignup = async () => {
    if (images.length < 5) {
      setImageError("최소 5개의 이미지를 업로드해야 합니다.");
      return;
    }
    if (selectedTags.length < 1) {
      setHashTagsError("최소 1개의 해시태그를 선택해야 합니다.");
      return;
    }
    setLoading(true);
    try {
      const signupData: SignupDto = {
        username: signUpTextData.username,
        lastName: signUpTextData.lastname,
        firstName: signUpTextData.firstname,
        gender: mapGender(signUpDropboxData.gender),
        preference: mapPreference(signUpDropboxData.preference),
        biography: signUpTextData.bio, // 필요한 경우 추가
        age: parseInt(signUpDropboxData.age), // 문자열을 숫자로 변환
        isGpsAllowed: gpsState.isAllowed,
        hashtags: selectedTags, // 선택된 태그들
        si: signUpDropboxData.location_si,
        gu: signUpDropboxData.location_gu,
        profileImages: images, // 업로드된 이미지 URL 배열
      };

      const res = await axiosUserCreate(signupData);
      goToMain();
    } catch (err : any) {
      if (err.response.status === 400) {
        alert("올바른 접근이 아닙니다.");
      }else{
        alert("빈 공란을 모두 채워주세요");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <MainTitleStyled>
        MEET<span>CHA</span>
      </MainTitleStyled>
      <RowContainer>
        <TitleStyled>User Profile</TitleStyled>
        <InputContainer>
          <InputTemplate
            type="firstname"
            label="이름"
            value={signUpTextData.firstname}
            onChange={handleInputChange}
            setError={setInputError}
          />
          <InputTemplate
            type="lastname"
            label="성"
            value={signUpTextData.lastname}
            onChange={handleInputChange}
            setError={setInputError}
          />
          <InputTemplate
            type="username"
            label="유저명"
            value={signUpTextData.username}
            onChange={handleInputChange}
            setError={setInputError}
          />
          <InputTemplate
            type="bio"
            label="약력"
            value={signUpTextData.bio}
            onChange={handleInputChange}
            setError={setInputError}
          />
        </InputContainer>
      </RowContainer>

      <RowContainer>
        <TitleStyled>User Photo</TitleStyled>
        <ImageUpload images={images} setImages={setImages} />
        {imageError && <ErrorStyled>{imageError}</ErrorStyled>}
      </RowContainer>

      <GeoLocationHandler
        isGpsAllowed={gpsState.isAllowed}
        onGeoLocationError={handleGeoLocationError}
        onAddressFound={handleAddressFound}
      />

      <RowContainer>
        <TitleStyled>위치 정보 허용</TitleStyled>
        <TagContainer>
          <TagStyled $selected={gpsState.isAllowed} onClick={handleGpsAllow}>
            허용
          </TagStyled>
          <TagStyled $selected={!gpsState.isAllowed} onClick={handleGpsDeny}>
            거부
          </TagStyled>
        </TagContainer>
        {gpsState.error && (
          <ErrorStyled>
            {gpsState.error}
            <br />
            {gpsState.isAllowed
              ? "브라우저 설정에서 위치 정보 접근을 허용해주세요."
              : "IP 기반 위치 정보를 사용합니다."}
          </ErrorStyled>
        )}
      </RowContainer>

      <RowContainer>
        <TitleStyled>User Detail</TitleStyled>
        <InputContainer>
          <DropboxTemplate
            options={locationSiTagList}
            type="도/시"
            onSelect={(option) => handleDropboxChange("location_si", option)}
            selectedValue={signUpDropboxData.location_si}
          />
          <DropboxTemplate
            options={locationGuTagList}
            type="시/군/구"
            onSelect={(option) => handleDropboxChange("location_gu", option)}
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
        </InputContainer>
      </RowContainer>

      <HashTagContainer>
        <TitleStyled>HashTags</TitleStyled>
        <TagList
          tags={HashTagsList}
          onTagSelect={onClickTags}
          selectedTags={selectedTags}
        />
        {hashTags && <ErrorStyled>{hashTags}</ErrorStyled>}
      </HashTagContainer>
      <ButtonStyled onClick={trySignup} disabled={!isFormValid() || loading}>
        {loading ? <LoadingSpinner /> : "가입하기"}
      </ButtonStyled>
    </Container>
  );
};

export default SignupDetailPage;

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

const InputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 740px;

  & > div {
    max-width: 350px;
  }

  @media screen and (max-width: 768px) {
    width: 100%;
    & > div {
      max-width: none;
    }
  }
`;

const HashTagContainer = styled.div`
  width: 740px;
  margin-bottom: 60px;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const RowContainer = styled.div`
  margin-bottom: 40px;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const TitleStyled = styled.div`
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: -0.025em;

  margin-bottom: 20px;
`;

const Container = styled.div`
  display: flex;
  padding-top: 6vh;

  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;

  @media screen and (max-width: 768px) {
    padding-top: 10vh;
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
`;

const MainTitleStyled = styled.div`
  font-size: 3rem;
  font-family: var(--main-font);
  /* margin-bottom: 20px; */
  & > span {
    color: var(--brand-main-1);
  }
  margin-bottom: 30px;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 740px;
  @media screen and (max-width: 768px) {
    width: 100%;
    /* justify-content: center; */
  }
`;

const ErrorStyled = styled.div`
  color: var(--status-error-1);
  margin-top: 6px;
  font-weight: 400;
  line-height: 1.4;
  font-size: 1rem;
  letter-spacing: -0.025em;
  width: 250px;
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

const ButtonStyled = styled.button<{ disabled: boolean }>`
  width: 350px;
  font-size: 1.1rem;
  background-color: ${(props) =>
    props.disabled ? "var(--line-gray-3)" : "var(--brand-main-1)"};
  color: ${(props) => (props.disabled ? "var(--line-gray-1)" : "var(--white)")};
  padding: 12px 0px;
  box-shadow: 4px 4px 3px 0px var(--black);
  margin-top: 30px;
  margin-bottom: 50px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;
