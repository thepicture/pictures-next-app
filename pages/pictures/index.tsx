import React, { useEffect, useState } from "react";

import { Card, Snackbar, TextField, Typography } from "@mui/material";

import styled from "styled-components";

import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useSession } from "next-auth/react";

import io, { Socket } from "socket.io-client";

import imageCompression from "browser-image-compression";

import {
  Footer,
  FullScreenPicture,
  Gallery,
  Header,
  PictureDeleteConfirm,
} from "@components";
import { Uploader } from "@components";
import { Picture } from "@interfaces";
import { useAsk } from "@hooks";
import { Background, StyledLink } from "@pages";

import {
  API_PICTURES,
  DELETE_PICTURE_BY_NAME_AND_PASSWORD,
  PICTURES,
  PICTURE_IS_DUPLICATE,
  POST_PICTURE,
  RELATIVE_SIGN_IN_URL,
  SHOW_SNACKBAR,
  UNKNOWN_FILE_SIZE,
} from "@constants";

let socket: Socket;

const ContainerGrid = styled.main`
  display: grid;
  width: 100%;
  margin: 1em;
  padding-top: 1em;
  padding-bottom: 1em;
  height: 100%;
  grid-template-areas:
    "h"
    "u"
    "p"
    "f";
  grid-template-rows: auto auto 1fr auto;
  grid-template-columns: 1fr;
  gap: 1em;

  @media print, screen and (min-width: 640px) {
    grid-template-areas:
      "h h"
      "u p"
      "f f";
    grid-template-rows: auto 1fr auto;
    grid-template-columns: auto 1fr;
  }
`;

interface ImageCompressionOptions {
  maxSizeMB: number;
}

const IMAGE_COMPRESSION_OPTIONS: ImageCompressionOptions = {
  maxSizeMB: 0.5,
};

const PICTURE_DELETE_WARNING = `You haven't installed a password for deletion.
 Deletion will be impossible.
 Continue uploading without a password for deletion?`;

const PicturesPage: NextPage = () => {
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [pictureName, setPictureName] = useState("");
  const [openedPicture, setOpenedPicture] = useState<Picture | null>();

  const [passwordForDeletion, setPasswordForDeletion] = useState("");
  const [
    passwordForExistingPictureDeletion,
    setPasswordForExistingPictureDeletion,
  ] = useState("");

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isPictureDeleteConfirmOpen, setIsPictureDeleteConfirmOpen] =
    useState(false);

  const { ask, ConfirmDialogWithProps } = useAsk();

  const { data: session } = useSession();

  const initializeSocket = async () => {
    await fetch(API_PICTURES);
    socket = io();
    socket.on(PICTURES, (initialPictures: Picture[]) => {
      setPictures(initialPictures);
    });
    socket.on(POST_PICTURE, (newPictures: Picture[]) => {
      setPictures((prev) => [...prev, ...newPictures]);
    });
    socket.on(DELETE_PICTURE_BY_NAME_AND_PASSWORD, (pictureIndex: number) => {
      setPictures((prev) =>
        prev.filter((_value, index) => index != pictureIndex)
      );
    });
    socket.on(SHOW_SNACKBAR, (message: string) => {
      setSnackbarMessage(message);
      setIsSnackbarOpen(true);
    });
  };

  useEffect(() => {
    initializeSocket();
    return () => {
      socket?.close();
    };
  }, []);

  if (session === null) {
    console.log("session");
    return (
      <Background>
        <Card elevation={16} sx={{ p: 4 }}>
          <Typography mb={2}>You must sign in</Typography>
          <Link href={RELATIVE_SIGN_IN_URL}>
            <StyledLink>Sign In</StyledLink>
          </Link>
        </Card>
      </Background>
    );
  }

  const handlePictureOpen = (picture: Picture) => {
    setOpenedPicture(picture);
  };

  const handlePictureClose = () => {
    setOpenedPicture(null);
  };

  const handleOpenDialogForPictureName = (pictureName: string) => {
    setIsPictureDeleteConfirmOpen(true);
    setPictureName(pictureName);
  };

  const handlePictureDelete = () => {
    if (passwordForExistingPictureDeletion) {
      socket.emit(DELETE_PICTURE_BY_NAME_AND_PASSWORD, {
        pictureName,
        passwordForExistingPictureDeletion,
      });
    }
    setPictureName(pictureName);
    setPasswordForExistingPictureDeletion("");
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
          setSnackbarMessage(PICTURE_IS_DUPLICATE);
          setIsSnackbarOpen(true);
          return resolve({
            name: "",
            size: UNKNOWN_FILE_SIZE,
            url: "",
            uploadedBy: "",
          });
        }
        return resolve({
          name: compressedFile.name,
          size: compressedFile.size,
          url: reader.result as string,
          passwordForDeletion,
          uploadedBy: session.user?.name || "Anonymous",
        });
      };
    });
  };

  const postFiles = async (files: File[]) => {
    let newPictures = await Promise.all(
      files.map(async (file) => {
        return await convertFileToPicture(file);
      })
    );
    newPictures = newPictures.filter((picture) => picture.size > 0);
    setPictures((prev) => [...prev, ...newPictures]);
    for (const picture of newPictures) {
      socket.emit(POST_PICTURE, [picture]);
    }
  };

  const handleUpload = async (files: File[]) => {
    if (passwordForDeletion || (await ask(PICTURE_DELETE_WARNING))) {
      setPasswordForDeletion("");
      postFiles(files);
    }
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
          <Header />
          <Card elevation={16} sx={{ p: 4 }}>
            <Uploader onUpload={handleUpload} />
            <TextField
              value={passwordForDeletion}
              onChange={(event) => setPasswordForDeletion(event.target.value)}
              autoComplete="one-time-code"
              type="password"
              title="Password for picture deletion"
              placeholder="Password for deletion"
              fullWidth
              sx={{ mt: 2 }}
            />
          </Card>
          <Card elevation={16} sx={{ p: 4, overflow: "hidden visible" }}>
            <Gallery
              id="gallery"
              pictures={pictures}
              onPictureOpen={handlePictureOpen}
              onPictureDelete={handleOpenDialogForPictureName}
            />
            {typeof session === "undefined" && (
              <Typography mb={2}>Loading...</Typography>
            )}
            {session && pictures.length === 0 && (
              <Typography>No pictures here yet. Upload yours now!</Typography>
            )}
          </Card>
          <Footer />
        </ContainerGrid>
      </Background>
      <FullScreenPicture
        picture={openedPicture}
        onPictureClose={handlePictureClose}
      />
      <Snackbar
        open={isSnackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
      <PictureDeleteConfirm
        isOpen={isPictureDeleteConfirmOpen}
        onPasswordChange={(password: string) =>
          setPasswordForExistingPictureDeletion(password)
        }
        onConfirm={() => {
          setIsPictureDeleteConfirmOpen(false);
          handlePictureDelete();
        }}
        onCancel={() => {
          setPasswordForExistingPictureDeletion("");
          setIsPictureDeleteConfirmOpen(false);
        }}
      />
      <ConfirmDialogWithProps />
    </>
  );
};

export default PicturesPage;
