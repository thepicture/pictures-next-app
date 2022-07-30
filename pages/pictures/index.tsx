import {
  Button,
  Card,
  CircularProgress,
  Dialog,
  Snackbar,
} from "@mui/material";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React, {
  createRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useInView } from "react-intersection-observer";
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";
import styled from "styled-components";
import { Background } from "..";
import Gallery from "../../components/Gallery/Gallery";
import Uploader from "../../components/Uploader/Uploader";

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

const FullScreenImageGrid = styled.section`
  display: grid;
  height: 100%;
  grid-template-rows: 1fr auto;

  & img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
`;

const IMAGE_WIDTH_IN_PIXELS = 640;
const IMAGE_HEIGHT_IN_PIXELS = 320;

const PicturesPage: NextPage = () => {
  const [pictures, setPictures] = useState<string[]>([]);
  const [openedImage, setOpenedImage] = useState<string>();
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(true);
  const { ref: scrollRef, inView } = useInView();
  const imageRef = useRef<any>();

  useEffect(() => {
    const loadMorePictures = async () => {
      const response = await fetch(
        `https://random.imagecdn.app/${IMAGE_WIDTH_IN_PIXELS}/${IMAGE_HEIGHT_IN_PIXELS}`
      );
      setPictures((prev) =>
        [...prev, response.url].filter(
          (value: string, index: number, array: string[]) => {
            return array.indexOf(value) === index;
          }
        )
      );
      setIsLoadingMore(!isLoadingMore);
    };
    if (inView) loadMorePictures();
  }, [inView, isLoadingMore]);

  const handleImageOpen = (url: string) => {
    setOpenedImage(url);
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

  const handleImageClose = () => {
    setOpenedImage(undefined);
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  const convertFileToImage = async (file: File) => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (pictures.some((picture) => picture === (reader.result as string))) {
          setIsSnackbarOpen(true);
          return resolve("rejected");
        }
        return resolve(reader.result as string);
      };
    });
  };

  const handleUpload = async (files: File[]) => {
    let newImages = await Promise.all(
      files.map(async (file) => {
        return await convertFileToImage(file);
      })
    );
    newImages = newImages.filter((image) => image !== "rejected");
    setPictures((prev) => [...prev, ...newImages]);
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
              onImageOpen={handleImageOpen}
            />
            <CircularProgress
              ref={scrollRef}
              title="Loading more images at the bottom of the page"
              aria-busy={inView}
              aria-describedby="gallery"
            />
          </Card>
        </ContainerGrid>
      </Background>
      <Dialog open={!!openedImage} fullScreen>
        <FullScreenImageGrid>
          <QuickPinchZoom onUpdate={onUpdate}>
            <img src={openedImage!} alt="" ref={imageRef} />
          </QuickPinchZoom>
          <Button onClick={handleImageClose}>Close</Button>
        </FullScreenImageGrid>
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
