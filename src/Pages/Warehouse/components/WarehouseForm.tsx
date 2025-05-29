import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Switch, FormControlLabel, Button
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Warehouse } from 'src/utils/warehousesApi';

type FormValues = {
  name: string;
  code: number;
  address: string;
  isActive: boolean;
};

interface Props {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues?: Warehouse;
  onClose: () => void;
  onSubmit: (data: FormValues | Warehouse) => void;
}

const WarehouseForm: React.FC<Props> = ({
  open, mode, initialValues, onClose, onSubmit
}) => {
  const { t } = useTranslation();

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: initialValues
      ? { ...initialValues }
      : { name: '', code: 0, address: '', isActive: true },
  });

  React.useEffect(() => {
    if (initialValues) reset({ ...initialValues });
  }, [initialValues, reset]);

  const submit = (data: FormValues) => onSubmit(
    mode === 'add' ? data : { ...initialValues!, ...data }
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === 'add' ? t('warehouses.add') : t('warehouses.edit')}</DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field }) => <TextField {...field} label={t('warehouses.name')} fullWidth />}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="code"
              control={control}
              rules={{ required: true, min: 0 }}
              render={({ field }) => <TextField {...field} type="number" label="Code" fullWidth />}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="address"
              control={control}
              rules={{ required: true }}
              render={({ field }) => <TextField {...field} label={t('warehouses.address')} fullWidth />}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                  label={t('warehouses.status')}
                />
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button variant="contained" onClick={handleSubmit(submit)}>
          {mode === 'add' ? t('warehouses.add') : t('warehouses.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarehouseForm;
