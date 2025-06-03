import React, { useRef } from 'react';
import { Grid, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Control, Controller } from 'react-hook-form';
import { Supplier } from 'src/utils/api/suppliersApi';
import { Warehouse } from 'src/utils/api/warehousesApi';
import SearchableSelect from '../SearchableSelect';

interface Props {
  control: Control<any>;
  suppliers: Supplier[];
  warehouses: Warehouse[];
}

const BasicInfoSection: React.FC<Props> = ({ control, suppliers, warehouses }) => {
  const { t } = useTranslation();
  const firstInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {/* السطر الأول */}
      <Grid item xs={12} md={3}>
        <Controller
          name="referenceDocNumber"
          control={control}
          rules={{ required: t('purchaseOrders.docNumberRequired') }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              inputRef={firstInputRef}
              label={t('purchaseOrders.docNumber')}
              fullWidth
              size="small"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              onFocus={(e) => e.target.select()}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <Controller
          name="date1"
          control={control}
          rules={{ required: t('purchaseOrders.dateRequired') }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label={t('purchaseOrders.date')}
              type="date"
              fullWidth
              size="small"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              InputLabelProps={{ shrink: true }}
              onFocus={(e) => e.target.select()}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <Controller
          name="supplierId"
          control={control}
          rules={{ required: t('purchaseOrders.supplierRequired') }}
          render={({ field, fieldState }) => (
            <SearchableSelect
              label={t('purchaseOrders.supplier')}
              value={field.value}
              onChange={field.onChange}
              options={suppliers.map(s => ({ id: s.id, name: s.name }))}
              placeholder={t('purchaseOrders.selectSupplier')}
              error={!!fieldState.error}
              autoFocusSearch={true}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <Controller
          name="warehouseId"
          control={control}
          rules={{ required: t('purchaseOrders.warehouseRequired') }}
          render={({ field, fieldState }) => (
            <SearchableSelect
              label={t('purchaseOrders.warehouse')}
              value={field.value}
              onChange={field.onChange}
              options={warehouses.map(w => ({ id: w.id, name: w.name }))}
              placeholder={t('purchaseOrders.selectWarehouse')}
              error={!!fieldState.error}
              autoFocusSearch={true}
            />
          )}
        />
      </Grid>

      {/* السطر الثاني - Total Discount & Total Tax */}
      <Grid item xs={12} md={6}>
        <Controller
          name="discountPercent"
          control={control}
          rules={{ 
            min: { value: 0, message: t('validation.minValue') },
            max: { value: 100, message: t('validation.maxPercent') }
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label={t('purchaseOrders.totalDiscount')}
              type="number"
              fullWidth
              size="small"
              inputProps={{ min: 0, max: 100, step: 0.01 }}
              InputProps={{ 
                endAdornment: '%',
                sx: {
                  '& input[type=number]': {
                    '-moz-appearance': 'textfield',
                  },
                  '& input[type=number]::-webkit-outer-spin-button': {
                    '-webkit-appearance': 'none',
                    margin: 0,
                  },
                  '& input[type=number]::-webkit-inner-spin-button': {
                    '-webkit-appearance': 'none',
                    margin: 0,
                  },
                },
              }}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              onFocus={(e) => e.target.select()}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Controller
          name="taxPercent"
          control={control}
          rules={{ 
            min: { value: 0, message: t('validation.minValue') },
            max: { value: 100, message: t('validation.maxPercent') }
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label={t('purchaseOrders.totalTax')}
              type="number"
              fullWidth
              size="small"
              inputProps={{ min: 0, max: 100, step: 0.01 }}
              InputProps={{ 
                endAdornment: '%',
                sx: {
                  '& input[type=number]': {
                    '-moz-appearance': 'textfield',
                  },
                  '& input[type=number]::-webkit-outer-spin-button': {
                    '-webkit-appearance': 'none',
                    margin: 0,
                  },
                  '& input[type=number]::-webkit-inner-spin-button': {
                    '-webkit-appearance': 'none',
                    margin: 0,
                  },
                },
              }}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              onFocus={(e) => e.target.select()}
            />
          )}
        />
      </Grid>
    </>
  );
};

export default BasicInfoSection;
