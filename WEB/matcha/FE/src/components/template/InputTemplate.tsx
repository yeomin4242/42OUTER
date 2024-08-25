import styled from "styled-components";
import { useState } from "react";
import { useInputValidation } from "@/utils/inputCheckUtils";

// 숫자는 드롭다운형식으로 받아오기
interface InputTemplateProps {
  type: string;
  placeholder?: string;
  onChange: (e: any) => void;
  value: string;
  label: string;
  checkPW?: string;
  setError?: (error: boolean) => void;
  disabled?: boolean;
}

const InputTemplate = (props: InputTemplateProps) => {
  const [error, setError] = useState<string | null>(null);

  // NOTE : Blur과 focusout차이 -> 버블링 유무
  const handleBlur = () => {
    const validationError = useInputValidation(
      props.type,
      props.value,
      props.checkPW
    );
    setError(validationError);
    if (props.setError) {
      props.setError(!!validationError);
    }
  };

  return (
    <InputContainer data-error={!!error}>
      <InputStyled
        id={props.type}
        placeholder={""}
        value={props.value}
        onChange={props.onChange}
        onBlur={handleBlur}
        type={
          props.type === "password" || props.type === "checkPassword"
            ? "password"
            : "text"
        }
        name={props.type}
        disabled={props.disabled}
      />
      <LabelStyled htmlFor={props.type}>{props.label}</LabelStyled>
      {error && <ErrorStyled>{error}</ErrorStyled>}
    </InputContainer>
  );
};

const ErrorStyled = styled.div`
  margin-left: 20px;
  font-weight: 400;
  line-height: 1.4;
  font-size: 0.8rem;
  letter-spacing: -0.025em;
  color: var(--status-error-1);
`;

const InputContainer = styled.div`
  /* max-width: 350px; */
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const LabelStyled = styled.label`
  transition: all 0.4s ease;
  position: absolute;
  color: var(--line-gray-1);
  font-size: 1rem;
  line-height: 1.4;
  height: 9px;
  top: 17px;
  left: 20px;
  letter-spacing: -0.025em;

  ${InputContainer}[data-error="true"] & {
    color: var(--status-error-1) !important;
  }
`;

const InputStyled = styled.input`
  transition: all 0.3s ease;
  padding: 0px 19px;
  border-radius: 4px;
  background-color: #fff;
  color: var(--line-gray-1);
  font-size: 1rem;
  letter-spacing: -0.025em;
  border: 1px solid var(--line-gray-3);
  height: 56px;
  text-overflow: ellipsis;

  ${InputContainer}[data-error="true"] & {
    border: 1px solid var(--status-error-1);
  }

  &:not(:focus):not(:placeholder-shown) + label {
    color: var(--line-gray-1);
  }

  &:focus + label,
  &:not(:placeholder-shown) + label {
    font-size: 0.9rem;
    padding: 0 4px;
    background-color: var(--white);
    top: -8px;
    color: var(--brand-main-1);
    /* background-color: var(--white); */
  }

  &:focus {
    outline: none;
    border: 1px solid var(--brand-main-1);

    ${InputContainer}:not([data-error="true"]) & {
      background-color: var(--brand-sub-2);
    }
  }
`;

export default InputTemplate;
