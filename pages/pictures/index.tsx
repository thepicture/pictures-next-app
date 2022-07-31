import {
  Button,
  Card,
  CircularProgress,
  Dialog,
  Snackbar,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import Head from "next/head";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";
import styled from "styled-components";
import byteSize from "byte-size";
import { Background } from "..";
import Gallery from "../../components/Gallery/Gallery";
import Uploader from "../../components/Uploader/Uploader";
import Picture from "../../interfaces/Picture";

const ContainerGrid = styled.main`
  display: grid;
  width: 100%;
  margin: 1em;
  padding-top: 1em;
  padding-bottom: 1em;
  height: 100%;
  grid-template-rows: auto 1fr;
  gap: 1em;
`;

const FullScreenPictureGrid = styled.section`
  display: grid;
  height: 100%;
  grid-template-rows: auto auto 1fr auto;

  & img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
`;

const PICTURE_WIDTH_IN_PIXELS = 640;
const PICTURE_HEIGHT_IN_PIXELS = 320;

const PicturesPage: NextPage = () => {
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [openedPicture, setOpenedPicture] = useState<Picture>();
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(true);
  const { ref: scrollRef, inView } = useInView();
  const imageRef = useRef<any>();

  useEffect(() => {
    const loadMorePictures = async () => {
      const response = await fetch(
        `https://random.imagecdn.app/${PICTURE_WIDTH_IN_PIXELS}/${PICTURE_HEIGHT_IN_PIXELS}`
      );
      setPictures((prev) =>
        [...prev, { name: response.url, size: -1, url: response.url }].filter(
          (value: Picture, index: number, array: Picture[]) => {
            return (
              array.map((picture) => picture.url).indexOf(value.url) === index
            );
          }
        )
      );
      setIsLoadingMore(!isLoadingMore);
    };
    if (inView) loadMorePictures();
  }, [inView, isLoadingMore]);

  const handlePictureOpen = (picture: Picture) => {
    setOpenedPicture(picture);
  };

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

  const handlePictureClose = () => {
    setOpenedPicture(undefined);
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  const convertFileToPicture = async (file: File) => {
    return new Promise<Picture>((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (
          pictures.some((picture) => picture.url === (reader.result as string))
        ) {
          setIsSnackbarOpen(true);
          return resolve({ name: "", size: -1, url: "" });
        }
        return resolve({
          name: file.name,
          size: file.size,
          url: reader.result as string,
        });
      };
    });
  };

  const handleUpload = async (files: File[]) => {
    let newPictures = await Promise.all(
      files.map(async (file) => {
        return await convertFileToPicture(file);
      })
    );
    newPictures = newPictures.filter((picture) => !!picture.name);
    setPictures((prev) => [...prev, ...newPictures]);
  };
  return (
    <>
      <Head>
        <title>Gallery</title>
        <meta
          name="description"
          content="A gallery with pictures that supports uploading new pictures"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Background>
        <ContainerGrid>
          <Card elevation={16} sx={{ p: 4 }}>
            <Uploader onUpload={handleUpload} />
          </Card>
          <Card elevation={16} sx={{ p: 4, overflow: "hidden visible" }}>
            <Gallery
              id="gallery"
              pictures={pictures}
              onPictureOpen={handlePictureOpen}
            />
            <CircularProgress
              ref={scrollRef}
              variant="indeterminate"
              title="Loading more pictures at the bottom of the page"
              aria-busy={inView}
              aria-describedby="gallery"
            />
          </Card>
        </ContainerGrid>
      </Background>
      <Dialog open={!!openedPicture} fullScreen>
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
            {openedPicture?.size === -1
              ? openedPicture?.name
              : openedPicture?.name.split(".")[0]}
          </Typography>
          <Typography textAlign="center">
            {openedPicture && openedPicture?.size === -1
              ? "Size is unknown"
              : openedPicture && byteSize(openedPicture.size).toString()}
          </Typography>
          <QuickPinchZoom onUpdate={onUpdate}>
            <img src={openedPicture?.url} alt="" ref={imageRef} />
          </QuickPinchZoom>
          <Button onClick={handlePictureClose}>Close</Button>
        </FullScreenPictureGrid>
      </Dialog>
      <Snackbar
        open={isSnackbarOpen}
        onClose={handleSnackbarClose}
        message="You have uploaded this picture already"
      ></Snackbar>
    </>
  );
};

export default PicturesPage;
