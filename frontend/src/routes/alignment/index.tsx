import { Box, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

function AlignmentPage() {
  return (
    <Box>
      <Typography variant="h5">Alignment</Typography>
      <Typography color="text.secondary">Coming soon.</Typography>
    </Box>
  );
}

export const Route = createFileRoute("/alignment/")({
  component: AlignmentPage,
});
