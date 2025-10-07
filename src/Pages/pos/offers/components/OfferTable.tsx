// File: src/pages/pos/offers/components/OfferTable.tsx
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton, Stack, Chip, Box, Typography } from '@mui/material';
import { IconEdit } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Offer } from 'src/utils/api/pagesApi/offersApi';

interface Props {
  rows: Offer[];
  onEdit: (offer: Offer) => void;
  canEdit?: boolean;
  selectedOfferId?: string;
}

const OfferTable: React.FC<Props> = ({ 
  rows, onEdit, canEdit = true 
}) => {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG');
  };

  const cols: GridColDef<Offer>[] = [
    { 
      field: 'name', 
      headerName: t('offers.form.name'), 
      flex: 1, 
      minWidth: 200 
    },
    { 
      field: 'priceType', 
      headerName: t('offers.form.priceType'), 
      width: 120,
      renderCell: ({ value }) => t(`offers.form.${value.toLowerCase()}`)
    },
    { 
      field: 'fixedPrice', 
      headerName: t('offers.form.fixedPrice'), 
      width: 150,
      renderCell: ({ value }) => (
        <Box sx={{ color: 'primary.main', fontWeight: 600 }}>
          {value?.toFixed(2) || '0.00'} {t('common.currency')}
        </Box>
      )
    },
    { 
      field: 'startDate', 
      headerName: t('offers.form.startDate'), 
      width: 140,
      renderCell: ({ value }) => formatDate(value)
    },
    { 
      field: 'endDate', 
      headerName: t('offers.form.endDate'), 
      width: 140,
      renderCell: ({ value }) => formatDate(value)
    },
{ 
  field: 'offerGroups', 
  headerName: t('offers.form.groups'), 
  width: 100,
  sortable: false,
  renderCell: ({ value }) => (
    <Typography variant="body2" fontWeight={500}>
      {value?.length || 0}
    </Typography>
  )
},
{ 
  field: 'offerItems', 
  headerName: t('offers.form.items'), 
  width: 100,
  sortable: false,
  renderCell: ({ value, row }) => {
    const independentItems = value?.filter((item: { offerGroupId: any; }) => !item.offerGroupId)?.length || 0;
    const groupItems = row.offerGroups?.reduce((total, group) => 
      total + (group.items?.length || 0), 0) || 0;
    return (
      <Typography variant="body2" fontWeight={500}>
        {independentItems + groupItems}
      </Typography>
    );
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

export default OfferTable;
