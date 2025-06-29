// File: src/pages/pos/hall-captains/components/CaptainTable.tsx
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton, Stack, Chip, Box, Typography } from '@mui/material';
import { IconEdit, IconPhone } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { HallCaptain } from 'src/utils/api/pagesApi/hallCaptainsApi';

interface Props {
  rows: HallCaptain[];
  onEdit: (captain: HallCaptain) => void;
  canEdit?: boolean;
}

const CaptainTable: React.FC<Props> = ({ 
  rows, onEdit, canEdit = true 
}) => {
  const { t } = useTranslation();

  const cols: GridColDef<HallCaptain>[] = [
    { 
      field: 'name', 
      headerName: t('hallCaptains.form.name'), 
      flex: 1, 
      minWidth: 200 
    },
    { 
      field: 'phone', 
      headerName: t('hallCaptains.form.phone'), 
      width: 180,
      renderCell: ({ value }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" fontFamily="monospace">
            {value}
          </Typography>
          <IconButton
            size="small"
            onClick={() => window.open(`tel:${value}`, '_self')}
            sx={{ p: 0.5 }}
          >
            <IconPhone size={16} />
          </IconButton>
        </Box>
      )
    },
    { 
      field: 'branchName', 
      headerName: t('hallCaptains.form.branch'), 
      width: 200,
      renderCell: ({ value }) => value || t('common.notSpecified')
    },
    { 
      field: 'notes', 
      headerName: t('hallCaptains.form.notes'), 
      width: 250,
      renderCell: ({ value }) => (
        <Typography 
          variant="body2" 
          sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
          title={value}
        >
          {value || '-'}
        </Typography>
      )
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
          {canEdit && (
            <IconButton size="small" onClick={() => onEdit(row)}>
              <IconEdit size={18} />
            </IconButton>
          )}
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

export default CaptainTable;
