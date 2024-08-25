import styled from "styled-components";
import { Range, getTrackBackground } from "react-range";

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  values: number[];
  onChange: (values: number[]) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  step,
  values,
  onChange,
}) => {
  return (
    <SliderContainer>
      <Range
        values={values}
        step={step}
        min={min}
        max={max}
        onChange={onChange}
        renderTrack={({ props, children }) => {
          const { style, ref, ...rest } = props;
          return (
            <SliderTrack
              ref={ref}
              {...rest}
              style={{
                ...style,
                background: getTrackBackground({
                  values,
                  colors: ["#ccc", "var(--brand-sub-1)", "#ccc"],
                  min,
                  max,
                }),
              }}
            >
              {children}
            </SliderTrack>
          );
        }}
        renderThumb={({ props, index }) => {
          const { key, ...rest } = props;
          return (
            <SliderThumb key={key} {...rest}>
              <ThumbLabel>{values[index].toFixed(step < 1 ? 1 : 0)}</ThumbLabel>
            </SliderThumb>
          );
        }}
      />
      <MinMaxLabels>
        <span>{min}</span>
        <span>{max}</span>
      </MinMaxLabels>
    </SliderContainer>
  );
};

export default RangeSlider;
// Styled components remain the same
const SliderContainer = styled.div`
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 10px;
`;

const SliderTrack = styled.div`
  height: 18px;
  width: 100%;
  border-radius: 3px;
`;

const SliderThumb = styled.div`
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 6px #aaa;
`;

const ThumbLabel = styled.div`
  position: absolute;
  top: -28px;
  font-size: 12px;
  background-color: #000;
  color: #fff;
  padding: 2px 4px;
  border-radius: 4px;
`;

const MinMaxLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 12px;
`;
