// src/pages/products/AddProductPage.tsx
import React from 'react';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProductForm, ProductFormValues } from './ProductForm';
import { Product } from './types';
import { useAppDispatch } from 'src/store/hooks';
import { addProduct } from 'src/store/slices/productsSlice';

const AddProductPage: React.FC = () => {
  useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

const handleSave = (values: ProductFormValues) => {
  const product: Product = {
    ...values,
    id: uuid(),
    img: '', // أو رابط افتراضى
    qty: values.quantity,
    createdAt: new Date().toISOString(),
    createdBy: { name: 'Admin', avatar: '' },
    status: 'active'
  };

  dispatch(addProduct(product));
  navigate('/inventory/products');
};

  return (
<ProductForm
  mode="add"
  onSubmit={handleSave}
  categories={['Computers', 'Electronics', 'Furniture', 'Bags']}
  brands={['Apple', 'Lenovo', 'Nike', 'Beats']}
  units={['Pc', 'Kg', 'Box']}
/>
  );
};
export default AddProductPage;
