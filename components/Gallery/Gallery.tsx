import React, { ReactText } from "react";
import styled from "styled-components";
import Image from "next/image";

export interface GalleryProps {
  id: string;
  pictures: string[];
  onImageOpen: (url: string) => void;
}

const FlexContainer = styled.section`
  display: flex;
  flex-wrap: wrap;
`;

const GrowingImage = styled(Image)`
  object-fit: cover;
  cursor: pointer;
`;

const ImageWrapperButton = styled.button`
  flex: 1;
  flex-basis: 20%;
  position: relative;
  height: 16vh;
  margin: 0.2em;
  border-radius: 0.2em;
  object-fit: cover;
  transition: all 100ms ease-in-out;
  border: none;

  &:hover {
    transform: scale(1.03);
  }
`;

const Gallery: React.FC<GalleryProps> = ({ id, pictures, onImageOpen }) => {
  return (
    <FlexContainer id={id}>
      {pictures.map((picture, index) => {
        return (
          <ImageWrapperButton
            key={index}
            tabIndex={0}
            onClick={() => onImageOpen(picture)}
            onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) =>
              event.key === "Enter" && onImageOpen(picture)
            }
            aria-label="Picture in the picture list, interact to open the full screen of this picture"
          >
            <GrowingImage src={picture} alt="" priority layout="fill" />
          </ImageWrapperButton>
        );
      })}
    </FlexContainer>
  );
};

export default Gallery;
