import { SeqViz } from "seqviz";
import { Box } from "@mui/material";

type DNAVisualizerProps = {
  sequence: string;
  alphabet?: string;
  search?: { query: string; mismatch?: number };
};

export function DNAVisualizer({ sequence, alphabet = "dna", search }: DNAVisualizerProps) {
  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <SeqViz
        name={alphabet.toUpperCase()}
        seq={sequence}
        viewer="linear"
        showComplement={true}
        search={search}
        bpColors={{
          A: "#4caf50",
          T: "#f44336",
          G: "#2196f3",
          C: "#ffeb3b",
          U: "#9c27b0"
        }}
        style={{ height: "100%", width: "100%", paddingRight: 10 }}
      />
    </Box>
  );
}
