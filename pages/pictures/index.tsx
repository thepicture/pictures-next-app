import { Card } from "@mui/material";
import { NextPage } from "next";
import Head from "next/head";
import React from "react";
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

const PicturesPage: NextPage = () => {
  const { pictures, setPictures, isLoading } = usePictures();

  const convertFileToImage = async (file: File) => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
    });
  };

  const handleUpload = async (files: File[]) => {
    const newImages = await Promise.all(
      files.map(async (file) => {
        return await convertFileToImage(file);
      })
    );
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
            {isLoading ? <p>Loading...</p> : <Gallery pictures={pictures} />}
          </Card>
        </ContainerGrid>
      </Background>
    </>
  );
};

export default PicturesPage;
