import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { getCookie } from "@/api/cookie";
import { userSocketLogin } from "@/recoil/atoms";
import { useRecoilValue } from "recoil";

const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const getSocketRecoil = useRecoilValue(userSocketLogin);

  useEffect(() => {
    const token = getCookie("jwt");

    if (getSocketRecoil && token && !socket) {
      const newSocket = io("http://localhost:3001", {
        auth: {
          authorization: token,
        },
      });
      setSocket(newSocket);
    } else if (!getSocketRecoil && socket) {
      socket.disconnect();
      setSocket(null);
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [getSocketRecoil]);

  return socket;
};

export default useSocket;
