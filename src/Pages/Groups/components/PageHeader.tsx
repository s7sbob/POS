// File: src/pages/groups/components/PageHeader.tsx
import React from 'react';
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ImportExportManager from '../../components/ImportExportManager';
import { groupsImportExportConfig } from '../../components/configs/importExportConfigs';
import { Group } from 'src/utils/api/pagesApi/groupsApi';

interface Props {
  exportData: Group[];
  loading: boolean;
}

const PageHeader: React.FC<Props> = ({ exportData, loading }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // تحويل البيانات الهرمية إلى مسطحة للتصدير
  const flattenGroups = (groups: Group[]): any[] => {
    const result: any[] = [];
    
    const flatten = (groups: Group[], level = 0) => {
      groups.forEach(group => {
        result.push({
          name: group.name,
          level: level,
          parentName: group.parentGroup || '-',
          backgroundColor: group.backgroundColor,
          fontColor: group.fontColor,
          isActive: group.isActive
        });
        
        if (group.children && group.children.length > 0) {
          flatten(group.children, level + 1);
        }
      });
    };
    
    flatten(groups);
    return result;
  };

  const config = {
    ...groupsImportExportConfig,
    onExport: () => flattenGroups(exportData)
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
          {t('groups.title')}
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
