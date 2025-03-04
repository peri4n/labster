import { DataGrid, GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import { Button, CardContent, CardHeader, Paper, Typography } from '@mui/material'
import { useState } from 'react'
import type { Sequence } from "~/models/sequence";
import AddDialog from '../components/add-dialog';
import type { Route } from './+types/SequenceListPage';
import { NavLink, useFetcher } from 'react-router';

export async function clientLoader() {
  const response = await fetch('http://localhost:3000/sequences')
  const result: Sequence[] = await response.json();
  return { sequences: result };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  console.log('add sequence');
  await fetch('http://localhost:3000/sequences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ identifier: "foo", description: "bar",  sequence: "aorisntaorisnet" })
  });
}

export function SequenceListPage({ loaderData }: Route.ComponentProps) {
  let [addDialogVisible, setAddDialogVisible] = useState(false);
  let fetcher = useFetcher();

  function showAddDialog() {
    setAddDialogVisible(true)
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

          <NavLink to={`/sequences/${row.id}`}>Details</NavLink>,
          <GridActionsCellItem
            icon={<Typography>Delete</Typography>}
            label="Delete"
            onClick={() => fetcher.submit({ id: row.id }, { method: "delete", action: `/sequences/${row.id}`, encType: 'application/json' })}
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
            rows={loaderData.sequences}
            columns={columns}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            getRowId={(row) => row.id}
            sx={{ border: 0 }}
          />
        </CardContent>
      </Paper>
      <AddDialog open={addDialogVisible} handleClose={() => setAddDialogVisible(false)} />
    </>
  )
}

export default SequenceListPage
