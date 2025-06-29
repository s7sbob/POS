import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Switch, FormControlLabel, Button, Stack,
  useMediaQuery, useTheme
} from '@mui/material';
import { IconDeviceFloppy, IconPlus as IconPlusNew } from '@tabler/icons-react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Supplier } from 'src/utils/api/pagesApi/suppliersApi';

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

  const { control, handleSubmit, reset, setError, clearErrors } = useForm<FormValues>({
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
      clearErrors(); // مسح الأخطاء السابقة
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
  }, [open, mode, initialValues, reset, clearErrors]);

  const submit = async (data: FormValues, saveAction: 'save' | 'saveAndNew') => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      if (mode === 'edit' && initialValues) {
        const updateData = {
          ...initialValues,
          ...data
        };
        await onSubmit(updateData, saveAction);
      } else {
        await onSubmit(data, saveAction);
      }
      
      // إذا كان saveAndNew، إعادة تعيين النموذج
      if (saveAction === 'saveAndNew') {
        reset(defaults);
        // Focus على الحقل الأول مرة أخرى
        setTimeout(() => {
          if (nameFieldRef.current) {
            nameFieldRef.current.focus();
          }
        }, 100);
      }
    } catch (error: any) {
      // معالجة أخطاء الـ validation من الـ API
      if (error?.errors) {
        Object.keys(error.errors).forEach(field => {
          const fieldName = field.toLowerCase();
          if (fieldName.includes('name') || fieldName.includes('suppliername')) {
            setError('name', { 
              type: 'server', 
              message: error.errors[field][0] || t('suppliers.nameRequired') 
            });
          } else if (fieldName.includes('phone')) {
            setError('phone', { 
              type: 'server', 
              message: error.errors[field][0] || t('suppliers.phoneRequired') 
            });
          } else if (fieldName.includes('address')) {
            setError('address', { 
              type: 'server', 
              message: error.errors[field][0] || t('suppliers.addressRequired') 
            });
          }
        });
      }
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
            {/* ---------- Name (Required) ---------- */}
            <Grid item xs={12} md={6}>
              <Controller
                name="name"
                control={control}
                rules={{ 
                  required: t('suppliers.nameRequired'),
                  minLength: {
                    value: 2,
                    message: t('suppliers.nameMinLength')
                  }
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    inputRef={nameFieldRef}
                    label={`${t('suppliers.name')} *`}
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    autoFocus
                  />
                )}
              />
            </Grid>

            {/* ---------- Phone (Optional) ---------- */}
            <Grid item xs={12} md={6}>
              <Controller
                name="phone"
                control={control}
                rules={{
                  pattern: {
                    value: /^[0-9+\-\s()]*$/,
                    message: t('suppliers.phoneInvalid')
                  }
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t('suppliers.phone')}
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    placeholder="01xxxxxxxxx"
                  />
                )}
              />
            </Grid>

            {/* ---------- Address (Optional) ---------- */}
            <Grid item xs={12}>
              <Controller
                name="address"
                control={control}
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

            {/* ---------- Notes (Optional) ---------- */}
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
