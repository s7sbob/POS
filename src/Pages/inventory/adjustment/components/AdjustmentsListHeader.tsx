// File: src/pages/inventory/adjustments-list/components/AdjustmentsListHeader.tsx
import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  IconPlus,
  IconRefresh,
  IconHome
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface Props {
  onRefresh: () => void;
  isLoading: boolean;
}

const AdjustmentsListHeader: React.FC<Props> = ({
  onRefresh,
  isLoading
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/inventory');
          }}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <IconHome size={16} style={{ marginRight: 4 }} />
          {t('inventory.title')}
        </Link>
        <Typography color="text.primary">
          {t('adjustments.list.title')}
        </Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          {t('adjustments.list.title')}
        </Typography>
      </Box>

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          startIcon={<IconPlus />}
          onClick={() => navigate('/inventory/inventory-adjustments/new')}
        >
          {t('adjustments.list.newAdjustment')}
        </Button>

        <Button
          variant="outlined"
          startIcon={<IconRefresh />}
          onClick={onRefresh}
          disabled={isLoading}
        >
          {t('common.refresh')}
        </Button>
      </Stack>
    </Box>
  );
};

export default AdjustmentsListHeader;
