// File: src/pages/purchases/components/PurchaseOrderSelectDialog.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  CircularProgress
} from '@mui/material';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import * as purchaseOrdersApi from 'src/utils/api/pagesApi/purchaseOrdersApi';
import { PurchaseOrder } from 'src/utils/api/pagesApi/purchaseOrdersApi';

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (purchaseOrder: PurchaseOrder) => void;
}

const PurchaseOrderSelectDialog: React.FC<Props> = ({ open, onClose, onSelect }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadPurchaseOrders();
    }
  }, [open]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = purchaseOrders.filter(po =>
        po.referenceDocNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        po.supplier?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        po.warehouse?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(purchaseOrders);
    }
  }, [searchQuery, purchaseOrders]);

  const loadPurchaseOrders = async () => {
    try {
      setLoading(true);
      const orders = await purchaseOrdersApi.getAll();
      const submittedOrders = orders.filter(po => po.status === 3);
      setPurchaseOrders(submittedOrders);
      setFilteredOrders(submittedOrders);
    } catch (error) {
      console.error('Error loading purchase orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (purchaseOrder: PurchaseOrder) => {
    try {
      const fullPurchaseOrder = await purchaseOrdersApi.getByIdWithDetails(purchaseOrder.id!);
      onSelect(fullPurchaseOrder);
      onClose();
    } catch (error) {
      console.error('Error loading purchase order details:', error);
      onSelect(purchaseOrder);
      onClose();
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {t('purchases.form.selectPurchaseOrder')}
          <IconButton onClick={handleClose}>
            <IconX size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box mb={2}>
          <TextField
            fullWidth
            placeholder={t('purchases.form.searchPurchaseOrders')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={20} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
          {loading ? (
            <Box textAlign="center" py={4}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>{t('common.loading')}</Typography>
            </Box>
          ) : filteredOrders.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" py={4}>
              {searchQuery ? t('common.noSearchResults') : t('purchases.form.noSubmittedPO')}
            </Typography>
          ) : (
            <List>
              {filteredOrders.map((order) => (
                <ListItem key={order.id} disablePadding>
                  <ListItemButton onClick={() => handleSelect(order)}>
                    <ListItemText
                      primary={
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {order.referenceDocNumber}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t('purchases.form.code')}: {order.code}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t('purchases.form.supplier')}: {order.supplier?.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t('purchases.form.warehouse')}: {order.warehouse?.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t('purchases.form.date')}: {new Date(order.date1).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t('purchases.form.total')}: {order.total.toFixed(2)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t('purchases.form.itemsCount')}: {order.details?.length || 0}
                          </Typography>
                          <Box mt={1}>
                            <Chip
                              label={t('purchases.status.submitted')}
                              color="primary"
                              size="small"
                            />
                          </Box>
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>{t('common.cancel')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseOrderSelectDialog;
