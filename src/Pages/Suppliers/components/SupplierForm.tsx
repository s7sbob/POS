import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Switch, FormControlLabel, Button, Stack,
  useMediaQuery, useTheme
} from '@mui/material';
import { IconDeviceFloppy, IconPlus as IconPlusNew } from '@tabler/icons-react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Supplier } from 'src/utils/suppliersApi';

/* ---------- types ---------- */
type FormValues = { 
  name: string; 
  phone: string;
  address: string;
  notes: string;
  isActive: boolean;
};

interface Props {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues?: Supplier;
  onClose: () => void;
  onSubmit: (data: any, saveAction: 'save' | 'saveAndNew') => Promise<void>;
}

const SupplierForm: React.FC<Props> = ({
  open, mode, initialValues, onClose, onSubmit
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const nameFieldRef = React.useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const defaults: FormValues = { 
    name: '', 
    phone: '',
    address: '',
    notes: '',
    isActive: true
  };

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: defaults
  });

  // Focus على اسم المورد عند فتح المودال
  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        if (nameFieldRef.current) {
          nameFieldRef.current.focus();
          nameFieldRef.current.select();
        }
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [open]);

  // إعادة تعيين النموذج عند تغيير البيانات
  React.useEffect(() => {
    if (open) {
      if (mode === 'add') {
        reset(defaults);
      } else if (initialValues) {
        reset({
          name: initialValues.name,
          phone: initialValues.phone,
          address: initialValues.address,
          notes: initialValues.notes,
          isActive: initialValues.isActive,
        });
      }
    }
  }, [open, mode, initialValues, reset]);

  const submit = async (data: FormValues, saveAction: 'save' | 'saveAndNew') => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      console.log('Form data before submit:', data);
      console.log('Mode:', mode);
      console.log('Save action:', saveAction);
      
      if (mode === 'edit' && initialValues) {
        const updateData = {
          ...initialValues,
          ...data
        };
        console.log('Sending update data:', updateData);
        await onSubmit(updateData, saveAction);
      } else {
        console.log('Sending add data:', data);
        await onSubmit(data, saveAction);
      }
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      disableEscapeKeyDown={false}
      fullScreen={isMobile}
    >
      <DialogTitle>
        {mode === 'add' ? t('suppliers.add') : t('suppliers.edit')}
      </DialogTitle>

      <form>
        <DialogContent sx={{ maxHeight: isMobile ? 'none' : '70vh', overflowY: 'auto' }}>
          <Grid container spacing={3}>
            {/* ---------- Name ---------- */}
            <Grid item xs={12} md={6}>
              <Controller
                name="name"
                control={control}
                rules={{ required: t('suppliers.nameRequired') }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    inputRef={nameFieldRef}
                    label={t('suppliers.name')}
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    autoFocus
                  />
                )}
              />
            </Grid>

            {/* ---------- Phone ---------- */}
            <Grid item xs={12} md={6}>
              <Controller
                name="phone"
                control={control}
                rules={{ required: t('suppliers.phoneRequired') }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t('suppliers.phone')}
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>

            {/* ---------- Address ---------- */}
            <Grid item xs={12}>
              <Controller
                name="address"
                control={control}
                rules={{ required: t('suppliers.addressRequired') }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t('suppliers.address')}
                    fullWidth
                    multiline
                    rows={2}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>

            {/* ---------- Notes ---------- */}
            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('suppliers.notes')}
                    fullWidth
                    multiline
                    rows={3}
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
                    control={
                      <Switch 
                        checked={field.value} 
                        onChange={(e) => field.onChange(e.target.checked)} 
                      />
                    }
                    label={t('suppliers.status')}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        {/* أزرار ثابتة في الأسفل */}
        <DialogActions 
          sx={{ 
            position: 'sticky', 
            bottom: 0, 
            backgroundColor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
            p: 2,
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 1 : 0
          }}
        >
          <Button 
            onClick={onClose} 
            type="button" 
            disabled={isSubmitting}
            fullWidth={isMobile}
          >
            {t('common.cancel')}
          </Button>
          
          <Stack direction={isMobile ? "column" : "row"} spacing={1} sx={{ width: isMobile ? '100%' : 'auto' }}>
            <Button 
              variant="outlined"
              startIcon={<IconDeviceFloppy size={20} />}
              onClick={handleSubmit((data) => submit(data, 'save'))}
              disabled={isSubmitting}
              fullWidth={isMobile}
            >
              {t('suppliers.saveAndExit')}
            </Button>
            
            <Button 
              variant="contained"
              startIcon={<IconPlusNew size={20} />}
              onClick={handleSubmit((data) => submit(data, 'saveAndNew'))}
              disabled={isSubmitting}
              fullWidth={isMobile}
            >
              {t('suppliers.saveAndNew')}
            </Button>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SupplierForm;
