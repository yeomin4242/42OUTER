import styled from "styled-components";
const Loading = () => {
  return (
    <>
      <LoadingWrapper>
        <LoadingDots>
          <Dot />
          <Dot />
          <Dot />
        </LoadingDots>
      </LoadingWrapper>
    </>
  );
};

export default Loading;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const LoadingDots = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  background-color: var(--brand-main-1);
  border-radius: 50%;
  margin: 0 5px;
  animation: bounce 1.4s infinite ease-in-out both;

  &:nth-child(1) {
    animation-delay: -0.32s;
  }

  &:nth-child(2) {
    animation-delay: -0.16s;
  }

  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;
