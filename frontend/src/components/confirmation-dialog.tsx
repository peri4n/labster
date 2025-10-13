import { Button, DialogContentText } from "@mui/material";
import BaseDialog from "./base-dialog";

type ConfirmationDialogProps = {
  open: boolean,
  title: string,
  question: string,
  onClose: () => void,
  onConfirm: () => void,
}

function ConfirmationDialog({ open, onClose, onConfirm, title, question }: ConfirmationDialogProps) {
  const actions = (
    <>
      <Button
        onClick={onClose}
        color="inherit"
        disableRipple
      >
        Cancel
      </Button>
      <Button
        onClick={onConfirm}
        variant="contained"
        autoFocus
        disableRipple
      >
        Delete
      </Button>
    </>
  );

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title={title}
      maxWidth="sm"
      actions={actions}
    >
      <DialogContentText>
        {question}
      </DialogContentText>
    </BaseDialog>
  );
}

export default ConfirmationDialog;
