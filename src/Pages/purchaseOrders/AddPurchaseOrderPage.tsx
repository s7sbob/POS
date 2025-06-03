import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import PurchaseOrderForm from './components/PurchaseOrderForm';
import * as apiSrv from 'src/utils/api/purchaseOrdersApi';
import * as suppliersApi from 'src/utils/api/suppliersApi';
import * as warehousesApi from 'src/utils/api/warehousesApi';
import { Supplier } from 'src/utils/api/suppliersApi';
import { Warehouse } from 'src/utils/api/warehousesApi';

const AddPurchaseOrderPage: React.FC = () => {
  const navigate = useNavigate();
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

  const handleSubmit = async (data: any, saveAction: 'save' | 'saveAndNew') => {
    try {
      console.log('Adding purchase order:', data);
      await apiSrv.add(data);
      
      if (saveAction === 'save') {
        navigate('/purchases/purchase-orders');
      }
      // إذا كان saveAndNew، الفورم سيقوم بإعادة تعيين البيانات تلقائياً
    } catch (e: any) {
      const msg = e?.message || 'Add failed';
      setError(msg);
      throw e;
    }
  };

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <>
      <PurchaseOrderForm
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
    </>
  );
};

export default AddPurchaseOrderPage;
