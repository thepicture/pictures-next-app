import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export interface ConfirmDialogProps {
  question: string;
  open: boolean;
  onConfirm: (isConfirmed: boolean) => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  question,
  open,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Confirm your action</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {question}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onConfirm(true)}>Yes</Button>
        <Button onClick={() => onConfirm(false)} autoFocus>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};
