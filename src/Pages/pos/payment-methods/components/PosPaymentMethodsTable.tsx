// File: src/pages/pos-payment-methods/components/PosPaymentMethodsTable.tsx
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton, Stack, Chip } from '@mui/material';
import { IconEdit } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { PosPaymentMethod } from 'src/utils/api/pagesApi/posPaymentMethodsApi';

interface Props {
  rows: PosPaymentMethod[];
  onEdit: (paymentMethod: PosPaymentMethod) => void;
}

const PosPaymentMethodsTable: React.FC<Props> = ({ rows, onEdit }) => {
  const { t } = useTranslation();

  const cols: GridColDef<PosPaymentMethod>[] = [
    { field: 'name', headerName: t('posPaymentMethods.name'), flex: 1, minWidth: 180 },
    { 
      field: 'safeOrAccountName', 
      headerName: t('posPaymentMethods.safeOrAccount'), 
      flex: 1,
      renderCell: ({ row }) => row.safeOrAccount?.name || '-'
    },
    { 
      field: 'accountType', 
      headerName: t('posPaymentMethods.accountType'), 
      flex: 0.8,
      renderCell: ({ row }) => {
        if (!row.safeOrAccount?.typeName) return '-';
        const safeOrAccountType = row.safeOrAccount.safeOrAccountType;
        return (
          <Chip 
            label={t(`accounts.types.${row.safeOrAccount.typeName.toLowerCase()}`)} 
            color={safeOrAccountType === 1 ? 'warning' : 'primary'} 
            variant="outlined" 
            size="small" 
          />
        );
      }
    },
    { 
      field: 'accountNumber', 
      headerName: t('posPaymentMethods.accountNumber'), 
      flex: 1,
      renderCell: ({ row }) => (
        <span style={{ fontFamily: 'monospace' }}>
          {row.safeOrAccount?.accountNumber || '-'}
        </span>
      )
    },
    { 
      field: 'collectionFee', 
      headerName: t('posPaymentMethods.collectionFee'), 
      flex: 0.8,
      renderCell: ({ row }) => `${row.safeOrAccount?.collectionFeePercent || 0}%`
    },
    { 
      field: 'isActive', 
      headerName: t('posPaymentMethods.status'), 
      width: 110,
      renderCell: ({ value }) => (
        <Chip 
          label={value ? t('posPaymentMethods.active') : t('posPaymentMethods.inactive')} 
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

export default PosPaymentMethodsTable;
