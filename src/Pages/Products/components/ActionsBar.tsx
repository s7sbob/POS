import { Button } from '@mui/material';
import { IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface Props {
  onAdd: () => void;
}

const ActionsBar: React.FC<Props> = ({ onAdd }) => {
  const { t } = useTranslation();

  return (
    <Button
      variant="contained"
      startIcon={<IconPlus size={20} />}
      onClick={onAdd}
    >
      {t('products.add')}
    </Button>
  );
};

export default ActionsBar;
