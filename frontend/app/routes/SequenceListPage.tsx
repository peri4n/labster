import { DataGrid, GridActionsCellItem, type GridColDef, type GridRowId } from '@mui/x-data-grid';
import { Button, CardContent, CardHeader, Container, Paper, Typography } from '@mui/material'
import { useState } from 'react'
import type { Sequence } from "~/models/sequence";
import AddDialog from '../components/add-dialog';
import type { Route } from './+types/SequenceListPage';
import { NavLink } from 'react-router';

export async function clientLoader() {
  const response = await fetch('http://localhost:3000/sequences')
  const result: Sequence[] = await response.json();
  return { sequences: result };
}

export function SequenceListPage({ loaderData }: Route.ComponentProps) {
  let [sequences, setSequences] = useState<Sequence[]>(loaderData.sequences);
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
    await fetch(`http://localhost:3000/sequences/${id}`, {
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
          <NavLink to="/sequences/1">Details</NavLink>,
          <GridActionsCellItem
            icon={<Typography>Delete</Typography>}
            label="Delete"
            onClick={() => handleDeleteClick(row.id)}
            color="inherit"
            disableRipple
          />,
        ];
      }
    }
  ];

  return (
    <>
      <Paper variant="outlined">
        <CardHeader title="Sequences" action={<Button variant="contained" color="primary" onClick={showAddDialog} disableElevation>Add Sequence</Button>} />
        <CardContent>
          <DataGrid
            rows={sequences}
            columns={columns}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            getRowId={(row) => row.identifier}
            sx={{ border: 0 }}
          />
        </CardContent>
      </Paper>
      <AddDialog open={addDialogVisible} handleClose={() => setAddDialogVisible(false)} addSequence={addSequence} />
    </>
  )
}

export default SequenceListPage
