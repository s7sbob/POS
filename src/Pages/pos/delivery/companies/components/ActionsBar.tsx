// File: src/pages/delivery/companies/components/ActionsBar.tsx
import React from 'react';
import { Box, Button } from '@mui/material';
import { IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface Props {
  onAdd: () => void;
}

const ActionsBar: React.FC<Props> = ({ onAdd }) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Button
        variant="contained"
        startIcon={<IconPlus />}
        onClick={onAdd}
      >
        {t('deliveryCompanies.add')}
      </Button>
    </Box>
  );
};

export default ActionsBar;
