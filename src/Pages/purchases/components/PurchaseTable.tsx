// File: src/pages/purchases/components/PurchaseTable.tsx
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton, Stack, Chip } from '@mui/material';
import { IconEdit, IconEye } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Purchase } from 'src/utils/api/pagesApi/purchaseApi';

interface Props {
  rows: Purchase[];
  onEdit: (purchase: Purchase) => void;
  onView: (purchase: Purchase) => void;
}

const PurchaseTable: React.FC<Props> = ({ rows, onEdit, onView }) => {
  const { t } = useTranslation();

  const handleAction = (row: Purchase) => {
    console.log('Action button clicked for row:', row);

    if (!row.id) {
      console.error('Purchase missing ID:', row);
      alert(t('purchases.errors.missingId'));
      return;
    }

    if (row.status === 3) {
      onView(row); // Submitted - View only
    } else {
      onEdit(row); // Pending - Edit
    }
  };

  const renderStatus = (status: number | undefined) => {
    switch (status) {
      case 1:
        return t('purchases.status.pending');
      case 3:
        return t('purchases.status.submitted');
      default:
        return '-';
    }
  };

  const getStatusColor = (status: number | undefined) => {
    switch (status) {
      case 1:
        return 'warning';
      case 3:
        return 'success';
      default:
        return 'default';
    }
  };

  const renderPurchaseOrderInfo = (purchase: Purchase) => {
    if (purchase.purchaseOrder) {
      return `${purchase.purchaseOrder.referenceDocNumber} (${purchase.purchaseOrder.code})`;
    }
    return t('purchases.table.directInvoice');
  };

  const cols: GridColDef[] = [
    {
      field: 'referenceDocNumber',
      headerName: t('purchases.table.invoiceNumber'),
      flex: 1,
      minWidth: 150
    },
    {
      field: 'purchaseOrder',
      headerName: t('purchases.table.purchaseOrder'),
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) => renderPurchaseOrderInfo(row)
    },
    {
      field: 'supplier',
      headerName: t('purchases.table.supplier'),
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) => row.supplier?.name || 'N/A'
    },
    {
      field: 'warehouse',
      headerName: t('purchases.table.warehouse'),
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) => row.warehouse?.name || 'N/A'
    },
    {
      field: 'date1',
      headerName: t('purchases.table.invoiceDate'),
      flex: 0.8,
      renderCell: ({ value }) => {
        if (!value) return '-';
        try {
          return new Date(value).toLocaleDateString();
        } catch {
          return '-';
        }
      }
    },
    {
      field: 'total',
      headerName: t('purchases.table.total'),
      width: 120,
      renderCell: ({ value }) => `${Number(value).toFixed(2)}`
    },
    {
      field: 'details',
      headerName: t('purchases.table.itemsCount'),
      width: 120,
      renderCell: ({ value }) => `${value?.length || 0} ${t('purchases.table.items')}`
    },
    {
      field: 'status',
      headerName: t('purchases.table.status'),
      width: 110,
      renderCell: ({ value }) => (
        <Chip
          label={renderStatus(value)}
          color={getStatusColor(value) as any}
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
        <Stack direction="row" spacing={1}>
          <IconButton size="small" onClick={() => handleAction(row)}>
            {row.status === 3 ? <IconEye size={18} /> : <IconEdit size={18} />}
          </IconButton>
        </Stack>
      )
    }
  ];

  return (
    <DataGrid
      rows={rows}
      columns={cols}
      getRowId={(row) => {
        if (!row.id) {
          console.error('Row missing ID:', row);
          return `temp-${Math.random()}`;
        }
        return row.id;
      }}
      autoHeight
      disableRowSelectionOnClick
      sx={{ mb: 2 }}
    />
  );
};

export default PurchaseTable;
