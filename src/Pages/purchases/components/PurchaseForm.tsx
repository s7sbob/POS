// File: src/pages/purchases/components/PurchaseForm.tsx
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
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  IconDeviceFloppy,
  IconPlus,
  IconTrash,
  IconArrowLeft,
  IconHome,
  IconSearch,
  IconBarcode,
  IconFileImport,
  IconSend
} from '@tabler/icons-react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Purchase } from 'src/utils/api/pagesApi/purchaseApi';
import { PurchaseOrder } from 'src/utils/api/pagesApi/purchaseOrdersApi';
import { Supplier } from 'src/utils/api/pagesApi/suppliersApi';
import { Warehouse } from 'src/utils/api/pagesApi/warehousesApi';
import PurchaseOrderSelectDialog from './PurchaseOrderSelectDialog';
import ProductPriceSearchDialog from '../../purchase-orders/components/ProductPriceSearchDialog';
import BarcodeScanner from '../../purchase-orders/components/BarcodeScanner';
import SearchableSelect from '../../purchase-orders/components/SearchableSelect';
import { ProductPrice } from 'src/utils/api/pagesApi/purchaseProductsApi';
import * as productsApi from 'src/utils/api/pagesApi/purchaseProductsApi';

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

const PurchaseForm: React.FC<Props> = ({
  mode, initialValues, suppliers, warehouses, onSubmit
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productSearchOpen, setProductSearchOpen] = useState(false);
  const [purchaseOrderSelectOpen, setPurchaseOrderSelectOpen] = useState(false);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<PurchaseOrder | null>(null);
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
    status: 1, // Default to Pending
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
  const watchedPurchaseOrderId = watch('purchaseOrderId');

  // Status options
  const statusOptions = [
    { value: 1, label: t('purchases.status.pending'), color: 'warning' },
    { value: 3, label: t('purchases.status.submitted'), color: 'success' }
  ];

  // دالة للعودة للـ Quick Search
  const focusQuickSearch = useCallback(() => {
    setTimeout(() => {
      if (quickSearchInputRef.current) {
        const inputElement = quickSearchInputRef.current.querySelector('input') as HTMLInputElement;
        if (inputElement) {
          inputElement.focus();
          inputElement.select();
        }
      }
    }, 200);
  }, []);

  const handleFieldKeyDown = useCallback((e: React.KeyboardEvent, nextFieldName?: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (nextFieldName) {
        setTimeout(() => {
          const nextInput = document.querySelector(`input[name="${nextFieldName}"]`) as HTMLInputElement;
          if (nextInput) {
            nextInput.focus();
            nextInput.select();
          }
        }, 50);
      } else {
        focusQuickSearch();
      }
    }
  }, [focusQuickSearch]);

  // دالة محسنة لإعادة الحساب
  const recalculateAll = useCallback(() => {
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

      setValue(`details.${idx}.subTotal` as any, parseFloat(lineSubTotal.toFixed(2)), { shouldValidate: false });
      setValue(`details.${idx}.discountValue` as any, parseFloat(lineDiscountValue.toFixed(2)), { shouldValidate: false });
      setValue(`details.${idx}.taxValue` as any, parseFloat(lineTaxValue.toFixed(2)), { shouldValidate: false });
      setValue(`details.${idx}.total` as any, parseFloat(lineTotal.toFixed(2)), { shouldValidate: false });

      subTotal += lineSubTotal;
    });

    const globalDiscountPercent = parseFloat(currentDiscountPercent?.toString() || '0');
    const globalTaxPercent = parseFloat(currentTaxPercent?.toString() || '0');

    const totalDiscountValue = subTotal * (globalDiscountPercent / 100);
    const afterDiscount = subTotal - totalDiscountValue;
    const totalTaxValue = afterDiscount * (globalTaxPercent / 100);
    const total = afterDiscount + totalTaxValue;

    setValue('subTotal', parseFloat(subTotal.toFixed(2)), { shouldValidate: false });
    setValue('discountValue', parseFloat(totalDiscountValue.toFixed(2)), { shouldValidate: false });
    setValue('taxValue', parseFloat(totalTaxValue.toFixed(2)), { shouldValidate: false });
    setValue('total', parseFloat(total.toFixed(2)), { shouldValidate: false });
  }, [setValue, watch]);

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
    const timeoutId = setTimeout(() => {
      recalculateAll();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [watchedDetails, watchedDiscountPercent, watchedTaxPercent, recalculateAll]);

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
          purchaseDetailID: d.id || '',
          productId: d.productID,
          productPriceId: d.productPriceID || '',
          productName: d.productName || d.unitName || t('purchases.form.unknownProduct'),
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

      // إذا كان مرتبط بأمر شراء، قم بإنشاء كائن كامل
      if (initialValues.purchaseOrder) {
        setSelectedPurchaseOrder(initialValues.purchaseOrder as PurchaseOrder);
      }
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

  // Handle purchase order selection
  const handlePurchaseOrderSelect = (purchaseOrder: PurchaseOrder) => {
    setSelectedPurchaseOrder(purchaseOrder);
    
    // تعبئة البيانات من أمر الشراء - المورد فقط غير قابل للتعديل
    setValue('purchaseOrderId', purchaseOrder.id!);
    setValue('supplierId', purchaseOrder.supplierId); // المورد غير قابل للتعديل
    // المخزن قابل للتعديل
    setValue('warehouseId', purchaseOrder.warehouseId);
    setValue('discountPercent', purchaseOrder.discountPercent);
    setValue('taxPercent', purchaseOrder.taxPercent);
    
    // تعبئة الأصناف
    const convertedDetails = purchaseOrder.details.map(d => ({
      productId: d.productID,
      productPriceId: d.productPriceID || '',
      productName: d.unitName || t('purchases.form.unknownProduct'),
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

    setValue('details', convertedDetails);
    
    setAlertMessage(t('purchases.form.purchaseOrderImported', { number: purchaseOrder.referenceDocNumber }));
    setAlertSeverity('success');
  };

  // Handle barcode scan result
  const handleBarcodeScanned = async (barcode: string) => {
    try {
      const result = await productsApi.searchProductPrices(barcode, 1, 1);
      if (result.data.length > 0) {
        const productPrice = result.data[0];
        addProductToForm(productPrice);
        setAlertMessage(t('purchases.form.productAdded', { name: productPrice.productName }));
        setAlertSeverity('success');
      } else {
        setAlertMessage(t('purchases.form.barcodeNotFound'));
        setAlertSeverity('warning');
      }
    } catch (error) {
      setAlertMessage(t('purchases.form.searchError'));
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
      setAlertMessage(t('purchases.form.invalidNumber', { field: fieldName }));
      setAlertSeverity('error');
      return false;
    }
    return true;
  };

  // Submit function with status
  const submit = async (data: FormValues, submitStatus: number) => {
    if (isSubmitting) return;

    if (!data.supplierId) {
      setAlertMessage(t('purchases.form.validation.supplierRequired'));
      setAlertSeverity('error');
      return;
    }

    if (!data.warehouseId) {
      setAlertMessage(t('purchases.form.validation.warehouseRequired'));
      setAlertSeverity('error');
      return;
    }

    if (data.details.length === 0) {
      setAlertMessage(t('purchases.form.validation.itemsRequired'));
      setAlertSeverity('error');
      return;
    }

    // التحقق من صحة البيانات
    for (let i = 0; i < data.details.length; i++) {
      const detail = data.details[i];
      if (!validateNumber(detail.quantity, t('purchases.form.quantity') + ` ${t('purchases.form.inLine')} ${i + 1}`)) return;
      if (!validateNumber(detail.price, t('purchases.form.price') + ` ${t('purchases.form.inLine')} ${i + 1}`)) return;
      if (!validateNumber(detail.discountPercent, t('purchases.form.discount') + ` ${t('purchases.form.inLine')} ${i + 1}`)) return;
      if (!validateNumber(detail.taxPercent, t('purchases.form.tax') + ` ${t('purchases.form.inLine')} ${i + 1}`)) return;
    }
    if (!validateNumber(data.discountPercent, t('purchases.form.totalDiscount'))) return;
    if (!validateNumber(data.taxPercent, t('purchases.form.totalTax'))) return;

    setIsSubmitting(true);
    try {
      const submitData = {
        ...data,
        status: submitStatus,
        date1: `${data.date1}T00:00:00`,
        date2: `${data.date2}T00:00:00`,
        details: data.details.map((d, index) => {
          if (!d.productId) {
            throw new Error(`Detail ${t('purchases.form.inLine')} ${index + 1} ${t('purchases.form.missingProductId')}`);
          }
          if (!d.productPriceId) {
            throw new Error(`Detail ${t('purchases.form.inLine')} ${index + 1} ${t('purchases.form.missingPriceId')}`);
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

          if (mode === 'edit' && d.purchaseDetailID && d.purchaseDetailID.trim() !== '') {
            detailData.id = d.purchaseDetailID;
          }

          return detailData;
        })
      };

      await onSubmit(submitData);
      navigate('/purchases/purchases');
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
          <IconButton onClick={onRemove} size="small" color="error">
            <IconTrash size={16} />
          </IconButton>
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
                  label={t('purchases.form.quantity')}
                  type="number"
                  size="small"
                  name={`details.${index}.quantity`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleFieldKeyDown(e, `details.${index}.price`);
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => recalculateAll(), 50);
                  }}
                  onFocus={(e) => e.target.select()}
                  fullWidth
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
                  label={t('purchases.form.price')}
                  type="number"
                  size="small"
                  name={`details.${index}.price`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleFieldKeyDown(e, `details.${index}.discountPercent`);
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => recalculateAll(), 50);
                  }}
                  onFocus={(e) => e.target.select()}
                  fullWidth
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
                  label={t('purchases.form.discount') + ' %'}
                  type="number"
                  size="small"
                  name={`details.${index}.discountPercent`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleFieldKeyDown(e, `details.${index}.taxPercent`);
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => recalculateAll(), 50);
                  }}
                  onFocus={(e) => e.target.select()}
                  fullWidth
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
                  label={t('purchases.form.tax') + ' %'}
                  type="number"
                  size="small"
                  name={`details.${index}.taxPercent`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleFieldKeyDown(e);
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => recalculateAll(), 50);
                  }}
                  onFocus={(e) => e.target.select()}
                  fullWidth
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
          {t('purchases.form.total')}: {watch(`details.${index}.total`)?.toFixed(2) || '0.00'}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/purchases/purchases');
            }}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <IconHome size={16} style={{ marginRight: 4 }} />
            {t('purchases.title')}
          </Link>
          <Typography color="text.primary">
            {mode === 'add' ? t('purchases.form.addTitle') : t('purchases.form.editTitle')}
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            {mode === 'add' ? t('purchases.form.addTitle') : t('purchases.form.editTitle')}
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
            {t('purchases.form.total')}: {watchedTotal?.toFixed(2) || '0.00'}
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<IconArrowLeft />}
            onClick={() => navigate('/purchases/purchases')}
            disabled={isSubmitting}
          >
            {t('common.back')}
          </Button>

          {mode === 'add' && (
            <Button
              variant="outlined"
              startIcon={<IconFileImport />}
              onClick={() => setPurchaseOrderSelectOpen(true)}
              disabled={isSubmitting}
            >
              {t('purchases.form.importFromPO')}
            </Button>
          )}

          <Button
            variant="outlined"
            startIcon={<IconDeviceFloppy />}
            onClick={handleSubmit((data) => submit(data, 1))}
            disabled={isSubmitting}
            color="warning"
          >
            {t('purchases.form.savePending')}
          </Button>

          <Button
            variant="contained"
            startIcon={<IconSend />}
            onClick={handleSubmit((data) => submit(data, 3))}
            disabled={isSubmitting}
          >
            {t('purchases.form.submitInvoice')}
          </Button>
        </Stack>
      </Box>

      {/* Purchase Order Info */}
      {selectedPurchaseOrder && (
        <Paper sx={{ p: 2, mb: 2, backgroundColor: 'info.light' }}>
          <Typography variant="h6" gutterBottom>
            {t('purchases.form.linkedToPO')}: {selectedPurchaseOrder.referenceDocNumber}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Typography variant="body2">
                <strong>{t('purchases.form.poCode')}:</strong> {selectedPurchaseOrder.code}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2">
                <strong>{t('purchases.form.poDate')}:</strong> {selectedPurchaseOrder.date1 ? new Date(selectedPurchaseOrder.date1).toLocaleDateString() : t('common.notSpecified')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2">
                <strong>{t('purchases.form.poTotal')}:</strong> {selectedPurchaseOrder.total?.toFixed(2) || '0.00'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2">
                <strong>{t('purchases.form.itemsCount')}:</strong> {selectedPurchaseOrder.details?.length || 0}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Form Fields */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <Controller
            name="referenceDocNumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('purchases.form.invoiceNumber')}
                fullWidth
                size="small"
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
                label={t('purchases.form.invoiceDate')}
                type="date"
                fullWidth
                size="small"
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
            rules={{ required: t('purchases.form.validation.supplierRequired') }}
            render={({ field, fieldState }) => (
              <SearchableSelect
                label={t('purchases.form.supplier')}
                value={field.value}
                onChange={field.onChange}
                options={suppliers.map(s => ({ id: s.id, name: s.name }))}
                placeholder={t('purchases.form.selectSupplier')}
                error={!!fieldState.error}
                size="small"
                disabled={!!watchedPurchaseOrderId} // المورد غير قابل للتعديل عند الاستيراد
                onSelectionComplete={focusQuickSearch}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Controller
            name="warehouseId"
            control={control}
            rules={{ required: t('purchases.form.validation.warehouseRequired') }}
            render={({ field, fieldState }) => (
              <SearchableSelect
                label={t('purchases.form.warehouse')}
                value={field.value}
                onChange={field.onChange}
                options={warehouses.map(w => ({ id: w.id, name: w.name }))}
                placeholder={t('purchases.form.selectWarehouse')}
                error={!!fieldState.error}
                size="small"
                // المخزن قابل للتعديل حتى لو تم الاستيراد
                onSelectionComplete={focusQuickSearch}
              />
            )}
          />
        </Grid>
      </Grid>

      {/* Status and Discount & Tax */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small">
                <InputLabel>{t('purchases.form.status')}</InputLabel>
                <Select
                  {...field}
                  label={t('purchases.form.status')}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Controller
            name="discountPercent"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('purchases.form.totalDiscount') + ' %'}
                type="number"
                fullWidth
                size="small"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    focusQuickSearch();
                  }
                }}
                onBlur={() => {
                  setTimeout(() => recalculateAll(), 50);
                  focusQuickSearch();
                }}
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
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Controller
            name="taxPercent"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('purchases.form.totalTax') + ' %'}
                type="number"
                fullWidth
                size="small"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    focusQuickSearch();
                  }
                }}
                onBlur={() => {
                  setTimeout(() => recalculateAll(), 50);
                  focusQuickSearch();
                }}
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
              />
            )}
          />
        </Grid>
      </Grid>

      {/* Summary */}
      <Paper sx={{ p: 1, mb: 2, backgroundColor: 'grey.50' }}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Typography variant="caption" color="text.secondary">
              {t('purchases.form.subTotal')}: {watch('subTotal')?.toFixed(2) || '0.00'}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="caption" color="text.secondary">
              {t('purchases.form.discountValue')}: {watch('discountValue')?.toFixed(2) || '0.00'}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="caption" color="text.secondary">
              {t('purchases.form.taxValue')}: {watch('taxValue')?.toFixed(2) || '0.00'}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
              {t('purchases.form.total')}: {watch('total')?.toFixed(2) || '0.00'}
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
            {t('purchases.form.items')}
          </Typography>

          <Box sx={{ position: 'relative', flex: 1 }}>
            <ClickAwayListener onClickAway={() => setQuickSearchOpen(false)}>
              <Box>
                <TextField
                  ref={quickSearchInputRef}
                  autoFocus
                  placeholder={t('purchases.form.quickSearch')}
                  value={quickSearchQuery}
                  onChange={(e) => setQuickSearchQuery(e.target.value)}
                  onKeyDown={handleQuickSearchKeyDown}
                  fullWidth
                  size="small"
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
                            sx={{
                              py: 0.25,
                              backgroundColor:
                                index === quickSearchSelectedIndex ? 'action.selected' : 'transparent'
                            }}
                          >
                            <ListItemText
                              primary={`${price.productName} — ${price.unitName}`}
                              secondary={`${t('purchases.form.price')}: ${price.price.toFixed(2)}`}
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
          >
            {t('purchases.form.scanBarcode')}
          </Button>

          <Button
            variant="contained"
            size="small"
            startIcon={<IconPlus />}
            onClick={addDetailWithSearch}
            sx={{ fontSize: '0.75rem' }}
          >
            {t('purchases.form.addBySearch')}
          </Button>
        </Box>

        <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
          {isMobile ? (
            <Box>
              {fields.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  {t('purchases.form.noItems')}
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
                    <TableCell>{t('purchases.form.product')}</TableCell>
                    <TableCell>{t('purchases.form.unit')}</TableCell>
                    <TableCell align="right">{t('purchases.form.quantity')}</TableCell>
                    <TableCell align="right">{t('purchases.form.price')}</TableCell>
                    <TableCell align="right">{t('purchases.form.discount')} %</TableCell>
                    <TableCell align="right">{t('purchases.form.tax')} %</TableCell>
                    <TableCell align="right">{t('purchases.form.total')}</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                          {t('purchases.form.noItems')}
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
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleFieldKeyDown(e, `details.${index}.price`);
                                  }
                                }}
                                onBlur={() => {
                                  setTimeout(() => recalculateAll(), 50);
                                }}
                                onFocus={(e) => e.target.select()}
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
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleFieldKeyDown(e, `details.${index}.discountPercent`);
                                  }
                                }}
                                onBlur={() => {
                                  setTimeout(() => recalculateAll(), 50);
                                }}
                                onFocus={(e) => e.target.select()}
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
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleFieldKeyDown(e, `details.${index}.taxPercent`);
                                  }
                                }}
                                onBlur={() => {
                                  setTimeout(() => recalculateAll(), 50);
                                }}
                                onFocus={(e) => e.target.select()}
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
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleFieldKeyDown(e);
                                  }
                                }}
                                onBlur={() => {
                                  setTimeout(() => recalculateAll(), 50);
                                }}
                                onFocus={(e) => e.target.select()}
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
                          <IconButton
                            onClick={() => remove(index)}
                            size="small"
                            color="error"
                          >
                            <IconTrash size={16} />
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
      </Paper>

      {/* Purchase Order Select Dialog */}
      <PurchaseOrderSelectDialog
        open={purchaseOrderSelectOpen}
        onClose={() => setPurchaseOrderSelectOpen(false)}
        onSelect={handlePurchaseOrderSelect}
      />

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

export default PurchaseForm;
