import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton, Stack, Chip } from '@mui/material';
import { IconEdit, IconEye } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { PurchaseOrder } from 'src/utils/api/purchaseOrdersApi';

interface Props {
  rows: PurchaseOrder[];
  onEdit: (po: PurchaseOrder) => void;
}

const PurchaseOrderTable: React.FC<Props> = ({ rows, onEdit }) => {
  const { t } = useTranslation();

  const handleEdit = (row: PurchaseOrder) => {
    console.log('Edit button clicked for row:', row); // ✅ للتأكد من البيانات

    // ✅ تأكد من وجود id
    if (!row.id) {
      console.error('Purchase order missing ID:', row);
      alert('خطأ: معرف أمر الشراء غير موجود');
      return;
    }

    onEdit(row);
  };

  const renderStatus = (status: number | undefined) => {
    switch (status) {
      case 1:
        return t('purchaseOrders.pending');   // “Pending”
      case 3:
        return t('purchaseOrders.submitted'); // “Submitted”
      default:
        return '-';
    }
  };

  const cols: GridColDef[] = [
    {
      field: 'referenceDocNumber',
      headerName: t('purchaseOrders.docNumber'),
      flex: 1,
      minWidth: 150
    },
    {
      field: 'code',
      headerName: t('purchaseOrders.code'),
      width: 100
    },
    {
      field: 'supplier',
      headerName: t('purchaseOrders.supplier'),
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) => row.supplier?.name || 'N/A'
    },
    {
      field: 'warehouse',
      headerName: t('purchaseOrders.warehouse'),
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) => row.warehouse?.name || 'N/A'
    },
    {
      field: 'date1',
      headerName: t('purchaseOrders.date'),
      flex: 0.8,
      renderCell: ({ value }) => {
        if (!value) return '-';
        try {
          return new Date(value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });
        } catch {
          return '-';
        }
      }
    },
    {
      field: 'total',
      headerName: t('purchaseOrders.total'),
      width: 120,
      renderCell: ({ value }) => `${Number(value).toFixed(2)}`
    },
    {
      field: 'details',
      headerName: t('purchaseOrders.itemsCount'),
      width: 120,
      renderCell: ({ value }) => `${value?.length || 0} ${t('purchaseOrders.items')}`
    },
    {
      // ← Changed from isActive → status
      field: 'status',
      headerName: t('purchaseOrders.status'),
      width: 110,
      renderCell: ({ value }) => (
        <Chip
          label={renderStatus(value)}
          color={value === 1 ? 'warning' : value === 3 ? 'primary' : 'default'}
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
          {/*
            If status === 3 (Submitted), show “view” icon; otherwise show edit.
          */}
          {row.status === 3 ? (
            <IconButton size="small" onClick={() => handleEdit(row)}>
              <IconEye size={18} />
            </IconButton>
          ) : (
            <IconButton size="small" onClick={() => handleEdit(row)}>
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
      getRowId={(row) => {
        // ✅ إصلاح: تأكد من وجود id وإلا اطبع خطأ
        if (!row.id) {
          console.error('Row missing ID:', row);
          return `temp-${Math.random()}`; // استخدم prefix للتمييز
        }
        return row.id;
      }}
      autoHeight
      disableRowSelectionOnClick
      sx={{ mb: 2 }}
    />
  );
};

export default PurchaseOrderTable;
