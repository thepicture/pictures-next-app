import React from "react";

import { Picture } from "@interfaces";
import { GalleryPicture } from "@components";
import { Box } from "@mui/material";

export interface GalleryProps {
  id: string;
  pictures: Picture[];
  onPictureOpen: (picture: Picture) => void;
  onPictureDelete: (pictureName: string) => void;
}

export const Gallery: React.FC<GalleryProps> = ({
  id,
  pictures,
  onPictureOpen,
  onPictureDelete,
}) => {
  return (
    <Box id={id} component="section" display="flex" flexWrap="wrap">
      {pictures.map((picture) => (
        <GalleryPicture
          key={picture.name}
          picture={picture}
          onPictureOpen={onPictureOpen}
          onPictureDelete={onPictureDelete}
        />
      ))}
    </Box>
  );
};
