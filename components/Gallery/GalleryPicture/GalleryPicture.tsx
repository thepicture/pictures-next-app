import React from "react";

import Image from "next/image";

import styled from "styled-components";

import { Picture } from "@interfaces";

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

const DeleteButton = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  background: red;
  color: white;
  padding: 0.5em;
  opacity: 0.9;
  width: 2em;
  height: 2em;
  cursor: pointer;

  &::before {
    content: "X";
  }

  &:hover {
    opacity: 1;
    font-weight: bold;
  }
`;

export interface GalleryPictureProps {
  picture: Picture;
  onPictureOpen: (picture: Picture) => void;
  onPictureDelete: (pictureName: string) => void;
}

export const GalleryPicture: React.FC<GalleryPictureProps> = ({
  picture,
  onPictureOpen,
  onPictureDelete,
}) => {
  return (
    <ImageWrapperButton
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
      <DeleteButton
        onClickCapture={(event: React.MouseEvent<HTMLDivElement>) => {
          event.stopPropagation();
          onPictureDelete(picture.name);
        }}
        onKeyDownCapture={(event: React.KeyboardEvent<HTMLDivElement>) => {
          if (event.key === KeyCodes.TAB) return;
          event.stopPropagation();
          onPictureDelete(picture.name);
        }}
        role="button"
        tabIndex={0}
        title="Delete picture"
      />
    </ImageWrapperButton>
  );
};

export class KeyCodes {
  static TAB = "Tab";
}
