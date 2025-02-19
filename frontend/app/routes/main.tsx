import { DataGrid, GridActionsCellItem, type GridColDef, type GridRowId } from '@mui/x-data-grid';
import { Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import { useState } from 'react'

import type { Route } from "./+types/add-dialog";
import AddDialog from '../components/add-dialog';

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

export type Sequence = {
  id: number;
  identifier: string;
  description: string;
  sequence: string;
}

export function Main({ loaderData }: Route.ComponentProps) {
  let [sequences, setSequences] = useState<Sequence[]>(loaderData);
  let [addDialogVisible, setAddDialogVisible] = useState(false);

  function showAddDialog() {
    setAddDialogVisible(true)
  }

  function addSequence(sequence: Sequence) {
    setSequences([...sequences, sequence])
  }

  function removeSequenceWithId(id: GridRowId) {
    setSequences(sequences.filter(s => s.id != id))
  }

  async function handleDeleteClick(id: GridRowId) {
    const response = await fetch(`http://localhost:3000/sequences/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    removeSequenceWithId(id)
  }

  const columns: GridColDef[] = [
    { field: 'identifier', headerName: 'Identifier', width: 130 },
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'sequence', headerName: 'Sequence', flex: 1 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ row }) => {

        return [
          <GridActionsCellItem
            icon={<Typography>Delete</Typography>}
            label="Delete"
            onClick={() => handleDeleteClick(row.id)}
            color="inherit"
          />,
        ];
      }
    }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Card variant="outlined">
        <CardContent>
          <DataGrid
            rows={sequences}
            columns={columns}
            initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            getRowId={(row) => row.identifier}
            sx={{ border: 0 }}
          />
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" onClick={showAddDialog} disableElevation={true}>
            Add Sequence
          </Button>
        </CardActions>
      </Card>
      <AddDialog open={addDialogVisible} handleClose={() => setAddDialogVisible(false)} addSequence={addSequence} />
    </Box>
  )
}

export default Main
