// File: src/pages/safes/components/SafesTable.tsx
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton, Stack, Chip } from '@mui/material';
import { IconEdit } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Safe } from 'src/utils/api/pagesApi/safesApi';

interface Props {
  rows: Safe[];
  onEdit: (safe: Safe) => void;
}

const SafesTable: React.FC<Props> = ({ rows, onEdit }) => {
  const { t } = useTranslation();

  const cols: GridColDef<Safe>[] = [
    { field: 'name', headerName: t('safes.name'), flex: 1, minWidth: 180 },
    { 
      field: 'typeName', 
      headerName: t('safes.type'), 
      flex: 0.8,
      renderCell: ({ value }) => (
        <Chip 
          label={t(`safes.types.${value.toLowerCase()}`)} 
          color="primary" 
          variant="outlined" 
          size="small" 
        />
      )
    },
    { field: 'accountNumber', headerName: t('safes.accountNumber'), flex: 1,
      renderCell: ({ value }) => value || '-' },
    { 
      field: 'collectionFeePercent', 
      headerName: t('safes.collectionFeePercent'), 
      flex: 0.8,
      renderCell: ({ value }) => `${value}%`
    },
    { 
      field: 'isActive', 
      headerName: t('safes.status'), 
      width: 110,
      renderCell: ({ value }) => (
        <Chip 
          label={value ? t('safes.active') : t('safes.inactive')} 
          color={value ? 'success' : 'default'} 
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
        <Stack direction="row" spacing={0.5}>
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
      autoHeight
      disableRowSelectionOnClick
      pageSizeOptions={[10, 25]}
      initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
    />
  );
};

export default SafesTable;
