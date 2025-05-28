import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton, Stack } from '@mui/material';
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import { Warehouse } from './types';
import { useTranslation } from 'react-i18next';
import { StatusPill } from './StatusPill';

interface Props {
  rows: Warehouse[];
  onEdit: (w: Warehouse) => void;
  onDelete: (id: string) => void;
}

const WarehouseTable: React.FC<Props> = ({ rows, onEdit, onDelete }) => {
  const { t } = useTranslation();

  const cols: GridColDef<Warehouse>[] = [
    { field: 'name', headerName: t('warehouses.name'), flex: 1, minWidth: 200 },
    { field: 'phone', headerName: t('warehouses.phone'), flex: 0.8 },
    { field: 'totalProducts', headerName: t('warehouses.totalProducts'), flex: 0.5,
      valueGetter: () => Math.floor(Math.random() * 25) + 5 }, // demo
    { field: 'qty', headerName: t('warehouses.qty'), flex: 0.4,
      valueGetter: () => Math.floor(Math.random() * 100) + 50 }, // demo
    { field: 'createdOn', headerName: t('warehouses.created'), flex: 0.8,
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
    { field: 'status', headerName: t('warehouses.status'), width: 110,
      renderCell: (p) => <StatusPill status={p.value} /> },
    {
      field: 'actions',
      headerName: '',
      width: 110,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton size="small"><IconEye size={18} /></IconButton>
          <IconButton size="small" onClick={() => onEdit(row)}>
            <IconEdit size={18} />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(row.id)}
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
      columns={cols}
      autoHeight
      disableRowSelectionOnClick
      pageSizeOptions={[10, 25]}
      initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
    />
  );
};

export default WarehouseTable;
