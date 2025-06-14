// File: src/pages/purchases/components/PageHeader.tsx
import React from 'react';
import PageHeader from '../../components/PageHeader';

interface Props {
  exportData?: any[];
  loading?: boolean;
}

const PurchasesPageHeader: React.FC<Props> = ({ exportData = [], loading = false }) => {
  const exportColumns = [
    { field: 'referenceDocNumber', headerName: 'رقم الفاتورة', type: 'string' as const },
    { field: 'code', headerName: 'الكود', type: 'number' as const },
    { field: 'purchaseOrder.referenceDocNumber', headerName: 'أمر الشراء', type: 'string' as const, format: (value: any) => value?.referenceDocNumber || 'فاتورة مباشرة' },
    { field: 'supplier.name', headerName: 'المورد', type: 'string' as const, format: (value: any) => value?.name || 'غير محدد' },
    { field: 'warehouse.name', headerName: 'المخزن', type: 'string' as const, format: (value: any) => value?.name || 'غير محدد' },
    { field: 'date1', headerName: 'تاريخ الفاتورة', type: 'date' as const },
    { field: 'total', headerName: 'الإجمالي', type: 'number' as const },
    { field: 'status', headerName: 'الحالة', type: 'string' as const, format: (value: number) => value === 1 ? 'معلق' : value === 3 ? 'مرسل' : 'غير محدد' },
  ];

  return (
    <PageHeader
      titleKey="purchases.title"
      subtitleKey="purchases.subtitle"
      exportData={exportData}
      exportColumns={exportColumns}
      exportFileName="purchases"
      exportLoading={loading}
    />
  );
};

export default PurchasesPageHeader;
