import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton, Stack, Chip } from '@mui/material';
import { IconEdit, IconEye } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Product } from 'src/utils/api/pagesApi/productsApi';

interface Props {
  rows: Product[];
  onEdit: (p: Product) => void;
  onViewPrices: (p: Product) => void;
  selectedProductId?: string;
}

const ProductTable: React.FC<Props> = ({ rows, onEdit, onViewPrices, selectedProductId }) => {
  const { t } = useTranslation();

  const getProductTypeLabel = (type: number) => {
    switch (type) {
      case 1: return 'POS';
      case 2: return 'Material';
      default: return 'Unknown';
    }
  };

  const cols: GridColDef[] = [
    { field: 'name', headerName: t('products.name'), flex: 1, minWidth: 200 },
    { 
      field: 'group', 
      headerName: t('products.group'), 
      flex: 0.8, 
      minWidth: 150,
      renderCell: ({ row }) => row.group?.name || 'No Group'
    },
    { 
      field: 'productType', 
      headerName: t('products.type'), 
      width: 120,
      renderCell: ({ value }) => (
        <Chip 
          label={getProductTypeLabel(value)} 
          color={value === 1 ? 'primary' : 'secondary'}
          size="small"
        />
      )
    },
    { 
      field: 'cost', 
      headerName: t('products.cost'), 
      width: 120,
      renderCell: ({ value }) => `${Number(value).toFixed(2)}`
    },
    { 
      field: 'productPrices', 
      headerName: t('products.pricesCount'), 
      width: 120,
      renderCell: ({ value }) => `${value?.length || 0} ${t('products.prices')}`
    },
    {
      field: 'createdOn',
      headerName: t('products.created'),
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
      headerName: t('products.status'), 
      width: 110,
      renderCell: (p) => (
        <Chip
          label={p.value ? t('products.active') : t('products.inactive')}
          color={p.value ? 'success' : 'default'}
          size="small"
        />
      )
    },
    {
      field: 'actions', 
      headerName: '', 
      width: 120, 
      sortable: false, 
      filterable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1}>
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              onViewPrices(row);
            }}
            color={selectedProductId === row.id ? 'primary' : 'default'}
            title={t('products.viewPrices')}
          >
            <IconEye size={18} />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row);
            }}
            title={t('products.edit')}
          >
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
      sx={{ 
        mb: 2,
        '& .MuiDataGrid-row': {
          cursor: 'pointer',
        },
        '& .MuiDataGrid-row:hover': {
          backgroundColor: 'action.hover',
        }
      }}
    />
  );
};

export default ProductTable;
