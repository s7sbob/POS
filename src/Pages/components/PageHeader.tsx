// File: src/components/PageHeader.tsx
import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ExportButtons from './ExportButtons';

interface Column {
  field: string;
  headerName: string;
  width?: number;
  type?: 'string' | 'number' | 'date' | 'boolean';
  format?: (value: any) => string;
}

interface PageHeaderProps {
  titleKey: string;
  subtitleKey: string;
  // خصائص التصدير (اختيارية)
  exportData?: any[];
  exportColumns?: Column[];
  exportFileName?: string;
  exportLoading?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  titleKey,
  subtitleKey,
  exportData = [],
  exportColumns = [],
  exportFileName = 'data',
  exportLoading = false
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="h5" fontWeight="bold">{t(titleKey)}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t(subtitleKey)}
          </Typography>
        </Box>
        
        {/* أزرار التصدير */}
        {exportData.length > 0 && exportColumns.length > 0 && (
          <ExportButtons
            data={exportData}
            columns={exportColumns}
            fileName={exportFileName}
            title={t(titleKey)}
            loading={exportLoading}
            compact={true}
          />
        )}
      </Stack>
    </Box>
  );
};

export default PageHeader;
