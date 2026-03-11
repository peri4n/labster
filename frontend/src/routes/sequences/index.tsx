import { Card, CardContent, CardHeader, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Checkbox, TablePagination, Skeleton, Paper } from '@mui/material'
import { useState } from 'react'
import { DeleteOutline } from '@mui/icons-material';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AddSequenceDropdown from '@components/add-sequence-dropdown';
import ConfirmationDialog from '@components/confirmation-dialog';
import { apiClient } from '@api/client';

function renderAplhabetCell(alphabet: string) {
  switch (alphabet) {
    case 'dna': return (<Chip label="DNA" color="primary" variant="outlined" size="small"/>)
    case 'rna': return (<Chip label="RNA" color="warning" variant="outlined" size="small"/>)
    case 'protein': return (<Chip label="Protein" color="info" variant="outlined" size="small"/>)
  }
}

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell padding="checkbox">
        <Skeleton variant="rectangular" width={20} height={20} />
      </TableCell>
      <TableCell><Skeleton width="80%" /></TableCell>
      <TableCell><Skeleton width={60} height={32} /></TableCell>
      <TableCell><Skeleton width="90%" /></TableCell>
      <TableCell><Skeleton width="70%" /></TableCell>
      <TableCell><Skeleton width={40} /></TableCell>
      <TableCell><Skeleton width="60%" /></TableCell>
      <TableCell>
        <Skeleton variant="circular" width={24} height={24} sx={{ display: 'inline-block', mr: 1 }} />
        <Skeleton variant="circular" width={24} height={24} sx={{ display: 'inline-block' }} />
      </TableCell>
    </TableRow>
  );
}

function SequenceListPage() {
  let navigate = useNavigate();
  let queryClient = useQueryClient();

  let [confirmationDialogVisible, setConfirmationDialogVisible] = useState(false);
  let [clickedRow, setClickedRow] = useState<number | null>(null);
  let [selected, setSelected] = useState<number[]>([]);

  console.log("Rendering SequenceListPage");

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });

  const { isLoading, data } = useQuery({
    queryKey: ['fetch-sequences', paginationModel],
    queryFn: () => apiClient.getSequences(paginationModel.page, paginationModel.pageSize),
  })

  const deleteSequence = useMutation({
    mutationFn: (id: number) => apiClient.deleteSequence(id),
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

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data?.map((row) => row.id) || [];
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleCheckboxClick = (id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const numSelected = selected.length;
  const rowCount = data?.length || 0;

  return (
    <>
      <Card variant="outlined">
        <CardHeader
          title="Sequences"
          action={<AddSequenceDropdown />}
          sx={{ pr: 3 }}
          slotProps={{ title: { variant: 'h5', color: 'primary.main' } }}
        />
        <CardContent>
          <TableContainer component={Paper}>
            <Table sx={{ border: 0 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={numSelected > 0 && numSelected < rowCount}
                      checked={rowCount > 0 && numSelected === rowCount}
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  <TableCell scope="row">Identifier</TableCell>
                  <TableCell>Alphabet</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Sequence</TableCell>
                  <TableCell>Length</TableCell>
                  <TableCell>Created at</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: paginationModel.pageSize }).map((_, index) => (
                    <SkeletonRow key={`skeleton-${index}`} />
                  ))
                ) : (
                  data?.map((row) => {
                    const isItemSelected = isSelected(row.id);
                    return (
                      <TableRow
                        key={row.id}
                        selected={isItemSelected}
                        onClick={() => navigate({ to: `/sequences/$sequenceId`, params: { sequenceId: row.id.toString() } })}
                        hover
                      >
                        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            onChange={() => {
                              handleCheckboxClick(row.id)
                            }}
                          />
                        </TableCell>
                        <TableCell>{row.identifier}</TableCell>
                        <TableCell>{renderAplhabetCell(row.alphabet)}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {row.sequence}
                        </TableCell>
                        <TableCell>{row.sequence.length}</TableCell>
                        <TableCell>{new Date(row.created_at).toLocaleString()}</TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setConfirmationDialogVisible(true)
                              setClickedRow(row.id)
                            }}
                            color="inherit"
                          >
                            <DeleteOutline />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={-1}
            page={paginationModel.page}
            onPageChange={(_, newPage) => setPaginationModel(prev => ({ ...prev, page: newPage }))}
            rowsPerPage={paginationModel.pageSize}
            onRowsPerPageChange={(event) => setPaginationModel(prev => ({ ...prev, pageSize: parseInt(event.target.value, 10), page: 0 }))}
            rowsPerPageOptions={[10, 20, 50]}
          />
        </CardContent>
      </Card>
      <ConfirmationDialog open={confirmationDialogVisible} title={"Delete"} question={"Are you sure you want to delete the sequence?"} onConfirm={handleDeleteSequence} onClose={() => setConfirmationDialogVisible(false)} />
    </>
  )
}

export const Route = createFileRoute('/sequences/')({
  component: SequenceListPage,
})
