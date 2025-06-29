// File: src/pages/accounts/components/AccountForm.tsx
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Switch,
  FormControlLabel,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Account } from 'src/utils/api/pagesApi/accountsApi';

interface Props {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues?: Account;
  onClose: () => void;
  onSubmit: (data: any, saveAction: 'save' | 'saveAndNew') => Promise<void>;
}

const AccountForm: React.FC<Props> = ({
  open,
  mode,
  initialValues,
  onClose,
  onSubmit
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      safeOrAccountType: 2,
      typeName: '',
      accountNumber: '',
      collectionFeePercent: 0,
      isActive: true
    }
  });

  useEffect(() => {
    if (mode === 'edit' && initialValues) {
      reset({
        name: initialValues.name,
        safeOrAccountType: initialValues.safeOrAccountType,
        typeName: initialValues.typeName,
        accountNumber: initialValues.accountNumber,
        collectionFeePercent: initialValues.collectionFeePercent,
        isActive: initialValues.isActive
      });
    } else if (mode === 'add') {
      reset({
        name: '',
        safeOrAccountType: 2,
        typeName: '',
        accountNumber: '',
        collectionFeePercent: 0,
        isActive: true
      });
    }
  }, [mode, initialValues, reset]);

  const submit = async (data: any, saveAction: 'save' | 'saveAndNew') => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const submitData = mode === 'edit' 
        ? { ...data, id: initialValues?.id }
        : data;

      await onSubmit(submitData, saveAction);
      
      if (saveAction === 'saveAndNew') {
        reset({
          name: '',
          safeOrAccountType: 2,
          typeName: '',
          accountNumber: '',
          collectionFeePercent: 0,
          isActive: true
        });
      }
    } catch (error) {
      } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      fullScreen={fullScreen}
    >
      <DialogTitle>
        {mode === 'add' ? t('accounts.add') : t('accounts.edit')}
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Controller
            name="name"
            control={control}
            rules={{ required: t('accounts.validation.nameRequired') }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('accounts.name')}
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={isSubmitting}
              />
            )}
          />

          <Controller
            name="typeName"
            control={control}
            rules={{ required: t('accounts.validation.typeRequired') }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('accounts.type')}
                fullWidth
                error={!!errors.typeName}
                helperText={errors.typeName?.message}
                disabled={isSubmitting}
                placeholder={t('accounts.typePlaceholder')}
              />
            )}
          />

          <Controller
            name="accountNumber"
            control={control}
            rules={{ required: t('accounts.validation.accountNumberRequired') }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('accounts.accountNumber')}
                fullWidth
                error={!!errors.accountNumber}
                helperText={errors.accountNumber?.message}
                disabled={isSubmitting}
              />
            )}
          />

          <Controller
            name="collectionFeePercent"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('accounts.collectionFeePercent')}
                type="number"
                fullWidth
                inputProps={{ step: 0.01, min: 0, max: 100 }}
                disabled={isSubmitting}
              />
            )}
          />

          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                }
                label={t('accounts.isActive')}
              />
            )}
          />
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          {t('common.cancel')}
        </Button>
        
        {mode === 'add' && (
          <Button
            onClick={handleSubmit((data) => submit(data, 'saveAndNew'))}
            disabled={isSubmitting}
            variant="outlined"
          >
            {t('common.saveAndNew')}
          </Button>
        )}
        
        <Button
          onClick={handleSubmit((data) => submit(data, 'save'))}
          disabled={isSubmitting}
          variant="contained"
        >
          {isSubmitting ? t('common.saving') : t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccountForm;
