import { Box, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';

function ImportPage() {
  return (
    <Box>
      <Typography variant="h5">Import</Typography>
      <Typography color="text.secondary">Coming soon.</Typography>
    </Box>
  );
}

export const Route = createFileRoute('/import/')({
  component: ImportPage,
})
