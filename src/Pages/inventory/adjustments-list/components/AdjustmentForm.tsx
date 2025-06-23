// File: src/pages/inventory/adjustment/components/AdjustmentForm.tsx
import React from 'react';
import {
  Grid,
  TextField} from '@mui/material';
import { Controller, Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Warehouse } from 'src/utils/api/pagesApi/warehousesApi';
import SearchableSelect from '../../../components/SearchableSelect';

interface Props {
  control: Control<any>;
  warehouses: Warehouse[];
  hasAdjustment: boolean;
  adjustmentType: number;
  isReadOnly?: boolean;
}

const AdjustmentForm: React.FC<Props> = ({
  control,
  warehouses,
  adjustmentType}) => {
  const { t } = useTranslation();

  const adjustmentTypeOptions = [
    { value: 1, label: t('adjustment.types.openingBalance') },
    { value: 2, label: t('adjustment.types.manualAdjustment') }
  ];

  const getAdjustmentTypeLabel = (type: number) => {
    const option = adjustmentTypeOptions.find(opt => opt.value === type);
    return option ? option.label : t('adjustment.types.notSelected');
  };

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} md={3}>
        <Controller
          name="warehouseId"
          control={control}
          rules={{ required: t('adjustment.form.validation.warehouseRequired') }}
          render={({ field, fieldState }) => (
            <SearchableSelect
              label={t('adjustment.form.warehouse')}
              value={field.value}
              onChange={field.onChange}
              options={warehouses.map(w => ({ id: w.id, name: w.name }))}
              placeholder={t('adjustment.form.selectWarehouse')}
              error={!!fieldState.error}
              size="small"
            />
          )}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        {adjustmentType === 0 ? (
          <TextField
            label={t('adjustment.form.adjustmentType')}
            value={t('adjustment.types.notSelected')}
            fullWidth
            size="small"
            InputProps={{ readOnly: true }}
            variant="filled"
          />
        ) : (
          <TextField
            label={t('adjustment.form.adjustmentType')}
            value={getAdjustmentTypeLabel(adjustmentType)}
            fullWidth
            size="small"
            InputProps={{ readOnly: true }}
            variant="filled"
          />
        )}
      </Grid>

      <Grid item xs={12} md={3}>
        <Controller
          name="referenceNumber"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t('adjustment.form.referenceNumber')}
              fullWidth
              size="small"
            />
          )}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <Controller
          name="reason"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t('adjustment.form.reason')}
              fullWidth
              size="small"
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default AdjustmentForm;
