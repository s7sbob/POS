// File: src/pages/inventory/adjustment/components/AdjustmentHeader.tsx
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
  IconDeviceFloppy,
  IconArrowLeft,
  IconHome,
  IconSend,
  IconRefresh
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface Props {
  isSubmitting: boolean;
  hasAdjustment: boolean;
  warehouseId: string;
  onSave: () => void;
  onSubmit: () => void;
  onRefresh: () => void;
}

const AdjustmentHeader: React.FC<Props> = ({
  isSubmitting,
  hasAdjustment,
  warehouseId,
  onSave,
  onSubmit,
  onRefresh
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
          {t('adjustment.title')}
        </Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          {t('adjustment.title')}
        </Typography>
      </Box>

      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          startIcon={<IconArrowLeft />}
          onClick={() => navigate('/inventory/inventory-adjustments')}
          disabled={isSubmitting}
        >
          {t('common.back')}
        </Button>

        <Button
          variant="outlined"
          startIcon={<IconRefresh />}
          onClick={onRefresh}
          disabled={isSubmitting || !warehouseId}
        >
          {t('common.refresh')}
        </Button>

        <Button
          variant="outlined"
          startIcon={<IconDeviceFloppy />}
          onClick={onSave}
          disabled={isSubmitting || !hasAdjustment}
          color="warning"
        >
          {t('adjustment.form.save')}
        </Button>

        <Button
          variant="contained"
          startIcon={<IconSend />}
          onClick={onSubmit}
          disabled={isSubmitting || !hasAdjustment}
        >
          {t('adjustment.form.submit')}
        </Button>
      </Stack>
    </Box>
  );
};

export default AdjustmentHeader;
