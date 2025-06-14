// File: src/pages/products/components/PageHeader.tsx
import React from 'react';
import PageHeader from '../../components/PageHeader';

interface Props {
  exportData?: any[];
  loading?: boolean;
}

const ProductsPageHeader: React.FC<Props> = ({ exportData = [], loading = false }) => {
  const exportColumns = [
    { field: 'name', headerName: 'اسم المنتج', type: 'string' as const },
    { field: 'code', headerName: 'الكود', type: 'number' as const },
    { field: 'group.name', headerName: 'المجموعة', type: 'string' as const, format: (value: any) => value?.name || 'غير محدد' },
    { field: 'cost', headerName: 'التكلفة', type: 'number' as const },
    { field: 'productType', headerName: 'النوع', type: 'string' as const, format: (value: number) => value === 1 ? 'POS' : 'Material' },
    { field: 'isActive', headerName: 'الحالة', type: 'boolean' as const },
  ];

  return (
    <PageHeader
      titleKey="products.title"
      subtitleKey="products.subtitle"
      exportData={exportData}
      exportColumns={exportColumns}
      exportFileName="products"
      exportLoading={loading}
    />
  );
};

export default ProductsPageHeader;
