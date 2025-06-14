// File: src/pages/purchases/EditPurchasePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Snackbar, Alert, Box, Typography, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PurchaseForm from './components/PurchaseForm';
import * as apiSrv from 'src/utils/api/pagesApi/purchaseApi';
import * as suppliersApi from 'src/utils/api/pagesApi/suppliersApi';
import * as warehousesApi from 'src/utils/api/pagesApi/warehousesApi';
import { Purchase } from 'src/utils/api/pagesApi/purchaseApi';
import { Supplier } from 'src/utils/api/pagesApi/suppliersApi';
import { Warehouse } from 'src/utils/api/pagesApi/warehousesApi';

const EditPurchasePage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          throw new Error(t('purchases.errors.idRequired'));
        }
        const [purchaseData, suppliersData, warehousesData] = await Promise.all([
          apiSrv.getById(id),
          suppliersApi.getAll(),
          warehousesApi.getAll()
        ]);
        setPurchase(purchaseData);
        setSuppliers(suppliersData);
        setWarehouses(warehousesData);
      } catch (e: any) {
        setError(e?.message || t('purchases.errors.dataLoadFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, t]);

  const handleSubmit = async (data: any) => {
    try {
      console.log('Updating purchase:', data);
      if (!purchase) {
        throw new Error(t('purchases.errors.noPurchaseLoaded'));
      }
      await apiSrv.update({ ...data, id: purchase.id! });
      setSuccess(t('purchases.messages.updateSuccess'));
    } catch (e: any) {
      console.error('Update error:', e);
      const msg = e?.message || t('purchases.errors.updateFailed');
      setError(msg);
      throw e;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>{t('common.loading')}</Typography>
      </Box>
    );
  }

  if (error && !purchase) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!purchase) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error">{t('purchases.errors.purchaseNotFound')}</Typography>
      </Box>
    );
  }

  return (
    <>
      <PurchaseForm
        mode="edit"
        initialValues={purchase}
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

export default EditPurchasePage;
