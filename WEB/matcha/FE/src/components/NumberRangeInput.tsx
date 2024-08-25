import React, { useState, useEffect } from "react";
import styled from "styled-components";

export interface RangeState {
  min: number;
  max: number;
}
interface NumberRangeInputProps {
  type: string;
  range: RangeState;
  onChange: (minOrMax: "min" | "max", value: number) => void;
}

const NumberRangeInput: React.FC<NumberRangeInputProps> = ({
  type,
  range,
  onChange,
}) => {
  const [error, setError] = useState<string>("");

  useEffect(() => {
    validateNumbers();
  }, [range.min, range.max]);

  const validateNumbers = () => {
    if (range.min > range.max) {
      setError("Minimum number cannot be greater than maximum number.");
    } else {
      setError("");
    }
  };

  const handleChange =
    (minOrMax: "min" | "max") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.max(0, Math.min(100, Number(e.target.value)));
      onChange(minOrMax, value);
    };

  return (
    <Container>
      <TitleStyled>{type}</TitleStyled>
      <InputGroup>
        <Label htmlFor={`min${type}`}>Min {type}:</Label>
        <Input
          type="number"
          id={`min${type}`}
          value={range.min}
          onChange={handleChange("min")}
          min={0}
          max={100}
        />
      </InputGroup>
      <InputGroup>
        <Label htmlFor={`max${type}`}>Max {type}:</Label>
        <Input
          type="number"
          id={`max${type}`}
          value={range.max}
          onChange={handleChange("max")}
          min={0}
          max={100}
        />
      </InputGroup>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};
export default NumberRangeInput;

const Container = styled.div`
  font-family: Arial, sans-serif;
  width: 80%;
  margin: 0 auto;
  border-radius: 8px;
`;

const InputGroup = styled.div`
  display: flex;
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  text-align: right;
  border-radius: 4px;
  color: #fff;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 0.8em;
  margin-top: 5px;
`;

const TitleStyled = styled.div`
  text-align: left;
  font-size: 2rem;
  margin-bottom: 20px;
  font-weight: 500;
  border-bottom: 1px solid #d9d9d9;
  padding-bottom: 20px;
`;
