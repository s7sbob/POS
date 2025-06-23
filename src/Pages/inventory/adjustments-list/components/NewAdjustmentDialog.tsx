// File: src/pages/inventory/adjustment/components/NewAdjustmentDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (adjustmentType: number) => void;
}

const NewAdjustmentDialog: React.FC<Props> = ({
  open,
  onClose,
  onConfirm
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('adjustment.dialog.newAdjustmentTitle')}</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          {t('adjustment.dialog.newAdjustmentMessage')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('adjustment.dialog.selectAdjustmentType')}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onConfirm(1)} variant="outlined">
          {t('adjustment.types.openingBalance')}
        </Button>
        <Button onClick={() => onConfirm(2)} variant="contained">
          {t('adjustment.types.manualAdjustment')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewAdjustmentDialog;
