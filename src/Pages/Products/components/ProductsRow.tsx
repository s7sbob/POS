import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
  Avatar,
  Divider
} from '@mui/material';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import { Product } from './types';
import { StatusPill } from './StatusPill';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'src/store/Store';
import { deleteProduct } from 'src/store/slices/productsSlice';

interface Props {
  product: Product;
}

export const ProductRow: React.FC<Props> = ({ product }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        {/* --- top: name + actions --- */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar src={product.img} variant="rounded" sx={{ width: 40, height: 40 }} />
            <Stack spacing={0}>
              <Typography variant="subtitle1">{product.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                SKU: {product.sku} • {product.category}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={0.5} alignItems="center">
            <StatusPill status={product.status} />
            <IconButton
              size="small"
              component={RouterLink}
              to={`/inventory/products/${product.id}`}
            >
              <IconEye size={18} />
            </IconButton>
            <IconButton
              size="small"
              component={RouterLink}
              to={`/inventory/products/${product.id}/edit`}
            >
              <IconEdit size={18} />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => dispatch(deleteProduct(product.id))}
            >
              <IconTrash size={18} />
            </IconButton>
          </Stack>
        </Stack>

        <Divider sx={{ my: 1 }} />

        {/* --- bottom metrics --- */}
        <Stack direction="row" spacing={3} flexWrap="wrap">
          <Typography variant="caption">
            {t('products.price')}: ${product.price}
          </Typography>
          <Typography variant="caption">
            {t('products.qty')}: {product.qty}
          </Typography>
          <Typography variant="caption">
            {t('products.unit')}: {product.unit}
          </Typography>
          <Typography variant="caption">
            {t('products.brand')}: {product.brand}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};
