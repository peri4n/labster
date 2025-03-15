import { useState, type ChangeEvent } from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography, type SelectChangeEvent } from "@mui/material";
import { useFetcher } from "react-router";

interface AddDialogProps {
  open: boolean;
  handleClose: () => void;
}

function AddDialog({ open, handleClose }: AddDialogProps) {
  const [identifier, setIdentifier] = useState('');
  const [description, setDescription] = useState('');
  const [sequence, setSequence] = useState('');
  const [alphabet, setAlphabet] = useState('dna');
  let fetcher = useFetcher();

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              fetcher.submit(formJson, { method: "post", action: "/sequences", encType: 'application/json' });
              handleClose();
            },
          },
        }}
        aria-labelledby="form-dialog-title"
        maxWidth="lg"
        fullWidth>
        <DialogTitle id="form-dialog-title" variant="h4" color="primary">Create new sequence</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the form below to create a new sequence.
          </DialogContentText>
          <div className="flex">
            <TextField
              sx={{ my: 2, flexGrow: 1 }}
              autoFocus
              id="identifier"
              name="identifier"
              label="Identifier"
              type="text"
              value={identifier}
              required
              onChange={(e: ChangeEvent<HTMLInputElement>) => setIdentifier(e.target.value)}
            />
            <FormControl variant="standard" sx={{ my: 3, mx: 5, minWidth: 100 }}>
              <InputLabel id="alphabet-label">Alphabet</InputLabel>
              <Select
                labelId="alphabet-label"
                id="alphabet-select"
                name="alphabet"
                value={alphabet}
                label="Alphabet"
                onChange={(e: SelectChangeEvent) => setAlphabet(e.target.value)}
              >
                <MenuItem value={'dna'}>DNA</MenuItem>
                <MenuItem value={'rna'}>RNA</MenuItem>
                <MenuItem value={'protein'}>Protein</MenuItem>
              </Select>
            </FormControl>
          </div>
          <TextField
            sx={{ mb: 2 }}
            id="description"
            name="description"
            label="Description"
            type="text"
            value={description}
            fullWidth
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
          />
          <TextField
            sx={{ mb: 2 }}
            id="sequence"
            name="sequence"
            label="Sequence"
            type="text"
            required
            multiline
            rows={4}
            fullWidth
            value={sequence}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSequence(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddDialog;
