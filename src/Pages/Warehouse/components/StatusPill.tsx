import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const StatusPill: React.FC<{ status: 'active' | 'inactive' }> = ({ status }) => {
  const { t } = useTranslation();
  return (
    <Chip
      label={status === 'active' ? t('status.active') : t('status.inactive')}
      color={status === 'active' ? 'success' : 'default'}
      size="small"
    />
  );
};
