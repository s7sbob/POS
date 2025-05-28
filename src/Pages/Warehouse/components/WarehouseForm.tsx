import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  Button,
  DialogActions,
  Switch,
  FormControlLabel
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { Warehouse } from './types';

type FormValues = Omit<Warehouse, 'id' | 'createdOn'>;

interface Props {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues?: Warehouse;
  onClose: () => void;
  onSubmit: (data: Warehouse | FormValues) => void;
}

const WarehouseForm: React.FC<Props> = ({
  open,
  mode,
  initialValues,
  onClose,
  onSubmit
}) => {
  const { t } = useTranslation();


  type FormValues = {
  name: string;
  phone: string;
  address: string;
  /* بقية الحقول … */
  status: 'active' | 'inactive';
};



const { control, handleSubmit, reset, formState: { errors } } =
  useForm<FormValues>({
    // resolver: yupResolver(schema),
    defaultValues: initialValues
      ? { ...initialValues }               // يسقط id و createdOn تلقائياً
      : { name: '', phone: '', address: '', status: 'active' }
  });

  /* reset form when switching between add / edit */
  React.useEffect(() => {
    if (initialValues) reset({ ...initialValues });
  }, [initialValues, reset]);

  const submit = (data: FormValues) => {
    if (mode === 'add') onSubmit(data);
    else if (initialValues) onSubmit({ ...initialValues, ...data });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'add' ? t('warehouses.add') : t('warehouses.edit')}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('warehouses.name')}
                  fullWidth
                  error={!!errors.name}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('warehouses.phone')}
                  fullWidth
                  error={!!errors.phone}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('warehouses.address')}
                  fullWidth
                  error={!!errors.address}
                />
              )}
            />
          </Grid>
          {/* status switch */}
          <Grid item xs={12}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value === 'active'}
                      onChange={(e) => field.onChange(e.target.checked ? 'active' : 'inactive')}
                    />
                  }
                  label={t('warehouses.status')}
                />
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          {t('common.cancel')}
        </Button>
        <Button onClick={handleSubmit(submit)} variant="contained">
          {mode === 'add' ? t('warehouses.add') : t('warehouses.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarehouseForm;
