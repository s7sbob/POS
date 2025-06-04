import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
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

// Debounce hook
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
  status: number;
  details: Array<{
    purchaseOrderDetailID?: string;
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
  initialValues?: PurchaseOrder;
  suppliers: Supplier[];
  warehouses: Warehouse[];
  onSubmit: (data: any) => Promise<void>;
}

const PurchaseOrderForm: React.FC<Props> = ({
  mode, initialValues, suppliers, warehouses, onSubmit
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productSearchOpen, setProductSearchOpen] = useState(false);
  const [lastAddedIndex, setLastAddedIndex] = useState<number | null>(null);

  // Quick-search states
  const [quickSearchQuery, setQuickSearchQuery] = useState('');
  const [quickSearchResults, setQuickSearchResults] = useState<ProductPrice[]>([]);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [, setQuickSearchLoading] = useState(false);
  const [quickSearchSelectedIndex, setQuickSearchSelectedIndex] = useState(0);
  const [scannerOpen, setScannerOpen] = useState(false);

  // Alert states
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('error');

  // Ref for quick search input
  const quickSearchInputRef = useRef<HTMLInputElement>(null);
  const quickSearchRef = useRef<HTMLDivElement>(null);
  const debouncedQuickSearch = useDebounce(quickSearchQuery, 300);

  // Default values
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
    status: 1,
    details: []
  };

  const { control, handleSubmit, reset, watch, setValue } = useForm<FormValues>({
    defaultValues: defaults
  });

  const { fields, remove } = useFieldArray({
    control,
    name: 'details'
  });

  const watchedDetails = watch('details');
  const watchedDiscountPercent = watch('discountPercent');
  const watchedTaxPercent = watch('taxPercent');
  const watchedTotal = watch('total');
  const watchedStatus = watch('status');

  // دالة للعودة للـ Quick Search
const focusQuickSearch = useCallback(() => {
  setTimeout(() => {
    if (quickSearchInputRef.current) {
      const inputElement = quickSearchInputRef.current.querySelector('input') as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
        inputElement.select(); // هيحدد كل النص
      }
    }
  }, 200);
}, []);


   const handleFieldKeyDown = useCallback((e: React.KeyboardEvent, nextFieldName?: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (nextFieldName) {
        // البحث عن الحقل التالي
        setTimeout(() => {
          const nextInput = document.querySelector(`input[name="${nextFieldName}"]`) as HTMLInputElement;
          if (nextInput) {
            nextInput.focus();
            nextInput.select();
          }
        }, 50);
      } else {
        // العودة للـ Quick Search
        focusQuickSearch();
      }
    }
  }, [focusQuickSearch]);


  // دالة للتنقل بين الحقول

  // Upon initial render in "add" mode, focus quick-search
  useLayoutEffect(() => {
    if (mode === 'add' && quickSearchInputRef.current) {
      quickSearchInputRef.current.focus();
    }
  }, [mode]);

  // Fallback if ref isn't attached yet
  useEffect(() => {
    if (mode === 'add' && quickSearchInputRef.current === null) {
      const timer = setTimeout(() => {
        if (quickSearchInputRef.current) {
          quickSearchInputRef.current.focus();
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [mode]);

  // After adding a product, focus its quantity input
  useEffect(() => {
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

  // Recalculate totals whenever details, discountPercent, or taxPercent change
  useEffect(() => {
    const calculateTotals = () => {
      let subTotal = 0;

      watchedDetails.forEach((detail, index) => {
        const lineSubTotal = detail.quantity * detail.price * detail.unitFactor;
        const lineDiscountValue = lineSubTotal * (detail.discountPercent / 100);
        const afterDiscount = lineSubTotal - lineDiscountValue;
        const lineTaxValue = afterDiscount * (detail.taxPercent / 100);
        const lineTotal = afterDiscount + lineTaxValue;

        setValue(`details.${index}.subTotal`, lineSubTotal);
        setValue(`details.${index}.discountValue`, lineDiscountValue);
        setValue(`details.${index}.taxValue`, lineTaxValue);
        setValue(`details.${index}.total`, lineTotal);

        subTotal += lineSubTotal;
      });

      const totalDiscountValue = subTotal * (watchedDiscountPercent / 100);
      const afterDiscount = subTotal - totalDiscountValue;
      const totalTaxValue = afterDiscount * (watchedTaxPercent / 100);
      const total = afterDiscount + totalTaxValue;

      setValue('subTotal', subTotal);
      setValue('discountValue', totalDiscountValue);
      setValue('taxValue', totalTaxValue);
      setValue('total', total);
    };

    calculateTotals();
  }, [watchedDetails, watchedDiscountPercent, watchedTaxPercent, setValue]);


  useEffect(() => {
  if (mode === 'add') {
    setTimeout(() => {
      focusQuickSearch();
    }, 500);
  }
}, [mode, focusQuickSearch]);


  // Populate form in "edit" mode, or reset in "add" mode
  useEffect(() => {
    if (mode === 'edit' && initialValues) {
      console.log('Initial values from API:', initialValues);
      console.log('Details from API:', initialValues.details);
      
      const convertedDetails = initialValues.details.map((d, index) => {
        console.log(`Converting detail ${index}:`, d);
        const converted = {
          purchaseOrderDetailID: d.id || '',
          productId: d.productID,
          productPriceId: d.productPriceID || '',
          productName: d.unitName || 'منتج غير محدد',
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
        };
        console.log(`Converted detail ${index}:`, converted);
        return converted;
      });

      console.log('All converted details:', convertedDetails);

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
        status: initialValues.status,
        details: convertedDetails
      });
    } else if (mode === 'add') {
      reset(defaults);
    }
  }, [mode, initialValues, reset, t]);

  // Handle debounced quick-search
  useEffect(() => {
    if (debouncedQuickSearch.trim()) {
      handleQuickSearch(debouncedQuickSearch);
    } else {
      setQuickSearchResults([]);
      setQuickSearchOpen(false);
    }
  }, [debouncedQuickSearch]);

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

  // Handle barcode scan result
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

  // Add a product from quick-search or barcode into the form's details
  const addProductToForm = (productPrice: ProductPrice) => {
    console.log('Adding product to form:', productPrice);
    
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

    console.log('New item being added:', newItem);

    const currentDetails = watch('details') || [];
    setValue('details', [newItem, ...currentDetails]);
    setLastAddedIndex(0);
    setQuickSearchQuery('');
    setQuickSearchOpen(false);

    setTimeout(() => {
      if (quickSearchInputRef.current) {
        quickSearchInputRef.current.focus();
      }
    }, 100);
  };

  // Navigate quick-search results with arrows + Enter/Escape
  const handleQuickSearchKeyDown = (e: React.KeyboardEvent) => {
    if (quickSearchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setQuickSearchSelectedIndex(prev => {
          const newIndex = Math.min(prev + 1, quickSearchResults.length - 1);
          scrollToQuickSearchItem(newIndex);
          return newIndex;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setQuickSearchSelectedIndex(prev => {
          const newIndex = Math.max(prev - 1, 0);
          scrollToQuickSearchItem(newIndex);
          return newIndex;
        });
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

  // Ensure the selected quick-search item is visible
  const scrollToQuickSearchItem = (index: number) => {
    const listElement = quickSearchRef.current;
    if (listElement) {
      const itemElement = listElement.children[index] as HTMLElement;
      if (itemElement) {
        const listRect = listElement.getBoundingClientRect();
        const itemRect = itemElement.getBoundingClientRect();
        const itemHeight = itemRect.height;
        const listHeight = listRect.height;
        const itemTop = itemElement.offsetTop;

        if (itemRect.bottom > listRect.bottom) {
          const newScrollTop = itemTop - listHeight + itemHeight + 10;
          listElement.scrollTo({ top: Math.max(0, newScrollTop), behavior: 'smooth' });
        } else if (itemRect.top < listRect.top) {
          const newScrollTop = itemTop - 10;
          listElement.scrollTo({ top: Math.max(0, newScrollTop), behavior: 'smooth' });
        }
      }
    }
  };

  const addDetailWithSearch = () => {
    setProductSearchOpen(true);
  };

  const handleProductPriceSelect = (productPrice: ProductPrice) => {
    addProductToForm(productPrice);
  };

  // Validate numeric fields
  const validateNumber = (value: any, fieldName: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      setAlertMessage(`${t('validation.enterValidNumber')} ${fieldName}`);
      setAlertSeverity('error');
      return false;
    }
    return true;
  };

  // On submit, build payload (with status from form) and call onSubmit
  const submit = async (data: FormValues) => {
    if (isSubmitting) return;

    // التحقق من المورد والمخزن
    if (!data.supplierId) {
      setAlertMessage(t('validation.supplierRequired') || 'يجب اختيار المورد');
      setAlertSeverity('error');
      return;
    }

    if (!data.warehouseId) {
      setAlertMessage(t('validation.warehouseRequired') || 'يجب اختيار المخزن');
      setAlertSeverity('error');
      return;
    }

    if (data.details.length === 0) {
      setAlertMessage(t('validation.itemsRequired') || 'يجب إضافة منتج واحد على الأقل');
      setAlertSeverity('error');
      return;
    }

    // التحقق من صحة البيانات
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
          // التحقق من البيانات المطلوبة
          if (!d.productId) {
            console.error(`Detail ${index} missing productId:`, d);
            throw new Error(`Detail في السطر ${index + 1} مفقود معرف المنتج`);
          }
          if (!d.productPriceId) {
            console.error(`Detail ${index} missing productPriceId:`, d);
            throw new Error(`Detail في السطر ${index + 1} مفقود معرف السعر`);
          }
          
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

          // إضافة ID للسطور الموجودة في التحديث
          if (mode === 'edit' && d.purchaseOrderDetailID && d.purchaseOrderDetailID.trim() !== '') {
            detailData.id = d.purchaseOrderDetailID;
            console.log(`Detail ${index} has existing ID:`, d.purchaseOrderDetailID);
          } else {
            console.log(`Detail ${index} is new - no ID`);
          }

          console.log(`Detail ${index} final data:`, detailData);
          return detailData;
        })
      };

      console.log('Submit data before sending:', JSON.stringify(submitData, null, 2));

      await onSubmit(submitData);

      if (data.status === 1 && mode === 'add') {
        reset(defaults);
        setTimeout(() => {
          if (quickSearchInputRef.current) {
            quickSearchInputRef.current.focus();
          }
        }, 200);
      } else {
        navigate('/purchases/purchase-orders');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setAlertSeverity('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mobile-only detail card
  const MobileDetailCard: React.FC<{ index: number; onRemove: () => void }> = ({ index, onRemove }) => (
    <Card key={index} sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2">#{index + 1}</Typography>
          {watchedStatus !== 3 && (
            <IconButton onClick={onRemove} size="small" color="error">
              <IconTrash size={16} />
            </IconButton>
          )}
        </Box>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
          {watch(`details.${index}.productName`)} — {watch(`details.${index}.unitName`)}
        </Typography>

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Controller
  name={`details.${index}.quantity`}
  control={control}
  render={({ field }) => (
    <TextField
      {...field}
      label={t('purchaseOrders.quantity')}
      type="number"
      size="small"
      name={`details.${index}.quantity`}
      onKeyDown={(e) => handleFieldKeyDown(e, `details.${index}.price`)}
      onFocus={(e) => e.target.select()}
      fullWidth
      disabled={watchedStatus === 3} // تأكد من وجود هذا السطر
      inputProps={{
        style: { textAlign: 'right' },
        step: "0.01",
        inputMode: 'decimal'
      }}
      sx={{
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
      }}
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
  type="number"
  size="small"
  name={`details.${index}.price`}  // أضف هذا
  onKeyDown={(e) => handleFieldKeyDown(e, `details.${index}.discountPercent`)}  // أضف هذا
  onFocus={(e) => e.target.select()}  // أضف هذا
                  fullWidth
                  disabled={watchedStatus === 3}
                  inputProps={{
                    style: { textAlign: 'right' },
                    step: "0.01",
                    inputMode: 'decimal'
                  }}
                  sx={{
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
                  }}
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
  type="number"
  size="small"
  name={`details.${index}.discountPercent`}  // أضف هذا
  onKeyDown={(e) => handleFieldKeyDown(e, `details.${index}.taxPercent`)}  // أضف هذا
  onFocus={(e) => e.target.select()}  // أضف هذا
                  fullWidth
                  disabled={watchedStatus === 3}
                  inputProps={{
                    style: { textAlign: 'right' },
                    step: "0.01",
                    inputMode: 'decimal'
                  }}
                  sx={{
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
                  }}
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
  type="number"
  size="small"
  name={`details.${index}.taxPercent`}  // أضف هذا
  onKeyDown={(e) => handleFieldKeyDown(e)}  // بدون next field - هيرجع للـ Quick Search
  onFocus={(e) => e.target.select()}  // أضف هذا
                  fullWidth
                  disabled={watchedStatus === 3}
                  inputProps={{
                    style: { textAlign: 'right' },
                    step: "0.01",
                    inputMode: 'decimal'
                  }}
                  sx={{
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
                  }}
                />
              )}
            />
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 1, textAlign: 'right', fontWeight: 'bold' }}>
          {t('purchaseOrders.total')}: {watch(`details.${index}.total`)?.toFixed(2) || '0.00'}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Breadcrumbs + Header + Total */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/purchases/purchase-orders');
            }}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <IconHome size={16} style={{ marginRight: 4 }} />
            {t('purchaseOrders.list')}
          </Link>
          <Typography color="text.primary">
            {mode === 'add' ? t('purchaseOrders.add') : t('purchaseOrders.edit')}
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            {mode === 'add' ? t('purchaseOrders.add') : t('purchaseOrders.edit')}
          </Typography>

          <Typography
            variant="h4"
            component="div"
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              fontSize: '2rem'
            }}
          >
            {t('purchaseOrders.total')}: {watchedTotal?.toFixed(2) || '0.00'}
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<IconArrowLeft />}
            onClick={() => navigate('/purchases/purchase-orders')}
            disabled={isSubmitting}
          >
            {t('common.back')}
          </Button>

          {/* "Save (Pending)" */}
          {watchedStatus !== 3 && (
            <Button
              variant="contained"
              startIcon={<IconPlus />}
              onClick={handleSubmit((data) => {
                data.status = 1;
                submit(data);
              })}
              disabled={isSubmitting}
            >
              {t('purchaseOrders.savePending')}
            </Button>
          )}

          {/* "Submit" */}
          {watchedStatus !== 3 && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<IconDeviceFloppy />}
              onClick={handleSubmit((data) => {
                data.status = 3;
                submit(data);
              })}
              disabled={isSubmitting}
            >
              {t('purchaseOrders.submit')}
            </Button>
          )}
        </Stack>
      </Box>

      {/* Row 1: Doc#, Date, Supplier, Warehouse */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <Controller
            name="referenceDocNumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('purchaseOrders.docNumber')}
                fullWidth
                size="small"
                disabled={watchedStatus === 3}
                onFocus={(e) => e.target.select()}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Controller
            name="date1"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('purchaseOrders.date')}
                type="date"
                fullWidth
                size="small"
                disabled={watchedStatus === 3}
                InputLabelProps={{ shrink: true }}
                onFocus={(e) => e.target.select()}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Controller
            name="supplierId"
            control={control}
            rules={{ required: t('validation.supplierRequired') || 'يجب اختيار المورد' }}
            render={({ field, fieldState }) => (
<SearchableSelect
  label={t('purchaseOrders.supplier')}
  value={field.value}
  onChange={field.onChange}
  options={suppliers.map(s => ({ id: s.id, name: s.name }))}
  placeholder={t('purchaseOrders.selectSupplier')}
  error={!!fieldState.error}
  size="small"
  autoFocusSearch={true}
  disabled={watchedStatus === 3}
  onSelectionComplete={focusQuickSearch}  // أضف هذا السطر
/>
            )}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Controller
            name="warehouseId"
            control={control}
            rules={{ required: t('validation.warehouseRequired') || 'يجب اختيار المخزن' }}
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
  disabled={watchedStatus === 3}
  onSelectionComplete={focusQuickSearch}  // أضف هذا السطر
/>
            )}
          />
        </Grid>
      </Grid>

      {/* Row 2: Total Discount & Total Tax */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Controller
            name="discountPercent"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={`${t('purchaseOrders.totalDiscount')} %`}
                type="number"
                fullWidth
                size="small"
                disabled={watchedStatus === 3}
                inputProps={{
                  style: { textAlign: 'right' },
                  step: "0.01",
                  inputMode: 'decimal'
                }}
                sx={{
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
                }}
                onFocus={(e) => e.target.select()}
                onBlur={focusQuickSearch}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="taxPercent"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={`${t('purchaseOrders.totalTax')} %`}
                type="number"
                fullWidth
                size="small"
                disabled={watchedStatus === 3}
                inputProps={{
                  style: { textAlign: 'right' },
                  step: "0.01",
                  inputMode: 'decimal'
                }}
                sx={{
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
                }}
                onFocus={(e) => e.target.select()}
                onBlur={focusQuickSearch}
              />
            )}
          />
        </Grid>
      </Grid>

      {/* Hidden "status" field */}
      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <input type="hidden" {...field} />
        )}
      />

      {/* Quick summary row */}
      <Paper sx={{ p: 1, mb: 2, backgroundColor: 'grey.50' }}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Typography variant="caption" color="text.secondary">
              {t('purchaseOrders.subTotal')}: {watch('subTotal')?.toFixed(2) || '0.00'}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="caption" color="text.secondary">
              {t('purchaseOrders.discountValue')}: {watch('discountValue')?.toFixed(2) || '0.00'}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="caption" color="text.secondary">
              {t('purchaseOrders.taxValue')}: {watch('taxValue')?.toFixed(2) || '0.00'}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
              {t('purchaseOrders.total')}: {watch('total')?.toFixed(2) || '0.00'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Items section */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{
          display: 'flex',
          gap: 2,
          mb: 2,
          p: 2,
          backgroundColor: 'grey.50',
          borderRadius: 1,
          boxShadow: 1,
          alignItems: 'center'
        }}>
          <Typography variant="h6" sx={{ minWidth: 'fit-content' }}>
            {t('purchaseOrders.items')}
          </Typography>

          <Box sx={{ position: 'relative', flex: 1 }}>
            <ClickAwayListener onClickAway={() => setQuickSearchOpen(false)}>
              <Box>
                <TextField
  ref={quickSearchInputRef}  // أضف هذا السطر
  autoFocus  // أضف هذا السطر
  placeholder={t('products.quickSearch')}
  value={quickSearchQuery}
  onChange={(e) => setQuickSearchQuery(e.target.value)}
  onKeyDown={handleQuickSearchKeyDown}
  fullWidth
  size="small"
  disabled={watchedStatus === 3}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <IconSearch size={20} />
      </InputAdornment>
    ),
  }}
/>

                {/* Quick Search Results Dropdown */}
                {quickSearchOpen && quickSearchResults.length > 0 && (
                  <Paper
                    ref={quickSearchRef}
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      zIndex: 1000,
                      maxHeight: 200,
                      overflow: 'auto'
                    }}
                  >
                    <List dense>
                      {quickSearchResults.map((price, index) => (
                        <ListItem key={price.id} disablePadding>
                          <ListItemButton
                            onClick={() => addProductToForm(price)}
                            selected={index === quickSearchSelectedIndex}
                            disabled={watchedStatus === 3}
                            sx={{
                              py: 0.25,
                              backgroundColor:
                                index === quickSearchSelectedIndex ? 'action.selected' : 'transparent'
                            }}
                          >
                            <ListItemText
                              primary={`${price.productName} — ${price.unitName}`}
                              secondary={`${t('products.price')}: ${price.price.toFixed(2)}`}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                )}
              </Box>
            </ClickAwayListener>
          </Box>

          <Button
            variant="outlined"
            size="small"
            onClick={() => setScannerOpen(true)}
            startIcon={<IconBarcode />}
            sx={{ fontSize: '0.75rem' }}
            disabled={watchedStatus === 3}
          >
            {t('barcode.scan')}
          </Button>

          <Button
            variant="contained"
            size="small"
            startIcon={<IconPlus />}
            onClick={addDetailWithSearch}
            sx={{ fontSize: '0.75rem' }}
            disabled={watchedStatus === 3}
          >
            {t('purchaseOrders.addItemWithSearch')}
          </Button>
        </Box>

        <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
          {isMobile ? (
            <Box>
              {fields.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
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
            <TableContainer>
              <Table size="small">
<TableHead>
  <TableRow>
    <TableCell>{t('purchaseOrders.product')}</TableCell>
    <TableCell>{t('purchaseOrders.unit')}</TableCell>
    <TableCell align="right">{t('purchaseOrders.quantity')}</TableCell>
    <TableCell align="right">{t('purchaseOrders.price')}</TableCell>
    <TableCell align="right">{`${t('purchaseOrders.discount')} %`}</TableCell>
    <TableCell align="right">{`${t('purchaseOrders.tax')} %`}</TableCell>
    <TableCell align="right">{t('purchaseOrders.total')}</TableCell>
    <TableCell />
  </TableRow>
</TableHead>
                <TableBody>
                  {fields.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                          {t('purchaseOrders.noItems')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    fields.map((field, index) => (
<TableRow key={field.id}>
  <TableCell>{watch(`details.${index}.productName`)}</TableCell>
  <TableCell>{watch(`details.${index}.unitName`)}</TableCell>
  
{/* الكمية */}
<TableCell align="right">
  <Controller
    name={`details.${index}.quantity`}
    control={control}
    render={({ field }) => (
      <TextField
        {...field}
        type="number"
        size="small"
        name={`details.${index}.quantity`}
        onKeyDown={(e) => handleFieldKeyDown(e, `details.${index}.price`)}
        onFocus={(e) => e.target.select()}
        disabled={watchedStatus === 3} // أضف هذا السطر
        sx={{
          width: 100,
          '& input[type=number]': {
            '-moz-appearance': 'textfield',
            textAlign: 'right',
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
        inputProps={{
          step: "0.01",
          inputMode: 'decimal'
        }}
      />
    )}
  />
</TableCell>

{/* السعر */}
<TableCell align="right">
  <Controller
    name={`details.${index}.price`}
    control={control}
    render={({ field }) => (
      <TextField
        {...field}
        type="number"
        size="small"
        name={`details.${index}.price`}
        onKeyDown={(e) => handleFieldKeyDown(e, `details.${index}.discountPercent`)}
        onFocus={(e) => e.target.select()}
        disabled={watchedStatus === 3} // أضف هذا السطر
        sx={{
          width: 120,
          '& input[type=number]': {
            '-moz-appearance': 'textfield',
            textAlign: 'right',
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
        inputProps={{
          step: "0.01",
          inputMode: 'decimal'
        }}
      />
    )}
  />
</TableCell>

{/* الخصم */}
<TableCell align="right">
  <Controller
    name={`details.${index}.discountPercent`}
    control={control}
    render={({ field }) => (
      <TextField
        {...field}
        type="number"
        size="small"
        name={`details.${index}.discountPercent`}
        onKeyDown={(e) => handleFieldKeyDown(e, `details.${index}.taxPercent`)}
        onFocus={(e) => e.target.select()}
        disabled={watchedStatus === 3} // أضف هذا السطر
        sx={{
          width: 100,
          '& input[type=number]': {
            '-moz-appearance': 'textfield',
            textAlign: 'right',
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
        inputProps={{
          step: "0.01",
          inputMode: 'decimal'
        }}
      />
    )}
  />
</TableCell>

{/* الضريبة */}
<TableCell align="right">
  <Controller
    name={`details.${index}.taxPercent`}
    control={control}
    render={({ field }) => (
      <TextField
        {...field}
        type="number"
        size="small"
        name={`details.${index}.taxPercent`}
        onKeyDown={(e) => handleFieldKeyDown(e)}
        onFocus={(e) => e.target.select()}
        disabled={watchedStatus === 3} // أضف هذا السطر
        sx={{
          width: 100,
          '& input[type=number]': {
            '-moz-appearance': 'textfield',
            textAlign: 'right',
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
        inputProps={{
          step: "0.01",
          inputMode: 'decimal'
        }}
      />
    )}
  />
</TableCell>

  {/* الإجمالي */}
  <TableCell align="right">
    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
      {watch(`details.${index}.total`)?.toFixed(2) || '0.00'}
    </Typography>
  </TableCell>

  <TableCell>
    {watchedStatus !== 3 && (
      <IconButton
        onClick={() => remove(index)}
        size="small"
        color="error"
      >
        <IconTrash size={16} />
      </IconButton>
    )}
  </TableCell>
</TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>

      {/* Product Price Search Dialog */}
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

      {/* Alert Snackbar */}
      <Snackbar
        open={!!alertMessage}
        autoHideDuration={6000}
        onClose={() => setAlertMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setAlertMessage('')}
          severity={alertSeverity}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PurchaseOrderForm;
