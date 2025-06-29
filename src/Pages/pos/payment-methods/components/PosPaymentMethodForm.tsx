// File: src/pages/pos-payment-methods/components/PosPaymentMethodForm.tsx
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Chip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PosPaymentMethod } from 'src/utils/api/pagesApi/posPaymentMethodsApi';
import { SafeOrAccount } from 'src/utils/api/pagesApi/safesAndAccountsApi';

interface Props {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues?: PosPaymentMethod;
  safesAndAccounts: SafeOrAccount[];
  onClose: () => void;
  onSubmit: (data: any, saveAction: 'save' | 'saveAndNew') => Promise<void>;
}

const PosPaymentMethodForm: React.FC<Props> = ({
  open,
  mode,
  initialValues,
  safesAndAccounts,
  onClose,
  onSubmit
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  type FormValues = {
    name: string;
    safeOrAccountID: string;
    branches: any[]; // Replace 'any' with the actual branch type if available
  };
  
  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: '',
      safeOrAccountID: '',
      branches: []
    }
  });
  
  useFieldArray({
        control,
        name: 'branches'
    });

  useEffect(() => {
    if (mode === 'edit' && initialValues) {
      reset({
        name: initialValues.name,
        safeOrAccountID: initialValues.safeOrAccountID || '',
        branches: initialValues.branches || []
      });
    } else if (mode === 'add') {
      reset({
        name: '',
        safeOrAccountID: '',
        branches: []
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
          safeOrAccountID: '',
          branches: []
        });
      }
    } catch (error) {
      } finally {
      setIsSubmitting(false);
    }
  };

  const selectedAccount = safesAndAccounts.find(sa => sa.id === watch('safeOrAccountID'));

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      fullScreen={fullScreen}
    >
      <DialogTitle>
        {mode === 'add' ? t('posPaymentMethods.add') : t('posPaymentMethods.edit')}
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Controller
            name="name"
            control={control}
            rules={{ required: t('posPaymentMethods.validation.nameRequired') }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('posPaymentMethods.name')}
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={isSubmitting}
              />
            )}
          />

          <Controller
            name="safeOrAccountID"
            control={control}
            rules={{ required: t('posPaymentMethods.validation.accountRequired') }}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.safeOrAccountID}>
                <InputLabel>{t('posPaymentMethods.safeOrAccount')}</InputLabel>
                <Select
                  {...field}
                  label={t('posPaymentMethods.safeOrAccount')}
                  disabled={isSubmitting}
                >
                  {safesAndAccounts.map((sa) => (
                    <MenuItem key={sa.id} value={sa.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography>{sa.name}</Typography>
                        <Chip
                          label={t(`accounts.types.${sa.typeName.toLowerCase()}`)}
                          size="small"
                          variant="outlined"
                          color={sa.safeOrAccountType === 1 ? 'warning' : 'primary'}
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          {selectedAccount && (
            <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('posPaymentMethods.selectedAccount')}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2">{selectedAccount.name}</Typography>
                <Chip
                  label={t(`accounts.types.${selectedAccount.typeName.toLowerCase()}`)}
                  size="small"
                  color={selectedAccount.safeOrAccountType === 1 ? 'warning' : 'primary'}
                />
                {selectedAccount.accountNumber && (
                  <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                    {selectedAccount.accountNumber}
                  </Typography>
                )}
              </Stack>
            </Box>
          )}

          {/* يمكن إضافة إدارة الفروع هنا لاحقاً */}
          <Typography variant="body2" color="text.secondary">
            {t('posPaymentMethods.branchesNote')}
          </Typography>
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

export default PosPaymentMethodForm;
