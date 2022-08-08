import React from "react";

import Image from "next/image";

import { signOut, useSession } from "next-auth/react";

import { Box, Card, Typography } from "@mui/material";

import { StyledButton } from "@styles";
import { ANONYMOUS, IMAGE_PLACEHOLDER } from "@constants";

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
              alt={`${session.user.name || ANONYMOUS}'s profile image`}
              width="70"
              height="70"
              style={{ borderRadius: "100%" }}
            />
            <Typography>{session.user.name}</Typography>
            <StyledButton
              onClick={() => signOut()}
              title="Sign out from the current account"
              style={{ paddingLeft: 0, paddingRight: 0 }}
            >
              Signout
            </StyledButton>
          </>
        )}
      </Box>
    </Card>
  );
};
