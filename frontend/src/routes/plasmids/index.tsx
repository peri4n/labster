import { Box, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';

function PlasmidsPage() {
  return (
    <Box>
      <Typography variant="h5">Plasmids</Typography>
      <Typography color="text.secondary">Coming soon.</Typography>
    </Box>
  );
}

export const Route = createFileRoute('/plasmids/')({
  component: PlasmidsPage,
})
