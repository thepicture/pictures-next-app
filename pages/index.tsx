import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useSession } from "next-auth/react";

import { Card, Typography } from "@mui/material";

import styled, { css } from "styled-components";

import { RELATIVE_PICTURES_URL, RELATIVE_SIGN_IN_URL } from "@constants";
import { useEffect } from "react";

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
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.replace("/pictures");
  }, [session]);

  if (session) {
    return (
      <Typography>
        Redirecting to{" "}
        <Link href={RELATIVE_PICTURES_URL}>
          <a>pictures</a>
        </Link>
        ...
      </Typography>
    );
  }

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
        <h1 tabIndex={0}>Pictures App</h1>
        <p tabIndex={0}>Share pictures with others in the common gallery</p>
        <Link href={RELATIVE_SIGN_IN_URL} title="Navigate to sign in">
          <StyledLink tabIndex={0} aria-label="Navigate to sign in">
            Start
          </StyledLink>
        </Link>
      </Card>
    </Background>
  );
};

export default Home;
