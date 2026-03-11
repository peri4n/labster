import { Box, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

function SearchPage() {
  return (
    <Box>
      <Typography variant="h5">Search</Typography>
      <Typography color="text.secondary">Coming soon.</Typography>
    </Box>
  );
}

export const Route = createFileRoute("/search/")({
  component: SearchPage,
});
