// File: src/pages/pos-payment-methods/components/PageHeader.tsx
import React from 'react';
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ImportExportManager from '../../components/ImportExportManager';
import { posPaymentMethodsImportExportConfig } from '../../components/configs/importExportConfigs';
import { PosPaymentMethod } from 'src/utils/api/pagesApi/posPaymentMethodsApi';

interface Props {
  exportData: PosPaymentMethod[];
  loading: boolean;
}

const PageHeader: React.FC<Props> = ({ exportData, loading }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const config = {
    ...posPaymentMethodsImportExportConfig,
    onExport: () => exportData.map(method => ({
      name: method.name,
      safeOrAccountName: method.safeOrAccount?.name || '',
      type: method.type,
      isActive: method.isActive,
      createdOn: method.createdOn
    }))
  };

  return (
    <Box sx={{ mb: { xs: 2, sm: 3 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        mb: { xs: 1, sm: 2 },
        gap: { xs: 1, sm: 0 }
      }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="h1"
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
            fontWeight: { xs: 600, sm: 500 }
          }}
        >
          {t('posPaymentMethods.title')}
        </Typography>
      </Box>

      <ImportExportManager
        config={config}
        data={exportData}
        loading={loading}
        compact={isMobile}
      />
    </Box>
  );
};

export default PageHeader;
