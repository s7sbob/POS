// File: src/pages/suppliers/components/PageHeader.tsx
import React from 'react';
import PageHeader from '../../components/PageHeader';

interface Props {
  exportData?: any[];
  loading?: boolean;
}

const SuppliersPageHeader: React.FC<Props> = ({ exportData = [], loading = false }) => {
  const exportColumns = [
    { field: 'name', headerName: 'اسم المورد', type: 'string' as const },
    { field: 'phone', headerName: 'الهاتف', type: 'string' as const },
    { field: 'address', headerName: 'العنوان', type: 'string' as const },
    { field: 'createdOn', headerName: 'تاريخ الإنشاء', type: 'date' as const },
    { field: 'isActive', headerName: 'الحالة', type: 'boolean' as const },
  ];

  return (
    <PageHeader
      titleKey="suppliers.title"
      subtitleKey="suppliers.subtitle"
      exportData={exportData}
      exportColumns={exportColumns}
      exportFileName="suppliers"
      exportLoading={loading}
    />
  );
};

export default SuppliersPageHeader;
