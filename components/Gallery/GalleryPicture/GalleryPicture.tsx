import React from "react";

import { Picture } from "@interfaces";
import { ImageWrapperButton, GrowingImage, DeleteButton } from "@styles";

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
          if (KeyCodes.NAVIGATION_KEYS.includes(event.key)) return;
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
  static SHIFT = "Shift";
  static NAVIGATION_KEYS = [KeyCodes.TAB, KeyCodes.SHIFT];
}
