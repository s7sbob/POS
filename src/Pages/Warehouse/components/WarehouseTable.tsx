import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton, Stack } from '@mui/material';
import { IconEdit } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { StatusPill } from './StatusPill';
import { Warehouse } from 'src/utils/warehousesApi';

interface Props {
  rows: Warehouse[];
  onEdit: (w: Warehouse) => void;
  onDelete: (id: string) => void;
}

const WarehouseTable: React.FC<Props> = ({ rows, onEdit }) => {
  const { t } = useTranslation();

const cols: GridColDef<Warehouse>[] = [
  { field: 'code',  headerName: 'Code', width: 80 },
  { field: 'name',  headerName: t('warehouses.name'), flex: 1, minWidth: 180 },
  { field: 'address', headerName: t('warehouses.address'), flex: 1 },
  { field: 'createdOn', headerName: t('warehouses.created'), flex: .8,
    valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
  { field: 'isActive', headerName: t('warehouses.status'), width: 110,
    renderCell: (p) => <StatusPill status={p.value ? 'active' : 'inactive'} /> },
  {
    field: 'actions', headerName: '', width: 110, sortable: false, filterable: false,
    renderCell: ({ row }) => (
      <Stack direction="row" spacing={0.5}>
        <IconButton size="small" onClick={() => onEdit(row)}><IconEdit size={18} /></IconButton>
        {/* لا يوجد حذف فى الـ API حالياً */}
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
