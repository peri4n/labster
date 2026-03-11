import { Box, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

function ExportPage() {
  return (
    <Box>
      <Typography variant="h5">Export</Typography>
      <Typography color="text.secondary">Coming soon.</Typography>
    </Box>
  );
}

export const Route = createFileRoute("/export/")({
  component: ExportPage,
});
