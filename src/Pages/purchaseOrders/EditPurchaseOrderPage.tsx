import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Snackbar, Alert, Box, Typography, CircularProgress } from '@mui/material';
import PurchaseOrderForm from './components/PurchaseOrderForm';
import * as apiSrv from 'src/utils/api/purchaseOrdersApi';
import * as suppliersApi from 'src/utils/api/suppliersApi';
import * as warehousesApi from 'src/utils/api/warehousesApi';
import { PurchaseOrder } from 'src/utils/api/purchaseOrdersApi';
import { Supplier } from 'src/utils/api/suppliersApi';
import { Warehouse } from 'src/utils/api/warehousesApi';

const EditPurchaseOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
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

  const handleSubmit = async (data: any, saveAction: 'save' | 'saveAndNew') => {
    try {
      console.log('Updating purchase order:', data);
      
      if (!data.id) {
        throw new Error('Purchase Order ID is missing');
      }
      
      await apiSrv.update(data);
      
      if (saveAction === 'save') {
        navigate('/purchases/purchase-orders');
      } else {
        // للـ saveAndNew في التعديل، نذهب لصفحة إضافة جديدة
        navigate('/purchases/purchase-orders/add');
      }
    } catch (e: any) {
      console.error('Update error:', e);
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
      <PurchaseOrderForm
        mode="edit"
        initialValues={purchaseOrder}
        suppliers={suppliers}
        warehouses={warehouses}
        onSubmit={handleSubmit}
      />

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditPurchaseOrderPage;
