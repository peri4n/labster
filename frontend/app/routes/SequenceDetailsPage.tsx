import type { Sequence } from "~/models/sequence";
import type { Route } from './+types/SequenceDetailsPage';
import { Box, Card, CardContent, CardHeader, Container, Paper, Typography } from "@mui/material";
import type { JSX, ReactNode } from "react";

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
  const response = await fetch('http://localhost:3000/sequences/' + params.id)
  const result: Sequence = await response.json();
  return { sequence: result };
}

type DNAVisualizerProps = {
  sequence: string;
};

const DNAVisualizer: React.FC<DNAVisualizerProps> = ({ sequence }) => {
  const colors: Record<string, string> = { A: "#FFB6B6", C: "#B5EAD7", G: "#FAF4B7", T: "#AFCBFF" };
  const nucleotideWidth = 20;
  const nucleotideHeight = 30;
  const lineBreak = 50;
  const spacing = 5;

  let svgElements: JSX.Element[] = [];
  let line = 0;

  for (let i = 0; i < sequence.length; i++) {
    let x = (i % lineBreak) * (nucleotideWidth + spacing);
    let y = line * (nucleotideHeight + spacing);
    if (i % lineBreak === 0 && i !== 0) line++;

    let nucleotide = sequence[i];
    let color = colors[nucleotide] || "#CCCCCC";

    svgElements.push(
      <g key={i}>
        <rect x={x + 1} y={y + 1} width={nucleotideWidth} height={nucleotideHeight}
          rx={5} ry={5} fill={color} stroke="#000" strokeWidth={1} />
        <text x={x + nucleotideWidth / 2} y={y + nucleotideHeight / 2 + 5}
          fontSize={16} textAnchor="middle" fill="#000">{nucleotide}</text>
      </g>
    );
  }

  let svgWidth = lineBreak * (nucleotideWidth + spacing);
  let svgHeight = (line + 1) * (nucleotideHeight + spacing);

  return (
    <svg width={svgWidth} height={svgHeight} xmlns="http://www.w3.org/2000/svg">
      {svgElements}
    </svg>
  );
};

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
