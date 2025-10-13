import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

type ConfirmationDialogProps = {
  open: boolean,
  title: string,
  question: string,
  onClose: () => void,
  onConfirm: () => void,
}

function ConfirmationDialog({ open, onClose, onConfirm, title, question }: ConfirmationDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            boxShadow: (theme) => theme.shadows[12]
          }
        }
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          fontWeight: 600
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent sx={{ mt: 3 }}>
        <DialogContentText>
          {question}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2, gap: 1 }}>
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
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;
