// File: src/pages/inventory/adjustment/components/BarcodeScanner.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box
} from '@mui/material';
import { IconBarcode } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}

const BarcodeScanner: React.FC<Props> = ({ open, onClose, onScan }) => {
  const { t } = useTranslation();
  const [barcode, setBarcode] = useState('');

  const handleScan = () => {
    if (barcode.trim()) {
      onScan(barcode.trim());
      setBarcode('');
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScan();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconBarcode />
        {t('adjustment.barcode.title')}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {t('adjustment.barcode.instruction')}
          </Typography>
        </Box>
        
        <TextField
          autoFocus
          fullWidth
          label={t('adjustment.barcode.label')}
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('adjustment.barcode.placeholder')}
        />
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button onClick={handleScan} variant="contained" disabled={!barcode.trim()}>
          {t('adjustment.barcode.scan')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BarcodeScanner;
