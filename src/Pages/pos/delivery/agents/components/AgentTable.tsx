// File: src/pages/delivery/agents/components/AgentTable.tsx
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton, Stack, Chip, Box, Typography } from '@mui/material';
import { IconEdit, IconTrash, IconPhone } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { DeliveryAgent } from 'src/utils/api/pagesApi/deliveryAgentsApi';

interface Props {
  rows: DeliveryAgent[];
  onEdit: (agent: DeliveryAgent) => void;
  onDelete: (agent: DeliveryAgent) => void;
  canEdit?: boolean;
  canDelete?: boolean;
    selectedAgentId?: string;

}

const AgentTable: React.FC<Props> = ({ 
  rows, onEdit, onDelete, canEdit = true, canDelete = true 
}) => {
  const { t } = useTranslation();

  const cols: GridColDef<DeliveryAgent>[] = [
    { 
      field: 'name', 
      headerName: t('deliveryAgents.form.name'), 
      flex: 1, 
      minWidth: 200 
    },
    { 
      field: 'phone', 
      headerName: t('deliveryAgents.form.phone'), 
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
      headerName: t('deliveryAgents.form.branch'), 
      width: 200,
      renderCell: ({ value }) => value || t('common.notSpecified')
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
      width: 150, 
      sortable: false, 
      filterable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={0.5}>
          {canEdit && (
            <IconButton size="small" onClick={() => onEdit(row)}>
              <IconEdit size={18} />
            </IconButton>
          )}
          {canDelete && (
            <IconButton size="small" onClick={() => onDelete(row)} color="error">
              <IconTrash size={18} />
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

export default AgentTable;
