import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Card from '@mui/material/Card'
import { Box, Button, CardActions, CardContent, TextField } from '@mui/material'
import { useState } from 'react'

import type { Route } from "./+types/add-dialog";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Labster" },
    { name: "description", content: "Welcome to Labster!" },
  ];
}

export async function clientLoader() {
  const response = await fetch('http://localhost:3000/sequences')
  const result: Promise<Sequence[]> = response.json();
  return result;
}

type Sequence = {
  identifier: string;
  description: string;
  sequence: string;
}

export function AddDialog({ loaderData }: Route.ComponentProps) {
  let [sequences, setSequences] = useState<Sequence[]>(loaderData);
  let [sequence, setSequence] = useState('');
  let [identifier, setIdentifier] = useState('');

  const columns: GridColDef[] = [
    { field: 'identifier', headerName: 'Identifier', width: 130 },
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'sequence', headerName: 'Sequence', flex: 1 },
  ];

  async function addSequence(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    await fetch('http://localhost:3000/sequences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ identifier, description: '', sequence })
    });
    setSequences([...sequences, { identifier, description: '', sequence }]);
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
          getRowId={(row) => row.identifier}
          sx={{ border: 0 }}
        />
      </Card>
    </Box>
  )
}

export default AddDialog
