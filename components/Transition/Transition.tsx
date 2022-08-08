import { UP } from "@constants";
import { Slide } from "@mui/material";
import React from "react";

export const Transition = React.forwardRef(function Transition(
  props: {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction={UP} ref={ref} {...props} />;
});
