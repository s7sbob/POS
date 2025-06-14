// File: src/pages/groups/components/PageHeader.tsx
import React from 'react';
import PageHeader from '../../components/PageHeader';

interface Props {
  exportData?: any[];
  loading?: boolean;
}

const GroupsPageHeader: React.FC<Props> = ({ exportData = [], loading = false }) => {
  const exportColumns = [
    { field: 'name', headerName: 'اسم المجموعة', type: 'string' as const },
    { field: 'code', headerName: 'الكود', type: 'number' as const },
    { field: 'isActive', headerName: 'الحالة', type: 'boolean' as const },
  ];

  return (
    <PageHeader
      titleKey="groups.title"
      subtitleKey="groups.subtitle"
      exportData={exportData}
      exportColumns={exportColumns}
      exportFileName="groups"
      exportLoading={loading}
    />
  );
};

export default GroupsPageHeader;
