import { useState } from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
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
    console.log(identifier, description, sequence);
    fetcher.submit({ identifier, description, sequence }, { method: "post", action: "/sequences" });
    handleClose();
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Sequence</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            id="sequence"
            label="Sequence"
            multiline
            type="text"
            fullWidth
            value={sequence}
            onChange={(e) => setSequence(e.target.value)}
          />
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
