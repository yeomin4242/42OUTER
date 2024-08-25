import { axiosCreateTwoFactor, axiosVerifyTwoFactor } from "@/api/axios.custom";
import useRouter from "@/hooks/useRouter";
import { userSocketLogin } from "@/recoil/atoms";
import React, {
  useState,
  useRef,
  KeyboardEvent,
  ChangeEvent,
  useEffect,
} from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

const TwoFactorPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const { goToMain } = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const setSocketRecoil = useSetRecoilState(userSocketLogin);

  //   TODO : 1단계 이메일 인증을 통과하면 2단계때 2fa받을수 있게 BE고치기
  const tryVerifyTwoFactor = async () => {
    setIsLoading(true);
    setError(null);
    const codeString = code.join("");
    try {
      const res = await axiosVerifyTwoFactor(codeString);
      setSocketRecoil(true);
      goToMain();
      // 성공 처리 로직 (예: 다음 페이지로 이동)
    } catch (err: any) {
      console.error("2FA 인증 실패:", err);
      setError(
        err.response?.data?.message || "인증에 실패했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const tryTwofactorCreate = async () => {
    setIsLoading(true);
    try {
      const res = await axiosCreateTwoFactor();
    } catch (error) {
      setError("인증 코드 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    tryTwofactorCreate();
  }, []);

  const handleSubmit = () => {
    if (code.some((digit) => digit === "")) {
      setError("모든 칸을 입력해주세요.");
      return;
    }
    tryVerifyTwoFactor();
  };

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return; // 숫자만 허용
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value !== "" && index < 6) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newCode = [...code];
    pastedData.forEach((digit, index) => {
      if (index < 6 && /^[0-9]$/.test(digit)) {
        newCode[index] = digit;
      }
    });
    setCode(newCode);
    inputs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  return (
    <Container>
      <>
        <TitleStyled>
          MEET<span>CHA</span>
        </TitleStyled>
        <InfoTextStyled>
          가입해주신 이메일의 메일함을 확인해주세요!
        </InfoTextStyled>
        <CodeContainer>
          {[0, 1].map((groupIndex) => (
            <CodeGroupStyled key={groupIndex}>
              {code
                .slice(groupIndex * 3, (groupIndex + 1) * 3)
                .map((digit, index) => {
                  const actualIndex = groupIndex * 3 + index;
                  return (
                    <CodeStyled
                      key={actualIndex}
                      ref={(el) => (inputs.current[actualIndex] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange(actualIndex, e.target.value)
                      }
                      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                        handleKeyDown(actualIndex, e)
                      }
                      onPaste={handlePaste}
                      disabled={isLoading}
                    />
                  );
                })}
            </CodeGroupStyled>
          ))}
        </CodeContainer>
        <ErrorContainer>
          {error && <ErrorStyled>{error}</ErrorStyled>}
        </ErrorContainer>
        <ButtonStyled onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <LoadingSpinner /> : "인증하기"}
        </ButtonStyled>
      </>
    </Container>
  );
};

const LoadingSpinner = styled.div`
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin: 0 auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorContainer = styled.div`
  height: 80px; // ButtonStyled와의 간격
  display: flex;
  align-items: flex-start;
`;

const Container = styled.div`
  display: flex;
  padding-top: 15vh;

  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;

  @media screen and (max-width: 768px) {
    padding: 10vh;
  }
`;

const InfoTextStyled = styled.div`
  font-size: 0.9rem;
  line-height: 1.4;
  font-weight: 400;
  margin-bottom: 65px;
`;

const TitleStyled = styled.div`
  font-size: 3rem;
  font-family: var(--main-font);
  margin-bottom: 25px;
  /* margin-bottom: 20px; */
  & > span {
    color: var(--brand-main-1);
  }
`;

const ErrorStyled = styled.div`
  margin-left: 20px;
  font-weight: 400;
  line-height: 1.4;
  font-size: 0.9rem;
  letter-spacing: -0.025em;
  color: var(--status-error-2);
`;

const CodeContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 10px;
  width: 100%;
  max-width: 600px;

  @media screen and (max-width: 768px) {
    gap: 3%;
  }
`;

const CodeGroupStyled = styled.div`
  display: flex;
  gap: 10px;

  @media screen and (max-width: 768px) {
    gap: 3%;
    /* flex: 1; */
  }
`;

const CodeStyled = styled.input`
  outline: none;
  text-align: center;
  color: var(--black);
  font-size: 2rem;
  font-weight: 400;
  line-height: 1.4;
  background-color: var(--white);
  border: 2px solid var(--line-gray-2);
  border-radius: 10px;
  width: 80px;
  height: 96px;

  &:focus {
    border-color: var(--brand-main-1);
    background-color: var(--brand-sub-2);
  }

  /* TODO : 나중에 해상도 320px일때 크기 따로 맞추기 */
  @media screen and (max-width: 768px) {
    width: 33%;
    height: auto;
    aspect-ratio: 1 / 1.2; // 가로:세로 비율을 1:1.2로 설정
    font-size: 1.5rem;
    padding: 0;
  }

  @media screen and (max-width: 480px) {
    font-size: 1.2rem;
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
  margin-bottom: 50px;
`;

export default TwoFactorPage;
