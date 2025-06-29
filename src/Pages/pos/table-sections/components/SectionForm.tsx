// File: src/pages/pos/table-sections/components/SectionForm.tsx
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Button, Box, Typography, IconButton,
  Card, CardContent, Stack, Divider
} from '@mui/material';
import { IconDeviceFloppy, IconPlus as IconPlusNew, IconTrash, IconPlus } from '@tabler/icons-react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TableSection, Table } from 'src/utils/api/pagesApi/tableSectionsApi';

type FormValues = {
  name: string;
  serviceCharge: number;
  tables: Table[];
};

interface Props {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues?: TableSection;
  onClose: () => void;
  onSubmit: (data: any, saveAction: 'save' | 'saveAndNew') => Promise<void>;
}

const SectionForm: React.FC<Props> = ({
  open, mode, initialValues, onClose, onSubmit
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const defaults: FormValues = {
    name: '',
    serviceCharge: 0,
    tables: []
  };

  const { control, handleSubmit, reset, formState: { isSubmitSuccessful } } = useForm<FormValues>({
    defaultValues: defaults
  });

  const { fields: tableFields, append: appendTable, remove: removeTable } = useFieldArray({
    control,
    name: 'tables'
  });

  React.useEffect(() => {
    if (open) {
      if (mode === 'add') {
        reset(defaults);
      } else if (initialValues) {
        reset({
          name: initialValues.name,
          serviceCharge: initialValues.serviceCharge,
          tables: initialValues.tables.map(table => ({
            id: table.id,
            name: table.name,
            sectionId: table.sectionId,
            capacity: table.capacity
          }))
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

  const addTable = () => {
    appendTable({
      name: `T${tableFields.length + 1}`,
      sectionId: '',
      capacity: 0
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
          serviceCharge: Number(data.serviceCharge),
          tables: data.tables.map(table => ({
            ...(table.id && { id: table.id }),
            name: table.name,
            sectionId: initialValues.id,
            capacity: Number(table.capacity)
          }))
        };
        await onSubmit(updateData, saveAction);
      } else {
        const addData = {
          name: data.name,
          serviceCharge: Number(data.serviceCharge),
          tables: data.tables.map(table => ({
            name: table.name,
            capacity: Number(table.capacity)
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
        {mode === 'add' ? t('tableSections.add') : t('tableSections.edit')}
      </DialogTitle>

      <form>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Section Info */}
            <Grid item xs={12} md={6}>
              <Controller
                name="name"
                control={control}
                rules={{ required: t('tableSections.nameRequired') }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t('tableSections.form.name')}
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
                name="serviceCharge"
                control={control}
                rules={{ required: t('tableSections.serviceChargeRequired'), min: 0 }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t('tableSections.form.serviceCharge')}
                    type="number"
                    fullWidth
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    inputProps={{ min: 0, step: 0.01 }}
                    onFocus={(e) => e.target.select()}
                  />
                )}
              />
            </Grid>

            {/* Tables Section */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {t('tableSections.form.tables')} ({tableFields.length})
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<IconPlus />}
                  onClick={addTable}
                  size="small"
                >
                  {t('tableSections.form.addTable')}
                </Button>
              </Box>

              {tableFields.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4, backgroundColor: 'grey.50', borderRadius: 1 }}>
                  <Typography color="text.secondary">
                    {t('tableSections.form.noTables')}
                  </Typography>
                </Box>
              ) : (
<Stack spacing={1}> {/* ⭐ تقليل المسافة من 2 إلى 1 */}
  {tableFields.map((table, index) => (
    <Card key={table.id} variant="outlined" sx={{ mb: 1 }}> {/* ⭐ إضافة margin bottom صغير */}
      <CardContent sx={{ py: 1, px: 2, '&:last-child': { pb: 1 } }}> {/* ⭐ تقليل padding */}
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={5}>
                            <Controller
                              name={`tables.${index}.name`}
                              control={control}
                              rules={{ required: t('tableSections.tableNameRequired') }}
                              render={({ field, fieldState }) => (
                                <TextField
                                  {...field}
                                  label={t('tableSections.form.tableName')}
                                  fullWidth
                                  size="small"
                                  required
                                  error={!!fieldState.error}
                                  helperText={fieldState.error?.message}
                                  onFocus={(e) => e.target.select()}
                                />
                              )}
                            />
                          </Grid>

                          <Grid item xs={12} md={5}>
                            <Controller
                              name={`tables.${index}.capacity`}
                              control={control}
                              rules={{ required: t('tableSections.capacityRequired'), min: 0 }}
                              render={({ field, fieldState }) => (
                                <TextField
                                  {...field}
                                  label={t('tableSections.form.capacity')}
                                  type="number"
                                  fullWidth
                                  size="small"
                                  required
                                  error={!!fieldState.error}
                                  helperText={fieldState.error?.message}
                                  inputProps={{ min: 1, max: 20 }}
                                  onFocus={(e) => e.target.select()}
                                />
                              )}
                            />
                          </Grid>

                          <Grid item xs={12} md={2}>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => removeTable(index)}
                              sx={{ width: '100%' }}
                            >
                              <IconTrash size={16} />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
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
            {t('tableSections.saveAndExit')}
          </Button>
          
          <Button 
            variant="contained"
            startIcon={<IconPlusNew size={20} />}
            onClick={handleSubmit((data) => submit(data, 'saveAndNew'))}
            disabled={isSubmitting}
          >
            {t('tableSections.saveAndNew')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SectionForm;
