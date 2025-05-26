// src/pages/products/EditProductPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProductForm } from './ProductForm';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { updateProduct } from 'src/store/slices/productsSlice';
import { Product } from './types';

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const product = useAppSelector((state) => state.productsReducer.items.find((p) => p.id === id));

  if (!product) return null; // TODO: 404 page

  const handleUpdate = (data: Product) => {
    dispatch(updateProduct({ ...data, id: product.id }));
    navigate('/inventory/products');
  };

  return (
    <ProductForm
      mode="edit"
      defaultValues={product}
      onSubmit={handleUpdate}
      categories={[ 'Computers', 'Electronics', 'Furniture', 'Bags' ]}
      brands={[ 'Apple', 'Lenovo', 'Nike', 'Beats' ]}
      units={[ 'Pc', 'Kg', 'Box' ]}
    />
  );
};
export default EditProductPage;
