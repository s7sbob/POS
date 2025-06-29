// File: src/pages/pos/customers/components/CustomerForm.tsx
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Button, Box, Switch, Typography,
  FormControlLabel, Card, CardContent, IconButton, Divider,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { IconDeviceFloppy, IconPlus as IconPlusNew, IconTrash, IconPlus } from '@tabler/icons-react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Customer, CustomerAddress } from 'src/utils/api/pagesApi/customersApi';
import * as deliveryZonesApi from 'src/utils/api/pagesApi/deliveryZonesApi';

type FormValues = {
  name: string;
  phone1: string;
  phone2: string;
  phone3: string;
  phone4: string;
  isVIP: boolean;
  isBlocked: boolean;
  isActive: boolean;
  addresses: CustomerAddress[];
};

interface Props {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues?: Customer;
  onClose: () => void;
  onSubmit: (data: any, saveAction: 'save' | 'saveAndNew') => Promise<void>;
}

const CustomerForm: React.FC<Props> = ({
  open, mode, initialValues, onClose, onSubmit
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [zones, setZones] = React.useState<any[]>([]);

  const defaults: FormValues = {
    name: '',
    phone1: '',
    phone2: '',
    phone3: '',
    phone4: '',
    isVIP: false,
    isBlocked: false,
    isActive: true,
    addresses: []
  };

  const { control, handleSubmit, reset, formState: { isSubmitSuccessful } } = useForm<FormValues>({
    defaultValues: defaults
  });

  const { fields: addressFields, append: appendAddress, remove: removeAddress } = useFieldArray({
    control,
    name: 'addresses'
  });

  // تحميل مناطق التوصيل
  React.useEffect(() => {
    const loadZones = async () => {
      try {
        const zonesData = await deliveryZonesApi.getAll();
        setZones(zonesData);
      } catch (error) {
        }
    };
    
    if (open) {
      loadZones();
    }
  }, [open]);

  React.useEffect(() => {
    if (open) {
      if (mode === 'add') {
        reset(defaults);
      } else if (initialValues) {
        reset({
          name: initialValues.name,
          phone1: initialValues.phone1,
          phone2: initialValues.phone2 || '',
          phone3: initialValues.phone3 || '',
          phone4: initialValues.phone4 || '',
          isVIP: initialValues.isVIP,
          isBlocked: initialValues.isBlocked,
          isActive: initialValues.isActive,
          addresses: initialValues.addresses || []
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

  const addAddress = () => {
    appendAddress({
      addressLine: '',
      floor: '',
      apartment: '',
      landmark: '',
      notes: '',
      zoneId: '',
      isActive: true
    });
  };

  const submit = async (data: FormValues, saveAction: 'save' | 'saveAndNew') => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      if (mode === 'edit' && initialValues) {
        const updateData = {
          id: initialValues.id,
          name: data.name,
          phone1: data.phone1,
          phone2: data.phone2 || null,
          phone3: data.phone3 || null,
          phone4: data.phone4 || null,
          isVIP: data.isVIP,
          isBlocked: data.isBlocked,
          isActive: data.isActive,
          addresses: data.addresses.map(addr => ({
            ...(addr.id && { id: addr.id }),
            addressLine: addr.addressLine,
            floor: addr.floor || '',
            apartment: addr.apartment || '',
            landmark: addr.landmark || '',
            notes: addr.notes || '',
            zoneId: addr.zoneId,
            isActive: addr.isActive
          }))
        };
        await onSubmit(updateData, saveAction);
      } else {
        const addData = {
          name: data.name,
          phone1: data.phone1,
          phone2: data.phone2 || null,
          phone3: data.phone3 || null,
          phone4: data.phone4 || null,
          isVIP: data.isVIP,
          isBlocked: data.isBlocked,
          isActive: data.isActive,
          addresses: data.addresses.map(addr => ({
            addressLine: addr.addressLine,
            floor: addr.floor || '',
            apartment: addr.apartment || '',
            landmark: addr.landmark || '',
            notes: addr.notes || '',
            zoneId: addr.zoneId
          }))
        };
        await onSubmit(addData, saveAction);
      }

      if (mode === 'add' && saveAction === 'saveAndNew') {
        setTimeout(() => {
          reset(defaults);
        }, 100);
      }
    } catch (error) {
      } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === 'add' ? t('customers.add') : t('customers.edit')}
      </DialogTitle>

      <form>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Customer Info */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {t('customers.form.basicInfo')}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                rules={{ required: t('customers.nameRequired') }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t('customers.form.name')}
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
                name="phone1"
                control={control}
                rules={{ 
                  required: t('customers.phone1Required'),
                  pattern: {
                    value: /^01[0-9]{9}$/,
                    message: t('customers.phoneInvalid')
                  }
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t('customers.form.phone1')}
                    fullWidth
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    placeholder="01012345678"
                    onFocus={(e) => e.target.select()}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="phone2"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('customers.form.phone2')}
                    fullWidth
                    placeholder="01012345678"
                    onFocus={(e) => e.target.select()}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="phone3"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('customers.form.phone3')}
                    fullWidth
                    placeholder="01012345678"
                    onFocus={(e) => e.target.select()}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="phone4"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('customers.form.phone4')}
                    fullWidth
                    placeholder="01012345678"
                    onFocus={(e) => e.target.select()}
                  />
                )}
              />
            </Grid>

            {/* Customer Status */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <FormControlLabel
                  control={
                    <Controller
                      name="isVIP"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  }
                  label={t('customers.form.isVIP')}
                />

                <FormControlLabel
                  control={
                    <Controller
                      name="isBlocked"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  }
                  label={t('customers.form.isBlocked')}
                />

                {mode === 'edit' && (
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
                    label={t('customers.form.isActive')}
                  />
                )}
              </Box>
            </Grid>

            {/* Addresses Section */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {t('customers.form.addresses')} ({addressFields.length})
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<IconPlus />}
                  onClick={addAddress}
                  size="small"
                >
                  {t('customers.form.addAddress')}
                </Button>
              </Box>

              {addressFields.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4, backgroundColor: 'grey.50', borderRadius: 1 }}>
                  <Typography color="text.secondary">
                    {t('customers.form.noAddresses')}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {addressFields.map((address, index) => (
                    <Card key={address.id} variant="outlined">
                      <CardContent sx={{ pb: '16px !important' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="subtitle2">
                            {t('customers.form.address')} {index + 1}
                          </Typography>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeAddress(index)}
                          >
                            <IconTrash size={16} />
                          </IconButton>
                        </Box>

                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Controller
                              name={`addresses.${index}.addressLine`}
                              control={control}
                              rules={{ required: t('customers.addressLineRequired') }}
                              render={({ field, fieldState }) => (
                                <TextField
                                  {...field}
                                  label={t('customers.form.addressLine')}
                                  fullWidth
                                  required
                                  error={!!fieldState.error}
                                  helperText={fieldState.error?.message}
                                  size="small"
                                />
                              )}
                            />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Controller
                              name={`addresses.${index}.zoneId`}
                              control={control}
                              rules={{ required: t('customers.zoneRequired') }}
                              render={({ field, fieldState }) => (
                                <FormControl fullWidth size="small" error={!!fieldState.error}>
                                  <InputLabel>{t('customers.form.zone')}</InputLabel>
                                  <Select
                                    {...field}
                                    label={t('customers.form.zone')}
                                    required
                                  >
                                    {zones.map((zone) => (
                                      <MenuItem key={zone.id} value={zone.id}>
                                        {zone.name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  {fieldState.error && (
                                    <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                                      {fieldState.error.message}
                                    </Box>
                                  )}
                                </FormControl>
                              )}
                            />
                          </Grid>

                          <Grid item xs={6} md={3}>
                            <Controller
                              name={`addresses.${index}.floor`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label={t('customers.form.floor')}
                                  fullWidth
                                  size="small"
                                />
                              )}
                            />
                          </Grid>

                          <Grid item xs={6} md={3}>
                            <Controller
                              name={`addresses.${index}.apartment`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label={t('customers.form.apartment')}
                                  fullWidth
                                  size="small"
                                />
                              )}
                            />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Controller
                              name={`addresses.${index}.landmark`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label={t('customers.form.landmark')}
                                  fullWidth
                                  size="small"
                                />
                              )}
                            />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Controller
                              name={`addresses.${index}.notes`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label={t('customers.form.notes')}
                                  fullWidth
                                  size="small"
                                />
                              )}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
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
            {t('customers.saveAndExit')}
          </Button>
          
          <Button 
            variant="contained"
            startIcon={<IconPlusNew size={20} />}
            onClick={handleSubmit((data) => submit(data, 'saveAndNew'))}
            disabled={isSubmitting}
          >
            {t('customers.saveAndNew')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CustomerForm;
