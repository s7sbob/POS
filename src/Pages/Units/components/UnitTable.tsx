import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton, Stack } from '@mui/material';
import { IconEdit } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { StatusPill } from './StatusPill';
import { Unit } from 'src/utils/api/unitsApi';

interface Props {
  rows: Unit[];
  onEdit: (u: Unit) => void;
}

const UnitTable: React.FC<Props> = ({ rows, onEdit }) => {
  const { t } = useTranslation();

  const cols: GridColDef[] = [
    { field: 'name', headerName: t('units.name'), flex: 1, minWidth: 180 },
    {
      field: 'createdOn',
      headerName: t('units.created'),
      flex: .8,
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
      headerName: t('units.status'), 
      width: 110,
      renderCell: (p) => <StatusPill status={p.value ? 'active' : 'inactive'} />
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

export default UnitTable;
