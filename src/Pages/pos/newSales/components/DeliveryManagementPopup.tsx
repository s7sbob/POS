// src/Pages/pos/newSales/components/DeliveryManagementPopup.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Avatar,
  Stack,
  Tooltip
} from '@mui/material';
import { 
  Close as CloseIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Assignment as OrderIcon
} from '@mui/icons-material';
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
        borderBottom: '1px solid #e0e0e0',
        bgcolor: 'background.paper'
      }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: 'primary.light' }}>
            <OrderIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              شاشة متابعة الطلبات
            </Typography>
            <Typography variant="body2" color="text.secondary">
              إدارة ومتابعة طلبات التوصيل
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Tooltip title="تحديث">
            <IconButton color="primary" size="small">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="فلترة">
            <IconButton color="primary" size="small">
              <FilterIcon />
            </IconButton>
          </Tooltip>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
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
