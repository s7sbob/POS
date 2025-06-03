import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Grid,
  TextField,
  Button,
  Stack,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Breadcrumbs,
  Link,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ClickAwayListener,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  IconDeviceFloppy, 
  IconPlus, 
  IconTrash, 
  IconArrowLeft,
  IconHome,
  IconSearch,
  IconBarcode
} from '@tabler/icons-react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PurchaseOrder } from 'src/utils/api/purchaseOrdersApi';
import { Supplier } from 'src/utils/api/suppliersApi';
import { Warehouse } from 'src/utils/api/warehousesApi';
import ProductPriceSearchDialog from './ProductPriceSearchDialog';
import BarcodeScanner from './BarcodeScanner';
import SearchableSelect from './SearchableSelect';
import { ProductPrice } from 'src/utils/api/purchaseProductsApi';
import * as productsApi from 'src/utils/api/purchaseProductsApi';

// Custom hook for debounced value
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

type FormValues = {
  referenceDocNumber: string;
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
  details: Array<{
    id?: string;
    productId: string;
    productPriceId?: string;
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
  initialValues?: PurchaseOrder;
  suppliers: Supplier[];
  warehouses: Warehouse[];
  onSubmit: (data: any, saveAction: 'save' | 'saveAndNew') => Promise<void>;
}

const PurchaseOrderForm: React.FC<Props> = ({
  mode, initialValues, suppliers, warehouses, onSubmit
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [productSearchOpen, setProductSearchOpen] = React.useState(false);
  const [lastAddedIndex, setLastAddedIndex] = React.useState<number | null>(null);
  
  // Quick search states
  const [quickSearchQuery, setQuickSearchQuery] = useState('');
  const [quickSearchResults, setQuickSearchResults] = useState<ProductPrice[]>([]);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [, setQuickSearchLoading] = useState(false);
  const [quickSearchSelectedIndex, setQuickSearchSelectedIndex] = useState(0);
  const [scannerOpen, setScannerOpen] = useState(false);
  
  // Alert states
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('error');

  // مراجع للـ inputs
  const quickSearchInputRef = useRef<HTMLInputElement>(null);
  const quickSearchRef = useRef<HTMLDivElement>(null);

  const debouncedQuickSearch = useDebounce(quickSearchQuery, 300);

  const defaults: FormValues = {
    referenceDocNumber: `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
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

  // Quick search effect
  useEffect(() => {
    if (debouncedQuickSearch.trim()) {
      handleQuickSearch(debouncedQuickSearch);
    } else {
      setQuickSearchResults([]);
      setQuickSearchOpen(false);
    }
  }, [debouncedQuickSearch]);

  // ✅ إصلاح 6: Focus على البحث السريع عند تحميل الصفحة
  useEffect(() => {
    const timer = setTimeout(() => {
      if (quickSearchInputRef.current) {
        quickSearchInputRef.current.focus();
      }
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Focus على الكمية بعد إضافة منتج
  React.useEffect(() => {
    if (lastAddedIndex !== null) {
      const timer = setTimeout(() => {
        const quantityInput = document.querySelector(
          `input[name="details.${lastAddedIndex}.quantity"]`
        ) as HTMLInputElement;
        if (quantityInput) {
          quantityInput.focus();
          quantityInput.select();
        }
        setLastAddedIndex(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [lastAddedIndex]);

  // حساب المجاميع تلقائياً
  React.useEffect(() => {
    const calculateTotals = () => {
      let subTotal = 0;

      watchedDetails.forEach((detail, index) => {
        const lineSubTotal = detail.quantity * detail.price;
        const lineDiscountValue = (lineSubTotal * detail.discountPercent) / 100;
        const lineAfterDiscount = lineSubTotal - lineDiscountValue;
        const lineTaxValue = (lineAfterDiscount * detail.taxPercent) / 100;
        const lineTotal = lineAfterDiscount + lineTaxValue;

        setValue(`details.${index}.subTotal`, lineSubTotal);
        setValue(`details.${index}.discountValue`, lineDiscountValue);
        setValue(`details.${index}.taxValue`, lineTaxValue);
        setValue(`details.${index}.total`, lineTotal);

        subTotal += lineTotal;
      });

      const totalDiscountValue = (subTotal * watchedDiscountPercent) / 100;
      const afterDiscount = subTotal - totalDiscountValue;
      const totalTaxValue = (afterDiscount * watchedTaxPercent) / 100;
      const total = afterDiscount + totalTaxValue;

      setValue('subTotal', subTotal);
      setValue('discountValue', totalDiscountValue);
      setValue('taxValue', totalTaxValue);
      setValue('total', total);
    };

    calculateTotals();
  }, [watchedDetails, watchedDiscountPercent, watchedTaxPercent, setValue]);

  React.useEffect(() => {
    if (mode === 'add') {
      reset(defaults);
    } else if (initialValues) {
      const convertedDetails = initialValues.details.map(d => ({
        id: d.purchaseOrderId || d.id,
        productId: d.productID,
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
        details: convertedDetails
      });
    }
  }, [mode, initialValues, reset, t]);

  // Quick search handler
  const handleQuickSearch = async (query: string) => {
    try {
      setQuickSearchLoading(true);
      const result = await productsApi.searchProductPrices(query, 1, 10);
      setQuickSearchResults(result.data);
      setQuickSearchOpen(result.data.length > 0);
      setQuickSearchSelectedIndex(0);
    } catch (error) {
      console.error('Quick search error:', error);
      setQuickSearchResults([]);
      setQuickSearchOpen(false);
    } finally {
      setQuickSearchLoading(false);
    }
  };

  // Handle barcode scan
  const handleBarcodeScanned = async (barcode: string) => {
    try {
      const result = await productsApi.searchProductPrices(barcode, 1, 1);
      if (result.data.length > 0) {
        const productPrice = result.data[0];
        addProductToForm(productPrice);
        setAlertMessage(`${t('products.productAdded')}: ${productPrice.productName}`);
        setAlertSeverity('success');
      } else {
        setAlertMessage(t('products.noProductFoundWithBarcode'));
        setAlertSeverity('warning');
      }
    } catch (error) {
      setAlertMessage(t('products.searchError'));
      setAlertSeverity('error');
    }
    setScannerOpen(false);
  };

  // ✅ إصلاح 4: Add product to form مع العودة للبحث السريع
  const addProductToForm = (productPrice: ProductPrice) => {
    const newIndex = fields.length;
    append({
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
    });
    
    setLastAddedIndex(newIndex);
    setQuickSearchQuery('');
    setQuickSearchOpen(false);
    
    // ✅ إصلاح 4: العودة للبحث السريع بعد الإضافة
    setTimeout(() => {
      if (quickSearchInputRef.current) {
        quickSearchInputRef.current.focus();
      }
    }, 100);
  };

  // ✅ إصلاح 4: معالجة التنقل بالكيبورد - محسن: كمية → سعر → بحث سريع
  const handleKeyDown = (e: React.KeyboardEvent, nextInputName?: string) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      
      if (nextInputName) {
        const nextInput = document.querySelector(`input[name="${nextInputName}"]`) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
          nextInput.select();
        }
      } else if (e.key === 'Enter') {
        // ✅ إصلاح 4: التنقل للبحث السريع بعد السعر
        if (quickSearchInputRef.current) {
          quickSearchInputRef.current.focus();
        }
      }
    }
  };

  // Quick search keyboard navigation - محسن
  const handleQuickSearchKeyDown = (e: React.KeyboardEvent) => {
    if (quickSearchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setQuickSearchSelectedIndex(prev => 
          Math.min(prev + 1, quickSearchResults.length - 1)
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setQuickSearchSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (quickSearchResults[quickSearchSelectedIndex]) {
          addProductToForm(quickSearchResults[quickSearchSelectedIndex]);
        }
        break;
      case 'Escape':
        setQuickSearchOpen(false);
        setQuickSearchQuery('');
        break;
    }
  };

  // فتح البحث مباشرة
  const addDetailWithSearch = () => {
    setProductSearchOpen(true);
  };

  // معالجة اختيار السعر
  const handleProductPriceSelect = (productPrice: ProductPrice) => {
    addProductToForm(productPrice);
  };

  // Number validation
  const validateNumber = (value: any, fieldName: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      setAlertMessage(`${t('validation.enterValidNumber')} ${fieldName}`);
      setAlertSeverity('error');
      return false;
    }
    return true;
  };

  // في دالة submit
  const submit = async (data: FormValues, saveAction: 'save' | 'saveAndNew') => {
    if (isSubmitting) return;
    
    // Validate numbers
    for (let i = 0; i < data.details.length; i++) {
      const detail = data.details[i];
      if (!validateNumber(detail.quantity, `${t('purchaseOrders.quantity')} ${t('common.inLine')} ${i + 1}`)) return;
      if (!validateNumber(detail.price, `${t('purchaseOrders.price')} ${t('common.inLine')} ${i + 1}`)) return;
      if (!validateNumber(detail.discountPercent, `${t('purchaseOrders.discount')} ${t('common.inLine')} ${i + 1}`)) return;
      if (!validateNumber(detail.taxPercent, `${t('purchaseOrders.tax')} ${t('common.inLine')} ${i + 1}`)) return;
    }
    
    if (!validateNumber(data.discountPercent, t('purchaseOrders.totalDiscount'))) return;
    if (!validateNumber(data.taxPercent, t('purchaseOrders.totalTax'))) return;
    
    setIsSubmitting(true);
    try {
      const submitData = {
        ...data,
        date1: `${data.date1}T00:00:00`,
        date2: `${data.date2}T00:00:00`,
        details: data.details.map((d, index) => {
          if (!d.productId) {
            throw new Error(`Detail ${index} missing productId`);
          }
          
          return {
            ...(mode === 'edit' && d.id ? { purchaseOrderDetailID: d.id } : {}),
            productID: d.productId,
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
        })
      };

      if (mode === 'edit' && initialValues) {
        await onSubmit({ 
          ...submitData, 
          id: initialValues.id 
        }, saveAction);
      } else {
        await onSubmit(submitData, saveAction);
      }

      if (saveAction === 'saveAndNew') {
        reset(defaults);
        setTimeout(() => {
          if (quickSearchInputRef.current) {
            quickSearchInputRef.current.focus();
          }
        }, 100);
      } else {
        navigate('/purchases/purchase-orders');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setAlertMessage(t('common.saveError'));
      setAlertSeverity('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // مكون منفصل لعرض التفاصيل في الموبايل
  const MobileDetailCard: React.FC<{ index: number; onRemove: () => void }> = ({ index, onRemove }) => (
    <Card variant="outlined" sx={{ mb: 0.5 }}>
      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
        <Stack spacing={0.5}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="primary">
              #{index + 1}
            </Typography>
            <IconButton size="small" color="error" onClick={onRemove}>
              <IconTrash size={14} />
            </IconButton>
          </Box>

          <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.8rem' }}>
            {watch(`details.${index}.productName`)} - {watch(`details.${index}.unitName`)}
          </Typography>

          <Grid container spacing={0.5}>
            <Grid item xs={6}>
              <Controller
                name={`details.${index}.quantity`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('purchaseOrders.quantity')}
                    type="number"
                    fullWidth
                    size="small"
                    inputProps={{ min: 0, step: 0.01 }}
                    InputProps={{
                      sx: {
                        '& input[type=number]': {
                          '-moz-appearance': 'textfield',
                        },
                        '& input[type=number]::-webkit-outer-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        },
                        '& input[type=number]::-webkit-inner-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        },
                      },
                    }}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(e) => handleKeyDown(e, `details.${index}.price`)}
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
                    label={t('purchaseOrders.price')}
                    type="number"
                    fullWidth
                    size="small"
                    inputProps={{ min: 0, step: 0.01 }}
                    InputProps={{
                      sx: {
                        '& input[type=number]': {
                          '-moz-appearance': 'textfield',
                        },
                        '& input[type=number]::-webkit-outer-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        },
                        '& input[type=number]::-webkit-inner-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        },
                      },
                    }}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(e) => handleKeyDown(e)}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Grid container spacing={0.5}>
            <Grid item xs={6}>
              <Controller
                name={`details.${index}.discountPercent`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('purchaseOrders.discount')}
                    type="number"
                    fullWidth
                    size="small"
                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                    InputProps={{ 
                      endAdornment: '%',
                      sx: {
                        '& input[type=number]': {
                          '-moz-appearance': 'textfield',
                        },
                        '& input[type=number]::-webkit-outer-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        },
                        '& input[type=number]::-webkit-inner-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        },
                      },
                    }}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(e) => handleKeyDown(e, `details.${index}.taxPercent`)}
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
                    label={t('purchaseOrders.tax')}
                    type="number"
                    fullWidth
                    size="small"
                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                    InputProps={{ 
                      endAdornment: '%',
                      sx: {
                        '& input[type=number]': {
                          '-moz-appearance': 'textfield',
                        },
                        '& input[type=number]::-webkit-outer-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        },
                        '& input[type=number]::-webkit-inner-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        },
                      },
                    }}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(e) => handleKeyDown(e)}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Typography variant="caption" color="text.secondary" align="center">
            {t('purchaseOrders.total')}: {watch(`details.${index}.total`)?.toFixed(2) || '0.00'}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 0.5 }}>
      {/* Header ثابت مع الأزرار */}
      <Box 
        sx={{ 
          position: 'sticky', 
          top: 0, 
          backgroundColor: 'background.paper',
          zIndex: 100,
          borderBottom: 1,
          borderColor: 'divider',
          pb: 1,
          mb: 1
        }}
      >
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 0.5, fontSize: '0.75rem' }}>
          <Link 
            underline="hover" 
            color="inherit" 
            href="/purchases/purchase-orders"
            onClick={(e) => {
              e.preventDefault();
              navigate('/purchases/purchase-orders');
            }}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <IconHome size={12} style={{ marginRight: 2 }} />
            {t('purchaseOrders.list')}
          </Link>
          <Typography color="text.primary" fontSize="0.75rem">
            {mode === 'add' ? t('purchaseOrders.add') : t('purchaseOrders.edit')}
          </Typography>
        </Breadcrumbs>

        {/* Header مع الأزرار */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
            {mode === 'add' ? t('purchaseOrders.add') : t('purchaseOrders.edit')}
          </Typography>
          
          {/* أزرار الحفظ والإلغاء */}
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<IconArrowLeft size={14} />}
              onClick={() => navigate('/purchases/purchase-orders')}
              disabled={isSubmitting}
            >
              {t('common.back')}
            </Button>
            
            <Button 
              variant="outlined"
              size="small"
              startIcon={<IconDeviceFloppy size={14} />}
              onClick={handleSubmit((data) => submit(data, 'save'))}
              disabled={isSubmitting}
            >
              {t('common.save')}
            </Button>
            
            <Button 
              variant="contained"
              size="small"
              startIcon={<IconPlus size={14} />}
              onClick={handleSubmit((data) => submit(data, 'saveAndNew'))}
              disabled={isSubmitting}
            >
              {t('purchaseOrders.saveAndNew')}
            </Button>
          </Stack>
        </Box>
      </Box>

      <form>
        <Grid container spacing={1}>
          {/* ✅ إصلاح 1: السطر الأول - 4 خانات بنفس الحجم تماماً */}
          <Grid item xs={12} md={3}>
            <Controller
              name="referenceDocNumber"
              control={control}
              rules={{ required: t('purchaseOrders.docNumberRequired') }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label={t('purchaseOrders.docNumber')}
                  fullWidth
                  size="small"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  onFocus={(e) => e.target.select()}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Controller
              name="date1"
              control={control}
              rules={{ required: t('purchaseOrders.dateRequired') }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label={t('purchaseOrders.date')}
                  type="date"
                  fullWidth
                  size="small"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  InputLabelProps={{ shrink: true }}
                  onFocus={(e) => e.target.select()}
                />
              )}
            />
          </Grid>

          {/* ✅ إصلاح 1: المورد بنفس الحجم md={3} */}
          <Grid item xs={12} md={3}>
            <Controller
              name="supplierId"
              control={control}
              rules={{ required: t('purchaseOrders.supplierRequired') }}
              render={({ field, fieldState }) => (
                <SearchableSelect
                  label={t('purchaseOrders.supplier')}
                  value={field.value}
                  onChange={field.onChange}
                  options={suppliers.map(s => ({ id: s.id, name: s.name }))}
                  placeholder={t('purchaseOrders.selectSupplier')}
                  error={!!fieldState.error}
                  autoFocusSearch={true}
                  size="small"
                />
              )}
            />
          </Grid>

          {/* ✅ إصلاح 1: المخزن بنفس الحجم md={3} */}
          <Grid item xs={12} md={3}>
            <Controller
              name="warehouseId"
              control={control}
              rules={{ required: t('purchaseOrders.warehouseRequired') }}
              render={({ field, fieldState }) => (
                <SearchableSelect
                  label={t('purchaseOrders.warehouse')}
                  value={field.value}
                  onChange={field.onChange}
                  options={warehouses.map(w => ({ id: w.id, name: w.name }))}
                  placeholder={t('purchaseOrders.selectWarehouse')}
                  error={!!fieldState.error}
                  size="small"
                  autoFocusSearch={true}
                />
              )}
            />
          </Grid>

          {/* السطر الثاني - Total Discount & Total Tax */}
          <Grid item xs={12} md={6}>
            <Controller
              name="discountPercent"
              control={control}
              rules={{ 
                min: { value: 0, message: t('validation.minValue') },
                max: { value: 100, message: t('validation.maxPercent') }
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label={t('purchaseOrders.totalDiscount')}
                  type="number"
                  fullWidth
                  size="small"
                  inputProps={{ min: 0, max: 100, step: 0.01 }}
                  InputProps={{ 
                    endAdornment: '%',
                    sx: {
                      '& input[type=number]': {
                        '-moz-appearance': 'textfield',
                      },
                      '& input[type=number]::-webkit-outer-spin-button': {
                        '-webkit-appearance': 'none',
                        margin: 0,
                      },
                      '& input[type=number]::-webkit-inner-spin-button': {
                        '-webkit-appearance': 'none',
                        margin: 0,
                      },
                    },
                  }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  onFocus={(e) => e.target.select()}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="taxPercent"
              control={control}
              rules={{ 
                min: { value: 0, message: t('validation.minValue') },
                max: { value: 100, message: t('validation.maxPercent') }
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label={t('purchaseOrders.totalTax')}
                  type="number"
                  fullWidth
                  size="small"
                  inputProps={{ min: 0, max: 100, step: 0.01 }}
                  InputProps={{ 
                    endAdornment: '%',
                    sx: {
                      '& input[type=number]': {
                        '-moz-appearance': 'textfield',
                      },
                      '& input[type=number]::-webkit-outer-spin-button': {
                        '-webkit-appearance': 'none',
                        margin: 0,
                      },
                      '& input[type=number]::-webkit-inner-spin-button': {
                        '-webkit-appearance': 'none',
                        margin: 0,
                      },
                    },
                  }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  onFocus={(e) => e.target.select()}
                />
              )}
            />
          </Grid>

          {/* ملخص سريع - مضغوط */}
          <Grid item xs={12}>
            <Box 
              sx={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 0.5,
                backgroundColor: 'background.default',
                borderRadius: 1,
                mb: 0.5
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {t('purchaseOrders.subTotal')}: {watch('subTotal')?.toFixed(2) || '0.00'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('purchaseOrders.discountValue')}: {watch('discountValue')?.toFixed(2) || '0.00'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('purchaseOrders.taxValue')}: {watch('taxValue')?.toFixed(2) || '0.00'}
              </Typography>
              <Typography variant="caption" color="primary" fontWeight="bold">
                {t('purchaseOrders.total')}: {watch('total')?.toFixed(2) || '0.00'}
              </Typography>
            </Box>
          </Grid>

          {/* قسم الأصناف */}
          <Grid item xs={12}>
            {/* ✅ إصلاح 5: شريط الأدوات - ممتد مع shadow جميل */}
            <Box 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 1,
                backgroundColor: 'background.default',
                borderRadius: 1,
                mb: 0.5,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              {/* كلمة الأصناف */}
              <Typography variant="subtitle1" sx={{ fontSize: '0.9rem', minWidth: 'fit-content' }}>
                {t('purchaseOrders.items')}
              </Typography>
              
              {/* ✅ إصلاح 5: البحث السريع - يأخذ المساحة الكاملة */}
              <ClickAwayListener onClickAway={() => setQuickSearchOpen(false)}>
                <Box position="relative" sx={{ flex: 1 }} ref={quickSearchRef}>
                  <TextField
                    ref={quickSearchInputRef}
                    size="small"
                    placeholder={t('products.quickSearchPlaceholder')}
                    value={quickSearchQuery}
                    onChange={(e) => setQuickSearchQuery(e.target.value)}
                    onKeyDown={handleQuickSearchKeyDown}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconSearch size={14} />
                        </InputAdornment>
                      )
                    }}
                  />
                  
                  {/* Quick Search Results Dropdown */}
                  {quickSearchOpen && quickSearchResults.length > 0 && (
                    <Paper
                      sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        maxHeight: 150,
                        overflow: 'auto',
                        mt: 0.5
                      }}
                    >
                      <List dense sx={{ p: 0 }}>
                        {quickSearchResults.map((price, index) => (
                          <ListItem key={`${price.id}-${index}`} disablePadding>
                            <ListItemButton 
                              onClick={() => addProductToForm(price)}
                              selected={index === quickSearchSelectedIndex}
                              sx={{ 
                                py: 0.25,
                                backgroundColor: index === quickSearchSelectedIndex ? 'action.selected' : 'transparent'
                              }}
                            >
                              <ListItemText
                                primary={`${price.productName} - ${price.unitName}`}
                                secondary={`${price.price.toFixed(2)} | ${t('products.unitFactor')}: ${price.unitFactor}`}
                                primaryTypographyProps={{ fontSize: '0.8rem' }}
                                secondaryTypographyProps={{ fontSize: '0.7rem' }}
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  )}
                </Box>
              </ClickAwayListener>

              {/* الأزرار */}
              <Stack direction="row" spacing={0.5}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setScannerOpen(true)}
                  startIcon={<IconBarcode size={14} />}
                  sx={{ fontSize: '0.75rem' }}
                >
                  {t('barcode.scan')}
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  startIcon={<IconPlus size={14} />}
                  onClick={addDetailWithSearch}
                  sx={{ fontSize: '0.75rem' }}
                >
                  {t('purchaseOrders.addItemWithSearch')}
                </Button>
              </Stack>
            </Box>

            {/* منطقة الأصناف - مضغوطة جداً */}
            <Box 
              sx={{ 
                maxHeight: '40vh', 
                overflow: 'auto',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1
              }}
            >
              {isMobile ? (
                <Box sx={{ p: 0.5 }}>
                  {fields.length === 0 ? (
                    <Typography color="text.secondary" align="center" sx={{ py: 1, fontSize: '0.8rem' }}>
                      {t('purchaseOrders.noItems')}
                    </Typography>
                  ) : (
                    fields.map((field, index) => (
                      <MobileDetailCard
                        key={field.id}
                        index={index}
                        onRemove={() => remove(index)}
                      />
                    ))
                  )}
                </Box>
              ) : (
                <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: '40vh' }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ py: 0.25, fontSize: '0.8rem' }}>{t('purchaseOrders.product')}</TableCell>
                        <TableCell sx={{ py: 0.25, fontSize: '0.8rem' }}>{t('purchaseOrders.unit')}</TableCell>
                        <TableCell sx={{ py: 0.25, fontSize: '0.8rem' }}>{t('purchaseOrders.quantity')}</TableCell>
                        <TableCell sx={{ py: 0.25, fontSize: '0.8rem' }}>{t('purchaseOrders.price')}</TableCell>
                        <TableCell sx={{ py: 0.25, fontSize: '0.8rem' }}>{t('purchaseOrders.discount')}</TableCell>
                        <TableCell sx={{ py: 0.25, fontSize: '0.8rem' }}>{t('purchaseOrders.tax')}</TableCell>
                        <TableCell sx={{ py: 0.25, fontSize: '0.8rem' }}>{t('purchaseOrders.total')}</TableCell>
                        <TableCell width={30}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fields.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} align="center" sx={{ py: 1 }}>
                            <Typography color="text.secondary" fontSize="0.8rem">
                              {t('purchaseOrders.noItems')}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        fields.map((field, index) => (
                          <TableRow key={field.id}>
                            <TableCell sx={{ py: 0.25 }}>
                              <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.75rem' }}>
                                {watch(`details.${index}.productName`)}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 0.25 }}>
                              <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                                {watch(`details.${index}.unitName`)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                {t('products.unitFactor')}: {watch(`details.${index}.unitFactor`)}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 0.25 }}>
                              <Controller
                                name={`details.${index}.quantity`}
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    type="number"
                                    size="small"
                                    inputProps={{ min: 0, step: 0.01 }}
                                    sx={{ 
                                      width: 60,
                                      '& input[type=number]': {
                                        '-moz-appearance': 'textfield',
                                        fontSize: '0.8rem'
                                      },
                                      '& input[type=number]::-webkit-outer-spin-button': {
                                        '-webkit-appearance': 'none',
                                        margin: 0,
                                      },
                                      '& input[type=number]::-webkit-inner-spin-button': {
                                        '-webkit-appearance': 'none',
                                        margin: 0,
                                      },
                                    }}
                                    onFocus={(e) => e.target.select()}
                                    onKeyDown={(e) => handleKeyDown(e, `details.${index}.price`)}
                                  />
                                )}
                              />
                            </TableCell>
                            <TableCell sx={{ py: 0.25 }}>
                              <Controller
                                name={`details.${index}.price`}
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    type="number"
                                    size="small"
                                    inputProps={{ min: 0, step: 0.01 }}
                                    sx={{ 
                                      width: 70,
                                      '& input[type=number]': {
                                        '-moz-appearance': 'textfield',
                                        fontSize: '0.8rem'
                                      },
                                      '& input[type=number]::-webkit-outer-spin-button': {
                                        '-webkit-appearance': 'none',
                                        margin: 0,
                                      },
                                      '& input[type=number]::-webkit-inner-spin-button': {
                                        '-webkit-appearance': 'none',
                                        margin: 0,
                                      },
                                    }}
                                    onFocus={(e) => e.target.select()}
                                    onKeyDown={(e) => handleKeyDown(e, `details.${index}.discountPercent`)}
                                  />
                                )}
                              />
                            </TableCell>
                            <TableCell sx={{ py: 0.25 }}>
                              <Controller
                                name={`details.${index}.discountPercent`}
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    type="number"
                                    size="small"
                                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                                    sx={{ 
                                      width: 60,
                                      '& input[type=number]': {
                                        '-moz-appearance': 'textfield',
                                        fontSize: '0.8rem'
                                      },
                                      '& input[type=number]::-webkit-outer-spin-button': {
                                        '-webkit-appearance': 'none',
                                        margin: 0,
                                      },
                                      '& input[type=number]::-webkit-inner-spin-button': {
                                        '-webkit-appearance': 'none',
                                        margin: 0,
                                      },
                                    }}
                                    InputProps={{ endAdornment: '%' }}
                                    onFocus={(e) => e.target.select()}
                                    onKeyDown={(e) => handleKeyDown(e, `details.${index}.taxPercent`)}
                                  />
                                )}
                              />
                            </TableCell>
                            <TableCell sx={{ py: 0.25 }}>
                              <Controller
                                name={`details.${index}.taxPercent`}
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    type="number"
                                    size="small"
                                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                                    sx={{ 
                                      width: 60,
                                      '& input[type=number]': {
                                        '-moz-appearance': 'textfield',
                                        fontSize: '0.8rem'
                                      },
                                      '& input[type=number]::-webkit-outer-spin-button': {
                                        '-webkit-appearance': 'none',
                                        margin: 0,
                                      },
                                      '& input[type=number]::-webkit-inner-spin-button': {
                                        '-webkit-appearance': 'none',
                                        margin: 0,
                                      },
                                    }}
                                    InputProps={{ endAdornment: '%' }}
                                    onFocus={(e) => e.target.select()}
                                    onKeyDown={(e) => handleKeyDown(e)}
                                  />
                                )}
                              />
                            </TableCell>
                            <TableCell sx={{ py: 0.25 }}>
                              <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.75rem' }}>
                                {watch(`details.${index}.total`)?.toFixed(2) || '0.00'}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 0.25 }}>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => remove(index)}
                              >
                                <IconTrash size={14} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Grid>
        </Grid>
      </form>

      {/* البحث الموحد للأسعار */}
      <ProductPriceSearchDialog
        open={productSearchOpen}
        onClose={() => setProductSearchOpen(false)}
        onSelect={handleProductPriceSelect}
      />

      {/* Barcode Scanner */}
      <BarcodeScanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={handleBarcodeScanned}
      />

      {/* Alert Messages */}
      <Snackbar 
        open={!!alertMessage} 
        autoHideDuration={4000} 
        onClose={() => setAlertMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity={alertSeverity} 
          onClose={() => setAlertMessage('')}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PurchaseOrderForm;
