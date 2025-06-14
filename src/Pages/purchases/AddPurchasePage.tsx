// File: src/pages/purchases/AddPurchasePage.tsx
import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Box, Typography, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PurchaseForm from './components/PurchaseForm';
import * as apiSrv from 'src/utils/api/pagesApi/purchaseApi';
import * as suppliersApi from 'src/utils/api/pagesApi/suppliersApi';
import * as warehousesApi from 'src/utils/api/pagesApi/warehousesApi';
import { Supplier } from 'src/utils/api/pagesApi/suppliersApi';
import { Warehouse } from 'src/utils/api/pagesApi/warehousesApi';

const AddPurchasePage: React.FC = () => {
  const { t } = useTranslation();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
        setError(e?.message || t('purchases.errors.dataLoadFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  const handleSubmit = async (data: any) => {
    try {
      console.log('Adding purchase (data):', data);
      await apiSrv.add(data);
      setSuccess(t('purchases.messages.addSuccess'));
    } catch (e: any) {
      const msg = e?.message || t('purchases.errors.addFailed');
      setError(msg);
      throw e;
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={4}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>{t('common.loading')}</Typography>
      </Box>
    );
  }

  return (
    <>
      <PurchaseForm
        mode="add"
        suppliers={suppliers}
        warehouses={warehouses}
        onSubmit={handleSubmit}
      />

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={!!success} autoHideDuration={4000} onClose={() => setSuccess('')}>
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddPurchasePage;
