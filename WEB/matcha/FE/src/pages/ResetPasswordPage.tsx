import InputTemplate from "@/components/template/InputTemplate";
import styled from "styled-components";
import { useState } from "react";
import useRouter from "@/hooks/useRouter";
import { axiosChangePassword } from "@/api/axios.custom";

export interface tagItem {
  value: string;
  label: string;
}

const ResetPasswordPage = () => {
  const { goTologin } = useRouter();
  const [error, setError] = useState<boolean>(false);
  const [signUpTextData, setSignUpTextData] = useState({
    password: "",
    checkPassword: "",
  });
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setSignUpTextData({ ...signUpTextData, [name]: value });
  };

  const handleSubmit = () => {
    if (error === true) {
      return;
    }
    tryResetPasswordVerify();
  };

  const tryResetPasswordVerify = async () => {
    try {
      const res = await axiosChangePassword(
        signUpTextData.password,
        signUpTextData.checkPassword
      );
      goTologin();
      alert("비밀번호가 변경되었습니다.");
    } catch (error) {
      alert(error);
      throw error;
    }
  };

  return (
    <Container>
      <InputContainer>
        <TitleStyled>
          MEET<span>CHA</span>
        </TitleStyled>
        <>
          <InfoTextContainer>
            <InfoTextStyled>
              {/* 아래에 가입한 이메일을 입력해주세요. */}
            </InfoTextStyled>
            <InfoTextStyled>
              변경하려고 하는 비밀번호를 입력해주세요
            </InfoTextStyled>
          </InfoTextContainer>
          <InputTemplate
            type="password"
            label="비밀번호"
            value={signUpTextData.password}
            onChange={handleInputChange}
            setError={setError}
          />
          <InputTemplate
            type="checkPassword"
            label="비밀번호 확인"
            value={signUpTextData.checkPassword}
            checkPW={signUpTextData.password}
            onChange={handleInputChange}
            setError={setError}
          />
          <ButtonStyled onClick={handleSubmit}>인증하기</ButtonStyled>
        </>
      </InputContainer>
    </Container>
  );
};

export default ResetPasswordPage;

const InfoTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const InfoTextStyled = styled.div`
  font-size: 0.9rem;
  line-height: 1.4;
  font-weight: 400;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  max-width: 350px;
  @media screen and (max-width: 768px) {
    width: 100%;
    max-width: none;
  }
`;

const ButtonStyled = styled.button`
  @media screen and (max-width: 768px) {
    width: 100%;
  }
  width: 350px;
  font-size: 1.1rem;
  background-color: var(--brand-main-1);
  padding: 12px 0px;

  box-shadow: 4px 4px 3px 0px var(--black);
  margin-top: 30px;
  margin-bottom: 50px;
`;

const TitleStyled = styled.div`
  font-size: 3rem;
  font-family: var(--main-font);
  /* margin-bottom: 20px; */
  & > span {
    color: var(--brand-main-1);
  }
  /* margin-bottom: 25px; */
`;

const Container = styled.div`
  display: flex;
  padding-top: 15vh;

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
