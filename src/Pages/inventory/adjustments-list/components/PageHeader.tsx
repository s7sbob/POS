// File: src/pages/inventory/adjustments-list/components/PageHeader.tsx
import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  Breadcrumbs,
  Link,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  IconPlus,
  IconRefresh,
  IconHome
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ImportExportManager from '../../../components/ImportExportManager';
import { inventoryAdjustmentsImportExportConfig } from '../../../components/configs/importExportConfigs';
import { AdjustmentListItem } from 'src/utils/api/pagesApi/inventoryAdjustmentApi';

interface Props {
  exportData: AdjustmentListItem[];
  loading: boolean;
  onRefresh: () => void;
}

const PageHeader: React.FC<Props> = ({ exportData, loading, onRefresh }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

const config = {
  ...inventoryAdjustmentsImportExportConfig,
  onExport: () => exportData.map(adjustment => ({
    warehouseName: adjustment.warehouseName || '-',
    adjustmentType: (() => {
      switch (adjustment.adjustmentType) {
        case 0: return t('adjustments.types.new');
        case 1: return t('adjustments.types.openingBalance');
        case 2: return t('adjustments.types.manualAdjustment');
        default: return t('adjustments.types.unknown');
      }
    })(),
    adjustmentDate: adjustment.adjustmentDate && adjustment.adjustmentDate !== '0001-01-01T00:00:00' 
      ? new Date(adjustment.adjustmentDate).toLocaleDateString() 
      : '-',
    referenceNumber: adjustment.referenceNumber || '-',
    reason: adjustment.reason || '-',
    totalItems: adjustment.totalItems || 0,
    totalDifference: adjustment.totalDifference ? adjustment.totalDifference.toFixed(2) : '0.00',
    status: (() => {
      switch (adjustment.status) {
        case 1: return t('adjustments.status.saved');
        case 3: return t('adjustments.status.submitted');
        default: return t('adjustments.status.unknown');
      }
    })()
  }))
};

  return (
    <Box sx={{ mb: { xs: 2, sm: 3 } }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/inventory');
          }}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <IconHome size={16} style={{ marginRight: 4 }} />
          {t('inventory.title')}
        </Link>
        <Typography color="text.primary">
          {t('adjustments.list.title')}
        </Typography>
      </Breadcrumbs>

      {/* Title and Actions */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        mb: { xs: 2, sm: 3 },
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="h1"
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
            fontWeight: { xs: 600, sm: 500 }
          }}
        >
          {t('adjustments.list.title')}
        </Typography>

        {/* Action Buttons */}
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={1}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          <Button
            variant="contained"
            startIcon={<IconPlus />}
            onClick={() => navigate('/inventory/inventory-adjustments/new')}
            fullWidth={isMobile}
            sx={{ minWidth: { sm: 180 } }}
          >
            {t('adjustments.list.newAdjustment')}
          </Button>

          <Button
            variant="outlined"
            startIcon={<IconRefresh />}
            onClick={onRefresh}
            disabled={loading}
            fullWidth={isMobile}
            sx={{ minWidth: { sm: 120 } }}
          >
            {t('common.refresh')}
          </Button>
        </Stack>
      </Box>

      {/* Import/Export Manager */}
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
