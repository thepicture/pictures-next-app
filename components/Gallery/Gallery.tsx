import React from "react";
import styled from "styled-components";

import { Picture } from "@interfaces";
import { GalleryPicture } from "./GalleryPicture";

export interface GalleryProps {
  id: string;
  pictures: Picture[];
  onPictureOpen: (picture: Picture) => void;
  onPictureDelete: (pictureName: string) => void;
}

const FlexContainer = styled.section`
  display: flex;
  flex-wrap: wrap;
`;

export const Gallery: React.FC<GalleryProps> = ({
  id,
  pictures,
  onPictureOpen,
  onPictureDelete,
}) => {
  return (
    <FlexContainer id={id}>
      {pictures.map((picture) => (
        <GalleryPicture
          key={picture.name}
          picture={picture}
          onPictureOpen={onPictureOpen}
          onPictureDelete={onPictureDelete}
        />
      ))}
    </FlexContainer>
  );
};
