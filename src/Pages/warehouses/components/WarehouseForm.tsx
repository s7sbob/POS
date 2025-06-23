import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Switch, FormControlLabel, Button
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Warehouse } from 'src/utils/api/pagesApi/warehousesApi';

/* ---------- types ---------- */
type FormValues = { name: string; address: string; isActive: boolean };

interface Props {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues?: Warehouse;
  onClose: () => void;
  onSubmit: (data: FormValues | Warehouse) => void;
}

/* ---------- helpers ---------- */
const nextOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key !== 'Enter') return;
  const form = e.currentTarget.form!;
  const idx  = Array.prototype.indexOf.call(form, e.currentTarget);
  if (idx > -1 && idx + 1 < form.elements.length) {
    (form.elements[idx + 1] as HTMLElement).focus();
  } else {
    (form as HTMLFormElement).requestSubmit();
  }
  e.preventDefault();
};

/* ---------- component ---------- */
const WarehouseForm: React.FC<Props> = ({
  open, mode, initialValues, onClose, onSubmit
}) => {
  const { t } = useTranslation();

  const defaults: FormValues = { name: '', address: '', isActive: true };

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: mode === 'add' ? defaults : {
      name:      initialValues?.name   ?? '',
      address:   initialValues?.address?? '',
      isActive:  initialValues?.isActive ?? true,
    },
  });

  /* -- reset القيم عند تغيير النمط -- */
  React.useEffect(() => {
    if (mode === 'add') reset(defaults);
    else if (initialValues) reset({
      name: initialValues.name,
      address: initialValues.address,
      isActive: initialValues.isActive,
    });
  }, [mode, initialValues, reset]);

  const submit = (data: FormValues) =>
    onSubmit(mode === 'add'
      ? data
      : { ...initialValues!, ...data }
    );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === 'add' ? t('warehouses.add') : t('warehouses.edit')}</DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* ---------- Name ---------- */}
          <Grid item xs={12}>
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  autoFocus
                  fullWidth
                  label={t('warehouses.name')}
                  error={fieldState.invalid}
                  helperText={fieldState.invalid && t('validation.required')}
                  onKeyDown={nextOnEnter}
                />
              )}
            />
          </Grid>

          {/* ---------- Address ---------- */}
          <Grid item xs={12}>
            <Controller
              name="address"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t('warehouses.address')}
                  error={fieldState.invalid}
                  helperText={fieldState.invalid && t('validation.required')}
                  onKeyDown={nextOnEnter}
                />
              )}
            />
          </Grid>

          {/* ---------- Status ---------- */}
          <Grid item xs={12}>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value}
                                   onChange={e => field.onChange(e.target.checked)} />}
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
