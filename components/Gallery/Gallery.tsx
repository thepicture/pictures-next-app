import React from "react";
import styled from "styled-components";
import Image from "next/image";

export interface GalleryProps {
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

const ImageWrapper = styled.figure`
  flex: 1;
  flex-basis: 20%;
  position: relative;
  height: 16vh;
  margin: 0.2em;
  border-radius: 0.2em;
  object-fit: cover;
  transition: all 100ms ease-in-out;

  &:hover {
    transform: scale(1.03);
  }
`;

const Gallery: React.FC<GalleryProps> = ({ pictures, onImageOpen }) => {
  return (
    <FlexContainer>
      {pictures.map((picture, index) => {
        return (
          <ImageWrapper key={index}>
            <GrowingImage
              priority
              layout="fill"
              src={picture}
              alt=""
              onClick={() => onImageOpen(picture)}
            />
          </ImageWrapper>
        );
      })}
    </FlexContainer>
  );
};

export default Gallery;
