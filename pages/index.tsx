import { useEffect } from "react";

import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useSession, signIn } from "next-auth/react";

import { Card, Typography } from "@mui/material";

import { RELATIVE_PICTURES_URL } from "@constants";
import { Background, StyledButton } from "@styles";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.replace(RELATIVE_PICTURES_URL);
  }, [session, router]);

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
        <StyledButton
          onClick={() => signIn("github")}
          title="Navigate to sign in"
        >
          Start
        </StyledButton>
      </Card>
    </Background>
  );
};

export default Home;
