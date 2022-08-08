import React, { useCallback, useRef } from "react";

import Image from "next/image";

import { Box, Button, Dialog, Typography } from "@mui/material";

import byteSize from "byte-size";

import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";

import { Picture } from "@interfaces";
import { IMAGE_PLACEHOLDER } from "@constants";
import { FullScreenPictureGrid } from "@layouts";

interface FullScreenPictureProps {
  picture: Picture | null | undefined;
  onPictureClose: () => void;
}

export const FullScreenPicture: React.FC<FullScreenPictureProps> = ({
  picture,
  onPictureClose,
}) => {
  const imageRef = useRef<any>();
  const onUpdate = useCallback(
    ({ x, y, scale }: { x: number; y: number; scale: number }) => {
      const { current: img } = imageRef;

      if (img) {
        const value = make3dTransformValue({ x, y, scale });

        img.style.setProperty("transform", value);
      }
    },
    []
  );

  return (
    <Dialog open={!!picture} fullScreen>
      <FullScreenPictureGrid>
        <Typography
          textAlign="center"
          component="h2"
          variant="h6"
          sx={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {picture?.size === -1 ? picture?.name : picture?.name.split(".")[0]}
        </Typography>
        <Typography textAlign="center">
          {picture && byteSize(picture.size).toString()}
        </Typography>
        <Typography textAlign="center">
          Uploaded by {picture?.uploadedBy}
        </Typography>
        <QuickPinchZoom onUpdate={onUpdate}>
          <Box width="100%" height="100%" position="relative" ref={imageRef}>
            <Image
              src={picture?.url || IMAGE_PLACEHOLDER}
              alt=""
              layout="fill"
            />
          </Box>
        </QuickPinchZoom>
        <Button onClick={onPictureClose}>Close</Button>
      </FullScreenPictureGrid>
    </Dialog>
  );
};
