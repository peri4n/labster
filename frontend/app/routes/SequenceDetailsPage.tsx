import type { Sequence } from "~/models/sequence";
import type { Route } from './+types/SequenceDetailsPage';
import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { DNAVisualizer } from "~/components/dna-visualizer";

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
  const response = await fetch('http://localhost:3000/sequences/' + params.id)
  const result: Sequence = await response.json();
  return { sequence: result };
}

export async function clientAction({ params }: Route.ClientLoaderArgs) {
  console.log("delete action");
  await fetch(`http://localhost:3000/sequences/${params.id}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json'
    },
  });
}

export function SequenceDetailsPage({ loaderData }: Route.ComponentProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h2">{loaderData.sequence.identifier}</Typography>
      <Card variant="outlined">
        <CardHeader title="Details" />
        <CardContent>
          <Typography variant="body1">{loaderData.sequence.description}</Typography>
        </CardContent>
      </Card>
      <Card variant="outlined">
        <CardHeader title="Sequence" />
        <CardContent>
          <DNAVisualizer sequence={loaderData.sequence.sequence} />
        </CardContent>
      </Card>
    </Box>
  )

}

export default SequenceDetailsPage
