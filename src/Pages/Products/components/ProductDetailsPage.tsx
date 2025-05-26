// src/pages/products/ProductDetailsPage.tsx
import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Divider,
  Button
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'src/store/hooks';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const product = useAppSelector((state) => state.productsReducer.products.find((p: { id: string | undefined; }) => p.id === id));

  if (!product) return null; // TODO: 404 page

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h5">{t('products.details.header')}</Typography>
        <Button component={RouterLink} to="/inventory/products" variant="outlined">
          {t('products.details.back')}
        </Button>
      </Stack>
      <Card variant="outlined">
        <Grid container>
          <Grid item xs={12} md={4}>
            <CardMedia
              component="img"
              height="100%"
              image={product.imageUrl || 'https://via.placeholder.com/400x400?text=No+Image'}
              alt={product.name}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Divider />
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="subtitle2">{t('products.sku')}</Typography>
                    <Typography>{product.sku}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="subtitle2">{t('products.category')}</Typography>
                    <Typography>{product.category}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="subtitle2">{t('products.brand')}</Typography>
                    <Typography>{product.brand}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="subtitle2">{t('products.price')}</Typography>
                    <Typography>${product.price}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="subtitle2">{t('products.qty')}</Typography>
                    <Typography>{product.quantity}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="subtitle2">{t('products.unit')}</Typography>
                    <Typography>{product.unit}</Typography>
                  </Grid>
                </Grid>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle2">{t('products.status')}</Typography>
                  <Chip label={product.status} color={product.status === 'active' ? 'success' : 'default'} size="small" />
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {t('products.createdBy')}: {product.createdBy}
                </Typography>
              </Stack>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};
export default ProductDetailsPage;