import React, { useState, useRef, useEffect } from "react";
import { ReactComponent as PlusIcon } from "@/assets/icons/plus-icon.svg";
import { ReactComponent as RightArrowIcon } from "@/assets/icons/right-arrow-icon.svg";
import { ReactComponent as LeftArrowIcon } from "@/assets/icons/left-arrow-icon.svg";
import styled from "styled-components";

const ImageUploader = ({
  images,
  setImages,
  isReadOnly,
}: {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  isReadOnly?: boolean;
}) => {
  const useParams = location.pathname.includes("signup");
  const MAX_IMAGES = 7;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

  const convertFileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const remainingSlots = MAX_IMAGES - images.length;
      const filesToAdd = files.slice(0, remainingSlots);

      const validFiles = filesToAdd.filter((file) => {
        if (file.size > MAX_FILE_SIZE) {
          alert(
            `파일 "${file.name}"의 크기가 5MB를 초과합니다. 이 파일은 무시됩니다.`
          );
          return false;
        }
        return true;
      });

      const newImageUrls = await Promise.all(
        validFiles.map(convertFileToDataURL)
      );
      setImages((prevImages) => [...prevImages, ...newImageUrls]);

      if (files.length > remainingSlots) {
        alert(
          `최대 ${MAX_IMAGES}개의 이미지만 업로드할 수 있습니다. ${
            files.length - remainingSlots
          }개의 이미지가 무시되었습니다.`
        );
      }

      if (files.length !== validFiles.length) {
        alert(
          `${
            files.length - validFiles.length
          }개의 파일이 크기 제한으로 인해 무시되었습니다.`
        );
      }
    }
  };
  const handleDelete = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    if (currentIndex > 0 && index < currentIndex)
      setCurrentIndex((prev) => prev - 1);
  };

  const handleScroll = (direction: "left" | "right") => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    if (direction === "left" && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else if (direction === "right" && currentIndex < images.length - 4) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <Container $useParams={useParams}>
      {!isReadOnly && (
        <UploadButton
          onClick={() => fileInputRef.current?.click()}
          disabled={images.length >= MAX_IMAGES}
        >
          <PlusIcon />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/*"
            disabled={images.length >= MAX_IMAGES}
          />
        </UploadButton>
      )}

      <ImageContainer>
        <ImageWrapper $translateX={-currentIndex * 143}>
          {images.map((image, index) => (
            <ImageItem key={index}>
              <Image src={image} alt={`Uploaded ${index}`} />

              {!isReadOnly && (
                <DeleteButton onClick={() => handleDelete(index)}>
                  삭제
                </DeleteButton>
              )}
            </ImageItem>
          ))}
        </ImageWrapper>
      </ImageContainer>

      <ScrollButtons>
        <ScrollButton
          onClick={() => handleScroll("left")}
          disabled={currentIndex === 0 || isTransitioning}
        >
          <LeftArrowIcon />
        </ScrollButton>
        <ScrollButton
          onClick={() => handleScroll("right")}
          disabled={currentIndex >= images.length - 4 || isTransitioning}
        >
          <RightArrowIcon />
        </ScrollButton>
      </ScrollButtons>
      <ImageCount>
        {images.length} / {MAX_IMAGES}
      </ImageCount>
    </Container>
  );
};

const Container = styled.div<{ $useParams: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  width: 740px;

  ${({ $useParams }) => `
    @media screen and (max-width: ${$useParams ? "768px" : "1360px"}) {
      width: 100%;
    }
  `}
`;

const ImageContainer = styled.div`
  width: 572px;
  overflow: hidden;
`;

const ImageWrapper = styled.div<{ $translateX: number }>`
  display: flex;
  transition: transform 0.3s ease;
  transform: translateX(${(props) => props.$translateX}px);
`;

const ImageItem = styled.div`
  position: relative;
  width: 133px;
  height: 143px;
  margin-right: 10px;
  flex-shrink: 0;
  border: 1px solid var(--line-gray-2);
  border-radius: 10px;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 0.5rem;
  font-weight: 500;
  color: var(--black);
  border: 1px solid var(--line-gray-2);
  border-radius: 2px;
  background-color: #f0f0f0;
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const ScrollButtons = styled.div`
  position: absolute;
  top: -54px;
  right: 35px;
  display: flex;
  @media screen and (max-width: 400px) {
    right: 0px;
  }
`;

const ScrollButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--line-gray-2);
  margin-left: 5px;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  color: var(--black);
`;

const UploadButton = styled.button<{ disabled: boolean }>`
  width: 133px;
  height: 143px;
  background-color: ${(props) => (props.disabled ? "#e0e0e0" : "#f0f0f0")};
  border: 2px solid var(--line-gray-2);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  & > input {
    display: none;
  }
`;

const ImageCount = styled.div`
  position: absolute;
  bottom: -25px;
  right: 0;
  font-size: 14px;
  color: var(--gray);
`;

export default ImageUploader;
