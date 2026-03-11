import { Box, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';

function StatisticsPage() {
  return (
    <Box>
      <Typography variant="h5">Statistics</Typography>
      <Typography color="text.secondary">Coming soon.</Typography>
    </Box>
  );
}

export const Route = createFileRoute('/statistics/')({
  component: StatisticsPage,
})
