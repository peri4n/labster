import { Box, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  open: boolean;
  handleClose: () => void;
}

function FileUploadDialog({ open, handleClose }: FileUploadProps) {
  const uploadSequences = useMutation({
    mutationFn: async (sequences: Array<{ identifier: string, sequence: string }>) => {
      let promises = [];
      for (const sequence of sequences) {
        promises.push(fetch('http://localhost:3000/sequences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sequence)
        }));
      }
      await Promise.all(promises)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['fetch-sequences']
      })

    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.map(file => {
      file.text().then(text => {
        const entries = parseFasta(text)
        uploadSequences.mutate(entries);
      })
    });
    handleClose();
  }, [handleClose, uploadSequences]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const queryClient = useQueryClient();

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth hideBackdrop>
      <DialogTitle>Upload Sequence Files</DialogTitle>
      <DialogContent>
        <Box {...getRootProps({ className: 'dropzone' })}
          sx={{
            border: '2px dashed #ccc',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
            minHeight: '200px',
            cursor: 'pointer',
            backgroundColor: '#f9f9f9'
          }}>
          <input {...getInputProps()} />
          <Typography variant="body1">Drag 'n' drop some files here, or click to select files</Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function parseFasta(text: string): Array<{ identifier: string; sequence: string }> {
  const sequences = [];
  const lines = text.split(/\r?\n/);
  let currentHeader = null;
  let currentSequence = [];

  for (const line of lines) {
    if (line.startsWith('>')) {
      // Save previous sequence if any
      if (currentHeader !== null) {
        sequences.push({
          identifier: currentHeader,
          sequence: currentSequence.join(''),
          description: '',
          alphabet: 'dna' // Default to DNA, can be changed based on your needs
        });
      }
      // Start new sequence
      currentHeader = line.slice(1).trim();
      currentSequence = [];
    } else if (line.trim() !== '') {
      currentSequence.push(line.trim());
    }
  }

  // Push the last parsed sequence
  if (currentHeader !== null) {
    sequences.push({
      identifier: currentHeader,
      sequence: currentSequence.join(''),
      description: '',
      alphabet: 'dna' // Default to DNA, can be changed based on your needs
    });
  }

  return sequences;
}

export default FileUploadDialog;
