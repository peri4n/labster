import { useState } from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import type { Sequence } from "~/models/sequence";

interface AddDialogProps {
  open: boolean;
  handleClose: () => void;
  addSequence: (sequence: Sequence) => void;
}

function AddDialog({ open, handleClose, addSequence }: AddDialogProps) {
  const [identifier, setIdentifier] = useState('');
  const [description, setDescription] = useState('');
  const [sequence, setSequence] = useState('');

  async function handleAdd(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const result = await fetch('http://localhost:3000/sequences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ identifier, description: '', sequence })
    }).then(res => res.json());
    setSequence('');
    setIdentifier('');
    setDescription('');
    addSequence(result);
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
