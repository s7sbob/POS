import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const StatusPill: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const { t } = useTranslation();

  return (
    <Chip
      label={isActive ? t('groups.active') : t('groups.inactive')}
      color={isActive ? 'success' : 'default'}
      size="small"
    />
  );
};
