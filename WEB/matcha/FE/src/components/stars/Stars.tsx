import styled from "styled-components";
import { ReactComponent as StarIcon } from "@/assets/icons/star-icon.svg";
import { ReactComponent as EmptyStarIcon } from "@/assets/icons/empty-star-icon.svg";
import { roundToThirdDecimal } from "@/utils/dataUtils";

const Stars = ({ rating }: { rating: number | undefined }) => {
  const filledWidth = rating ? `${(rating / 5) * 100}%` : "0%";

  return (
    <Wrapper>
      <StarsContainer>
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
      <StarsRatingTextStyled>
        {roundToThirdDecimal(rating) ?? "N/A"}
      </StarsRatingTextStyled>
    </Wrapper>
  );
};

export default Stars;

const Wrapper = styled.div`
  display: inline-block;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #a1a1a1;
  display: flex;
  /* width: 140px; */
  width: 100%;
  /* & > :firsts-child {
    margin-left: 40px;
  } */
`;

const StarsRatingTextStyled = styled.div`
  margin-left: 5px;
  line-height: 120%;
`;

const StarsContainer = styled.div`
  position: relative;
  display: inline-block;
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
