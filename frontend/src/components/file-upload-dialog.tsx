import { apiClient } from "@api/client";
import { CloudUpload, Description } from "@mui/icons-material";
import { Alert, Box, Button, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@util/snackbar-provider";
import { useCallback, useState } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import BaseDialog from "./base-dialog";

interface FileUploadProps {
  open: boolean;
  handleClose: () => void;
}

function FileUploadDialog({ open, handleClose }: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [parsedSequences, setParsedSequences] = useState<
    Array<{ identifier: string; sequence: string }>
  >([]);
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const uploadSequences = useMutation({
    mutationFn: async (
      sequences: Array<{
        identifier: string;
        sequence: string;
        description?: string;
        alphabet?: string;
      }>,
    ) => {
      await Promise.all(
        sequences.map((sequence) =>
          apiClient.createSequence({
            identifier: sequence.identifier,
            description: sequence.description || "",
            sequence: sequence.sequence,
            alphabet: sequence.alphabet || "dna",
          }),
        ),
      );
    },
    onSuccess: (_, sequences) => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-sequences"],
      });
      showSnackbar(`Successfully uploaded ${sequences.length} sequence(s)`, "success");
      handleCloseAndReset();
    },
    onError: (error: Error) => {
      showSnackbar(error.message || "Failed to upload sequences", "error");
    },
  });

  const handleCloseAndReset = () => {
    setUploadedFiles([]);
    setParsedSequences([]);
    handleClose();
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        showSnackbar("Some files were rejected. Please upload FASTA files only.", "warning");
      }

      setUploadedFiles(acceptedFiles);

      // Parse all files
      Promise.all(acceptedFiles.map((file) => file.text().then((text) => parseFasta(text))))
        .then((results) => {
          const allSequences = results.flat();
          setParsedSequences(allSequences);
        })
        .catch(() => {
          showSnackbar("Error parsing FASTA files", "error");
        });
    },
    [showSnackbar],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".fasta", ".fa", ".fas", ".txt"],
      "application/octet-stream": [".fasta", ".fa", ".fas"],
    },
    maxFiles: 10,
  });

  return (
    <BaseDialog
      open={open}
      onClose={handleCloseAndReset}
      title="Upload FASTA Files"
      maxWidth="md"
      actions={
        <>
          <Button
            onClick={handleCloseAndReset}
            color="inherit"
            disabled={uploadSequences.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={() => uploadSequences.mutate(parsedSequences)}
            variant="contained"
            disabled={parsedSequences.length === 0 || uploadSequences.isPending}
            startIcon={uploadSequences.isPending ? <CircularProgress size={16} /> : <CloudUpload />}
            sx={{ minWidth: 120 }}
          >
            {uploadSequences.isPending
              ? "Uploading..."
              : `Upload ${parsedSequences.length || ""} Sequence${parsedSequences.length !== 1 ? "s" : ""}`}
          </Button>
        </>
      }
    >
      <Stack spacing={3}>
        <Typography variant="body2" color="text.secondary">
          Upload FASTA files containing biological sequences. Supported formats: .fasta, .fa, .fas,
          .txt
        </Typography>

        <Box
          {...getRootProps({ className: "dropzone" })}
          sx={{
            border: (theme) =>
              `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
            borderRadius: 2,
            padding: 4,
            textAlign: "center",
            minHeight: 200,
            cursor: "pointer",
            backgroundColor: (theme) =>
              isDragActive ? theme.palette.action.hover : theme.palette.background.paper,
            transition: "all 0.2s ease-in-out",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            "&:hover": {
              backgroundColor: (theme) => theme.palette.action.hover,
              borderColor: (theme) => theme.palette.primary.main,
            },
          }}
        >
          <input {...getInputProps()} />
          <CloudUpload
            sx={{
              fontSize: 48,
              color: (theme) =>
                isDragActive ? theme.palette.primary.main : theme.palette.text.secondary,
            }}
          />
          <Typography variant="h6" color={isDragActive ? "primary" : "text.primary"}>
            {isDragActive ? "Drop files here" : "Drag & drop FASTA files"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            or click to browse files
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Maximum 10 files • .fasta, .fa, .fas, .txt
          </Typography>
        </Box>

        {uploadedFiles.length > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Uploaded Files ({uploadedFiles.length})
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {uploadedFiles.map((file) => (
                <Chip
                  key={file.name}
                  icon={<Description />}
                  label={file.name}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Stack>
          </Box>
        )}

        {parsedSequences.length > 0 && (
          <Alert severity="info">Found {parsedSequences.length} sequence(s) ready for upload</Alert>
        )}
      </Stack>
    </BaseDialog>
  );
}

function parseFasta(text: string): Array<{ identifier: string; sequence: string }> {
  const sequences = [];
  const lines = text.split(/\r?\n/);
  let currentHeader = null;
  let currentSequence = [];

  for (const line of lines) {
    if (line.startsWith(">")) {
      // Save previous sequence if any
      if (currentHeader !== null) {
        sequences.push({
          identifier: currentHeader,
          sequence: currentSequence.join(""),
          description: "",
          alphabet: "dna", // Default to DNA, can be changed based on your needs
        });
      }
      // Start new sequence
      currentHeader = line.slice(1).trim();
      currentSequence = [];
    } else if (line.trim() !== "") {
      currentSequence.push(line.trim());
    }
  }

  // Push the last parsed sequence
  if (currentHeader !== null) {
    sequences.push({
      identifier: currentHeader,
      sequence: currentSequence.join(""),
      description: "",
      alphabet: "dna", // Default to DNA, can be changed based on your needs
    });
  }

  return sequences;
}

export default FileUploadDialog;
