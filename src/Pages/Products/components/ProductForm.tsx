// src/components/products/ProductForm.tsx
import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  TextField,
  MenuItem,
  Button,
  Stack,
  Divider
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
export type ProductFormValues = {
  sku: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  unit: string;
  quantity: number;
  imageUrl?: string;
  description?: string;
};

export interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => void;
  mode: 'add' | 'edit';
  categories: string[];
  brands: string[];
  units: string[];
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
export const ProductForm: React.FC<ProductFormProps> = ({
  defaultValues,
  onSubmit,
  mode,
  categories,
  brands,
  units
}) => {
  const { t } = useTranslation();

  /* Yup schema (matches only the editable fields) */

/* 2️⃣ useForm كما هو، لا تغيير */
const {
  control,
  handleSubmit,
  formState: { errors }
} = useForm<ProductFormValues>({
  defaultValues: defaultValues as ProductFormValues,
  // resolver: yupResolver(schema)
});

  const submitHandler: SubmitHandler<ProductFormValues> = (data) => {
    onSubmit(data);
  };
  return (
    <Box component="form" onSubmit={handleSubmit(submitHandler)} noValidate>
      {/* ─── Basic Info ─────────────────────────────────────────────── */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardHeader title={t('products.form.basicInfo')} />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            {/* SKU */}
            <Grid item xs={12} md={4}>
              <Controller
                name="sku"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t('products.sku')}
                    error={!!errors.sku}
                    helperText={errors.sku?.message}
                  />
                )}
              />
            </Grid>

            {/* Name */}
            <Grid item xs={12} md={8}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t('products.name')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            {/* Category */}
            <Grid item xs={12} md={4}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label={t('products.category')}
                    error={!!errors.category}
                    helperText={errors.category?.message}
                  >
                    {categories.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            {/* Brand */}
            <Grid item xs={12} md={4}>
              <Controller
                name="brand"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label={t('products.brand')}
                    error={!!errors.brand}
                    helperText={errors.brand?.message}
                  >
                    {brands.map((b) => (
                      <MenuItem key={b} value={b}>
                        {b}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            {/* Price */}
            <Grid item xs={12} md={4}>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label={t('products.price')}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ─── Inventory Info ─────────────────────────────────────────── */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardHeader title={t('products.form.inventoryInfo')} />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            {/* Unit */}
            <Grid item xs={12} md={4}>
              <Controller
                name="unit"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label={t('products.unit')}
                    error={!!errors.unit}
                    helperText={errors.unit?.message}
                  >
                    {units.map((u) => (
                      <MenuItem key={u} value={u}>
                        {u}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            {/* Quantity */}
            <Grid item xs={12} md={4}>
              <Controller
                name="quantity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    fullWidth
                    label={t('products.qty')}
                    error={!!errors.quantity}
                    helperText={errors.quantity?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ─── Image & Description ────────────────────────────────────── */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardHeader title={t('products.form.uploadImage')} />
        <Divider />
        <CardContent>
          <Stack spacing={2}>
            {/* Image URL */}
            <Controller
              name="imageUrl"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth type="url" label="Image URL" placeholder="https://…" />
              )}
            />

            {/* Description */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth multiline minRows={4} label={t('products.form.description')} />
              )}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* ─── Actions ─────────────────────────────────────────────────── */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
        <Button variant="contained" type="submit">
          {mode === 'add' ? t('products.form.save') : t('products.form.update')}
        </Button>
        <Button variant="outlined" color="secondary" type="button" onClick={() => history.back()}>
          {t('products.form.cancel')}
        </Button>
      </Stack>
    </Box>
  );
};
