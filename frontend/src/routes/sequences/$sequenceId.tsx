import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { DNAVisualizer } from "@components/dna-visualizer";
import { createFileRoute } from "@tanstack/react-router";
import type { Sequence } from "@models/sequence";

export function SequenceDetailsPage() {
  const { identifier, description, sequence } = Route.useLoaderData()
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h2">{identifier}</Typography>
      <Card variant="outlined">
        <CardHeader title="Details" />
        <CardContent>
          <Typography variant="body1">{description}</Typography>
        </CardContent>
      </Card>
      <Card variant="outlined">
        <CardHeader title="Sequence" />
        <CardContent>
          <DNAVisualizer sequence={sequence} />
        </CardContent>
      </Card>
    </Box>
  )

}

export const Route = createFileRoute('/sequences/$sequenceId')({
  component: SequenceDetailsPage,
  loader: async ({ params }) => {
    const response = await fetch('http://localhost:3000/sequences/' + params.sequenceId)
    const result: Sequence = await response.json();
    return { ...result };
  }
})
