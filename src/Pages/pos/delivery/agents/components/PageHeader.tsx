// File: src/pages/delivery/agents/components/PageHeader.tsx
import React from 'react';
import { Box, Typography, Button, Stack, useMediaQuery, useTheme } from '@mui/material';
import { IconFileExport, IconFileImport } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface Props {
  title: string;
  exportData: any[];
  loading: boolean;
  showImport?: boolean;
  showExport?: boolean;
}

const PageHeader: React.FC<Props> = ({
  title,
  exportData,
  loading,
  showImport = false,
  showExport = false
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleExport = () => {
    // تنفيذ تصدير البيانات
    console.log('Exporting agents data:', exportData);
  };

  const handleImport = () => {
    // تنفيذ استيراد البيانات
    console.log('Importing agents data');
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={2}
      >
        <Typography variant="h4" component="h1">
          {title}
        </Typography>

        {(showImport || showExport) && (
          <Stack direction="row" spacing={1}>
            {showImport && (
              <Button
                variant="outlined"
                startIcon={<IconFileImport />}
                onClick={handleImport}
                disabled={loading}
                size={isMobile ? 'small' : 'medium'}
              >
                {isMobile ? '' : t('common.import')}
              </Button>
            )}
            
            {showExport && (
              <Button
                variant="outlined"
                startIcon={<IconFileExport />}
                onClick={handleExport}
                disabled={loading || exportData.length === 0}
                size={isMobile ? 'small' : 'medium'}
              >
                {isMobile ? '' : t('common.export')}
              </Button>
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default PageHeader;
