// File: src/pages/pos-screens/components/PageHeader.tsx
import React from 'react';
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ExportButtons from '../../components/ExportButtons';
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
          name: screen.name,
          level: level,
          displayOrder: screen.displayOrder,
          icon: screen.icon,
          colorHex: screen.colorHex,
          isVisible: screen.isVisible,
          isActive: screen.isActive,
          parentName: screen.parentScreen?.name || '-'
        });
        
        if (screen.children && screen.children.length > 0) {
          flatten(screen.children, level + 1);
        }
      });
    };
    
    flatten(screens);
    return result;
  };

  const exportColumns = [
    { 
      field: 'name', 
      headerName: t('posScreens.name'),
      type: 'string' as const
    },
    { 
      field: 'level', 
      headerName: t('posScreens.level'),
      type: 'number' as const
    },
    { 
      field: 'displayOrder', 
      headerName: t('posScreens.displayOrder'),
      type: 'number' as const
    },
    { 
      field: 'icon', 
      headerName: t('posScreens.icon'),
      type: 'string' as const
    },
    { 
      field: 'colorHex', 
      headerName: t('posScreens.color'),
      type: 'string' as const
    },
    { 
      field: 'isVisible', 
      headerName: t('posScreens.visibility'),
      type: 'string' as const,
      format: (value: boolean) => value ? t('posScreens.visible') : t('posScreens.hidden')
    },
    { 
      field: 'isActive', 
      headerName: t('posScreens.status'),
      type: 'string' as const,
      format: (value: boolean) => value ? t('posScreens.active') : t('posScreens.inactive')
    },
    { 
      field: 'parentName', 
      headerName: t('posScreens.parentScreen'),
      type: 'string' as const
    }
  ];

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

      <ExportButtons
        data={flattenScreens(exportData)}
        columns={exportColumns}
        fileName="pos-screens"
        title={t('posScreens.title')}
        loading={loading}
        compact={isMobile}
      />
    </Box>
  );
};

export default PageHeader;
