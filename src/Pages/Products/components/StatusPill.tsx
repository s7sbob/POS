/* =====================
   components/StatusPill.tsx
===================== */
import React from 'react';
import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const StatusPill: React.FC<{ status: 'active' | 'inactive' }> = ({ status }) => {
  const { t } = useTranslation();
  const color = status === 'active' ? 'success' : 'default';
  return <Chip size="small" label={t(`products.status.${status}`)} color={color} />;
};