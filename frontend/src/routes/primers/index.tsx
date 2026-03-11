import { Box, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

function PrimersPage() {
  return (
    <Box>
      <Typography variant="h5">Primers</Typography>
      <Typography color="text.secondary">Coming soon.</Typography>
    </Box>
  );
}

export const Route = createFileRoute("/primers/")({
  component: PrimersPage,
});
