import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Switch, FormControlLabel, Button
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Unit } from 'src/utils/api/pagesApi/unitsApi';

/* ---------- types ---------- */
type FormValues = { name: string; isActive: boolean };

interface Props {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues?: Unit;
  onClose: () => void;
  onSubmit: (data: FormValues | Unit) => void;
}

/* ---------- helpers ---------- */
const nextOnEnter = (e: React.KeyboardEvent) => {
  if (e.key !== 'Enter') return;
  const form = (e.currentTarget as HTMLInputElement).form!;
  const idx = Array.prototype.indexOf.call(form, e.currentTarget);
  if (idx > -1 && idx + 1 < form.elements.length) {
    (form.elements[idx + 1] as HTMLElement).focus();
  } else {
    (form as HTMLFormElement).requestSubmit();
  }
  e.preventDefault();
};

/* ---------- component ---------- */
const UnitForm: React.FC<Props> = ({
  open, mode, initialValues, onClose, onSubmit
}) => {
  const { t } = useTranslation();
  const defaults: FormValues = { name: '', isActive: true };

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: mode === 'add' ? defaults : {
      name: initialValues?.name ?? '',
      isActive: initialValues?.isActive ?? true,
    },
  });

  /* -- reset القيم عند تغيير النمط -- */
  React.useEffect(() => {
    if (mode === 'add') reset(defaults);
    else if (initialValues) reset({
      name: initialValues.name,
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
      <DialogTitle>
        {mode === 'add' ? t('units.add') : t('units.edit')}
      </DialogTitle>

      <form onSubmit={handleSubmit(submit)}>
        <DialogContent>
          <Grid container spacing={3}>
            {/* ---------- Name ---------- */}
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                rules={{ required: t('units.nameRequired') }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t('units.name')}
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
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
                    control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                    label={t('units.status')}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="contained">
            {mode === 'add' ? t('units.add') : t('units.save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UnitForm;
