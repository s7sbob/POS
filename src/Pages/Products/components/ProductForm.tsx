// File: src/pages/products/components/ProductForm.tsx
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Typography,
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Stack,
  Card, CardContent, useMediaQuery, useTheme, Accordion,
  AccordionSummary, AccordionDetails} from '@mui/material';
import { 
  IconPlus, IconTrash, IconDeviceFloppy, IconPlus as IconPlusNew,
  IconChevronDown, IconComponents
} from '@tabler/icons-react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Product, searchProductPricesByNameOrBarcode } from 'src/utils/api/pagesApi/productsApi';
import { Group } from 'src/utils/api/pagesApi/groupsApi';
import { Unit } from 'src/utils/api/pagesApi/unitsApi';
import GroupTreeSelect from './GroupTreeSelect';
import ProductPriceSearchSelect from './ProductPriceSearchSelect';

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
    productComponents: Array<{
      componentId?: string;
      rawProductPriceId: string;
      quantity: number;
      notes: string;
    }>;
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
  const [, setLastAddedPriceIndex] = React.useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [expandedPriceIndex, setExpandedPriceIndex] = React.useState<number | null>(null);
  
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

  const { control, handleSubmit, reset, watch, formState: { isSubmitSuccessful } } = useForm<FormValues>({
    defaultValues: defaults
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'productPrices'
  });

  const watchedProductId = initialValues?.id;

  // إعادة تعيين النموذج بعد النجاح في الحفظ
  React.useEffect(() => {
    if (isSubmitSuccessful && mode === 'add') {
      const timer = setTimeout(() => {
        reset(defaults);
        if (nameFieldRef.current) {
          nameFieldRef.current.focus();
          nameFieldRef.current.select();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isSubmitSuccessful, mode, reset]);

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
            Price: p.price,
            productComponents: p.productComponents?.map(c => ({
              componentId: c.componentId,
              rawProductPriceId: c.rawProductPriceId,
              quantity: c.quantity,
              notes: c.notes || ''
            })) || []
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
      Price: 0,
      productComponents: []
    });
    setLastAddedPriceIndex(newIndex);
  };

  const submit = async (data: FormValues, saveAction: 'save' | 'saveAndNew') => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      console.log('Form data before submit:', data);
      
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
          productPrices: data.productPrices.map(price => ({
            ...(price.productPriceId && { productPriceId: price.productPriceId }),
            unitId: price.unitId,
            unitFactor: Number(price.unitFactor),
            barcode: price.barcode,
            Price: Number(price.Price),
            productComponents: price.productComponents?.map(component => ({
              ...(component.componentId && { componentId: component.componentId }),
              rawProductPriceId: component.rawProductPriceId,
              quantity: Number(component.quantity),
              notes: component.notes || ""
            })) || []
          }))
        };
        console.log('Sending update data:', JSON.stringify(updateData, null, 2));
        await onSubmit(updateData, saveAction);
      } else {
        // للإضافة
        const addData = {
          productName: data.productName,
          groupId: data.groupId,
          productType: data.productType,
          description: data.description,
          reorderLevel: data.reorderLevel,
          cost: data.cost,
          lastPurePrice: data.lastPurePrice,
          expirationDays: data.expirationDays,
          productPrices: data.productPrices.map(price => ({
            unitId: price.unitId,
            unitFactor: Number(price.unitFactor),
            barcode: price.barcode,
            Price: Number(price.Price),
            productComponents: price.productComponents?.map(component => ({
              rawProductPriceId: component.rawProductPriceId,
              quantity: Number(component.quantity),
              notes: component.notes || ""
            })) || []
          }))
        };
        console.log('Sending add data:', JSON.stringify(addData, null, 2));
        await onSubmit(addData, saveAction);
      }

      if (mode === 'add' && saveAction === 'saveAndNew') {
        setTimeout(() => {
          reset(defaults);
          if (nameFieldRef.current) {
            nameFieldRef.current.focus();
            nameFieldRef.current.select();
          }
        }, 100);
      }
      
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // الحصول على اسم الوحدة

  // مكون إدارة المكونات لكل سعر

const ProductComponentsManager: React.FC<{ priceIndex: number }> = ({ priceIndex }) => {
  const { fields: componentFields, append: appendComponent, remove: removeComponent } = useFieldArray({
    control,
    name: `productPrices.${priceIndex}.productComponents`
  });

  const [componentDetails, setComponentDetails] = React.useState<{[key: string]: any}>({});
  const [loadingComponents, setLoadingComponents] = React.useState<{[key: string]: boolean}>({});

  const addComponent = () => {
    appendComponent({
      rawProductPriceId: '',
      quantity: 1,
      notes: ''
    });
  };

  // دالة محسنة لجلب تفاصيل المكون
  const fetchComponentDetails = async (rawProductPriceId: string, _componentIndex: number) => {
    if (!rawProductPriceId || componentDetails[rawProductPriceId] || loadingComponents[rawProductPriceId]) return;

    setLoadingComponents(prev => ({ ...prev, [rawProductPriceId]: true }));

    try {
      // أولاً، جرب البحث بالـ ID مباشرة
      const searchResponse = await searchProductPricesByNameOrBarcode(rawProductPriceId, 1, 10);
      let foundInSearch = searchResponse.data.find(item => item.productPriceId === rawProductPriceId);
      
      // إذا لم نجد بالـ ID، جرب البحث بالباركود
      if (!foundInSearch) {
        const searchByBarcode = await searchProductPricesByNameOrBarcode('', 1, 100);
        foundInSearch = searchByBarcode.data.find(item => item.productPriceId === rawProductPriceId);
      }

      if (foundInSearch) {
        const details = {
          productName: foundInSearch.product?.productName || 'منتج غير محدد',
          unitName: foundInSearch.unit?.unitName || 'وحدة غير محددة',
          unitFactor: foundInSearch.unitFactor || 1,
          price: foundInSearch.price || 0,
          barcode: foundInSearch.barcode || '',
          productId: foundInSearch.product?.productID || ''
        };

        setComponentDetails(prev => ({
          ...prev,
          [rawProductPriceId]: details
        }));

        console.log(`Component details loaded for ${rawProductPriceId}:`, details);
      } else {
        // إذا لم نجد التفاصيل، اعرض معلومات أساسية
        setComponentDetails(prev => ({
          ...prev,
          [rawProductPriceId]: {
            productName: `منتج (${rawProductPriceId.slice(-8)})`,
            unitName: 'وحدة غير محددة',
            unitFactor: 1,
            price: 0,
            barcode: 'غير محدد',
            productId: ''
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching component details:', error);
      // في حالة الخطأ، اعرض معلومات أساسية
      setComponentDetails(prev => ({
        ...prev,
        [rawProductPriceId]: {
          productName: `منتج (${rawProductPriceId.slice(-8)})`,
          unitName: 'وحدة غير محددة',
          unitFactor: 1,
          price: 0,
          barcode: 'غير محدد',
          productId: ''
        }
      }));
    } finally {
      setLoadingComponents(prev => ({ ...prev, [rawProductPriceId]: false }));
    }
  };

  // جلب تفاصيل المكونات الموجودة عند التحميل والتحديث
  React.useEffect(() => {
    const loadComponentsDetails = async () => {
      for (let index = 0; index < componentFields.length; index++) {
        const rawProductPriceId = watch(`productPrices.${priceIndex}.productComponents.${index}.rawProductPriceId`);
        if (rawProductPriceId && !componentDetails[rawProductPriceId]) {
          await fetchComponentDetails(rawProductPriceId, index);
        }
      }
    };

    if (componentFields.length > 0) {
      loadComponentsDetails();
    }
  }, [componentFields.length, priceIndex]);

  // مراقبة تغييرات القيم
  React.useEffect(() => {
    componentFields.forEach((_field, index) => {
      const rawProductPriceId = watch(`productPrices.${priceIndex}.productComponents.${index}.rawProductPriceId`);
      if (rawProductPriceId && !componentDetails[rawProductPriceId]) {
        fetchComponentDetails(rawProductPriceId, index);
      }
    });
  }, [componentFields, priceIndex]);

  return (
    <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconComponents size={16} />
          {t('products.components')} ({componentFields.length})
        </Typography>
        <Button
          size="small"
          variant="outlined"
          onClick={addComponent}
          startIcon={<IconPlus size={16} />}
        >
          {t('products.addComponent')}
        </Button>
      </Box>

      {componentFields.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          {t('products.noComponents')}
        </Typography>
      ) : (
        <Stack spacing={2}>
          {componentFields.map((field, componentIndex) => {
            const currentRawProductPriceId = watch(`productPrices.${priceIndex}.productComponents.${componentIndex}.rawProductPriceId`);
            const details = componentDetails[currentRawProductPriceId];
            const isLoading = loadingComponents[currentRawProductPriceId];
            
            return (
              <Card key={field.id} variant="outlined" sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={5}>
                    <Controller
                      name={`productPrices.${priceIndex}.productComponents.${componentIndex}.rawProductPriceId`}
                      control={control}
                      rules={{ required: t('products.componentRequired') }}
                      render={({ field, fieldState }) => (
                        <ProductPriceSearchSelect
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            if (value) {
                              fetchComponentDetails(value, componentIndex);
                            }
                          }}
                          label={t('products.selectComponent')}
                          error={!!fieldState.error}
                          excludeProductId={watchedProductId}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={6} md={2}>
                    <Controller
                      name={`productPrices.${priceIndex}.productComponents.${componentIndex}.quantity`}
                      control={control}
                      rules={{ required: true, min: 0.01 }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t('products.quantity')}
                          type="number"
                          size="small"
                          fullWidth
                          inputProps={{ min: 0.01, step: 0.01 }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={6} md={3}>
                    <Controller
                      name={`productPrices.${priceIndex}.productComponents.${componentIndex}.notes`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t('products.notes')}
                          size="small"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeComponent(componentIndex)}
                      sx={{ width: '100%' }}
                    >
                      <IconTrash size={16} />
                    </IconButton>
                  </Grid>
                </Grid>

                {/* عرض تفاصيل المكون المحدد مع حالة التحميل */}
                {currentRawProductPriceId && (
                  <Box sx={{ mt: 2, p: 1, backgroundColor: 'Highlight', borderRadius: 1 }}>
                    {isLoading ? (
                      <Typography variant="caption" color="info.contrastText">
                        {t('products.loadingComponentDetails')}...
                      </Typography>
                    ) : details ? (
                      <Typography variant="caption" color="info.contrastText">
                        {t('products.selectedComponent')}: {details.productName} - 
                        {details.price?.toFixed(2)} - 
                        {details.unitName} × {details.unitFactor}
                        {details.barcode && details.barcode !== 'غير محدد' && ` - ${details.barcode}`}
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="info.contrastText">
                        ID: {currentRawProductPriceId}
                      </Typography>
                    )}
                  </Box>
                )}
              </Card>
            );
          })}
        </Stack>
      )}
    </Box>
  );
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

          {/* معامل الوحدة والسعر */}
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

          {/* المكونات */}
          <Accordion>
            <AccordionSummary expandIcon={<IconChevronDown />}>
              <Typography variant="subtitle2">
                {t('products.components')} ({fields[index]?.productComponents?.length || 0})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ProductComponentsManager priceIndex={index} />
            </AccordionDetails>
          </Accordion>
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
            <TableCell>{t('products.components')}</TableCell>
            <TableCell width={50}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography color="text.secondary">
                  {t('products.noPrices')}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            fields.map((field, index) => (
              <React.Fragment key={field.id}>
                <TableRow>
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
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setExpandedPriceIndex(expandedPriceIndex === index ? null : index)}
                      startIcon={<IconComponents size={16} />}
                    >
                      {fields[index]?.productComponents?.length || 0}
                    </Button>
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
                {expandedPriceIndex === index && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <ProductComponentsManager priceIndex={index} />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
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
      fullScreen={isMobile}
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
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                    inputProps={{ min: 0, step: 0.01 }}
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
