import { Box, Card, CardContent, CardHeader, Typography, Chip, Divider, Stack, IconButton, Tooltip, Collapse, TextField, InputAdornment } from "@mui/material";
import { ContentCopy, Timeline, Info, ExpandMore, ExpandLess, Search } from "@mui/icons-material";
import { DNAVisualizer } from "@components/dna-visualizer";
import { createFileRoute } from "@tanstack/react-router";
import type { Sequence } from "@models/sequence";
import { useState } from "react";

export function SequenceDetailsPage() {
  const sequenceData = Route.useLoaderData();
  const { id, identifier, description, sequence, alphabet, created_at } = sequenceData;
  const [copySuccess, setCopySuccess] = useState(false);
  const [rawSequenceExpanded, setRawSequenceExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCopySequence = async () => {
    try {
      await navigator.clipboard.writeText(sequence);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy sequence:', err);
    }
  };

  const getAlphabetChip = (type: string) => {
    switch (type.toLowerCase()) {
      case 'dna': return <Chip label="DNA" color="primary" size="medium" variant="filled"/>;
      case 'rna': return <Chip label="RNA" color="error" size="medium" variant="filled"/>;
      case 'protein': return <Chip label="Protein" color="info" size="medium"variant="filled" />;
      default: return <Chip label={type.toUpperCase()} color="default" size="medium" variant="filled"/>;
    }
  };

  const getSequenceStats = () => {
    const length = sequence.length;
    const composition: Record<string, number> = {};
    
    for (const nucleotide of sequence.toUpperCase()) {
      composition[nucleotide] = (composition[nucleotide] || 0) + 1;
    }

    return { length, composition };
  };

  const { length, composition } = getSequenceStats();

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      {/* Header Section with Dominant Identifier */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            color: 'primary.main',
            wordBreak: 'break-word'
          }}
        >
          {identifier}
        </Typography>
      </Box>

      <Stack spacing={3}>
        {/* Details Section */}
        <Card variant="outlined">
          <CardHeader 
            title="Sequence Details"
            slotProps={{ title: { variant: 'h5', color: 'primary.main' } }}
            avatar={<Info color="primary" />}
            sx={{ pb: 1 }}
          />
          <CardContent>
            {/* Basic Information Row */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  ID:
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {id}
                </Typography>
              </Box>
              
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Type:
                </Typography>
                {getAlphabetChip(alphabet)}
              </Box>
              
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Created:
                </Typography>
                <Typography variant="body1">
                  {new Date(created_at).toLocaleDateString()}
                </Typography>
              </Box>
              
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Length:
                </Typography>
                <Typography variant="h6" color="primary.main">
                  {length.toLocaleString()} {alphabet.toLowerCase() === 'protein' ? 'amino acids' : 'nucleotides'}
                </Typography>
              </Box>
            </Box>

            {/* Description Section */}
            <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Description:
              </Typography>
              <Typography variant="body1" sx={{ minHeight: '1.5em', flex: 1 }}>
                {description || 'No description provided'}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Composition
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(6, 1fr)' },
                gap: 2,
                mt: 1
              }}>
                {Object.entries(composition)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([nucleotide, count]) => (
                    <Box key={nucleotide} sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" fontWeight="bold" color="primary.main">
                        {nucleotide}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {count}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({((count / length) * 100).toFixed(1)}%)
                      </Typography>
                    </Box>
                  ))}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Sequence Visualization Section */}
        <Box>
          <Card variant="outlined">
            <CardHeader 
              title="Sequence Visualization"
              slotProps={{ title: { variant: 'h5', color: 'primary.main' } }}
              avatar={<Timeline color="primary" fontSize="large"/>}
              action={
                <TextField
                  size="small"
                  placeholder="Search sequence..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ minWidth: 200 }}
                />
              }
              sx={{ pb: 1 }}
            />
            <CardContent>
              <DNAVisualizer sequence={sequence} alphabet={alphabet} search={searchQuery ? { query: searchQuery } : undefined} />
              
              {/* Raw Sequence Text - Collapsible */}
              <Box sx={{ mt: 2 }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'action.hover' },
                    borderRadius: 1,
                    p: 1,
                    ml: -1
                  }}
                  onClick={() => setRawSequenceExpanded(!rawSequenceExpanded)}
                >
                  <IconButton size="small" sx={{ mr: 1 }}>
                    {rawSequenceExpanded ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                  <Typography variant="subtitle2" color="text.secondary">
                    Raw Sequence
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    ({rawSequenceExpanded ? 'Click to collapse' : 'Click to expand'})
                  </Typography>
                  <Tooltip title={copySuccess ? "Copied!" : "Copy sequence to clipboard"}>
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); handleCopySequence(); }}
                      color={copySuccess ? "success" : "default"}
                      sx={{ ml: 'auto' }}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                <Collapse in={rawSequenceExpanded}>
                  <Box sx={{ mt: 1 }}>
                    <Typography 
                      variant="body2" 
                      component="pre"
                      sx={{ 
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        backgroundColor: 'grey.50',
                        p: 2,
                        borderRadius: 1,
                        maxHeight: '200px',
                        overflow: 'auto',
                        wordBreak: 'break-all',
                        whiteSpace: 'pre-wrap',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      {sequence}
                    </Typography>
                  </Box>
                </Collapse>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
}

export const Route = createFileRoute('/sequences/$sequenceId')({
  component: SequenceDetailsPage,
  loader: async ({ params }) => {
    const response = await fetch('http://localhost:3000/sequences/' + params.sequenceId)
    const result: Sequence = await response.json();
    return { ...result };
  }
})
