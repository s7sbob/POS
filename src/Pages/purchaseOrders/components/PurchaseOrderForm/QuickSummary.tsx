import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
  watch: any;
}

const QuickSummary: React.FC<Props> = ({ watch }) => {
  const { t } = useTranslation();

  return (
    <Grid item xs={12}>
      <Box 
        sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 0.5,
          backgroundColor: 'background.default',
          borderRadius: 1,
          mb: 0.5
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {t('purchaseOrders.subTotal')}: {watch('subTotal')?.toFixed(2) || '0.00'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t('purchaseOrders.discountValue')}: {watch('discountValue')?.toFixed(2) || '0.00'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t('purchaseOrders.taxValue')}: {watch('taxValue')?.toFixed(2) || '0.00'}
        </Typography>
        <Typography variant="caption" color="primary" fontWeight="bold">
          {t('purchaseOrders.total')}: {watch('total')?.toFixed(2) || '0.00'}
        </Typography>
      </Box>
    </Grid>
  );
};

export default QuickSummary;
