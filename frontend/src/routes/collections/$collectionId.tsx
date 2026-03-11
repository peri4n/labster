import { Card, CardContent, CardHeader, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Typography, IconButton, TablePagination, Skeleton } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Collection } from "@models/collection";
import { apiClient } from '@api/client';
import { useState } from "react";

function renderAlphabetCell(alphabet: string) {
  switch (alphabet) {
    case 'dna': return (<Chip label="DNA" color="primary" />);
    case 'rna': return (<Chip label="RNA" color="error" />);
    case 'protein': return (<Chip label="Protein" color="info" />);
  }
}

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell><Skeleton width="80%" /></TableCell>
      <TableCell><Skeleton width={60} height={32} /></TableCell>
      <TableCell><Skeleton width="90%" /></TableCell>
      <TableCell><Skeleton width="70%" /></TableCell>
      <TableCell><Skeleton width={40} /></TableCell>
      <TableCell><Skeleton width="60%" /></TableCell>
      <TableCell>
        <Skeleton variant="circular" width={24} height={24} sx={{ display: 'inline-block' }} />
      </TableCell>
    </TableRow>
  );
}

function CollectionDetailsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { collection } = Route.useLoaderData() as { collection: Collection };

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });

  const { isLoading, data } = useQuery({
    queryKey: ['fetch-collection-sequences', collection.id, paginationModel],
    queryFn: () => apiClient.getCollectionSequences(collection.id, paginationModel.page, paginationModel.pageSize),
  });

  const deleteSequence = useMutation({
    mutationFn: (id: number) => apiClient.deleteSequence(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetch-collection-sequences', collection.id] });
    }
  });

  const rowCount = data?.length || 0;

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, color: 'primary.main', wordBreak: 'break-word' }}>
          {collection.name}
        </Typography>
        {collection.description && (
          <Typography variant="body1" sx={{ mt: 1 }}>
            {collection.description}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Created {new Date(collection.created_at as unknown as string).toLocaleString()} • Last modified {new Date(collection.last_modified as unknown as string).toLocaleString()}
        </Typography>
      </Box>

      <Card variant="outlined">
        <CardHeader title="Sequences in this collection" />
        <CardContent>
          <TableContainer>
            <Table sx={{ border: 0 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Identifier</TableCell>
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
                ) : rowCount === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary">No sequences in this collection</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  data!.map((row) => (
                    <TableRow
                      key={row.id}
                      hover
                      onClick={() => navigate({ to: `/sequences/$sequenceId`, params: { sequenceId: row.id.toString() } })}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{row.identifier}</TableCell>
                      <TableCell>{renderAlphabetCell(row.alphabet)}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {row.sequence}
                      </TableCell>
                      <TableCell>{row.sequence.length}</TableCell>
                      <TableCell>{new Date(row.created_at as unknown as string).toLocaleString()}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <IconButton size="small" onClick={() => deleteSequence.mutate(row.id)} color="inherit">
                          <DeleteOutline />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
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
    </Box>
  );
}

export const Route = createFileRoute('/collections/$collectionId')({
  component: CollectionDetailsPage,
  loader: async ({ params }) => {
    const collection = await apiClient.getCollection(params.collectionId);
    return { collection };
  }
})
