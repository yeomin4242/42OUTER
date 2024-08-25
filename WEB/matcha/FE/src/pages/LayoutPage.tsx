import styled from "styled-components";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import Header from "@/components/Header";
import { io, Socket } from "socket.io-client";
import useRouter from "@/hooks/useRouter";
import useSocket from "@/hooks/useSocket";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userSocketLogin } from "@/recoil/atoms";
import { getCookie } from "@/api/cookie";

export const SocketContext = createContext<Socket | null>(null);

const Layout = () => {
  const { goToMain } = useRouter();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const setSocketRecoil = useSetRecoilState(userSocketLogin);

  const directOutletPaths = [
    "/twoFactor",
    "/login",
    "/signup",
    "/signup/detail",
    "/resetPW",
  ];

  // 현재 경로가 directOutletPaths에 포함되어 있는지 확인
  const isDirectOutletPath = directOutletPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  // useEffect(() => {}, [getSocketRecoil]);

  const socket = useSocket();

  useEffect(() => {
    const token = getCookie("jwt");
    setSocketRecoil(token ? true : false);
  }, []);

  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "") {
      goToMain();
    }
  }, [location]);

  return isDirectOutletPath ? (
    <Outlet />
  ) : (
    <SocketContext.Provider value={socket}>
      <Wrapper>
        <Header />
        <MainStyled>
          <Outlet />
        </MainStyled>
      </Wrapper>
    </SocketContext.Provider>
  );
};

export default Layout;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* width: 1440px; */
  height: 100%;
  overflow: scroll;
`;

const MainStyled = styled.div`
  /* position: relative; */
  max-width: 1440px;
  width: 100%;
  /* margin: 0 auto; */
  margin-bottom: 30px;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoginWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  height: 100%;
  /* /* height: 100%; */
  /* align-items: center; */
  /* height: auto; */
`;
