// File: src/pages/delivery/companies/components/PageHeader.tsx
import React from 'react';
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ImportExportManager from '../../../../components/ImportExportManager';
import { deliveryCompaniesImportExportConfig } from '../../../../components/configs/importExportConfigs';
import { DeliveryCompany } from 'src/utils/api/pagesApi/deliveryCompaniesApi';

interface Props {
  exportData: DeliveryCompany[];
  loading: boolean;
  onDataChange?: () => Promise<void>;
}

const PageHeader: React.FC<Props> = ({ exportData, loading }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const config = {
    ...deliveryCompaniesImportExportConfig,
    onExport: () => exportData.map(company => ({
      name: company.name,
      paymentType: company.paymentType,
      companySharePercentage: company.companySharePercentage,
      visaCollectionCommissionPercentage: company.visaCollectionCommissionPercentage,
      taxPercentage: company.taxPercentage,
      phone: company.phone,
      email: company.email,
      contactPerson: company.contactPerson,
      notes: company.notes || '',
      isActive: company.isActive
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
          {t('deliveryCompanies.title')}
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
