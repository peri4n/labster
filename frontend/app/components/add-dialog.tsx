import { useState, type ChangeEvent } from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from "@mui/material";
import { useFetcher } from "react-router";

interface AddDialogProps {
  open: boolean;
  handleClose: () => void;
}

function AddDialog({ open, handleClose }: AddDialogProps) {
  const [identifier, setIdentifier] = useState('');
  const [description, setDescription] = useState('');
  const [sequence, setSequence] = useState('');
  let fetcher = useFetcher();

  async function handleAdd(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    fetcher.submit({ identifier, description, sequence }, { method: "post", action: "/sequences", encType: 'application/json' });
    handleClose();
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="lg" fullWidth>
        <DialogTitle id="form-dialog-title" variant="h4" color="primary">Create new sequence</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the form below to create a new sequence.
          </DialogContentText>
          <form noValidate autoComplete="off">
            <TextField
              sx={{ my: 2 }}
              autoFocus
              id="identifier"
              label="Identifier"
              type="text"
              value={identifier}
              fullWidth
              required
              onChange={(e: ChangeEvent<HTMLInputElement>) => setIdentifier(e.target.value)}
            />
            <TextField
              sx={{ mb: 2 }}
              id="description"
              label="Description"
              type="text"
              value={description}
              fullWidth
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
            />
            <TextField
              sx={{ mb: 2 }}
              id="sequence"
              label="Sequence"
              type="text"
              required
              multiline
              rows={4}
              fullWidth
              value={sequence}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSequence(e.target.value)}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAdd} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddDialog;
