// File: src/pages/delivery/zones/components/ZoneTable.tsx
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton, Stack, Chip, Box } from '@mui/material';
import { IconEdit } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { DeliveryZone } from 'src/utils/api/pagesApi/deliveryZonesApi';

interface Props {
  rows: DeliveryZone[];
  onEdit: (zone: DeliveryZone) => void;
    selectedZoneId?: string;

}

const ZoneTable: React.FC<Props> = ({ rows, onEdit }) => {
  const { t } = useTranslation();

  const cols: GridColDef<DeliveryZone>[] = [
    { 
      field: 'name', 
      headerName: t('deliveryZones.form.name'), 
      flex: 1, 
      minWidth: 200 
    },
    { 
      field: 'deliveryCharge', 
      headerName: t('deliveryZones.form.deliveryCharge'), 
      width: 150,
      renderCell: ({ value }) => (
        <Box sx={{ color: 'primary.main', fontWeight: 600 }}>
          {value?.toFixed(2)} {t('common.currency')}
        </Box>
      )
    },
    { 
      field: 'defaultBonus', 
      headerName: t('deliveryZones.form.defaultBonus'), 
      width: 150,
      renderCell: ({ value }) => (
        <Box sx={{ color: 'success.main', fontWeight: 600 }}>
          {value?.toFixed(2)} {t('common.currency')}
        </Box>
      )
    },
    { 
      field: 'branchName', 
      headerName: t('deliveryZones.form.branch'), 
      width: 200,
      renderCell: ({ value }) => value || t('deliveryZones.form.allBranches')
    },
    { 
      field: 'isActive', 
      headerName: t('common.status'), 
      width: 120,
      renderCell: ({ value }) => (
        <Chip 
          label={value ? t('common.active') : t('common.inactive')} 
          color={value ? 'success' : 'error'} 
          size="small"
          variant={value ? 'filled' : 'outlined'}
        />
      )
    },
    {
      field: 'actions', 
      headerName: t('common.actions'), 
      width: 120, 
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
      pageSizeOptions={[10, 25, 50]}
      initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
      sx={{
        '& .MuiDataGrid-cell:focus': {
          outline: 'none'
        },
        '& .MuiDataGrid-row:hover': {
          backgroundColor: 'action.hover'
        }
      }}
    />
  );
};

export default ZoneTable;
