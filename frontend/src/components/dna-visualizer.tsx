import type { JSX } from "react";
import { Box, Typography, FormControlLabel, Switch, Stack, Tooltip } from "@mui/material";
import { useState, useEffect, useRef } from "react";

type DNAVisualizerProps = {
  sequence: string;
  alphabet?: string;
};

export function DNAVisualizer({ sequence, alphabet = 'dna' }: DNAVisualizerProps) {
  const [showIndexes, setShowIndexes] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [containerWidth, setContainerWidth] = useState(800);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth - 32); // Account for padding
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Color schemes for different sequence types
  const getColorScheme = (type: string): Record<string, string> => {
    switch (type.toLowerCase()) {
      case 'dna':
        return {
          A: "#FF6B9D", // Pink
          T: "#4ECDC4", // Teal  
          G: "#FFE66D", // Yellow
          C: "#A8E6CF", // Light Green
        };
      case 'rna':
        return {
          A: "#FF6B9D", // Pink
          U: "#FF8C42", // Orange (U instead of T)
          G: "#FFE66D", // Yellow
          C: "#A8E6CF", // Light Green
        };
      case 'protein':
        return {
          // Amino acid color scheme based on properties
          'A': "#FFB3BA", 'R': "#FF7F7F", 'N': "#FFD700", 'D': "#FF6347",
          'C': "#98FB98", 'Q': "#DDA0DD", 'E': "#FF4500", 'G': "#F0E68C",
          'H': "#87CEEB", 'I': "#DEB887", 'L': "#D2B48C", 'K': "#FF69B4",
          'M': "#F4A460", 'F': "#FFA07A", 'P': "#20B2AA", 'S': "#87CEFA",
          'T': "#98F5FF", 'W': "#CD853F", 'Y': "#DAA520", 'V': "#BC8F8F"
        };
      default:
        return {};
    }
  };

  const colors = getColorScheme(alphabet);
  const nucleotideWidth = compactView ? 16 : 24;
  const nucleotideHeight = compactView ? 20 : 28;
  const spacing = compactView ? 2 : 4;
  const fontSize = compactView ? 10 : 14;
  
  // Calculate how many nucleotides fit in the available width
  const nucleotidesPerLine = Math.floor(containerWidth / (nucleotideWidth + spacing));
  const lineBreak = Math.max(10, nucleotidesPerLine); // Minimum 10 nucleotides per line

  let svgElements: JSX.Element[] = [];
  let line = 0;

  // Add position indicators
  const addPositionIndicators = () => {
    const indicators: JSX.Element[] = [];
    for (let i = 0; i < sequence.length; i += 10) {
      if (i % lineBreak === 0 && i !== 0) continue; // Skip line breaks
      
      const x = (i % lineBreak) * (nucleotideWidth + spacing);
      const y = Math.floor(i / lineBreak) * (nucleotideHeight + spacing + 20);
      
      indicators.push(
        <text
          key={`pos-${i}`}
          x={x + nucleotideWidth / 2}
          y={y - 5}
          fontSize={10}
          textAnchor="middle"
          fill="#666"
        >
          {i + 1}
        </text>
      );
    }
    return indicators;
  };

  // Generate nucleotide elements
  for (let i = 0; i < sequence.length; i++) {
    let x = (i % lineBreak) * (nucleotideWidth + spacing);
    let y = line * (nucleotideHeight + spacing + (showIndexes ? 20 : 0));
    if (i % lineBreak === 0 && i !== 0) line++;

    let nucleotide = sequence[i].toUpperCase();
    let color = colors[nucleotide] || "#E5E5E5";
    
    // Add subtle shadow and better styling
    svgElements.push(
      <g key={i}>
        {/* Shadow */}
        <rect 
          x={x + 2} 
          y={y + 2} 
          width={nucleotideWidth} 
          height={nucleotideHeight}
          rx={4} 
          ry={4} 
          fill="rgba(0,0,0,0.1)" 
        />
        {/* Main rectangle */}
        <rect 
          x={x} 
          y={y} 
          width={nucleotideWidth} 
          height={nucleotideHeight}
          rx={4} 
          ry={4} 
          fill={color} 
          stroke="rgba(0,0,0,0.2)" 
          strokeWidth={0.5}
          style={{
            filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.1))'
          }}
        />
        {/* Text */}
        <text 
          x={x + nucleotideWidth / 2} 
          y={y + nucleotideHeight / 2 + fontSize / 3}
          fontSize={fontSize} 
          textAnchor="middle" 
          fill="rgba(0,0,0,0.8)"
          fontWeight="600"
          fontFamily="monospace"
        >
          {nucleotide}
        </text>
        {/* Position indicator on hover */}
        {showIndexes && (i + 1) % 5 === 0 && (
          <text
            x={x + nucleotideWidth / 2}
            y={y + nucleotideHeight + 12}
            fontSize={8}
            textAnchor="middle"
            fill="#999"
          >
            {i + 1}
          </text>
        )}
      </g>
    );
  }

  let svgWidth = containerWidth;
  let svgHeight = (line + 1) * (nucleotideHeight + spacing + (showIndexes ? 20 : 0)) + (showIndexes ? 20 : 0);

  // Create legend for color scheme
  const createLegend = () => {
    const uniqueNucleotides = [...new Set(sequence.toUpperCase().split(''))].sort();
    return (
      <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 2 }}>
        {uniqueNucleotides.map(nucleotide => (
          <Box key={nucleotide} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: colors[nucleotide] || "#E5E5E5",
                borderRadius: 0.5,
                border: '1px solid rgba(0,0,0,0.2)'
              }}
            />
            <Typography variant="caption" fontFamily="monospace" fontWeight="600">
              {nucleotide}
            </Typography>
          </Box>
        ))}
      </Stack>
    );
  };

  return (
    <Box>
      {/* Controls */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }} flexWrap="wrap">
        <FormControlLabel
          control={
            <Switch
              checked={showIndexes}
              onChange={(e) => setShowIndexes(e.target.checked)}
              size="small"
            />
          }
          label="Show positions"
        />
        <FormControlLabel
          control={
            <Switch
              checked={compactView}
              onChange={(e) => setCompactView(e.target.checked)}
              size="small"
            />
          }
          label="Compact view"
        />
      </Stack>

      {/* Legend */}
      {createLegend()}

      {/* Sequence Visualization */}
      <Box 
        ref={containerRef}
        sx={{ 
          border: '1px solid', 
          borderColor: 'divider',
          borderRadius: 1,
          p: 2,
          backgroundColor: 'background.default',
          overflow: 'auto',
          width: '100%'
        }}
      >
        {sequence.length > 0 ? (
          <svg 
            width={svgWidth} 
            height={svgHeight} 
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block' }}
          >
            {showIndexes && addPositionIndicators()}
            {svgElements}
          </svg>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No sequence data to display
          </Typography>
        )}
      </Box>

      {/* Sequence Stats */}
      <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="caption" color="text.secondary">
          Length: {sequence.length.toLocaleString()} {alphabet.toLowerCase() === 'protein' ? 'amino acids' : 'nucleotides'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Type: {alphabet.toUpperCase()}
        </Typography>
      </Box>
    </Box>
  );
};
