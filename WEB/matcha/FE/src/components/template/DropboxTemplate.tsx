import { tagItem } from "@/pages/SignUpPage";
import { useEffect, useRef, useState } from "react";
import { ReactComponent as ChevronIcon } from "@/assets/icons/chevron-icon.svg";
import styled from "styled-components";

const DropboxTemplate = ({
  options,
  type,
  onSelect,
  selectedValue,
  disabled = false,
}: {
  options: tagItem[];
  type: string;
  onSelect: (option: tagItem) => void;
  selectedValue: string;
  disabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropbox = () => !disabled && setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: tagItem) => {
    setIsOpen(false);
    onSelect(option);
  };

  return (
    <DropboxContainer ref={dropdownRef}>
      <DropboxHeader onClick={toggleDropbox} $disabled={disabled}>
        {selectedValue || type}
        <ChevronIconStyled $isOpen={isOpen}>
          <ChevronIcon />
        </ChevronIconStyled>
      </DropboxHeader>
      {isOpen && !disabled && (
        <OptionsList>
          {options.map((option) => (
            <Option
              key={option.value}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </Option>
          ))}
        </OptionsList>
      )}
    </DropboxContainer>
  );
};

const DropboxContainer = styled.div`
  position: relative;
  width: 100%;
  /* height: 56px; */
  border-radius: 4px;
`;

const DropboxHeader = styled.div<{ $disabled: boolean }>`
  padding: 10px;
  background-color: var(--white);
  border-radius: 4px;
  border: 1px solid var(--line-gray-3);
  color: ${({ $disabled }) =>
    $disabled ? "var(--line-gray-3)" : "var(--line-gray-1)"};
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  opacity: ${({ $disabled }) => ($disabled ? 0.7 : 1)};
`;

const ChevronIconStyled = styled.div<{ $isOpen: boolean }>`
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0)")};
  transition: transform 0.3s ease;
`;

const OptionsList = styled.ul`
  z-index: 1;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-top: none;
  list-style-type: none;
  padding: 0;
  margin: 0;
  max-height: 150px;
  overflow-y: auto;
  animation: slideDown 0.3s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* 오버레이 스크롤바 사용 */
  overflow-y: overlay;

  /* 스크롤바 영역에 패딩 추가 */
  /* padding-right: 15px; */

  /* 스크롤바 트랙과 핸들에 대한 기본 스타일 */
  scrollbar-width: thin;
  scrollbar-color: var(--brand-main-1) var(--brand-sub-2);
`;

const Option = styled.li`
  padding: 10px;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1.4;
  letter-spacing: -0.025em;

  &:hover {
    background-color: var(--brand-sub-2);
  }
`;

export default DropboxTemplate;
