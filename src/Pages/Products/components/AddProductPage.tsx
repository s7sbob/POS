// src/pages/products/AddProductPage.tsx
import React from 'react';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProductForm } from './ProductForm';
import { Product } from './types';
import { useAppDispatch } from 'src/store/hooks';
import { addProduct } from 'src/store/slices/productsSlice';

const AddProductPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSave = (data: Product) => {
    dispatch(addProduct({ 
      ...data, 
      id: uuid(), 
      createdAt: new Date().toISOString(), 
      createdBy: { name: 'Admin', avatar: '' } 
    }));
    navigate('/inventory/products');
  };

  return (
    <ProductForm
      mode="add"
      onSubmit={handleSave}
      categories={[ 'Computers', 'Electronics', 'Furniture', 'Bags' ]} // TODO: replace with API
      brands={[ 'Apple', 'Lenovo', 'Nike', 'Beats' ]}
      units={[ 'Pc', 'Kg', 'Box' ]}
    />
  );
};
export default AddProductPage;
