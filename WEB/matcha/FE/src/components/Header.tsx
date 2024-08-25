import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { axiosLogout } from "@/api/axios.custom";
import { SocketContext } from "@/pages/LayoutPage";
import useRouter from "@/hooks/useRouter";
import { getCookie } from "@/api/cookie";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userAlarm, userSocketLogin } from "@/recoil/atoms";

// TODO: Router 테이블 만들어서 해당 라우터에서 색상 표현
const Header = () => {
  const {
    goToSignup,
    goTologin,
    goToSearch,
    goToProfileMe,
    goToChat,
    goToAlarm,
    goToSetting,
    goToMain,
  } = useRouter();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isAlarm, setIsAlarm] = useRecoilState(userAlarm);
  const setSocketRecoil = useSetRecoilState(userSocketLogin);

  const socket = useContext(SocketContext);

  const token = getCookie("jwt");
  useEffect(() => {
    setIsLogin(!!token); // token이 존재하면 true, 없으면 false
  }, [token]);

  useEffect(() => {
    if (socket) {
      socket.on("alarm", (data: any) => {
        setIsAlarm(true);
      });
      
      

      // getAlarms는 알람페이지 들어간 경우
      socket.emit("getAlarms");
      // return () => {
      //   socket.off("alarm");
      // };
    }
  }, [socket,isAlarm]);

  const handleNavClick = (action: () => void) => {
    if (!isLogin) {
      alert("로그인 해주세요");
    } else {
      action();
    }
  };

  // jwt로 인증
  const onClickLogout = async () => {
    try {
      const res = await axiosLogout();
      alert("로그아웃 되었습니다");
      setIsLogin(!isLogin);
      setSocketRecoil(false);
      goToMain();
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Wrapper>
      <HeaderContainer>
        <NavStyled onClick={() => handleNavClick(goToProfileMe)}>
          Profile
        </NavStyled>
        <NavStyled onClick={() => handleNavClick(goToSearch)}>Search</NavStyled>
        <NavStyled onClick={() => handleNavClick(goToChat)}>Chat</NavStyled>
      </HeaderContainer>
      <TitleStyled onClick={goToMain}>
        MEET<span>CHA</span>
      </TitleStyled>
      <HeaderContainer>
        {!isLogin ? (
          <>
            <NavStyled onClick={goTologin}>Log In</NavStyled>
            <NavStyled onClick={goToSignup}>Sign Up</NavStyled>
          </>
        ) : (
          <>
            <NavStyled
              onClick={() => handleNavClick(goToAlarm)}
              $isAlarm={isAlarm}
            >
              Alarm
            </NavStyled>
            <NavStyled onClick={() => handleNavClick(goToSetting)}>
              Setting
            </NavStyled>
            <NavStyled onClick={() => onClickLogout()}>Logout</NavStyled>
          </>
        )}
      </HeaderContainer>
    </Wrapper>
  );
};

export default Header;

const NavStyled = styled.div<{ $isAlarm?: boolean }>`
  border: 1px solid var(--black);
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  font-size: 1rem;
  font-weight: 400;
  position: relative;

  @media screen and (max-width: 1024px) {
    font-size: 0.8rem;
  }

  &:hover {
    background-color: var(--brand-sub-2);
  }

  ${({ $isAlarm }) =>
    $isAlarm &&
    `
    &::after {
      content: '';
      position: absolute;
      top: 5px;
      right: 5px;
      width: 10px;
      height: 10px;
      background-color: var(--brand-main-1);
      border-radius: 50%;
      animation: pulse 1s infinite;
    }

    @keyframes pulse {
      0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7);
      }
      
      70% {
        transform: scale(1);
        box-shadow: 0 0 0 10px rgba(255, 82, 82, 0);
      }
      
      100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(255, 82, 82, 0);
      }
    }
  `}
`;

const HeaderContainer = styled.div`
  display: flex;
  flex: 1;
  min-width: 368px;
  height: 100%;
  @media screen and (max-width: 1024px) {
    min-width: 280px;
  }
  @media screen and (max-width: 768px) {
    min-width: unset;
  }
`;

const Wrapper = styled.div`
  display: flex;
  border: 1px solid var(--black);
  min-height: 100px;
  max-width: 1440px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  @media screen and (max-width: 768px) {
    justify-content: center;
    font-size: 1rem;
    min-height: 80px;
  }
`;

const TitleStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  border: 1px solid var(--black);
  font-family: var(--main-font);
  font-size: 3rem;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 0.06em;

  & > span {
    color: var(--brand-main-1);
  }
  @media screen and (max-width: 1024px) {
    font-size: 2rem;
  }
  @media screen and (max-width: 768px) {
    font-size: 1rem;
    flex: 1;
  }
`;
