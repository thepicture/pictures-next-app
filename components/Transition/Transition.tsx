import React from "react";

import { Slide } from "@mui/material";

import { UP } from "@constants";

export const Transition = React.forwardRef(function Transition(
  props: {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction={UP} ref={ref} {...props} />;
});
