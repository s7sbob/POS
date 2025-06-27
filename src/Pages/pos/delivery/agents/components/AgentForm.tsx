// File: src/pages/delivery/agents/components/AgentForm.tsx
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Button, Box, Typography,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { IconDeviceFloppy, IconPlus as IconPlusNew } from '@tabler/icons-react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DeliveryAgent } from 'src/utils/api/pagesApi/deliveryAgentsApi';
import { getUserBranchesFromStorage, getDefaultBranch } from 'src/utils/branchUtils';

type FormValues = {
  name: string;
  phone: string;
  branchId: string;
};

interface Props {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues?: DeliveryAgent;
  onClose: () => void;
  onSubmit: (data: any, saveAction: 'save' | 'saveAndNew') => Promise<void>;
}

const AgentForm: React.FC<Props> = ({
  open, mode, initialValues, onClose, onSubmit
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const branches = getUserBranchesFromStorage();
  const defaultBranch = getDefaultBranch();

  const defaults: FormValues = {
    name: '',
    phone: '',
    branchId: defaultBranch?.id || ''
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
          phone: initialValues.phone,
          branchId: initialValues.branchId || defaultBranch?.id || ''
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
          phone: data.phone,
          branchId: data.branchId
        };
        await onSubmit(updateData, saveAction);
      } else {
        const addData = {
          name: data.name,
          phone: data.phone,
          branchId: data.branchId
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
        {mode === 'add' ? t('deliveryAgents.add') : t('deliveryAgents.edit')}
      </DialogTitle>

      <form>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                rules={{ required: t('deliveryAgents.nameRequired') }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t('deliveryAgents.form.name')}
                    fullWidth
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    onFocus={(e) => e.target.select()}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="phone"
                control={control}
                rules={{ 
                  required: t('deliveryAgents.phoneRequired'),
                  pattern: {
                    value: /^[0-9+\-\s()]+$/,
                    message: t('deliveryAgents.phoneInvalid')
                  }
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t('deliveryAgents.form.phone')}
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

            <Grid item xs={12}>
              <Controller
                name="branchId"
                control={control}
                rules={{ required: t('deliveryAgents.branchRequired') }}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error}>
                    <InputLabel>{t('deliveryAgents.form.branch')}</InputLabel>
                    <Select
                      {...field}
                      label={t('deliveryAgents.form.branch')}
                      required
                    >
                      {branches.map((branch) => (
                        <MenuItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldState.error && (
                      <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                        {fieldState.error.message}
                      </Typography>
                    )}
                  </FormControl>
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
            {t('deliveryAgents.saveAndExit')}
          </Button>
          
          <Button 
            variant="contained"
            startIcon={<IconPlusNew size={20} />}
            onClick={handleSubmit((data) => submit(data, 'saveAndNew'))}
            disabled={isSubmitting}
          >
            {t('deliveryAgents.saveAndNew')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AgentForm;
