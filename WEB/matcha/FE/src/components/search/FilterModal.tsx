import React, { useState } from "react";
import styled from "styled-components";
import DropboxTemplate from "../template/DropboxTemplate";
import TagList from "../template/TagTemplate";
import RangeSlider from "./Slider";

import { HashTagsList, SortTagList } from "@/types/tags";
import { LocationData } from "../location/LocationData";
import { SortType } from "@/types/tag.enum";
import { sortLableMap } from "@/types/maps";

interface ModalProps {
  title: "나이" | "평점" | "지역" | "태그" | "정렬";
  onClose: () => void;
  onSave: (value: any) => void;
  values?: any;
}

export function getSortLabel(sortType: SortType): string {
  return sortLableMap[sortType];
}

const FilterModal: React.FC<ModalProps> = ({
  title,
  onClose,
  onSave,
  values,
}) => {
  const [value, setValue] = useState<any>(() => {
    switch (title) {
      case "나이":
        return [values.age.min, values.age.max];
      case "평점":
        return [values.rate.min, values.rate.max];
      case "지역":
        return { si: values.location.si, gu: values.location.gu };
      case "태그":
        return values.hashtag || [];
      case "정렬":
        return values.sort || "dscRate";
      default:
        return null;
    }
  });

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  const renderContent = () => {
    switch (title) {
      case "나이":
        return (
          <RangeSlider
            min={20}
            max={100}
            step={1}
            values={value || [20, 100]}
            onChange={(values) => setValue(values)}
          />
        );
      case "평점":
        return (
          <RangeSlider
            min={0}
            max={5}
            step={0.1}
            values={value || [0, 5]}
            onChange={(values) => setValue(values)}
          />
        );
      case "지역":
        return (
          <>
            <DropboxTemplate
              options={LocationData.map((loc) => ({
                value: loc.name,
                label: loc.name,
              }))}
              type="시"
              onSelect={(option) => {
                setValue({ si: option.value, gu: "" }); // gu를 초기화
              }}
              selectedValue={value.si}
            />
            {value.si && (
              <DropboxTemplate
                options={
                  LocationData.find(
                    (loc) => loc.name === value.si
                  )?.subArea.map((sub) => ({ value: sub, label: sub })) || []
                }
                type="구"
                onSelect={(option) => {
                  setValue((prev: any) => ({ ...prev, gu: option.value }));
                }}
                selectedValue={value.gu}
              />
            )}
          </>
        );
      case "태그":
        return (
          <TagList
            tags={HashTagsList}
            onTagSelect={(tag) =>
              setValue((prev: string[]) =>
                prev.includes(tag.value)
                  ? prev.filter((t) => t !== tag.value)
                  : [...prev, tag.value]
              )
            }
            selectedTags={value || []}
            selectable
          />
        );
      case "정렬":
        return (
          <DropboxTemplate
            options={SortTagList}
            type="정렬방식"
            onSelect={(option) => setValue(option.value)}
            selectedValue={getSortLabel(value as SortType)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>{title.charAt(0).toUpperCase() + title.slice(1)}</h2>
        </ModalHeader>
        <ModalBody>{renderContent()}</ModalBody>
        <ModalFooter>
          <ButtonStyled onClick={onClose}>Cancel</ButtonStyled>
          <ButtonStyled onClick={handleSave}>Save</ButtonStyled>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default FilterModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 1.5rem;
  }
`;

const ModalBody = styled.div`
  margin-bottom: 20px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ButtonStyled = styled.button`
  padding: 10px 20px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;
  background-color: #f0f0f0;
  color: var(--black);
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: var(--brand-sub-2);
    color: var(--brand-main-1);
  }
`;
