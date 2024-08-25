import InputTemplate from "@/components/template/InputTemplate";
import styled from "styled-components";
import { useState } from "react";
import { axiosEmailSend, axiosRegister } from "@/api/axios.custom";
import useRouter from "@/hooks/useRouter";

export interface tagItem {
  value: string;
  label: string;
}

const SignUpPage = () => {
  const { goToMain } = useRouter();

  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isCheckEmail, setIsCheckEmail] = useState<boolean>(false);
  const [signUpTextData, setSignUpTextData] = useState({
    email: "",
    password: "",
    checkPassword: "",
  });

  const trySignUp = async () => {
    try {
      const res = await axiosRegister(
        signUpTextData.email,
        signUpTextData.password,
        signUpTextData.checkPassword
      );
      axiosEmailSend();
      setIsCheckEmail(true);
      setErrorMessage(""); // 성공 시 에러 메시지 초기화
    } catch (error: any) {
      setErrorMessage(
        error.response?.data || "회원가입 중 오류가 발생했습니다."
      );
      throw error;
    }
  };
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setSignUpTextData({ ...signUpTextData, [name]: value });
    setErrorMessage("");
  };

  const handleSubmit = () => {
    if (error === true) {
      return;
    }
    trySignUp();
  };

  const onClickOauthButton = () => {
    const url = `${import.meta.env.VITE_OAUTH_REDIRECT_URI}client_id=${
      import.meta.env.VITE_OAUTH_CLIENT_ID
    }&redirect_uri=${
      import.meta.env.VITE_OAUTH_CALLBACK_URI
    }&response_type=code`;
    window.location.href = url;
  };

  return (
    <Container>
      <InputContainer>
        <TitleStyled onClick={goToMain}>
          MEET<span>CHA</span>
        </TitleStyled>
        <InputTemplate
          type="email"
          label="이메일"
          value={signUpTextData.email}
          onChange={handleInputChange}
          setError={setError}
        />
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
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <ButtonStyled onClick={handleSubmit}>가입하기</ButtonStyled>
        {isCheckEmail && <div> 이메일을 확인하세요</div>}
        <OauthContainer>
          <OauthLabelStyled>간편 회원가입</OauthLabelStyled>
          <OauthButtonStyled onClick={onClickOauthButton}>
            42 login
          </OauthButtonStyled>
        </OauthContainer>
      </InputContainer>
    </Container>
  );
};

export default SignUpPage;

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

const ErrorMessage = styled.div`
  color: var(--status-error-1);
  font-size: 0.9rem;
  margin-top: 10px;
  text-align: center;
  width: 100%;
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

const OauthContainer = styled.div`
  display: flex;
  width: 350px;
  height: 50px;
  font-size: 1.1rem;
  font-weight: 400;
  line-height: 1.4;

  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const OauthLabelStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
  border-top: 1px solid black;
  background-color: var(--white);
`;

const OauthButtonStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--brand-sub-1);
  flex: 1;
  width: 100%;
  border: 1px solid black;
`;

const ButtonStyled = styled.button`
  /* width: 350px; */
  width: 100%;
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
  margin-bottom: 40px;
`;
