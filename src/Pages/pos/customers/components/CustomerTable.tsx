// File: src/pages/pos/customers/components/CustomerTable.tsx
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton, Stack, Chip, Box, Typography } from '@mui/material';
import { IconEdit, IconTrash, IconPhone, IconMapPin } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Customer } from 'src/utils/api/pagesApi/customersApi';

interface Props {
  rows: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const CustomerTable: React.FC<Props> = ({ 
  rows, onEdit, onDelete, canEdit = true, canDelete = true 
}) => {
  const { t } = useTranslation();

  const cols: GridColDef<Customer>[] = [
    { 
      field: 'name', 
      headerName: t('customers.form.name'), 
      flex: 1, 
      minWidth: 200 
    },
    { 
      field: 'phone1', 
      headerName: t('customers.form.phone1'), 
      width: 150,
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
            <IconPhone size={14} />
          </IconButton>
        </Box>
      )
    },
    { 
      field: 'addresses', 
      headerName: t('customers.form.addresses'), 
      width: 250,
      sortable: false,
      renderCell: ({ value }) => {
        const addresses = value || [];
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconMapPin size={16} />
            <Typography variant="body2">
              {addresses.length} {t('customers.form.addressCount')}
            </Typography>
            {addresses.length > 0 && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: 150
                }}
                title={addresses[0]?.addressLine}
              >
                - {addresses[0]?.addressLine}
              </Typography>
            )}
          </Box>
        );
      }
    },
    { 
      field: 'customerType', 
      headerName: t('customers.form.type'), 
      width: 120,
      renderCell: ({ row }) => {
        if (row.isBlocked) {
          return <Chip label={t('customers.form.blocked')} color="error" size="small" />;
        }
        if (row.isVIP) {
          return <Chip label={t('customers.form.vip')} color="warning" size="small" />;
        }
        return <Chip label={t('customers.form.regular')} color="default" size="small" variant="outlined" />;
      }
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

export default CustomerTable;
