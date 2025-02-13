import './App.css'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Card from '@mui/material/Card'
import { Box, Button, CardActions, CardContent, CardHeader, TextField, Typography } from '@mui/material'
import { useState } from 'react'

type Sequence = {
  id: number;
  identifier: string;
  sequence: string;
}

function App() {

  let [sequences, setSequences] = useState<Sequence[]>([]);
  let [sequence, setSequence] = useState('');
  let [identifier, setIdentifier] = useState('');

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'identifier', headerName: 'Identifier', width: 130 },
    { field: 'sequence', headerName: 'Sequence', flex: 1 },
  ];

  function addSequence(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    setSequences([...sequences, { id: (sequences.length + 1), identifier, sequence }]);
    setSequence('');
    setIdentifier('');
  }


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Card variant="outlined">
        <>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                required
                id="outlined-required"
                label="Identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
              <TextField fullWidth label="Sequence" id="fullWidth"
                value={sequence}
                onChange={(e) => setSequence(e.target.value)}
              />
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button size="small" variant="outlined" onClick={addSequence}>Add Sequence</Button>
          </CardActions>
        </>
      </Card>
      <Card variant="outlined" sx={{ height: 400 }}>
        <DataGrid
          rows={sequences}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Card>
    </Box>
  )
}

export default App
