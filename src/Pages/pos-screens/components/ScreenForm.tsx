// File: src/pages/pos-screens/components/ScreenForm.tsx
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Switch, FormControlLabel, Button, Box,
  Typography, Avatar, Stack
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PosScreen } from 'src/utils/api/pagesApi/posScreensApi';
import ScreenTreeSelect from './ScreenTreeSelect';
import { StatusPill } from './StatusPill';
import { VisibilityPill } from './VisibilityPill';

/* ---------- types ---------- */
type FormValues = { 
  screenName: string; 
  ParentScreenId?: string;
  isVisible: boolean;
  displayOrder: number;
  colorHex: string;
  icon: string;
};

interface Props {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues?: PosScreen;
  parentScreen?: PosScreen;
  allScreens: PosScreen[];
  onClose: () => void;
  onSubmit: (data: FormValues | PosScreen) => void;
}

const ScreenForm: React.FC<Props> = ({
  open, mode, initialValues, parentScreen, allScreens, onClose, onSubmit
}) => {
  const { t } = useTranslation();
  
  // حساب الترتيب التالي
  const getNextDisplayOrder = () => {
    if (parentScreen) {
      return (parentScreen.children?.length || 0) + 1;
    }
    return allScreens.length + 1;
  };

  const defaults: FormValues = { 
    screenName: '', 
    ParentScreenId: parentScreen?.id || '',
    isVisible: true,
    displayOrder: getNextDisplayOrder(),
    colorHex: '#2196F3',
    icon: '📱'
  };

  const { control, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: mode === 'add' ? defaults : {
      screenName: initialValues?.name ?? '',
      ParentScreenId: initialValues?.parentId ?? '',
      isVisible: initialValues?.isVisible ?? true,
      displayOrder: initialValues?.displayOrder ?? 1,
      colorHex: initialValues?.colorHex ?? '#2196F3',
      icon: initialValues?.icon ?? '📱',
    },
  });

  const colorHex = watch('colorHex');
  const icon = watch('icon');
  const isVisible = watch('isVisible');
  const screenName = watch('screenName');

  React.useEffect(() => {
    if (mode === 'add') {
      reset({
        ...defaults,
        ParentScreenId: parentScreen?.id || '',
        displayOrder: getNextDisplayOrder()
      });
    } else if (initialValues) {
      reset({
        screenName: initialValues.name,
        ParentScreenId: initialValues.parentId || '',
        isVisible: initialValues.isVisible,
        displayOrder: initialValues.displayOrder,
        colorHex: initialValues.colorHex,
        icon: initialValues.icon,
      });
    }
  }, [mode, initialValues, parentScreen, reset]);

  const submit = (data: FormValues) =>
    onSubmit(mode === 'add'
      ? data
      : { ...initialValues!, ...data, name: data.screenName, parentId: data.ParentScreenId }
    );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'add' 
          ? (parentScreen ? t('posScreens.addChild') : t('posScreens.add'))
          : t('posScreens.edit')
        }
        {parentScreen && (
          <Box component="span" sx={{ fontSize: '0.8em', color: 'text.secondary', ml: 1 }}>
            ({t('posScreens.parentScreen')}: {parentScreen.name})
          </Box>
        )}
      </DialogTitle>

      <form onSubmit={handleSubmit(submit)}>
        <DialogContent>
          <Grid container spacing={3}>
            {/* ---------- Name ---------- */}
            <Grid item xs={12}>
              <Controller
                name="screenName"
                control={control}
                rules={{ required: t('posScreens.nameRequired') }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t('posScreens.name')}
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>

            {/* ---------- Parent Screen ---------- */}
            {!parentScreen && (
              <Grid item xs={12}>
                <Controller
                  name="ParentScreenId"
                  control={control}
                  render={({ field }) => (
                    <ScreenTreeSelect
                      screens={allScreens}
                      value={field.value}
                      onChange={field.onChange}
                      label={t('posScreens.parentScreen')}
                      excludeId={initialValues?.id}
                    />
                  )}
                />
              </Grid>
            )}

            {/* ---------- Display Order ---------- */}
            <Grid item xs={6}>
              <Controller
                name="displayOrder"
                control={control}
                rules={{ required: true, min: 1 }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t('posScreens.displayOrder')}
                    type="number"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    inputProps={{ min: 1 }}
                  />
                )}
              />
            </Grid>

            {/* ---------- Visibility ---------- */}
            <Grid item xs={6}>
              <Controller
                name="isVisible"
                control={control}
                render={({ field }) => (
                  <Box>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={field.value} 
                          onChange={(e) => field.onChange(e.target.checked)} 
                        />
                      }
                      label={t('posScreens.visibility')}
                    />
                    <Box sx={{ mt: 1 }}>
                      <VisibilityPill isVisible={field.value} />
                    </Box>
                  </Box>
                )}
              />
            </Grid>

            {/* ---------- Icon ---------- */}
            <Grid item xs={6}>
              <Controller
                name="icon"
                control={control}
                rules={{ required: t('posScreens.iconRequired') }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t('posScreens.icon')}
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message || t('posScreens.iconHelp')}
                    placeholder="📱"
                  />
                )}
              />
            </Grid>

            {/* ---------- Color ---------- */}
            <Grid item xs={6}>
              <Controller
                name="colorHex"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('posScreens.color')}
                    type="color"
                    fullWidth
                  />
                )}
              />
            </Grid>

            {/* ---------- Preview ---------- */}
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  backgroundColor: 'background.paper'
                }}
              >
                <Typography variant="body2" gutterBottom>
                  {t('posScreens.preview')}:
                </Typography>
                
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar 
                    sx={{ 
                      backgroundColor: colorHex,
                      width: 40,
                      height: 40
                    }}
                  >
                    {icon}
                  </Avatar>
                  
                  <Box>
                    <Typography variant="h6">
                      {screenName || t('posScreens.sampleText')}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <VisibilityPill isVisible={isVisible} />
                      <StatusPill isActive={true} />
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="contained">
            {mode === 'add' ? t('posScreens.add') : t('posScreens.save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ScreenForm;
