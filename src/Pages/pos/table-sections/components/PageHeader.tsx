// File: src/pages/pos/table-sections/components/PageHeader.tsx
import React from 'react';
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Chip,
  Stack
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ImportExportManager from '../../../components/ImportExportManager';
import { tableSectionsImportExportConfig } from '../../../components/configs/importExportConfigs';
import { TableSection } from 'src/utils/api/pagesApi/tableSectionsApi';

interface Props {
  exportData: TableSection[];
  loading: boolean;
    onDataChange?: () => Promise<void>;

}

const PageHeader: React.FC<Props> = ({ exportData, loading }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getTotalTablesCount = () => {
    return exportData.reduce((total, section) => total + section.tables.length, 0);
  };

  const config = {
    ...tableSectionsImportExportConfig,
    onExport: () => exportData.map(section => ({
      name: section.name,
      serviceCharge: section.serviceCharge,
      tablesCount: section.tables.length,
      totalCapacity: section.tables.reduce((sum, table) => sum + table.capacity, 0),
      branchName: section.branchName || t('common.notSpecified'),
      isActive: section.isActive
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
        <Box>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h1"
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
              fontWeight: { xs: 600, sm: 500 },
              mb: 1
            }}
          >
            {t('tableSections.title')}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {t('tableSections.subtitle', { count: exportData.length })}
            </Typography>
            <Chip 
              label={t('tableSections.totalTables', { count: getTotalTablesCount() })}
              color="primary"
              variant="outlined"
              size="small"
            />
          </Stack>
        </Box>
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
