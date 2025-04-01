import { DataGrid, GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import { Card, CardContent, CardHeader, Chip } from '@mui/material'
import { useState } from 'react'
import type { Sequence } from "@models/sequence";
import { DeleteOutline, Search } from '@mui/icons-material';
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import IndeterminateProgress from '@components/indeterminate-progress';
import ActionsSpeedDial from '@components/action-speed-dial';
import ConfirmationDialog from '@components/confirmation-dialog';

function renderAplhabetCell(alphabet: string) {
  switch (alphabet) {
    case 'dna': return (<Chip label="DNA" color="primary" />)
    case 'rna': return (<Chip label="RNA" color="error" />)
    case 'protein': return (<Chip label="Protein" color="info" />)
  }
}

function SequenceListPage() {
  let navigate = useNavigate();
  let queryClient = useQueryClient();

  let [confirmationDialogVisible, setConfirmationDialogVisible] = useState(false);
  let [clickedRow, setClickedRow] = useState(null);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const { isLoading, data } = useQuery({
    queryKey: ['fetch-sequences', paginationModel],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/sequences?page=${paginationModel.page}&per_page=${paginationModel.pageSize}`)
      const result: Sequence[] = await response.json();
      return result
    },
  })

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
      queryClient.invalidateQueries({
        queryKey: ['fetch-sequences']
      })
    }
  })

  function handleDeleteSequence() {
    if (clickedRow) {
      setConfirmationDialogVisible(false)
      setClickedRow(null)
      deleteSequence.mutate(clickedRow)
    }
  }

  const columns: GridColDef[] = [
    { field: 'identifier', headerName: 'Identifier', width: 130 },
    { field: 'alphabet', headerName: 'Alphabet', width: 100, renderCell: (params) => renderAplhabetCell(params.value) },
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'sequence', headerName: 'Sequence', flex: 1, filterable: false },
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
            onClick={() => {
              setConfirmationDialogVisible(true)
              setClickedRow(row.id)
            }}
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
        <CardHeader title="Sequences" action={<ActionsSpeedDial />} sx={{ pr: 3 }} />
        <CardContent>
          <DataGrid
            rows={data}
            columns={columns}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            getRowId={(row) => row.id}
            loading={isLoading}
            rowCount={-1}
            sx={{ border: 0 }}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </CardContent>
      </Card>
      <ConfirmationDialog open={confirmationDialogVisible} title={"Delete"} question={"Are you sure you want to delete the sequence?"} onConfirm={handleDeleteSequence} onClose={() => setConfirmationDialogVisible(false)} />
    </>
  )
}

export const Route = createFileRoute('/sequences/')({
  component: SequenceListPage,
  pendingComponent: () => <IndeterminateProgress />
})
