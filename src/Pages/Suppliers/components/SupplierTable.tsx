import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton, Stack, Chip } from '@mui/material';
import { IconEdit } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Supplier } from 'src/utils/api/suppliersApi';

interface Props {
  rows: Supplier[];
  onEdit: (s: Supplier) => void;
}

const SupplierTable: React.FC<Props> = ({ rows, onEdit }) => {
  const { t } = useTranslation();

  const cols: GridColDef[] = [
    { field: 'name', headerName: t('suppliers.name'), flex: 1, minWidth: 200 },
    { field: 'phone', headerName: t('suppliers.phone'), flex: 0.8, minWidth: 150 },
    { field: 'address', headerName: t('suppliers.address'), flex: 1, minWidth: 200 },
    {
      field: 'createdOn',
      headerName: t('suppliers.created'),
      flex: 0.8,
      renderCell: ({ value }) => {
        if (!value) return '-';
        try {
          return new Date(value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });
        } catch (error) {
          return '-';
        }
      },
    },
    { 
      field: 'isActive', 
      headerName: t('suppliers.status'), 
      width: 110,
      renderCell: (p) => (
        <Chip
          label={p.value ? t('suppliers.active') : t('suppliers.inactive')}
          color={p.value ? 'success' : 'default'}
          size="small"
        />
      )
    },
    {
      field: 'actions', 
      headerName: '', 
      width: 110, 
      sortable: false, 
      filterable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1}>
          <IconButton size="small" onClick={() => onEdit(row)}>
            <IconEdit size={18} />
          </IconButton>
        </Stack>
      )
    }
  ];

  return (
    <DataGrid
      rows={rows}
      columns={cols}
      getRowId={(row) => row.id}
      autoHeight
      disableRowSelectionOnClick
      sx={{ mb: 2 }}
    />
  );
};

export default SupplierTable;
