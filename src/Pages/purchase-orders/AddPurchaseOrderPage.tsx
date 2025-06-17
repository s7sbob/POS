// File: src/pages/purchases/purchase-orders/AddPurchaseOrderPage.tsx
import React, { useState, useEffect } from 'react';
import { useMediaQuery, useTheme, Snackbar, Alert, Box, Typography, CircularProgress } from '@mui/material';
import PurchaseOrderForm from './components/PurchaseOrderForm';
import MobilePurchaseOrderForm from './components/mobile/MobilePurchaseOrderForm';
import * as apiSrv from 'src/utils/api/pagesApi/purchaseOrdersApi';
import * as suppliersApi from 'src/utils/api/pagesApi/suppliersApi';
import * as warehousesApi from 'src/utils/api/pagesApi/warehousesApi';
import { Supplier } from 'src/utils/api/pagesApi/suppliersApi';
import { Warehouse } from 'src/utils/api/pagesApi/warehousesApi';

const AddPurchaseOrderPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersData, warehousesData] = await Promise.all([
          suppliersApi.getAll(),
          warehousesApi.getAll()
        ]);
        setSuppliers(suppliersData);
        setWarehouses(warehousesData);
      } catch (e: any) {
        setError(e?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (data: any) => {
    try {
      await apiSrv.add(data);
    } catch (e: any) {
      const msg = e?.message || 'Add failed';
      setError(msg);
      throw e;
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={4}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>جاري التحميل...</Typography>
      </Box>
    );
  }

  return (
    <>
      {isMobile ? (
        <MobilePurchaseOrderForm
          mode="add"
          suppliers={suppliers}
          warehouses={warehouses}
          onSubmit={handleSubmit}
        />
      ) : (
        <PurchaseOrderForm
          mode="add"
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

export default AddPurchaseOrderPage;
