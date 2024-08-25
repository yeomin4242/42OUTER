import React from "react";
import styled from "styled-components";

export interface TagProps {
  value: string;
  label: string;
}

interface TagListProps {
  tags: TagProps[];
  onTagSelect: (tag: TagProps) => void; // 빈 함수로 설정하여 선택 기능 비활성화
  onTagRemove?: (tag: TagProps) => void;
  showRemoveIcon?: boolean;
  selectable?: boolean;
  showSelectedOnly?: boolean;
  selectedTags: string[];
}

const TagList: React.FC<TagListProps> = ({
  tags,
  onTagSelect,
  onTagRemove,
  selectedTags,
  showRemoveIcon = false,
  selectable = true,
  showSelectedOnly = false,
}) => {
  const handleTagClick = (tag: TagProps) => {
    if (!selectable) return;
    onTagSelect(tag);
  };

  const handleRemoveClick = (e: React.MouseEvent, tag: TagProps) => {
    e.stopPropagation();
    if (onTagRemove) {
      onTagRemove(tag);
    }
  };

  const displayTags = showSelectedOnly
    ? tags.filter((tag) => selectedTags.includes(tag.value))
    : tags;

  return (
    <TagContainer>
      {displayTags.map((tag) => (
        <TagStyled
          key={tag.value}
          onClick={() => handleTagClick(tag)}
          $selected={selectedTags.includes(tag.value)}
          $selectable={selectable}
        >
          {tag.label}
          {showRemoveIcon && selectedTags.includes(tag.value) && (
            <RemoveIcon onClick={(e) => handleRemoveClick(e, tag)}>
              x
            </RemoveIcon>
          )}
        </TagStyled>
      ))}
    </TagContainer>
  );
};

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  @media screen and (max-width: 768px) {
    justify-content: center;
  }
`;

export const TagStyled = styled.div<{
  $selected: boolean;
  $selectable: boolean;
}>`
  padding: 6px 24px;
  border-radius: 2px;
  background-color: ${(props) =>
    props.$selected ? "var(--brand-main-1)" : "#f0f0f0"};
  color: ${(props) => (props.$selected ? "var(--white)" : "var(--black)")};
  cursor: ${(props) => (props.$selectable ? "pointer" : "default")};
  display: flex;
  align-items: center;
  transition: all 0.1s ease;
  font-size: 0.9rem;
  line-height: 1.4;
  height: 36px;

  &:hover {
    background-color: var(--brand-sub-1);
    color: #f0f0f0;
  }
`;

const RemoveIcon = styled.span`
  margin-left: 6px;
  font-weight: bold;
  cursor: pointer;
`;

export default TagList;
