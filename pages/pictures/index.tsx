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
import React, { useState } from "react";
import styled from "styled-components";
import { Background } from "..";
import Gallery from "../../components/Gallery/Gallery";
import Uploader from "../../components/Uploader/Uploader";
import usePictures from "../../hooks/usePictures";

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

const ImageWrapper = styled.figure`
  position: relative;
`;

const PicturesPage: NextPage = () => {
  const { pictures, setPictures, isLoading } = usePictures();
  const [openedImage, setOpenedImage] = useState<string>();
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const handleImageOpen = (url: string) => {
    setOpenedImage(url);
  };

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
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Gallery pictures={pictures} onImageOpen={handleImageOpen} />
            )}
          </Card>
        </ContainerGrid>
      </Background>
      <Dialog open={!!openedImage} fullScreen>
        <FullScreenImageGrid>
          <ImageWrapper>
            <Image src={openedImage!} alt="" layout="fill" />
          </ImageWrapper>
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
