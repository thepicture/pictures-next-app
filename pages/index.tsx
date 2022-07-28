import { Card } from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styled, { css } from "styled-components";

export const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, red, blue);
  text-align: center;
`;

const sharedClickableStyle = css`
  color: white;
  background: #00d;
  border-radius: 0.5em;
  padding: 0.5em 1em;
  width: 100%;
  display: block;
  cursor: pointer;

  &:hover {
    background: blue;
  }
`;

export const StyledLink = styled.a`
  ${sharedClickableStyle}
`;
export const StyledButton = styled.button`
  ${sharedClickableStyle}
  border: none;
`;

const Home: NextPage = () => {
  return (
    <Background>
      <Head>
        <title>Pictures App</title>
        <meta
          name="description"
          content="Share pictures with others in the common gallery"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Card elevation={16} component="main" sx={{ p: 4, m: 4 }}>
        <h1>Pictures App</h1>
        <p>Share pictures with others in the common gallery</p>
        <Link href="/pictures" title="Navigate to pictures page">
          <StyledLink>Start</StyledLink>
        </Link>
      </Card>
    </Background>
  );
};

export default Home;
