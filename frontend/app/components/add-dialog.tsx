import { Controller, useForm, type SubmitHandler } from "react-hook-form"

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, TextField } from "@mui/material";
import { useFetcher } from "react-router";
import type { Alphabet } from "~/models/sequence";

interface AddDialogProps {
  open: boolean;
  handleClose: () => void;
}

type AddSequenceInput = {
  identifier: string;
  description: string;
  sequence: string;
  alphabet: Alphabet;
}

function AddDialog({ open, handleClose }: AddDialogProps) {
  const { control, register, handleSubmit } = useForm<AddSequenceInput>({
    defaultValues: {
      identifier: '',
      description: '',
      alphabet: 'dna',
      sequence: '',
    }
  });
  let fetcher = useFetcher();

  const onSubmit: SubmitHandler<AddSequenceInput> = (data) => {
    console.log(data);
    fetcher.submit(data, { method: "post", action: "/sequences", encType: 'application/json' });
    handleClose();
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: handleSubmit(onSubmit)
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
          <div className="flex flex-col">
            <div className="flex flex-row">
              <TextField
                sx={{ my: 2, flexGrow: 1 }}
                autoFocus
                label="Identifier"
                type="text"
                {...register("identifier", { required: true })}
              />
              <Controller
                name="alphabet"
                control={control}
                render={({ field }) => (
                  <Select {...field} sx={{ my: 2, ml: 2 }}>
                    <MenuItem value={'dna'} selected>DNA</MenuItem>
                    <MenuItem value={'rna'}>RNA</MenuItem>
                    <MenuItem value={'protein'}>Protein</MenuItem>
                  </Select>
                )}
              />
            </div>
            <TextField
              sx={{ mb: 2 }}
              label="Description"
              type="text"
              fullWidth
              {...register("description")}
            />
            <TextField
              sx={{ mb: 2 }}
              label="Sequence (e.g. ACGTAGACA)"
              type="text"
              required
              multiline
              rows={4}
              fullWidth
              {...register("sequence", { required: true })}
            />
          </div>
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
