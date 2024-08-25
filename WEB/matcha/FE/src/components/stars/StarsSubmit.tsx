import React, { useState } from "react";
import styled from "styled-components";
import { ReactComponent as StarIcon } from "@/assets/icons/star-icon.svg";
import { ReactComponent as EmptyStarIcon } from "@/assets/icons/empty-star-icon.svg";

interface StarsProps {
  initialRating: number;
  onRatingChange: (rating: number) => void;
}

const StarsSubmit: React.FC<StarsProps> = ({
  initialRating,
  onRatingChange,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const newRating = Math.min(
      5,
      Math.max(0, Math.round((x / width) * 10) / 2)
    );
    setHoverRating(newRating);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = () => {
    setRating(hoverRating);
    onRatingChange(hoverRating);
  };

  const filledWidth = `${((hoverRating || rating) / 5) * 100}%`;

  return (
    <Wrapper>
      <StarsContainer
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <EmptyStars>
          {[...Array(5)].map((_, i) => (
            <StarWrapper key={`empty-${i}`}>
              <EmptyStarIcon />
            </StarWrapper>
          ))}
        </EmptyStars>
        <FilledStars style={{ width: filledWidth }}>
          {[...Array(5)].map((_, i) => (
            <StarWrapper key={`filled-${i}`}>
              <StarIcon />
            </StarWrapper>
          ))}
        </FilledStars>
      </StarsContainer>
      <StarsRatingTextStyled>{hoverRating || rating}</StarsRatingTextStyled>
    </Wrapper>
  );
};

export default StarsSubmit;

const Wrapper = styled.div`
  display: inline-block;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #a1a1a1;
  display: flex;
  /* width: 140px; */
  width: 100%;
`;

const StarsRatingTextStyled = styled.div`
  margin-left: 5px;
  line-height: 120%;
`;

const StarsContainer = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
`;

const EmptyStars = styled.div`
  display: flex;
`;

const FilledStars = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  white-space: nowrap;
  overflow: hidden;
  display: flex;
`;

const StarWrapper = styled.div``;
