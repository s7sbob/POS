// File: src/pages/purchases/components/mobile/MobilePurchaseForm.tsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  TextField,
  Button,
  Stack,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Divider,
  Alert,
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab
} from '@mui/material';
import {
  IconPlus,
  IconTrash,
  IconArrowLeft,
  IconChevronDown,
  IconChevronUp,
} from '@tabler/icons-react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Purchase } from 'src/utils/api/pagesApi/purchaseApi';
import { Supplier } from 'src/utils/api/pagesApi/suppliersApi';
import { Warehouse } from 'src/utils/api/pagesApi/warehousesApi';
import MobileSearchableSelect from '../../../purchase-orders/components/mobile/MobileSearchableSelect';
import MobileProductSearch from '../../../purchase-orders/components/mobile/MobileProductSearch';
import { ProductPrice } from 'src/utils/api/pagesApi/purchaseProductsApi';

type FormValues = {
  referenceDocNumber: string;
  purchaseOrderId?: string | null;
  date1: string;
  date2: string;
  warehouseId: string;
  supplierId: string;
  discountPercent: number;
  discountValue: number;
  taxPercent: number;
  taxValue: number;
  subTotal: number;
  total: number;
  status: number;
  details: Array<{
    purchaseDetailID?: string;
    productId: string;
    productPriceId: string;
    productName?: string;
    unitId: string;
    unitName?: string;
    unitFactor: number;
    quantity: number;
    price: number;
    discountPercent: number;
    discountValue: number;
    taxPercent: number;
    taxValue: number;
    subTotal: number;
    total: number;
  }>;
};

interface Props {
  mode: 'add' | 'edit';
  initialValues?: Purchase;
  suppliers: Supplier[];
  warehouses: Warehouse[];
  onSubmit: (data: any) => Promise<void>;
}

const MobilePurchaseForm: React.FC<Props> = ({
  mode, initialValues, suppliers, warehouses, onSubmit
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productSearchOpen, setProductSearchOpen] = useState(false);
  const [alertMessage, setMessage] = useState('');
  const [alertSeverity, setSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('error');
  const [expandedSection, setExpandedSection] = useState<string>('basic');

  const defaults: FormValues = {
    referenceDocNumber: `PI-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
    purchaseOrderId: null,
    date1: new Date().toISOString().split('T')[0],
    date2: new Date().toISOString().split('T')[0],
    warehouseId: '',
    supplierId: '',
    discountPercent: 0,
    discountValue: 0,
    taxPercent: 14,
    taxValue: 0,
    subTotal: 0,
    total: 0,
    status: 1,
    details: []
  };

  const { control, handleSubmit, reset, watch, setValue } = useForm<FormValues>({
    defaultValues: defaults
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'details'
  });

  const watchedDetails = watch('details');
  const watchedDiscountPercent = watch('discountPercent');
  const watchedTaxPercent = watch('taxPercent');
  const watchedTotal = watch('total');
  const watchedStatus = watch('status');

  // حساب الإجماليات
  const recalculateAll = () => {
    const currentDetails = watch('details');
    const currentDiscountPercent = watch('discountPercent');
    const currentTaxPercent = watch('taxPercent');
    
    let subTotal = 0;

    currentDetails.forEach((detail: any, idx: number) => {
      const quantity = parseFloat(detail.quantity?.toString() || '0');
      const price = parseFloat(detail.price?.toString() || '0');
      const unitFactor = parseFloat(detail.unitFactor?.toString() || '1');
      const discountPercent = parseFloat(detail.discountPercent?.toString() || '0');
      const taxPercent = parseFloat(detail.taxPercent?.toString() || '0');

      if (isNaN(quantity) || isNaN(price) || isNaN(unitFactor)) return;

      const lineSubTotal = quantity * price * unitFactor;
      const lineDiscountValue = lineSubTotal * (discountPercent / 100);
      const afterDiscount = lineSubTotal - lineDiscountValue;
      const lineTaxValue = afterDiscount * (taxPercent / 100);
      const lineTotal = afterDiscount + lineTaxValue;

      setValue(`details.${idx}.subTotal` as any, parseFloat(lineSubTotal.toFixed(2)));
      setValue(`details.${idx}.discountValue` as any, parseFloat(lineDiscountValue.toFixed(2)));
      setValue(`details.${idx}.taxValue` as any, parseFloat(lineTaxValue.toFixed(2)));
      setValue(`details.${idx}.total` as any, parseFloat(lineTotal.toFixed(2)));

      subTotal += lineSubTotal;
    });

    const globalDiscountPercent = parseFloat(currentDiscountPercent?.toString() || '0');
    const globalTaxPercent = parseFloat(currentTaxPercent?.toString() || '0');

    const totalDiscountValue = subTotal * (globalDiscountPercent / 100);
    const afterDiscount = subTotal - totalDiscountValue;
    const totalTaxValue = afterDiscount * (globalTaxPercent / 100);
    const total = afterDiscount + totalTaxValue;

    setValue('subTotal', parseFloat(subTotal.toFixed(2)));
    setValue('discountValue', parseFloat(totalDiscountValue.toFixed(2)));
    setValue('taxValue', parseFloat(totalTaxValue.toFixed(2)));
    setValue('total', parseFloat(total.toFixed(2)));
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      recalculateAll();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [watchedDetails, watchedDiscountPercent, watchedTaxPercent]);

  useEffect(() => {
    if (mode === 'edit' && initialValues) {
      const convertedDetails = initialValues.details.map((d) => ({
        purchaseDetailID: d.id || '',
        productId: d.productID,
        productPriceId: d.productPriceID || '',
        productName: d.productName || d.unitName || 'منتج غير محدد',
        unitId: d.unitId,
        unitName: d.unitName,
        unitFactor: d.unitFactor,
        quantity: d.quantity,
        price: d.price,
        discountPercent: d.discountPercent,
        discountValue: d.discountValue,
        taxPercent: d.taxPercent,
        taxValue: d.taxValue,
        subTotal: d.subTotal,
        total: d.total
      }));

      reset({
        referenceDocNumber: initialValues.referenceDocNumber,
        purchaseOrderId: initialValues.purchaseOrderId,
        date1: initialValues.date1.split('T')[0],
        date2: initialValues.date2.split('T')[0],
        warehouseId: initialValues.warehouseId,
        supplierId: initialValues.supplierId,
        discountPercent: initialValues.discountPercent,
        discountValue: initialValues.discountValue,
        taxPercent: initialValues.taxPercent,
        taxValue: initialValues.taxValue,
        subTotal: initialValues.subTotal,
        total: initialValues.total,
        status: initialValues.status,
        details: convertedDetails
      });
    } else if (mode === 'add') {
      reset(defaults);
    }
  }, [mode, initialValues, reset]);

  const addProductToForm = (productPrice: ProductPrice) => {
    const newItem = {
      productId: productPrice.productId,
      productPriceId: productPrice.id,
      productName: productPrice.productName,
      unitId: productPrice.unitId || '',
      unitName: productPrice.unitName,
      unitFactor: productPrice.unitFactor,
      quantity: 1,
      price: productPrice.price,
      discountPercent: 0,
      discountValue: 0,
      taxPercent: 14,
      taxValue: 0,
      subTotal: 0,
      total: 0
    };

    append(newItem);
    setProductSearchOpen(false);
    setExpandedSection('items');
  };

  const validateNumber = (value: any, fieldName: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      setMessage(`${t('validation.enterValidNumber')} ${fieldName}`);
      setSeverity('error');
      return false;
    }
    return true;
  };

  const submit = async (data: FormValues, submitStatus: number) => {
    if (isSubmitting) return;

    if (!data.supplierId) {
      setMessage(t('validation.supplierRequired') || 'يجب اختيار المورد');
      setSeverity('error');
      return;
    }

    if (!data.warehouseId) {
      setMessage(t('validation.warehouseRequired') || 'يجب اختيار المخزن');
      setSeverity('error');
      return;
    }

    if (data.details.length === 0) {
      setMessage(t('validation.itemsRequired') || 'يجب إضافة منتج واحد على الأقل');
      setSeverity('error');
      return;
    }

    for (let i = 0; i < data.details.length; i++) {
      const detail = data.details[i];
      if (!validateNumber(detail.quantity, `${t('purchases.quantity')} ${t('common.inLine')} ${i + 1}`)) return;
      if (!validateNumber(detail.price, `${t('purchases.price')} ${t('common.inLine')} ${i + 1}`)) return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        ...data,
        status: submitStatus,
        date1: `${data.date1}T00:00:00`,
        date2: `${data.date2}T00:00:00`,
        details: data.details.map((d) => {
          const detailData: any = {
            productID: d.productId,
            productPriceID: d.productPriceId,
            unitId: d.unitId,
            unitFactor: d.unitFactor,
            quantity: parseFloat(d.quantity.toString()),
            price: parseFloat(d.price.toString()),
            discountPercent: parseFloat(d.discountPercent.toString()),
            discountValue: parseFloat(d.discountValue.toString()),
            taxPercent: parseFloat(d.taxPercent.toString()),
            taxValue: parseFloat(d.taxValue.toString()),
            subTotal: parseFloat(d.subTotal.toString()),
            total: parseFloat(d.total.toString())
          };

          if (mode === 'edit' && d.purchaseDetailID && d.purchaseDetailID.trim() !== '') {
            detailData.id = d.purchaseDetailID;
          }

          return detailData;
        })
      };

      await onSubmit(submitData);

      if (submitStatus === 1 && mode === 'add') {
        reset(defaults);
        setExpandedSection('basic');
      } else {
        navigate('/purchases/purchases');
      }
    } catch (error) {
      setSeverity('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSection(isExpanded ? panel : '');
  };

  return (
    <Container maxWidth="sm" sx={{ py: 1, px: 1 }}>
      {/* Header مع الإجمالي */}
      <Card sx={{ mb: 2, position: 'sticky', top: 0, zIndex: 100 }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">
              {mode === 'add' ? t('purchases.add') : t('purchases.edit')}
            </Typography>
            <IconButton onClick={() => navigate('/purchases/purchases')} size="small">
              <IconArrowLeft />
            </IconButton>
          </Box>
          
          <Typography variant="h4" color="primary" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
            {t('purchases.total')}: {watchedTotal?.toFixed(2) || '0.00'}
          </Typography>
          
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            {watchedStatus !== 3 && (
              <>
                <Button
                  variant="contained"
                  size="small"
                  fullWidth
                  onClick={handleSubmit((data) => {
                    data.status = 1;
                    submit(data, 1);
                  })}
                  disabled={isSubmitting}
                >
                  {t('purchases.savePending')}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  fullWidth
                  onClick={handleSubmit((data) => {
                    data.status = 3;
                    submit(data, 3);
                  })}
                  disabled={isSubmitting}
                >
                  {t('purchases.submit')}
                </Button>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* المعلومات الأساسية */}
      <Accordion 
        expanded={expandedSection === 'basic'} 
        onChange={handleAccordionChange('basic')}
        sx={{ mb: 1 }}
      >
        <AccordionSummary expandIcon={expandedSection === 'basic' ? <IconChevronUp /> : <IconChevronDown />}>
          <Typography variant="h6">{t('purchases.basicInfo')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Controller
              name="referenceDocNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('purchases.invoiceNumber')}
                  fullWidth
                  size="small"
                  disabled={watchedStatus === 3}
                />
              )}
            />

            <Controller
              name="date1"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('purchases.invoiceDate')}
                  type="date"
                  fullWidth
                  size="small"
                  disabled={watchedStatus === 3}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />

            <Controller
              name="supplierId"
              control={control}
              rules={{ required: t('validation.supplierRequired') }}
              render={({ field, fieldState }) => (
                <MobileSearchableSelect
                  label={t('purchases.supplier')}
                  value={field.value}
                  onChange={field.onChange}
                  options={suppliers.map(s => ({ id: s.id, name: s.name }))}
                  placeholder={t('purchases.selectSupplier')}
                  error={!!fieldState.error}
                  disabled={watchedStatus === 3}
                />
              )}
            />

            <Controller
              name="warehouseId"
              control={control}
              rules={{ required: t('validation.warehouseRequired') }}
              render={({ field, fieldState }) => (
                <MobileSearchableSelect
                  label={t('purchases.warehouse')}
                  value={field.value}
                  onChange={field.onChange}
                  options={warehouses.map(w => ({ id: w.id, name: w.name }))}
                  placeholder={t('purchases.selectWarehouse')}
                  error={!!fieldState.error}
                  disabled={watchedStatus === 3}
                />
              )}
            />
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* الخصومات والضرائب */}
      <Accordion 
        expanded={expandedSection === 'discounts'} 
        onChange={handleAccordionChange('discounts')}
        sx={{ mb: 1 }}
      >
        <AccordionSummary expandIcon={expandedSection === 'discounts' ? <IconChevronUp /> : <IconChevronDown />}>
          <Typography variant="h6">{t('purchases.discountsAndTaxes')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Controller
              name="discountPercent"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={`${t('purchases.totalDiscount')} %`}
                  type="number"
                  fullWidth
                  size="small"
                  disabled={watchedStatus === 3}
                  inputProps={{ inputMode: 'decimal' }}
                />
              )}
            />

            <Controller
              name="taxPercent"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={`${t('purchases.totalTax')} %`}
                  type="number"
                  fullWidth
                  size="small"
                  disabled={watchedStatus === 3}
                  inputProps={{ inputMode: 'decimal' }}
                />
              )}
            />
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* الأصناف */}
      <Accordion 
        expanded={expandedSection === 'items'} 
        onChange={handleAccordionChange('items')}
        sx={{ mb: 1 }}
      >
        <AccordionSummary expandIcon={expandedSection === 'items' ? <IconChevronUp /> : <IconChevronDown />}>
          <Typography variant="h6">
            {t('purchases.items')} ({fields.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            {fields.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                {t('purchases.noItems')}
              </Typography>
            ) : (
              fields.map((field, index) => (
                <Card key={field.id} variant="outlined">
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle2">
                        #{index + 1} - {watch(`details.${index}.productName`)}
                      </Typography>
                      {watchedStatus !== 3 && (
                        <IconButton onClick={() => remove(index)} size="small" color="error">
                          <IconTrash size={16} />
                        </IconButton>
                      )}
                    </Box>

                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Controller
                          name={`details.${index}.quantity`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={t('purchases.quantity')}
                              type="number"
                              size="small"
                              fullWidth
                              disabled={watchedStatus === 3}
                              inputProps={{ inputMode: 'decimal' }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <Controller
                          name={`details.${index}.price`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={t('purchases.price')}
                              type="number"
                              size="small"
                              fullWidth
                              disabled={watchedStatus === 3}
                              inputProps={{ inputMode: 'decimal' }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <Controller
                          name={`details.${index}.discountPercent`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={`${t('purchases.discount')} %`}
                              type="number"
                              size="small"
                              fullWidth
                              disabled={watchedStatus === 3}
                              inputProps={{ inputMode: 'decimal' }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <Controller
                          name={`details.${index}.taxPercent`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={`${t('purchases.tax')} %`}
                              type="number"
                              size="small"
                              fullWidth
                              disabled={watchedStatus === 3}
                              inputProps={{ inputMode: 'decimal' }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 1 }} />
                    
                    <Typography variant="body2" sx={{ textAlign: 'right', fontWeight: 'bold' }}>
                      {t('purchases.total')}: {watch(`details.${index}.total`)?.toFixed(2) || '0.00'}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* زر إضافة منتج عائم */}
      {watchedStatus !== 3 && (
        <Fab
          color="primary"
          onClick={() => setProductSearchOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 16,
            left: 16,
            zIndex: 1000
          }}
        >
          <IconPlus />
        </Fab>
      )}

      {/* البحث عن المنتجات */}
      <MobileProductSearch
        open={productSearchOpen}
        onClose={() => setProductSearchOpen(false)}
        onSelect={addProductToForm}
      />

      {/* التنبيهات */}
      <Snackbar
        open={!!alertMessage}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setMessage('')}
          severity={alertSeverity}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MobilePurchaseForm;
