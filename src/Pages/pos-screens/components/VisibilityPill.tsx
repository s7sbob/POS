// File: src/pages/pos-screens/components/VisibilityPill.tsx
import React from 'react';
import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
  isVisible: boolean;
}

export const VisibilityPill: React.FC<Props> = ({ isVisible }) => {
  const { t } = useTranslation();
  
  return (
    <Chip
      label={isVisible ? t('posScreens.visible') : t('posScreens.hidden')}
      color={isVisible ? 'primary' : 'warning'}
      size="small"
      variant="outlined"
    />
  );
};
