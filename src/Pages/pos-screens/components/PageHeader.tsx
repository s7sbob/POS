// File: src/pages/pos-screens/components/PageHeader.tsx
import React from 'react';
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ImportExportManager from '../../components/ImportExportManager';
import { posScreensImportExportConfig } from '../../components/configs/importExportConfigs';
import { PosScreen } from 'src/utils/api/pagesApi/posScreensApi';

interface Props {
  exportData: PosScreen[];
  loading: boolean;
}

const PageHeader: React.FC<Props> = ({ exportData, loading }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // تحويل البيانات الهرمية إلى مسطحة للتصدير
  const flattenScreens = (screens: PosScreen[]): any[] => {
    const result: any[] = [];
    
    const flatten = (screens: PosScreen[], level = 0) => {
      screens.forEach(screen => {
        result.push({
          screenName: screen.name,
          parentScreenName: screen.parentScreen?.name || '',
          displayOrder: screen.displayOrder,
          colorHex: screen.colorHex,
          icon: screen.icon,
          isVisible: screen.isVisible,
          level: level
        });
        
        if (screen.children && screen.children.length > 0) {
          flatten(screen.children, level + 1);
        }
      });
    };
    
    flatten(screens);
    return result;
  };

  const config = {
    ...posScreensImportExportConfig,
    onExport: () => flattenScreens(exportData)
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
          {t('posScreens.title')}
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
