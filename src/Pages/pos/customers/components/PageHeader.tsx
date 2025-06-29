// File: src/pages/pos/customers/components/PageHeader.tsx
import React from 'react';
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ImportExportManager from '../../../components/ImportExportManager';
import { customersImportExportConfig } from '../../../components/configs/importExportConfigs';
import { Customer } from 'src/utils/api/pagesApi/customersApi';

interface Props {
  exportData: Customer[];
  loading: boolean;
}

const PageHeader: React.FC<Props> = ({ exportData, loading }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const config = {
    ...customersImportExportConfig,
    onExport: () => exportData.map(customer => ({
      name: customer.name,
      phone1: customer.phone1,
      phone2: customer.phone2 || '',
      phone3: customer.phone3 || '',
      phone4: customer.phone4 || '',
      isVIP: customer.isVIP,
      isBlocked: customer.isBlocked,
      isActive: customer.isActive,
      addressesCount: customer.addresses.length,
      primaryAddress: customer.addresses[0]?.addressLine || ''
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
          {t('customers.title')}
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
