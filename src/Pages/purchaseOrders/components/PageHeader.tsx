import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const PageHeader = () => {
  const { t } = useTranslation();

  return (
    <Box mb={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('purchaseOrders.title')}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {t('purchaseOrders.subtitle')}
      </Typography>
    </Box>
  );
};

export default PageHeader;
