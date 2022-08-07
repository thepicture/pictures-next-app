import React from "react";

import Link from "next/link";

import { Card, Typography } from "@mui/material";

import { StyledLink } from "@pages";
import { RELATIVE_SIGN_OUT_URL } from "@constants";

export const Header = () => {
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
      <Link href={RELATIVE_SIGN_OUT_URL}>
        <StyledLink style={{ width: "auto" }}>Sign out</StyledLink>
      </Link>
    </Card>
  );
};
