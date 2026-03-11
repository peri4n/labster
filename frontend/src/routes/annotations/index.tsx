import { Box, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';

function AnnotationsPage() {
  return (
    <Box>
      <Typography variant="h5">Annotations</Typography>
      <Typography color="text.secondary">Coming soon.</Typography>
    </Box>
  );
}

export const Route = createFileRoute('/annotations/')({
  component: AnnotationsPage,
})
