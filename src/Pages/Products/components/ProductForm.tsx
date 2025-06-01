import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Typography,
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Stack,
  Card, CardContent, useMediaQuery, useTheme
} from '@mui/material';
import { IconPlus, IconTrash, IconDeviceFloppy, IconPlus as IconPlusNew } from '@tabler/icons-react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Product } from 'src/utils/productsApi';
import { Group } from 'src/utils/groupsApi';
import { Unit } from 'src/utils/unitsApi';
import GroupTreeSelect from './GroupTreeSelect';

/* ---------- types ---------- */
type FormValues = { 
  productName: string; 
  groupId: string;
  productType: number;
  description: string;
  reorderLevel: number;
  cost?: number;
  lastPurePrice: number;
  expirationDays: number;
  productPrices: Array<{
    productPriceId?: string;
    unitId: string;
    unitFactor: number;
    barcode: string;
    Price: number;
  }>;
};

interface Props {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues?: Product;
  groups: Group[];
  units: Unit[];
  onClose: () => void;
  onSubmit: (data: any, saveAction: 'save' | 'saveAndNew') => Promise<void>;
}

const ProductForm: React.FC<Props> = ({
  open, mode, initialValues, groups, units, onClose, onSubmit
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const nameFieldRef = React.useRef<HTMLInputElement>(null);
  const [lastAddedPriceIndex, setLastAddedPriceIndex] = React.useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const defaults: FormValues = { 
    productName: '', 
    groupId: '',
    productType: 1,
    description: '',
    reorderLevel: 0,
    cost: 0,
    lastPurePrice: 0,
    expirationDays: 180,
    productPrices: []
  };

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: defaults
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'productPrices'
  });

  // Focus على اسم المنتج عند فتح المودال
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

  // Focus على الباركود الجديد عند إضافة سعر
  React.useEffect(() => {
    if (lastAddedPriceIndex !== null) {
      const timer = setTimeout(() => {
        const barcodeInput = document.querySelector(
          `input[name="productPrices.${lastAddedPriceIndex}.barcode"]`
        ) as HTMLInputElement;
        if (barcodeInput) {
          barcodeInput.focus();
        }
        setLastAddedPriceIndex(null);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [lastAddedPriceIndex]);

  // إعادة تعيين النموذج عند تغيير البيانات
  React.useEffect(() => {
    if (open) {
      if (mode === 'add') {
        reset(defaults);
      } else if (initialValues) {
        reset({
          productName: initialValues.name,
          groupId: initialValues.groupId,
          productType: initialValues.productType,
          description: initialValues.description || '',
          reorderLevel: initialValues.reorderLevel,
          cost: initialValues.cost,
          lastPurePrice: initialValues.lastPurePrice,
          expirationDays: initialValues.expirationDays,
          productPrices: initialValues.productPrices?.map(p => ({
            productPriceId: p.id,
            unitId: p.unitId,
            unitFactor: p.unitFactor,
            barcode: p.barcode,
            Price: p.price
          })) ?? []
        });
      }
    }
  }, [open, mode, initialValues, reset]);

  const addPrice = () => {
    const newIndex = fields.length;
    append({
      unitId: '',
      unitFactor: 1,
      barcode: '',
      Price: 0
    });
    setLastAddedPriceIndex(newIndex);
  };

  const submit = async (data: FormValues, saveAction: 'save' | 'saveAndNew') => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      console.log('Form data before submit:', data);
      console.log('Mode:', mode);
      console.log('Save action:', saveAction);
      
      if (mode === 'edit' && initialValues) {
        const updateData = {
          ProductId: initialValues.id,
          productName: data.productName,
          groupId: data.groupId,
          ProductType: data.productType,
          description: data.description,
          reorderLevel: data.reorderLevel,
          lastPurePrice: data.lastPurePrice,
          expirationDays: data.expirationDays,
          productPrices: data.productPrices
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

  // مكون منفصل لعرض الأسعار في الموبايل
  const MobilePriceCard: React.FC<{ index: number; onRemove: () => void }> = ({ index, onRemove }) => (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Stack spacing={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2" color="primary">
              {t('products.price')} #{index + 1}
            </Typography>
            <IconButton
              size="small"
              color="error"
              onClick={onRemove}
              type="button"
            >
              <IconTrash size={18} />
            </IconButton>
          </Box>

          {/* الباركود */}
          <Controller
            name={`productPrices.${index}.barcode`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('products.barcode')}
                placeholder={t('products.barcodeOptional')}
                fullWidth
                size="small"
              />
            )}
          />

          {/* الوحدة */}
          <Controller
            name={`productPrices.${index}.unitId`}
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <FormControl fullWidth size="small" error={!!fieldState.error}>
                <InputLabel>{t('products.unit')}</InputLabel>
                <Select
                  {...field}
                  label={t('products.unit')}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>{t('products.selectUnit')}</em>
                  </MenuItem>
                  {units.map((unit) => (
                    <MenuItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          {/* معامل الوحدة والسعر في صف واحد */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Controller
                name={`productPrices.${index}.unitFactor`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('products.unitFactor')}
                    type="number"
                    fullWidth
                    size="small"
                    inputProps={{ min: 0.01, step: 0.01 }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name={`productPrices.${index}.Price`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('products.price')}
                    type="number"
                    fullWidth
                    size="small"
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );

  // مكون الجدول للشاشات الكبيرة
  const DesktopPriceTable = () => (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('products.barcode')}</TableCell>
            <TableCell>{t('products.unit')}</TableCell>
            <TableCell>{t('products.unitFactor')}</TableCell>
            <TableCell>{t('products.price')}</TableCell>
            <TableCell width={50}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography color="text.secondary">
                  {t('products.noPrices')}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            fields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell>
                  <Controller
                    name={`productPrices.${index}.barcode`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        size="small"
                        placeholder={t('products.barcodeOptional')}
                        fullWidth
                      />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Controller
                    name={`productPrices.${index}.unitId`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormControl fullWidth size="small">
                        <Select
                          {...field}
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>{t('products.selectUnit')}</em>
                          </MenuItem>
                          {units.map((unit) => (
                            <MenuItem key={unit.id} value={unit.id}>
                              {unit.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Controller
                    name={`productPrices.${index}.unitFactor`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        size="small"
                        inputProps={{ min: 0.01, step: 0.01 }}
                      />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Controller
                    name={`productPrices.${index}.Price`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        size="small"
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => remove(index)}
                    type="button"
                  >
                    <IconTrash size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      disableEscapeKeyDown={false}
      fullScreen={isMobile} // ملء الشاشة في الموبايل
    >
      <DialogTitle>
        {mode === 'add' ? t('products.add') : t('products.edit')}
      </DialogTitle>

      <form>
        <DialogContent sx={{ maxHeight: isMobile ? 'none' : '70vh', overflowY: 'auto' }}>
          <Grid container spacing={3}>
            {/* ---------- Basic Info ---------- */}
            <Grid item xs={12} md={6}>
              <Controller
                name="productName"
                control={control}
                rules={{ required: t('products.nameRequired') }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    inputRef={nameFieldRef}
                    label={t('products.name')}
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    autoFocus
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="groupId"
                control={control}
                rules={{ required: t('products.groupRequired') }}
                render={({ field, fieldState }) => (
                  <Box>
                    <GroupTreeSelect
                      groups={groups}
                      value={field.value}
                      onChange={field.onChange}
                      label={t('products.group')}
                    />
                    {fieldState.error && (
                      <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                        {fieldState.error.message}
                      </Typography>
                    )}
                  </Box>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="productType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>{t('products.type')}</InputLabel>
                    <Select
                      {...field}
                      label={t('products.type')}
                    >
                      <MenuItem value={1}>POS</MenuItem>
                      <MenuItem value={2}>Material</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('products.description')}
                    fullWidth
                    multiline
                    rows={2}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="reorderLevel"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('products.reorderLevel')}
                    type="number"
                    fullWidth
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                )}
              />
            </Grid>

            {/* إظهار التكلفة فقط في الإضافة */}
            {mode === 'add' && (
              <Grid item xs={12} md={6}>
                <Controller
                  name="cost"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('products.cost')}
                      type="number"
                      fullWidth
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  )}
                />
              </Grid>
            )}

            {/* إظهار التكلفة للقراءة فقط في التعديل */}
            {mode === 'edit' && initialValues && (
              <Grid item xs={12} md={6}>
                <TextField
                  label={t('products.cost')}
                  value={Number(initialValues.cost).toFixed(2)}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="filled"
                />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <Controller
                name="lastPurePrice"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('products.lastPurePrice')}
                    type="number"
                    fullWidth
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="expirationDays"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('products.expirationDays')}
                    type="number"
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                )}
              />
            </Grid>

            {/* ---------- Product Prices ---------- */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  {t('products.prices')}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<IconPlus size={20} />}
                  onClick={addPrice}
                  type="button"
                  size={isMobile ? "small" : "medium"}
                >
                  {t('products.addPrice')}
                </Button>
              </Box>

              {/* عرض مختلف للموبايل والشاشات الكبيرة */}
              {isMobile ? (
                <Box>
                  {fields.length === 0 ? (
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="text.secondary" align="center">
                          {t('products.noPrices')}
                        </Typography>
                      </CardContent>
                    </Card>
                  ) : (
                    fields.map((field, index) => (
                      <MobilePriceCard
                        key={field.id}
                        index={index}
                        onRemove={() => remove(index)}
                      />
                    ))
                  )}
                </Box>
              ) : (
                <DesktopPriceTable />
              )}
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
              {t('products.saveAndExit')}
            </Button>
            
            <Button 
              variant="contained"
              startIcon={<IconPlusNew size={20} />}
              onClick={handleSubmit((data) => submit(data, 'saveAndNew'))}
              disabled={isSubmitting}
              fullWidth={isMobile}
            >
              {t('products.saveAndNew')}
            </Button>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductForm;
