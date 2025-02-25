import type { Sequence } from "~/models/sequence";
import type { Route } from './+types/SequenceDetailsPage';
import { Typography } from "@mui/material";

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
  const response = await fetch('http://localhost:3000/sequences/' + params.id)
  const result: Sequence = await response.json();
  return { sequence: result };
}

export function SequenceDetailsPage({ loaderData }: Route.ComponentProps) {
  return (
    <Typography>View: {JSON.stringify(loaderData.sequence)}</Typography>
  )

}

export default SequenceDetailsPage
