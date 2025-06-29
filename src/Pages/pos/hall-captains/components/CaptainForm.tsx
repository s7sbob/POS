// File: src/pages/pos/hall-captains/components/CaptainForm.tsx
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Button, Box, Switch,
  FormControlLabel, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { IconDeviceFloppy, IconPlus as IconPlusNew } from '@tabler/icons-react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { HallCaptain } from 'src/utils/api/pagesApi/hallCaptainsApi';
import { getUserBranchesFromStorage, getDefaultBranch } from 'src/utils/branchUtils';

type FormValues = {
  name: string;
  phone: string;
  notes: string;
  branchId: string;
  isActive: boolean;
};

interface Props {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues?: HallCaptain;
  onClose: () => void;
  onSubmit: (data: any, saveAction: 'save' | 'saveAndNew') => Promise<void>;
}

const CaptainForm: React.FC<Props> = ({
  open, mode, initialValues, onClose, onSubmit
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const branches = getUserBranchesFromStorage();
  const defaultBranch = getDefaultBranch();

  const defaults: FormValues = {
    name: '',
    phone: '',
    notes: '',
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
          phone: initialValues.phone,
          notes: initialValues.notes || '',
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
          phone: data.phone,
          notes: data.notes,
          branchId: data.branchId,
          isActive: data.isActive
        };
        await onSubmit(updateData, saveAction);
      } else {
        const addData = {
          name: data.name,
          phone: data.phone,
          notes: data.notes,
          branchId: data.branchId,
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
      } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'add' ? t('hallCaptains.add') : t('hallCaptains.edit')}
      </DialogTitle>

      <form>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                rules={{ required: t('hallCaptains.nameRequired') }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t('hallCaptains.form.name')}
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
                  required: t('hallCaptains.phoneRequired'),
                  pattern: {
                    value: /^01[0-9]{9}$/,
                    message: t('hallCaptains.phoneInvalid')
                  }
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t('hallCaptains.form.phone')}
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
                rules={{ required: t('hallCaptains.branchRequired') }}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error}>
                    <InputLabel>{t('hallCaptains.form.branch')}</InputLabel>
                    <Select
                      {...field}
                      label={t('hallCaptains.form.branch')}
                      required
                    >
                      {branches.map((branch) => (
                        <MenuItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldState.error && (
                      <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 2 }}>
                        {fieldState.error.message}
                      </Box>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('hallCaptains.form.notes')}
                    fullWidth
                    multiline
                    rows={3}
                    placeholder={t('hallCaptains.form.notesPlaceholder')}
                  />
                )}
              />
            </Grid>

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
                  label={t('hallCaptains.form.isActive')}
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
            {t('hallCaptains.saveAndExit')}
          </Button>
          
          <Button 
            variant="contained"
            startIcon={<IconPlusNew size={20} />}
            onClick={handleSubmit((data) => submit(data, 'saveAndNew'))}
            disabled={isSubmitting}
          >
            {t('hallCaptains.saveAndNew')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CaptainForm;
