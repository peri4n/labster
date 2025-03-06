import type { JSX } from "react";

type DNAVisualizerProps = {
  sequence: string;
};

export function DNAVisualizer({ sequence }: DNAVisualizerProps) {
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
