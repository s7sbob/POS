// File: src/pages/warehouses/components/PageHeader.tsx
import React from 'react';
import PageHeader from '../../components/PageHeader';

interface Props {
  exportData?: any[];
  loading?: boolean;
}

const WarehousesPageHeader: React.FC<Props> = ({ exportData = [], loading = false }) => {
  const exportColumns = [
    { field: 'name', headerName: 'اسم المخزن', type: 'string' as const },
    { field: 'address', headerName: 'العنوان', type: 'string' as const },
    { field: 'createdOn', headerName: 'تاريخ الإنشاء', type: 'date' as const },
    { field: 'isActive', headerName: 'الحالة', type: 'boolean' as const },
  ];

  return (
    <PageHeader
      titleKey="warehouses.title"
      subtitleKey="warehouses.subtitle"
      exportData={exportData}
      exportColumns={exportColumns}
      exportFileName="warehouses"
      exportLoading={loading}
    />
  );
};

export default WarehousesPageHeader;
