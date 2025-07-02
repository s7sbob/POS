// File: src/pages/delivery/companies/components/CompanyTable.tsx
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton, Stack, Chip, Box, Typography } from '@mui/material';
import { IconEdit, IconPhone, IconMail } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { DeliveryCompany } from 'src/utils/api/pagesApi/deliveryCompaniesApi';

interface Props {
  rows: DeliveryCompany[];
  onEdit: (company: DeliveryCompany) => void;
  canEdit?: boolean;
  selectedCompanyId?: string;
}

const CompanyTable: React.FC<Props> = ({ 
  rows, onEdit, canEdit = true 
}) => {
  const { t } = useTranslation();

  const cols: GridColDef<DeliveryCompany>[] = [
    { 
      field: 'name', 
      headerName: t('deliveryCompanies.form.name'), 
      flex: 1, 
      minWidth: 200 
    },
    { 
      field: 'paymentType', 
      headerName: t('deliveryCompanies.form.paymentType'), 
      width: 120,
      renderCell: ({ value }) => (
        <Chip
          label={t(`deliveryCompanies.form.${value.toLowerCase()}`)}
          size="small"
          variant="outlined"
          color="primary"
        />
      )
    },
    { 
      field: 'phone', 
      headerName: t('deliveryCompanies.form.phone'), 
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
      field: 'email', 
      headerName: t('deliveryCompanies.form.email'), 
      width: 200,
      renderCell: ({ value }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
            {value}
          </Typography>
          <IconButton
            size="small"
            onClick={() => window.open(`mailto:${value}`, '_self')}
            sx={{ p: 0.5 }}
          >
            <IconMail size={14} />
          </IconButton>
        </Box>
      )
    },
    { 
      field: 'companySharePercentage', 
      headerName: t('deliveryCompanies.form.companyShare'), 
      width: 130,
      renderCell: ({ value }) => (
        <Typography variant="body2" color="primary.main" fontWeight={600}>
          {value}%
        </Typography>
      )
    },
    { 
      field: 'contactPerson', 
      headerName: t('deliveryCompanies.form.contactPerson'), 
      width: 150
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

export default CompanyTable;
