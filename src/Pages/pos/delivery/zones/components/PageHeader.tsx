// File: src/pages/delivery/zones/components/PageHeader.tsx
import React from 'react';
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ImportExportManager from '../../../../components/ImportExportManager';
import { deliveryZonesImportExportConfig } from '../../../../components/configs/importExportConfigs';
import { DeliveryZone } from 'src/utils/api/pagesApi/deliveryZonesApi';

interface Props {
  exportData: DeliveryZone[];
  loading: boolean;
      onDataChange?: () => Promise<void>;

}

const PageHeader: React.FC<Props> = ({ exportData, loading }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const config = {
    ...deliveryZonesImportExportConfig,
    onExport: () => exportData.map(zone => ({
      name: zone.name,
      deliveryCharge: zone.deliveryCharge,
      defaultBonus: zone.defaultBonus,
      branchName: zone.branchName || t('deliveryZones.form.allBranches'),
      isActive: zone.isActive
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
          {t('deliveryZones.title')}
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
