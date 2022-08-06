import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import styled from "styled-components";

import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";

import byteSize from "byte-size";

import io, { Socket } from "socket.io-client";
import imageCompression from "browser-image-compression";

import { Background } from "@pages";
import { ConfirmDialog, Footer, Gallery, Header } from "@components";
import { Uploader } from "@components";
import { Picture } from "@interfaces";

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
  position: relative;
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
  const [openedPicture, setOpenedPicture] = useState<Picture>();

  const [passwordForDeletion, setPasswordForDeletion] = useState("");
  const [
    passwordForExistingPictureDeletion,
    setPasswordForExistingPictureDeletion,
  ] = useState("");

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const [files, setFiles] = useState<File[]>([]);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const imageRef = useRef<any>();
  const dialogTextFieldRef = useRef<HTMLInputElement>(null);

  const initializeSocket = async () => {
    await fetch("/api/pictures");
    socket = io();
    socket.on("pictures", (initialPictures: Picture[]) => {
      setPictures(initialPictures);
    });
    socket.on("post picture", (newPictures: Picture[]) => {
      setPictures((prev) => [...prev, ...newPictures]);
    });
    socket.on("delete picture by name", (pictureIndex: number) => {
      setPictures((prev) =>
        prev.filter((_value, index) => index != pictureIndex)
      );
    });
    socket.on("show snackbar", (message: string) => {
      setSnackbarMessage(message);
      setIsSnackbarOpen(true);
    });
  };

  useEffect(() => {
    initializeSocket();
  }, []);

  useEffect(() => {
    if (isDialogOpen && dialogTextFieldRef.current)
      dialogTextFieldRef.current.focus();
  }, [isDialogOpen]);

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

  const handleOpenDialogForPictureName = (pictureName: string) => {
    setIsDialogOpen(true);
    setPictureName(pictureName);
  };

  const handlePictureDelete = () => {
    if (passwordForExistingPictureDeletion) {
      socket.emit("delete picture by name", {
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
          setSnackbarMessage("One or more pictures have already been uploaded");
          setIsSnackbarOpen(true);
          return resolve({ name: "", size: -1, url: "" });
        }
        return resolve({
          name: compressedFile.name,
          size: compressedFile.size,
          url: reader.result as string,
          passwordForDeletion,
        });
      };
    });
  };

  const handleUpload = (files: File[]) => {
    setFiles(files);
    if (!passwordForDeletion) {
      setIsConfirmDialogOpen(true);
    }
  };

  const handleUploadWithAgreement = async (agree: boolean) => {
    setIsConfirmDialogOpen(false);
    if (!agree) return;
    let newPictures = await Promise.all(
      files.map(async (file) => {
        return await convertFileToPicture(file);
      })
    );
    newPictures = newPictures.filter((picture) => picture.size > 0);
    setPictures((prev) => [...prev, ...newPictures]);
    for (const picture of newPictures) socket.emit("post picture", [picture]);
    setPasswordForDeletion("");
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPasswordForDeletion(event.target.value);
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
              onChange={handlePasswordChange}
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
            {pictures.length === 0 && (
              <p>No pictures here yet. Upload yours now!</p>
            )}
          </Card>
          <Footer />
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
        message={snackbarMessage}
      />
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        keepMounted
        fullScreen={fullScreen}
        TransitionComponent={Transition}
      >
        <DialogTitle>Confirm your identity</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To delete the picture, you need to enter password. If password was
            empty during picture upload, you cannot delete the picture.
          </DialogContentText>
          <TextField
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setPasswordForExistingPictureDeletion(event.target.value)
            }
            value={passwordForExistingPictureDeletion}
            type="password"
            autoComplete="one-time-code"
            label="Password for deletion"
            inputRef={dialogTextFieldRef}
            margin="dense"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setPasswordForExistingPictureDeletion("");
              setIsDialogOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setIsDialogOpen(false);
              handlePictureDelete();
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDialog
        question={PICTURE_DELETE_WARNING}
        open={isConfirmDialogOpen}
        onClose={handleUploadWithAgreement}
      />
    </>
  );
};

const Transition = React.forwardRef(function Transition(
  props: {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default PicturesPage;
