import { apiClient } from "@api/client";
import type { Alphabet } from "@models/sequence";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  DialogContentText,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useSnackbar } from "@util/snackbar-provider";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import BaseDialog from "./base-dialog";

interface AddDialogProps {
  open: boolean;
  handleClose: () => void;
}

type AddSequenceInput = {
  identifier: string;
  description: string;
  sequence: string;
  alphabet: Alphabet;
};

function AddSequenceDialog({ open, handleClose }: AddDialogProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddSequenceInput>({
    defaultValues: {
      identifier: "",
      description: "",
      alphabet: "dna",
      sequence: "",
    },
  });

  console.log("Rendering AddSequenceDialog");

  const _router = useRouter();

  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const addSequence = useMutation({
    mutationFn: (sequence: AddSequenceInput) => apiClient.createSequence(sequence),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-sequences"],
      });
      showSnackbar("Sequence added successfully", "success");
      reset();
      handleClose();
    },
    onError: () => {
      showSnackbar("Failed to add sequence", "error");
    },
  });

  const onSubmit: SubmitHandler<AddSequenceInput> = (data) => {
    addSequence.mutate(data);
  };

  const getAlphabetChip = (alphabet: Alphabet) => {
    switch (alphabet) {
      case "dna":
        return <Chip label="DNA" color="primary" size="small" />;
      case "rna":
        return <Chip label="RNA" color="error" size="small" />;
      case "protein":
        return <Chip label="Protein" color="info" size="small" />;
    }
  };

  return (
    <BaseDialog
      open={open}
      onClose={handleClose}
      title="Create New Sequence"
      maxWidth="md"
      actions={
        <>
          <Button onClick={handleClose} color="inherit" disabled={addSequence.isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={addSequence.isPending}
            startIcon={addSequence.isPending ? <CircularProgress size={16} /> : null}
            sx={{ minWidth: 100 }}
          >
            {addSequence.isPending ? "Adding..." : "Add Sequence"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContentText sx={{ mb: 3 }}>
          Fill in the details below to add a new biological sequence to your collection.
        </DialogContentText>

        <Stack spacing={3}>
          <Stack direction="row" spacing={2}>
            <TextField
              autoFocus
              label="Identifier"
              fullWidth
              error={!!errors.identifier}
              helperText={errors.identifier ? "Identifier is required" : ""}
              {...register("identifier", { required: "Identifier is required" })}
              sx={{ flex: 2 }}
            />

            <Controller
              name="alphabet"
              control={control}
              render={({ field }) => (
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    {...field}
                    label="Type"
                    renderValue={(value) => getAlphabetChip(value as Alphabet)}
                  >
                    <MenuItem value="dna">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {getAlphabetChip("dna")}
                        <span>Deoxyribonucleic Acid</span>
                      </Box>
                    </MenuItem>
                    <MenuItem value="rna">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {getAlphabetChip("rna")}
                        <span>Ribonucleic Acid</span>
                      </Box>
                    </MenuItem>
                    <MenuItem value="protein">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {getAlphabetChip("protein")}
                        <span>Protein Sequence</span>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Stack>

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={2}
            placeholder="Describe the sequence (optional)"
            {...register("description")}
          />

          <TextField
            label="Sequence"
            multiline
            rows={6}
            fullWidth
            required
            error={!!errors.sequence}
            helperText={
              errors.sequence
                ? "Sequence is required"
                : "Enter the biological sequence (e.g., ATGCGATCG)"
            }
            placeholder="ATGCGATCGAATTC..."
            {...register("sequence", { required: "Sequence is required" })}
            sx={{
              "& .MuiInputBase-root": {
                fontFamily: "monospace",
                fontSize: "0.9rem",
              },
            }}
          />
        </Stack>
      </form>
    </BaseDialog>
  );
}

export default AddSequenceDialog;
