// File: src/pages/purchases/purchase-orders/EditPurchaseOrderPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMediaQuery, useTheme, Snackbar, Alert, Box, Typography, CircularProgress } from '@mui/material';
import PurchaseOrderForm from './components/PurchaseOrderForm';
import MobilePurchaseOrderForm from './components/mobile/MobilePurchaseOrderForm';
import * as apiSrv from 'src/utils/api/pagesApi/purchaseOrdersApi';
import * as suppliersApi from 'src/utils/api/pagesApi/suppliersApi';
import * as warehousesApi from 'src/utils/api/pagesApi/warehousesApi';
import { PurchaseOrder } from 'src/utils/api/pagesApi/purchaseOrdersApi';
import { Supplier } from 'src/utils/api/pagesApi/suppliersApi';
import { Warehouse } from 'src/utils/api/pagesApi/warehousesApi';

const EditPurchaseOrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          throw new Error('Purchase Order ID is required');
        }
        const [purchaseOrderData, suppliersData, warehousesData] = await Promise.all([
          apiSrv.getById(id),
          suppliersApi.getAll(),
          warehousesApi.getAll()
        ]);
        setPurchaseOrder(purchaseOrderData);
        setSuppliers(suppliersData);
        setWarehouses(warehousesData);
      } catch (e: any) {
        setError(e?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (data: any) => {
    try {
      if (!purchaseOrder) {
        throw new Error('No purchase order loaded');
      }
      await apiSrv.update({ ...data, id: purchaseOrder.id! });
    } catch (e: any) {
      const msg = e?.message || 'Update failed';
      setError(msg);
      throw e;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>جاري التحميل...</Typography>
      </Box>
    );
  }

  if (error && !purchaseOrder) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!purchaseOrder) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error">أمر الشراء غير موجود</Typography>
      </Box>
    );
  }

  return (
    <>
      {isMobile ? (
        <MobilePurchaseOrderForm
          mode="edit"
          initialValues={purchaseOrder}
          suppliers={suppliers}
          warehouses={warehouses}
          onSubmit={handleSubmit}
        />
      ) : (
        <PurchaseOrderForm
          mode="edit"
          initialValues={purchaseOrder}
          suppliers={suppliers}
          warehouses={warehouses}
          onSubmit={handleSubmit}
        />
      )}

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditPurchaseOrderPage;
