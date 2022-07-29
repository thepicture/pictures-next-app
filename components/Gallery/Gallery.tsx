import React from "react";
import styled from "styled-components";

export interface GalleryProps {
  pictures: string[];
  onImageOpen: (url: string) => void;
}

const FlexContainer = styled.section`
  display: flex;
  flex-wrap: wrap;
`;

const GrowingImage = styled.img`
  width: 25%;
  flex: 1;
  margin: 0.2em;
  border-radius: 0.2em;
  object-fit: cover;
`;

const Gallery: React.FC<GalleryProps> = ({ pictures, onImageOpen }) => {
  return (
    <FlexContainer>
      {pictures.map((picture, index) => {
        return (
          <GrowingImage
            key={index}
            src={picture}
            alt=""
            onClick={() => onImageOpen(picture)}
          />
        );
      })}
    </FlexContainer>
  );
};

export default Gallery;
