// File: src/pages/pos-screens/components/StatusPill.tsx
import React from 'react';
import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
  isActive: boolean;
}

export const StatusPill: React.FC<Props> = ({ isActive }) => {
  const { t } = useTranslation();
  
  return (
    <Chip
      label={isActive ? t('posScreens.active') : t('posScreens.inactive')}
      color={isActive ? 'success' : 'default'}
      size="small"
      variant="outlined"
    />
  );
};
