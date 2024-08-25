import styled from "styled-components";

const PaginationDots = ({ step }: { step: number }) => {
  return (
    <PaginationDotsContainer>
      {[0, 1, 2].map((index) => (
        <DotStyled key={index} $active={index === step} />
      ))}
    </PaginationDotsContainer>
  );
};

export default PaginationDots;

export const PaginationDotsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 45px;
  margin-bottom: 20px;
`;

export const DotStyled = styled.div<{ $active: boolean }>`
  width: 14px;
  height: 14px;
  background-color: ${(props) =>
    props.$active ? "var(--brand-main-1)" : "var(--line-gray-3)"};
  border-radius: 30px;
`;
