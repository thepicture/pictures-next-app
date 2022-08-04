import React from "react";

import { Typography } from "@mui/material";

import styled from "styled-components";

const StyledFooter = styled(Typography)`
  color: white;
  grid-area: f;
`;

export const Footer = () => {
  return <StyledFooter>&copy; Pictures App</StyledFooter>;
};
