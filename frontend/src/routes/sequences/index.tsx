import { DataGrid, GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import { Button, Card, CardContent, CardHeader, Chip } from '@mui/material'
import { useState } from 'react'
import type { Sequence } from "@models/sequence";
import AddDialog from '@components/add-dialog';
import { DeleteOutline, Search } from '@mui/icons-material';
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import IndeterminateProgress from '@components/indeterminate-progress';


function renderAplhabetCell(alphabet: string) {
  switch (alphabet) {
    case 'dna': return (<Chip label="DNA" color="primary" />)
    case 'rna': return (<Chip label="RNA" color="error" />)
    case 'protein': return (<Chip label="Protein" color="info" />)
  }
}

function SequenceListPage() {
  let [addDialogVisible, setAddDialogVisible] = useState(false);
  const { sequences } = Route.useLoaderData()
  let navigate = useNavigate();
  let router = useRouter();

  function showAddDialog() {
    setAddDialogVisible(true)
  }

  const deleteSequence = useMutation({
    mutationFn: async (id) => {
      await fetch(`http://localhost:3000/sequences/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        },
      });
    },
    onSuccess: () => {
      router.invalidate({ filter: (match) => match.routeId === '/sequences/' });
    }
  })

  const columns: GridColDef[] = [
    { field: 'identifier', headerName: 'Identifier', width: 130 },
    { field: 'alphabet', headerName: 'Alphabet', width: 100, renderCell: (params) => renderAplhabetCell(params.value) },
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'sequence', headerName: 'Sequence', flex: 1 },
    { field: 'length', headerName: 'Length', width: 100, valueGetter: (_, row: Sequence) => row.sequence.length },
    { field: 'created_at', headerName: 'Created at', width: 200, renderCell: (params) => new Date(params.value).toLocaleString() },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ row }) => {
        return [
          <GridActionsCellItem
            icon={<Search />}
            label="Details"
            onClick={() => navigate({ to: `/sequences/$sequenceId`, params: { sequenceId: row.id } })}
            color="inherit"
            disableRipple
          />,
          <GridActionsCellItem
            icon={<DeleteOutline />}
            label="Delete"
            onClick={() => deleteSequence.mutate(row.id)}
            color="inherit"
            disableRipple
          />,
        ];
      }
    }
  ];

  return (
    <>
      <Card variant="outlined">
        <CardHeader title="Sequences" action={<Button variant="contained" color="primary" onClick={showAddDialog} disableElevation>Add Sequence</Button>} />
        <CardContent>
            <DataGrid
              rows={sequences}
              columns={columns}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              getRowId={(row) => row.id}
              sx={{ border: 0 }}
            />
        </CardContent>
      </Card>
      <AddDialog open={addDialogVisible} handleClose={() => setAddDialogVisible(false)} />
    </>
  )
}

export const Route = createFileRoute('/sequences/')({
  loader: async () => {
    const response = await fetch('http://localhost:3000/sequences')
    const result: Sequence[] = await response.json();
    return { sequences: result };
  },
  component: SequenceListPage,
  pendingComponent: () => <IndeterminateProgress />
})
