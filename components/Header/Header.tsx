import React from "react";

import { Card, Typography } from "@mui/material";

export const Header = () => {
  return (
    <Card elevation={16} sx={{ p: 2, gridArea: "h" }}>
      <Typography component="h1" variant="h6">
        Pictures
      </Typography>
    </Card>
  );
};
