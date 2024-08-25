import styled from "styled-components";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <NotFoundContainer>
      <NotFoundContent>
        <NotFoundTitle>잘못된 접근</NotFoundTitle>
        <NotFoundDescription>
          이미 회원가입한 이메일로 oauth로그인은 불가능합니다
        </NotFoundDescription>
        <HomeLink to="/main">홈으로 돌아가기</HomeLink>
      </NotFoundContent>
    </NotFoundContainer>
  );
};

export default ErrorPage;

const NotFoundContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
`;

const NotFoundContent = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const NotFoundTitle = styled.h1`
  font-size: 6rem;
  color: var(--status-error-1);
  margin-bottom: 1rem;
`;

const NotFoundText = styled.p`
  font-size: 1.5rem;
  color: #343a40;
  margin-bottom: 1rem;
`;

const NotFoundDescription = styled.p`
  font-size: 1rem;
  color: #6c757d;
  margin-bottom: 2rem;
`;

const HomeLink = styled(Link)`
  display: inline-block;
  padding: 0.5rem 1rem;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;

  background-color: var(--brand-sub-2);
  border: 1px solid var(--brand-main-1);
  color: var(--black);
  &:hover {
    background-color: var(--brand-sub-1);
    color: var(--white);
  }
`;
