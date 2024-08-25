import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { axiosLoginOauth } from "@/api/axios.custom";

const OauthPage = () => {
  const [code, setCode] = useState("");
  const location = useLocation();

  const tryOauthCode = async (code: string) => {
    try {
      const res = await axiosLoginOauth(code);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const codeParam = searchParams.get("code");
    if (codeParam) {
      setCode(codeParam);
      tryOauthCode(codeParam);
    }
  }, [location]);

  return (
    <Container>
      <h1>OauthPage</h1>
      {code ? (
        <p>Received CODE: {code}</p>
      ) : (
        <p>No CODE parameter found in URL</p>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  text-align: center;
`;

export default OauthPage;
