// File: src/pages/accounts/components/PageHeader.tsx
import React from 'react';
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ExportButtons from '../../components/ExportButtons';
import { Account } from 'src/utils/api/pagesApi/accountsApi';

interface Props {
  exportData: Account[];
  loading: boolean;
}

const PageHeader: React.FC<Props> = ({ exportData, loading }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const exportColumns = [
    { 
      field: 'name', 
      headerName: t('accounts.name'),
      type: 'string' as const
    },
    { 
      field: 'typeName', 
      headerName: t('accounts.type'),
      type: 'string' as const
    },
    { 
      field: 'accountNumber', 
      headerName: t('accounts.accountNumber'),
      type: 'string' as const
    },
    { 
      field: 'collectionFeePercent', 
      headerName: t('accounts.collectionFeePercent'),
      type: 'number' as const,
      format: (value: number) => `${value}%`
    },
    { 
      field: 'isActive', 
      headerName: t('accounts.status'),
      type: 'string' as const,
      format: (value: boolean) => value ? t('accounts.active') : t('accounts.inactive')
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
          {t('accounts.title')}
        </Typography>
      </Box>

      <ExportButtons
        data={exportData}
        columns={exportColumns}
        fileName="accounts"
        title={t('accounts.title')}
        loading={loading}
        compact={isMobile}
      />
    </Box>
  );
};

export default PageHeader;
