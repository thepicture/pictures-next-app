import React, { ChangeEvent, useEffect, useRef } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { Transition } from "@components";

interface PictureDeleteConfirmProps {
  isOpen: boolean;
  onPasswordChange: (password: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PictureDeleteConfirm: React.FC<PictureDeleteConfirmProps> = ({
  isOpen,
  onPasswordChange,
  onConfirm,
  onCancel,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const dialogTextFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (dialogTextFieldRef.current)
      if (isOpen && dialogTextFieldRef.current)
        dialogTextFieldRef.current.focus();
      else dialogTextFieldRef.current.value = "";
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onClose={() => onCancel()}
      keepMounted
      fullScreen={fullScreen}
      TransitionComponent={Transition}
    >
      <DialogTitle>Confirm your identity</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To delete the picture, you need to enter password. If password was
          empty during picture upload, you cannot delete the picture.
        </DialogContentText>
        <TextField
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onPasswordChange(event.target.value)
          }
          type="password"
          autoComplete="one-time-code"
          label="Password for deletion"
          inputRef={dialogTextFieldRef}
          margin="dense"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
};
