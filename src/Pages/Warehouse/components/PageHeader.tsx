import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const PageHeader = () => {
  const { t } = useTranslation();
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h5">{t('warehouses.title')}</Typography>
      <Typography variant="body2" color="text.secondary">
        {t('warehouses.subtitle')}
      </Typography>
    </Box>
  );
};

export default PageHeader;
