
// src/Pages/pos/newSales/components/DeliveryManagementPopup.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import DeliveryManagementPage from './DeliveryManagementPage';

interface DeliveryManagementPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeliveryManagementPopup: React.FC<DeliveryManagementPopupProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      fullScreen
      PaperProps={{
        sx: {
          margin: 0,
          maxHeight: '100vh',
          height: '100vh',
          borderRadius: 0
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 2,
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Typography variant="h6" component="div">
          إدارة التوصيل
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        <Box sx={{ height: '100%', overflow: 'auto' }}>
          <DeliveryManagementPage />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryManagementPopup;

