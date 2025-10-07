// File: src/pages/delivery/companies/components/CompanyForm.tsx
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem,
  Switch, FormControlLabel
} from '@mui/material';
import { IconDeviceFloppy, IconPlus as IconPlusNew } from '@tabler/icons-react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DeliveryCompany } from 'src/utils/api/pagesApi/deliveryCompaniesApi';

type FormValues = {
  name: string;
  paymentType: string;
  companySharePercentage: number;
  visaCollectionCommissionPercentage: number;
  taxPercentage: number;
  phone: string;
  email: string;
  contactPerson: string;
  notes: string;
  isActive: boolean;
};

interface Props {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues?: DeliveryCompany;
  onClose: () => void;
  onSubmit: (data: any, saveAction: 'save' | 'saveAndNew') => Promise<void>;
}

const CompanyForm: React.FC<Props> = ({
  open, mode, initialValues, onClose, onSubmit
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const defaults: FormValues = {
    name: '',
    paymentType: 'Cash',
    companySharePercentage: 0,
    visaCollectionCommissionPercentage: 0,
    taxPercentage: 0,
    phone: '',
    email: '',
    contactPerson: '',
    notes: '',
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
          paymentType: initialValues.paymentType,
          companySharePercentage: initialValues.companySharePercentage,
          visaCollectionCommissionPercentage: initialValues.visaCollectionCommissionPercentage,
          taxPercentage: initialValues.taxPercentage,
          phone: initialValues.phone,
          email: initialValues.email,
          contactPerson: initialValues.contactPerson,
          notes: initialValues.notes || '',
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
          paymentType: data.paymentType,
          companySharePercentage: Number(data.companySharePercentage),
          visaCollectionCommissionPercentage: Number(data.visaCollectionCommissionPercentage),
          taxPercentage: Number(data.taxPercentage),
          phone: data.phone,
          email: data.email,
          contactPerson: data.contactPerson,
          notes: data.notes,
          isActive: data.isActive
        };
        await onSubmit(updateData, saveAction);
      } else {
        const addData = {
          name: data.name,
          paymentType: data.paymentType,
          companySharePercentage: Number(data.companySharePercentage),
          visaCollectionCommissionPercentage: Number(data.visaCollectionCommissionPercentage),
          taxPercentage: Number(data.taxPercentage),
          phone: data.phone,
          email: data.email,
          contactPerson: data.contactPerson,
          notes: data.notes,
          isActive: data.isActive
        };
        await onSubmit(addData, saveAction);
      }

      if (mode === 'add' && saveAction === 'saveAndNew') {
        setTimeout(() => {
          reset(defaults);
        }, 100);
      }
    } catch (error) {
      // Error handled by global error handler
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === 'add' ? t('deliveryCompanies.add') : t('deliveryCompanies.edit')}
      </DialogTitle>

      <form>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Company Name */}
            <Grid item xs={12} md={6}>
              <Controller
                name="name"
                control={control}
                rules={{ required: t('deliveryCompanies.nameRequired') }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t('deliveryCompanies.form.name')}
                    fullWidth
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    onFocus={(e) => e.target.select()}
                  />
                )}
              />
            </Grid>

            {/* Payment Type */}
            <Grid item xs={12} md={6}>
              <Controller
                name="paymentType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>{t('deliveryCompanies.form.paymentType')}</InputLabel>
                    <Select
                      {...field}
                      label={t('deliveryCompanies.form.paymentType')}
                    >
                      <MenuItem value="Cash">{t('deliveryCompanies.form.cash')}</MenuItem>
                      <MenuItem value="Visa">{t('deliveryCompanies.form.visa')}</MenuItem>
                      <MenuItem value="InChoice">{t('deliveryCompanies.form.inChoice')}</MenuItem>

                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            {/* Company Share Percentage */}
            <Grid item xs={12} md={6}>
              <Controller
                name="companySharePercentage"
                control={control}
                rules={{ 
                  required: t('deliveryCompanies.companyShareRequired'),
                  min: { value: 0, message: t('deliveryCompanies.percentageMin') },
                  max: { value: 100, message: t('deliveryCompanies.percentageMax') }
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t('deliveryCompanies.form.companySharePercentage')}
                    type="number"
                    fullWidth
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                    onFocus={(e) => e.target.select()}
                  />
                )}
              />
            </Grid>

            {/* Visa Collection Commission */}
            <Grid item xs={12} md={6}>
              <Controller
                name="visaCollectionCommissionPercentage"
                control={control}
                rules={{ 
                  min: { value: 0, message: t('deliveryCompanies.percentageMin') },
                  max: { value: 100, message: t('deliveryCompanies.percentageMax') }
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t('deliveryCompanies.form.visaCollectionCommissionPercentage')}
                    type="number"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                    onFocus={(e) => e.target.select()}
                  />
                )}
              />
            </Grid>

            {/* Tax Percentage */}
            <Grid item xs={12} md={6}>
              <Controller
                name="taxPercentage"
                control={control}
                rules={{ 
                  min: { value: 0, message: t('deliveryCompanies.percentageMin') },
                  max: { value: 100, message: t('deliveryCompanies.percentageMax') }
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t('deliveryCompanies.form.taxPercentage')}
                    type="number"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                    onFocus={(e) => e.target.select()}
                  />
                )}
              />
            </Grid>

            {/* Phone */}
            <Grid item xs={12} md={6}>
              <Controller
                name="phone"
                control={control}
                rules={{ 
                  pattern: {
                    value: /^01[0-9]{9}$/,
                    message: t('deliveryCompanies.phoneInvalid')
                  }
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t('deliveryCompanies.form.phone')}
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    placeholder="01012345678"
                    onFocus={(e) => e.target.select()}
                  />
                )}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} md={6}>
              <Controller
                name="email"
                control={control}
                rules={{ 
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t('deliveryCompanies.emailInvalid')
                  }
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t('deliveryCompanies.form.email')}
                    type="email"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    onFocus={(e) => e.target.select()}
                  />
                )}
              />
            </Grid>

            {/* Contact Person */}
            <Grid item xs={12} md={6}>
              <Controller
                name="contactPerson"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t('deliveryCompanies.form.contactPerson')}
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    onFocus={(e) => e.target.select()}
                  />
                )}
              />
            </Grid>

            {/* Notes */}
            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('deliveryCompanies.form.notes')}
                    fullWidth
                    multiline
                    rows={3}
                    placeholder={t('deliveryCompanies.form.notesPlaceholder')}
                  />
                )}
              />
            </Grid>

            {/* Active Status */}
            <Grid item xs={12}>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    }
                    label={t('deliveryCompanies.form.isActive')}
                  />
                )}
              />
            </Grid>
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
            {t('deliveryCompanies.saveAndExit')}
          </Button>
          
          <Button 
            variant="contained"
            startIcon={<IconPlusNew size={20} />}
            onClick={handleSubmit((data) => submit(data, 'saveAndNew'))}
            disabled={isSubmitting}
          >
            {t('deliveryCompanies.saveAndNew')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CompanyForm;
