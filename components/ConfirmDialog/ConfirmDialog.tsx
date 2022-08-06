import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export interface ConfirmDialogProps {
  question: string;
  onClose: (agree: boolean) => void;
  open: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  onClose,
  question,
  open,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        <Button onClick={() => onClose(true)}>Yes</Button>
        <Button onClick={() => onClose(false)} autoFocus>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};
