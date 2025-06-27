// File: src/pages/delivery/zones/components/ZoneForm.tsx
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Button, Box, Typography, Switch,
  FormControlLabel, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { IconDeviceFloppy, IconPlus as IconPlusNew } from '@tabler/icons-react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DeliveryZone } from 'src/utils/api/pagesApi/deliveryZonesApi';
import { getUserBranchesFromStorage, getDefaultBranch } from 'src/utils/branchUtils';

type FormValues = {
  name: string;
  deliveryCharge: number;
  defaultBonus: number;
  branchId?: string;
  isActive: boolean;
};

interface Props {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues?: DeliveryZone;
  onClose: () => void;
  onSubmit: (data: any, saveAction: 'save' | 'saveAndNew') => Promise<void>;
}

const ZoneForm: React.FC<Props> = ({
  open, mode, initialValues, onClose, onSubmit
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const branches = getUserBranchesFromStorage();
  const defaultBranch = getDefaultBranch();

  const defaults: FormValues = {
    name: '',
    deliveryCharge: 0,
    defaultBonus: 0,
    branchId: defaultBranch?.id || '',
    isActive: true
  };

  const { control, handleSubmit, reset, formState: { isSubmitSuccessful } } = useForm<FormValues>({
    defaultValues: defaults
  });

  React.useEffect(() => {
    if (open) {
      if (mode === 'add') {
        reset(defaults);
      } else if (initialValues) {
        reset({
          name: initialValues.name,
          deliveryCharge: initialValues.deliveryCharge,
          defaultBonus: initialValues.defaultBonus,
          branchId: initialValues.branchId || defaultBranch?.id || '',
          isActive: initialValues.isActive
        });
      }
    }
  }, [open, mode, initialValues, reset]);

  React.useEffect(() => {
    if (isSubmitSuccessful && mode === 'add') {
      const timer = setTimeout(() => {
        reset(defaults);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isSubmitSuccessful, mode, reset]);

  const submit = async (data: FormValues, saveAction: 'save' | 'saveAndNew') => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      if (mode === 'edit' && initialValues) {
        const updateData = {
          id: initialValues.id,
          name: data.name,
          deliveryCharge: Number(data.deliveryCharge),
          defaultBonus: Number(data.defaultBonus),
          branchId: data.branchId || null,
          isActive: data.isActive
        };
        await onSubmit(updateData, saveAction);
      } else {
        const addData = {
          name: data.name,
          deliveryCharge: Number(data.deliveryCharge),
          defaultBonus: Number(data.defaultBonus)
        };
        await onSubmit(addData, saveAction);
      }

      if (mode === 'add' && saveAction === 'saveAndNew') {
        setTimeout(() => {
          reset(defaults);
        }, 100);
      }
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'add' ? t('deliveryZones.add') : t('deliveryZones.edit')}
      </DialogTitle>

      <form>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                rules={{ required: t('deliveryZones.nameRequired') }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t('deliveryZones.form.name')}
                    fullWidth
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    onFocus={(e) => e.target.select()}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="deliveryCharge"
                control={control}
                rules={{ required: t('deliveryZones.deliveryChargeRequired'), min: 0 }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t('deliveryZones.form.deliveryCharge')}
                    type="number"
                    fullWidth
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    inputProps={{ min: 0, step: 0.01 }}
                    onFocus={(e) => e.target.select()}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="defaultBonus"
                control={control}
                rules={{ required: t('deliveryZones.defaultBonusRequired'), min: 0 }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t('deliveryZones.form.defaultBonus')}
                    type="number"
                    fullWidth
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    inputProps={{ min: 0, step: 0.01 }}
                    onFocus={(e) => e.target.select()}
                  />
                )}
              />
            </Grid>

            {mode === 'edit' && branches.length > 1 && (
              <Grid item xs={12}>
                <Controller
                  name="branchId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>{t('deliveryZones.form.branch')}</InputLabel>
                      <Select
                        {...field}
                        label={t('deliveryZones.form.branch')}
                      >
                        <MenuItem value="">
                          <em>{t('deliveryZones.form.allBranches')}</em>
                        </MenuItem>
                        {branches.map((branch) => (
                          <MenuItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
            )}

            {mode === 'edit' && (
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Controller
                      name="isActive"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  }
                  label={t('deliveryZones.form.isActive')}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={onClose} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          
          <Button 
            variant="outlined"
            startIcon={<IconDeviceFloppy size={20} />}
            onClick={handleSubmit((data) => submit(data, 'save'))}
            disabled={isSubmitting}
          >
            {t('deliveryZones.saveAndExit')}
          </Button>
          
          <Button 
            variant="contained"
            startIcon={<IconPlusNew size={20} />}
            onClick={handleSubmit((data) => submit(data, 'saveAndNew'))}
            disabled={isSubmitting}
          >
            {t('deliveryZones.saveAndNew')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ZoneForm;
