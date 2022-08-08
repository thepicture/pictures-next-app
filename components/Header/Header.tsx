import React from "react";

import Link from "next/link";
import Image from "next/image";

import { useSession } from "next-auth/react";

import { Box, Card, Typography } from "@mui/material";

import { StyledLink } from "@pages";
import { IMAGE_PLACEHOLDER, RELATIVE_SIGN_OUT_URL } from "@constants";

export const Header = () => {
  const { data: session } = useSession();

  return (
    <Card
      elevation={16}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        p: 2,
        gridArea: "h",
      }}
    >
      <Typography alignSelf="center" component="h1" variant="h6">
        Pictures
      </Typography>
      <Box display="flex" alignItems="center" gap={1}>
        {!session || !session.user ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            <Image
              src={session.user.image || IMAGE_PLACEHOLDER}
              alt={`${session.user.name || "Anonymous"}'s profile image`}
              width="35"
              height="35"
              style={{ borderRadius: "100%" }}
            />
            <Typography>{session.user.name}</Typography>
            <Link href={RELATIVE_SIGN_OUT_URL}>
              <StyledLink style={{ width: "auto" }}>Signout</StyledLink>
            </Link>
          </>
        )}
      </Box>
    </Card>
  );
};
