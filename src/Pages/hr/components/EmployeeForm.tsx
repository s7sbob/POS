// File: src/Pages/hr/components/EmployeeForm.tsx
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Switch, FormControlLabel, Button, Stack,
  useMediaQuery, useTheme
} from '@mui/material';
import { IconDeviceFloppy, IconPlus as IconPlusNew } from '@tabler/icons-react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Employee } from 'src/utils/api/pagesApi/employeesApi';

/* ---------- types ---------- */
type FormValues = { 
  name: string; 
  workingHours: string;
  hourSalary: string;
  isActive: boolean;
};

interface Props {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues?: Employee;
  onClose: () => void;
  onSubmit: (data: any, saveAction: 'save' | 'saveAndNew') => Promise<void>;
}

const EmployeeForm: React.FC<Props> = ({
  open, mode, initialValues, onClose, onSubmit
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const nameFieldRef = React.useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const defaults: FormValues = { 
    name: '', 
    workingHours: '8',
    hourSalary: '',
    isActive: true
  };

  const { control, handleSubmit, reset, setError, clearErrors } = useForm<FormValues>({
    defaultValues: defaults
  });

  // Focus على اسم الموظف عند فتح المودال
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
          workingHours: initialValues.workingHours,
          hourSalary: initialValues.hourSalary,
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
          if (fieldName.includes('name') || fieldName.includes('employeename')) {
            setError('name', { 
              type: 'server', 
              message: error.errors[field][0] || t('hr.employees.nameRequired') 
            });
          } else if (fieldName.includes('workinghours')) {
            setError('workingHours', { 
              type: 'server', 
              message: error.errors[field][0] || t('hr.employees.workingHoursRequired') 
            });
          } else if (fieldName.includes('hoursalary')) {
            setError('hourSalary', { 
              type: 'server', 
              message: error.errors[field][0] || t('hr.employees.hourSalaryRequired') 
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
        {mode === 'add' ? t('hr.employees.add') : t('hr.employees.edit')}
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
                  required: t('hr.employees.nameRequired'),
                  minLength: {
                    value: 2,
                    message: t('hr.employees.nameMinLength')
                  }
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    inputRef={nameFieldRef}
                    label={`${t('hr.employees.name')} *`}
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    autoFocus
                  />
                )}
              />
            </Grid>

            {/* ---------- Working Hours (Required) ---------- */}
            <Grid item xs={12} md={6}>
              <Controller
                name="workingHours"
                control={control}
                rules={{
                  required: t('hr.employees.workingHoursRequired'),
                  pattern: {
                    value: /^[0-9]+$/,
                    message: t('hr.employees.workingHoursInvalid')
                  },
                  min: {
                    value: 1,
                    message: t('hr.employees.workingHoursMin')
                  }
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={`${t('hr.employees.workingHours')} *`}
                    fullWidth
                    type="number"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    placeholder="8"
                  />
                )}
              />
            </Grid>

            {/* ---------- Hour Salary (Required) ---------- */}
            <Grid item xs={12} md={6}>
              <Controller
                name="hourSalary"
                control={control}
                rules={{
                  required: t('hr.employees.hourSalaryRequired'),
                  pattern: {
                    value: /^[0-9]+(\.[0-9]{1,2})?$/,
                    message: t('hr.employees.hourSalaryInvalid')
                  },
                  min: {
                    value: 1,
                    message: t('hr.employees.hourSalaryMin')
                  }
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={`${t('hr.employees.hourSalary')} *`}
                    fullWidth
                    type="number"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    placeholder="150"
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
                    label={t('hr.employees.status')}
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
              {t('hr.employees.saveAndExit')}
            </Button>
            
            <Button 
              variant="contained"
              startIcon={<IconPlusNew size={20} />}
              onClick={handleSubmit((data) => submit(data, 'saveAndNew'))}
              disabled={isSubmitting}
              fullWidth={isMobile}
            >
              {t('hr.employees.saveAndNew')}
            </Button>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EmployeeForm;

