// File: src/pages/purchases/purchase-orders/components/PageHeader.tsx
import React from 'react';
import PageHeader from '../../components/PageHeader';

interface Props {
  exportData?: any[];
  loading?: boolean;
}

const PurchaseOrdersPageHeader: React.FC<Props> = ({ exportData = [], loading = false }) => {
  const exportColumns = [
    { field: 'referenceDocNumber', headerName: 'رقم المستند', type: 'string' as const },
    { field: 'code', headerName: 'الكود', type: 'number' as const },
    { field: 'supplier.name', headerName: 'المورد', type: 'string' as const, format: (value: any) => value?.name || 'غير محدد' },
    { field: 'warehouse.name', headerName: 'المخزن', type: 'string' as const, format: (value: any) => value?.name || 'غير محدد' },
    { field: 'date1', headerName: 'التاريخ', type: 'date' as const },
    { field: 'total', headerName: 'الإجمالي', type: 'number' as const },
    { field: 'status', headerName: 'الحالة', type: 'string' as const, format: (value: number) => value === 1 ? 'معلق' : value === 3 ? 'مرسل' : 'غير محدد' },
  ];

  return (
    <PageHeader
      titleKey="purchaseOrders.title"
      subtitleKey="purchaseOrders.subtitle"
      exportData={exportData}
      exportColumns={exportColumns}
      exportFileName="purchase-orders"
      exportLoading={loading}
    />
  );
};

export default PurchaseOrdersPageHeader;
