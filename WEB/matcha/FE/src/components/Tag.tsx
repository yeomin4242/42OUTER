import styled from "styled-components";

export interface ITagProps {
  iconTitle?: string;
  title: string;
  onClick?: () => void;
  isClick: boolean;
}

const Tag = (props: ITagProps) => {
  const handleClick = () => {
    if (props.onClick) {
      props.onClick();
    }
  };
  return (
    <Wrapper isClick={props.isClick} onClick={handleClick}>
      {/* {props.iconTitle && <IconStyled>{props.iconTitle}</IconStyled>} */}
      <TitleStyled>{props.title}</TitleStyled>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ isClick: boolean }>`
  width: fit-content;
  display: flex;
  flex-direction: column;
  background-color: ${(props) =>
    props.isClick ? "var(--vermilion)" : "var(--white)"};
  padding: 12px 15px;
  border-radius: 10px;

  color: ${(props) => (props.isClick ? "var(--white)" : "var(--black)")};
`;

const TitleStyled = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
`;

export default Tag;
