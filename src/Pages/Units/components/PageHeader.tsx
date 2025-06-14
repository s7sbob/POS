// File: src/pages/units/components/PageHeader.tsx
import React from 'react';
import PageHeader from '../../components/PageHeader';

interface Props {
  exportData?: any[];
  loading?: boolean;
}

const UnitsPageHeader: React.FC<Props> = ({ exportData = [], loading = false }) => {
  const exportColumns = [
    { field: 'name', headerName: 'اسم الوحدة', type: 'string' as const },
    { field: 'createdOn', headerName: 'تاريخ الإنشاء', type: 'date' as const },
    { field: 'isActive', headerName: 'الحالة', type: 'boolean' as const },
  ];

  return (
    <PageHeader
      titleKey="units.title"
      subtitleKey="units.subtitle"
      exportData={exportData}
      exportColumns={exportColumns}
      exportFileName="units"
      exportLoading={loading}
    />
  );
};

export default UnitsPageHeader;
