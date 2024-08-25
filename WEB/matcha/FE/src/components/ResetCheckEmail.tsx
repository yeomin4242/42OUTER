import styled from "styled-components";
import InputTemplate from "./template/InputTemplate";
import { useState } from "react";
import { axiosResetCreate } from "@/api/axios.custom";
import useRouter from "@/hooks/useRouter";

const ResetCheckEmail = () => {
  const { goToMain } = useRouter();
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [signUpTextData, setSignUpTextData] = useState({
    email: "",
    password: "",
    checkPassword: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setSignUpTextData({ ...signUpTextData, [name]: value });
    setMessage(""); // 입력 시 메시지 초기화
  };

  const tryResetPasswordCreate = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      const res = await axiosResetCreate(signUpTextData.email);
      setIsSuccess(true);
      setMessage(
        "이메일함에 정상적으로 비밀번호 변경 링크가 전송되었습니다. 메일함을 확인해주세요"
      );
    } catch (error) {
      setIsSuccess(false);
      setMessage("가입된 이메일이 아닙니다");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (error || isLoading || isSuccess) {
      return;
    }
    tryResetPasswordCreate();
  };

  return (
    <Container>
      <InputContainer>
        <TitleStyled onClick={goToMain}>
          MEET<span>CHA</span>
        </TitleStyled>
        <>
          <InfoTextContainer>
            <InfoTextStyled>비밀번호를 찾을 이메일을 알려주세요</InfoTextStyled>
          </InfoTextContainer>
          <InputTemplate
            type="email"
            label="이메일"
            value={signUpTextData.email}
            onChange={handleInputChange}
            setError={setError}
          />
          <ButtonStyled
            onClick={handleSubmit}
            disabled={isLoading || isSuccess}
          >
            {isLoading ? "처리 중..." : isSuccess ? "전송 완료" : "변경하기"}
          </ButtonStyled>
          {isLoading && <LoadingSpinner />}
          {message && (
            <MessageStyled $isSuccess={isSuccess}>{message}</MessageStyled>
          )}
        </>
      </InputContainer>
    </Container>
  );
};

export default ResetCheckEmail;

const MessageStyled = styled.div<{ $isSuccess: boolean }>`
  color: ${(props) => (props.$isSuccess ? "green" : "red")};
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  margin-top: 10px;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--brand-main-1);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

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
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
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
