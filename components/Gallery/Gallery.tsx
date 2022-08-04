import React from "react";
import styled from "styled-components";
import Image from "next/image";

import { Picture } from "@interfaces";

export interface GalleryProps {
  id: string;
  pictures: Picture[];
  onPictureOpen: (picture: Picture) => void;
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

export const Gallery: React.FC<GalleryProps> = ({
  id,
  pictures,
  onPictureOpen: onPictureOpen,
}) => {
  return (
    <FlexContainer id={id}>
      {pictures.map((picture, index) => {
        return (
          <ImageWrapperButton
            key={index}
            type="button"
            tabIndex={0}
            onClick={() => onPictureOpen(picture)}
            onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) =>
              event.key === "Enter" && onPictureOpen(picture)
            }
            aria-label="Picture in the picture list, interact to open the full screen of this picture"
          >
            <GrowingImage
              src={picture.url}
              alt={picture.name}
              priority
              layout="fill"
            />
          </ImageWrapperButton>
        );
      })}
    </FlexContainer>
  );
};
