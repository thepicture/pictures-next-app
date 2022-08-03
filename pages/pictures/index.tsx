import React, { useCallback, useEffect, useRef, useState } from "react";

import { Button, Card, Dialog, Snackbar, Typography } from "@mui/material";

import styled from "styled-components";

import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";

import byteSize from "byte-size";

import { Background } from "@pages";
import { Gallery } from "@components";
import { Uploader } from "@components";
import { Picture } from "@interfaces";

import io, { Socket } from "socket.io-client";
import imageCompression from "browser-image-compression";

let socket: Socket;

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

const ImageContainer = styled.div`
  height: 100%;
  width: 100%;
`;

interface ImageCompressionOptions {
  maxSizeMB: number;
}

const IMAGE_COMPRESSION_OPTIONS: ImageCompressionOptions = {
  maxSizeMB: 0.5,
};

const PicturesPage: NextPage = () => {
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [openedPicture, setOpenedPicture] = useState<Picture>();
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const imageRef = useRef<any>();

  const initializeSocket = async () => {
    await fetch("/api/pictures");
    socket = io();
    socket.on("pictures", (initialPictures: Picture[]) => {
      setPictures(initialPictures);
    });
    socket.on("post picture", (newPictures: Picture[]) => {
      setPictures((prev) => [...prev, ...newPictures]);
    });
  };

  useEffect(() => {
    initializeSocket();
  }, []);

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

  const handlePictureOpen = (picture: Picture) => {
    setOpenedPicture(picture);
  };

  const handlePictureClose = () => {
    setOpenedPicture(undefined);
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  const convertFileToPicture = async (file: File) => {
    return new Promise<Picture>(async (resolve) => {
      const reader = new FileReader();
      const compressedFile = await imageCompression(
        file,
        IMAGE_COMPRESSION_OPTIONS
      );
      reader.readAsDataURL(compressedFile);
      reader.onload = () => {
        if (
          pictures.some((picture) => picture.url === (reader.result as string))
        ) {
          setIsSnackbarOpen(true);
          return resolve({ name: "", size: -1, url: "" });
        }
        return resolve({
          name: compressedFile.name,
          size: compressedFile.size,
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
    newPictures = newPictures.filter((picture) => picture.size > 0);
    setPictures((prev) => [...prev, ...newPictures]);
    for (const picture of newPictures) socket.emit("post picture", [picture]);
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
            {pictures.length === 0 && (
              <p>No pictures here yet. Upload yours now!</p>
            )}
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
            <ImageContainer ref={imageRef}>
              <Image
                src={openedPicture?.url || "/vercel.svg"}
                alt=""
                layout="fill"
              />
            </ImageContainer>
          </QuickPinchZoom>
          <Button onClick={handlePictureClose}>Close</Button>
        </FullScreenPictureGrid>
      </Dialog>
      <Snackbar
        open={isSnackbarOpen}
        onClose={handleSnackbarClose}
        message="One or more pictures have already been uploaded"
      ></Snackbar>
    </>
  );
};

export default PicturesPage;
