import React from 'react';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams
} from '@mui/x-data-grid';
import { Avatar, Stack, IconButton } from '@mui/material';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import { Product } from './types';
import { StatusPill } from './StatusPill';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'src/store/Store';
import { deleteProduct } from 'src/store/slices/productsSlice';

interface Props {
  rows: Product[];
}

export const ProductTable: React.FC<Props> = ({ rows }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const columns: GridColDef<Product>[] = [
    { field: 'sku', headerName: 'SKU', width: 90 },
    {
      field: 'name',
      headerName: t('products.name'),
      flex: 1,
      minWidth: 200,
      renderCell: ({ row }: GridRenderCellParams<Product>) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar
            src={row.img}
            variant="rounded"
            sx={{ width: 32, height: 32 }}
          />
          {row.name}
        </Stack>
      )
    },
    { field: 'category', headerName: t('products.category'), flex: 0.6, minWidth: 120 },
    { field: 'brand', headerName: t('products.brand'), flex: 0.6, minWidth: 120 },
    {
      field: 'price',
      headerName: t('products.price'),
      flex: 0.5,
      minWidth: 100,
      valueFormatter: ({ value }) => `$${value}`
    },
    { field: 'unit', headerName: t('products.unit'), width: 70 },
    { field: 'qty', headerName: t('products.qty'), width: 80 },
    {
      field: 'createdBy',
      headerName: t('products.createdBy'),
      flex: 0.8,
      minWidth: 150,
      renderCell: ({ value }) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar src={value.avatar} sx={{ width: 26, height: 26 }} />
          {value.name}
        </Stack>
      ),
      sortable: false,
      filterable: false
    },
    {
      field: 'status',
      headerName: t('products.status.label'),
      width: 110,
      renderCell: (params) => <StatusPill status={params.value} />
    },
    {
      field: 'actions',
      headerName: '',
      width: 110,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton
            size="small"
            component={RouterLink}
            to={`/inventory/products/${row.id}`}
          >
            <IconEye size={18} />
          </IconButton>
          <IconButton
            size="small"
            component={RouterLink}
            to={`/inventory/products/${row.id}/edit`}
          >
            <IconEdit size={18} />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => dispatch(deleteProduct(row.id))}
          >
            <IconTrash size={18} />
          </IconButton>
        </Stack>
      )
    }
  ];

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      autoHeight
      sx={{ width: '100%' }}
      checkboxSelection
      disableRowSelectionOnClick
      initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
      pageSizeOptions={[10, 25, 50]}
    />
  );
};
