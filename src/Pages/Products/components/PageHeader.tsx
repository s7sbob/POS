/* ===================== components/PageHeader.tsx ===================== */
import React from 'react';
import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
export const PageHeader: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Stack spacing={0.5} sx={{ mb: 3 }}>
      <Typography variant="h5">{t('products.title')}</Typography>
      <Typography variant="body2" color="text.secondary">
        {t('products.subtitle')}
      </Typography>
    </Stack>
  );
};