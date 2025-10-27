import { Card, CardContent, CardHeader, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Checkbox, TablePagination, Skeleton } from '@mui/material'
import { useState } from 'react'
import type { Collection } from "@models/collection";
import { DeleteOutline } from '@mui/icons-material';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ConfirmationDialog from '@components/confirmation-dialog';

function renderAlphabetCell(alphabet: string) {
  switch (alphabet) {
    case 'dna': return (<Chip label="DNA" color="primary" />)
    case 'rna': return (<Chip label="RNA" color="error" />)
    case 'protein': return (<Chip label="Protein" color="info" />)
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
      <TableCell><Skeleton width="60%" /></TableCell>
      <TableCell><Skeleton width="60%" /></TableCell>
      <TableCell>
        <Skeleton variant="circular" width={24} height={24} sx={{ display: 'inline-block' }} />
      </TableCell>
    </TableRow>
  );
}

function CollectionListPage() {
  let navigate = useNavigate();
  let queryClient = useQueryClient();

  let [confirmationDialogVisible, setConfirmationDialogVisible] = useState(false);
  let [clickedRow, setClickedRow] = useState<number | null>(null);
  let [selected, setSelected] = useState<number[]>([]);

  console.log("Rendering CollectionListPage");

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });

  const { isLoading, data } = useQuery({
    queryKey: ['fetch-collections', paginationModel],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/collections?page=${paginationModel.page}&per_page=${paginationModel.pageSize}`)
      const result: Collection[] = await response.json();
      return result
    },
  })

  const deleteCollection = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`http://localhost:3000/collections/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['fetch-collections']
      })
    }
  })

  function handleDeleteCollection() {
    if (clickedRow) {
      setConfirmationDialogVisible(false)
      setClickedRow(null)
      deleteCollection.mutate(clickedRow)
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
        <CardHeader title="Collections" sx={{ pr: 3 }} />
        <CardContent>
          <TableContainer>
            <Table sx={{ border: 0 }}>
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
                  <TableCell>Name</TableCell>
                  <TableCell>Alphabet</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Created at</TableCell>
                  <TableCell>Last Modified</TableCell>
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
                        onClick={() => navigate({ to: `/collections/${row.id}` })}
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
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{renderAlphabetCell(row.alphabet)}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell>{new Date(row.created_at).toLocaleString()}</TableCell>
                        <TableCell>{new Date(row.last_modified).toLocaleString()}</TableCell>
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
      <ConfirmationDialog open={confirmationDialogVisible} title={"Delete"} question={"Are you sure you want to delete the collection?"} onConfirm={handleDeleteCollection} onClose={() => setConfirmationDialogVisible(false)} />
    </>
  )
}

export const Route = createFileRoute('/collections/')({
  component: CollectionListPage,
})
