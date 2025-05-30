import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Switch, FormControlLabel, Button, Box,
  Typography
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Group } from 'src/utils/groupsApi';
import GroupTreeSelect from './GroupTreeSelect';

/* ---------- types ---------- */
type FormValues = { 
  name: string; 
  parentId?: string;
  backgroundColor: string;
  fontColor: string;
  isActive: boolean;
};

interface Props {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues?: Group;
  parentGroup?: Group;
  allGroups: Group[];
  onClose: () => void;
  onSubmit: (data: FormValues | Group) => void;
}

/* ---------- helpers ---------- */
const nextOnEnter = (e: React.KeyboardEvent) => {
  if (e.key !== 'Enter') return;
  const form = (e.currentTarget as HTMLInputElement).form!;
  const idx = Array.prototype.indexOf.call(form, e.currentTarget);
  if (idx > -1 && idx + 1 < form.elements.length) {
    (form.elements[idx + 1] as HTMLElement).focus();
  } else {
    (form as HTMLFormElement).requestSubmit();
  }
  e.preventDefault();
};

/* ---------- component ---------- */
const GroupForm: React.FC<Props> = ({
  open, mode, initialValues, parentGroup, allGroups, onClose, onSubmit
}) => {
  const { t } = useTranslation();
  const defaults: FormValues = { 
    name: '', 
    parentId: parentGroup?.id || '',
    backgroundColor: '123',
    fontColor: '123',
    isActive: true 
  };

  const { control, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: mode === 'add' ? defaults : {
      name: initialValues?.name ?? '',
      parentId: initialValues?.parentId ?? '',
      backgroundColor: initialValues?.backgroundColor ?? '123',
      fontColor: initialValues?.fontColor ?? '123',
      isActive: initialValues?.isActive ?? true,
    },
  });

  const backgroundColor = watch('backgroundColor');
  const fontColor = watch('fontColor');

  /* -- reset القيم عند تغيير النمط -- */
  React.useEffect(() => {
    if (mode === 'add') {
      reset({
        ...defaults,
        parentId: parentGroup?.id || ''
      });
    } else if (initialValues) {
      reset({
        name: initialValues.name,
        parentId: initialValues.parentId || '',
        backgroundColor: initialValues.backgroundColor,
        fontColor: initialValues.fontColor,
        isActive: initialValues.isActive,
      });
    }
  }, [mode, initialValues, parentGroup, reset]);

  const submit = (data: FormValues) =>
    onSubmit(mode === 'add'
      ? data
      : { ...initialValues!, ...data }
    );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'add' 
          ? (parentGroup ? t('groups.addChild') : t('groups.add'))
          : t('groups.edit')
        }
        {parentGroup && (
          <Box component="span" sx={{ fontSize: '0.8em', color: 'text.secondary', ml: 1 }}>
            ({t('groups.parentGroup')}: {parentGroup.name})
          </Box>
        )}
      </DialogTitle>

      <form onSubmit={handleSubmit(submit)}>
        <DialogContent>
          <Grid container spacing={3}>
            {/* ---------- Name ---------- */}
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                rules={{ required: t('groups.nameRequired') }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t('groups.name')}
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    onKeyDown={nextOnEnter}
                  />
                )}
              />
            </Grid>

            {/* ---------- Parent Group ---------- */}
            {!parentGroup && (
              <Grid item xs={12}>
                <Controller
                  name="parentId"
                  control={control}
                  render={({ field }) => (
                    <GroupTreeSelect
                      groups={allGroups}
                      value={field.value}
                      onChange={field.onChange}
                      label={t('groups.parentGroup')}
                      excludeId={initialValues?.id}
                    />
                  )}
                />
              </Grid>
            )}

            {/* ---------- Colors ---------- */}
            <Grid item xs={6}>
              <Controller
                name="backgroundColor"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('groups.backgroundColor')}
                    type="color"
                    fullWidth
                    value={field.value === '123' ? '#ffffff' : `#${field.value}`}
                    onChange={(e) => field.onChange(e.target.value.replace('#', ''))}
                    onKeyDown={nextOnEnter}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="fontColor"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('groups.fontColor')}
                    type="color"
                    fullWidth
                    value={field.value === '123' ? '#000000' : `#${field.value}`}
                    onChange={(e) => field.onChange(e.target.value.replace('#', ''))}
                    onKeyDown={nextOnEnter}
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
                  backgroundColor: backgroundColor !== '123' ? `#${backgroundColor}` : 'background.paper',
                  color: fontColor !== '123' ? `#${fontColor}` : 'text.primary'
                }}
              >
                <Typography variant="body2" gutterBottom>
                  {t('groups.preview')}:
                </Typography>
                <Typography variant="h6">
                  {watch('name') || t('groups.sampleText')}
                </Typography>
              </Box>
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
                    label={t('groups.status')}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="contained">
            {mode === 'add' ? t('groups.add') : t('groups.save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default GroupForm;
