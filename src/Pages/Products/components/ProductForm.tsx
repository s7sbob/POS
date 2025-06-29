// File: src/pages/products/components/ProductForm.tsx
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Typography,
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Stack,
  Card, CardContent, useMediaQuery, useTheme, Accordion,
  AccordionSummary, AccordionDetails,
  FormControlLabel, Switch, Tabs, Tab, Chip,
  Divider
} from '@mui/material';
import { 
  IconPlus, IconTrash, IconDeviceFloppy, IconPlus as IconPlusNew,
  IconChevronDown, IconComponents, IconCopy, IconClipboard, 
  IconClipboardCheck, IconTrashX, IconGripVertical,
  IconSearch
} from '@tabler/icons-react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Product, searchProductPricesByNameOrBarcode } from 'src/utils/api/pagesApi/productsApi';
import { Group } from 'src/utils/api/pagesApi/groupsApi';
import { Unit } from 'src/utils/api/pagesApi/unitsApi';
import GroupTreeSelect from './GroupTreeSelect';
import ProductPriceSearchSelect from './ProductPriceSearchSelect';
import { useCopyPaste } from 'src/hooks/useCopyPaste';
import { PosScreen } from 'src/utils/api/pagesApi/posScreensApi';
import ProductMultiSelectDialog from './ProductMultiSelectDialog';

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
  isActive: boolean; // ⭐ إضافة isActive
  posScreenId?: string;
  productPrices: Array<{
    productPriceId?: string;
    unitId: string;
    unitFactor: number;
    barcode: string;
    Price: number;
    posPriceName?: string; // ⭐ إضافة posPriceName للـ POS/Addition
    productComponents: Array<{
      componentId?: string;
      rawProductPriceId: string;
      quantity: number;
      notes: string;
    }>;
  }>;
  productOptionGroups: Array<{
    id?: string;
    name: string;
    isRequired: boolean;
    allowMultiple: boolean;
    minSelection: number;
    maxSelection: number;
    sortOrder: number;
    optionItems: Array<{
      id?: string;
      name: string;
      productPriceId?: string;
      useOriginalPrice: boolean;
      extraPrice: number;
      isCommentOnly: boolean;
      sortOrder: number;
    }>;
  }>;
};

interface Props {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues?: Product;
  groups: Group[];
  units: Unit[];
  posScreens?: PosScreen[];
  productType?: number;
  onClose: () => void;
  onSubmit: (data: any, saveAction: 'save' | 'saveAndNew') => Promise<void>;
}

// أنواع البيانات للـ Copy/Paste
interface ProductCopyData {
  groupId: string;
  productType: number;
  description: string;
  reorderLevel: number;
  expirationDays: number;
  isActive: boolean; // ⭐ إضافة isActive
  posScreenId?: string;
  priceTemplates: Array<{
    unitId: string;
    unitFactor: number;
    posPriceName?: string; // ⭐ إضافة posPriceName
    productComponents: Array<{
      rawProductPriceId: string;
      quantity: number;
      notes: string;
    }>;
  }>;
  optionGroupTemplates: Array<{
    name: string;
    isRequired: boolean;
    allowMultiple: boolean;
    minSelection: number;
    maxSelection: number;
    sortOrder: number;
    optionItems: Array<{
      name: string;
      productPriceId?: string;
      useOriginalPrice: boolean;
      extraPrice: number;
      isCommentOnly: boolean;
      sortOrder: number;
    }>;
  }>;
}

const ProductForm: React.FC<Props> = ({
  open, mode, initialValues, groups, units, posScreens = [], productType = 2, onClose, onSubmit
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const nameFieldRef = React.useRef<HTMLInputElement>(null);
  const [, setLastAddedPriceIndex] = React.useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [expandedPriceIndex, setExpandedPriceIndex] = React.useState<number | null>(null);
  const [currentTab, setCurrentTab] = React.useState(0);
  
  // إضافةstate
  const [, set] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const productCopyPaste = useCopyPaste<ProductCopyData>({
    storageKey: 'productCopyData',
    onCopySuccess: () => {
      set({
        open: true,
        message: t('products.copySuccess'),
        severity: 'success'
      });
    },
    onPasteSuccess: (data) => {
      set({
        open: true,
        message: t('products.pasteSuccess', { count: data.priceTemplates.length }),
        severity: 'success'
      });
    },
    onError: (error) => {
      set({
        open: true,
        message: error,
        severity: 'error'
      });
    }
  });
 
  const defaults: FormValues = { 
    productName: '', 
    groupId: '',
    productType: productType,
    description: '',
    reorderLevel: 0,
    cost: 0,
    lastPurePrice: 0,
    expirationDays: 180,
    isActive: true, // ⭐ إضافة isActive
    posScreenId: '',
    productPrices: [],
    productOptionGroups: []
  };

  const { control, handleSubmit, reset, watch, setValue, getValues, formState: { isSubmitSuccessful } } = useForm<FormValues>({
    defaultValues: defaults
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'productPrices'
  });

  const { fields: optionGroupFields, append: appendOptionGroup, remove: removeOptionGroup } = useFieldArray({
    control,
    name: 'productOptionGroups'
  });

  // دالة إضافة Option Group
  const addOptionGroup = () => {
    appendOptionGroup({
      name: '',
      isRequired: false,
      allowMultiple: false,
      minSelection: 1, // ⭐ الحد الأدنى 1
      maxSelection: 1, // ⭐ الحد الأقصى 1
      sortOrder: optionGroupFields.length,
      optionItems: []
    });
  };

const OptionGroupComponent: React.FC<{ groupIndex: number }> = ({ groupIndex }) => {
  const [productSelectionOpen, setProductSelectionOpen] = React.useState(false);
    const [groupName, setGroupName] = React.useState(''); // ⭐ state منفصل للاسم

  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
    control,
    name: `productOptionGroups.${groupIndex}.optionItems`
  });

    // ⭐ تحديث الاسم عند تغيير القيمة بدون watch
  React.useEffect(() => {
    const subscription = watch((value) => {
      const currentName = value.productOptionGroups?.[groupIndex]?.name;
      if (currentName !== groupName) {
        setGroupName(currentName || '');
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, groupIndex, groupName]);

  // ⭐ الحصول على المنتجات المختارة حالياً
  const getCurrentlySelectedProducts = React.useCallback(() => {
    return itemFields
      .filter(item => item.productPriceId && !item.isCommentOnly)
      .map(item => item.productPriceId)
      .filter(Boolean) as string[];
  }, [itemFields]);

  const addCommentItem = () => {
    appendItem({
      name: '',
      productPriceId: '',
      useOriginalPrice: false,
      extraPrice: 0,
      isCommentOnly: true,
      sortOrder: itemFields.length
    });
  };

  // ⭐ تحديث handleAddMultipleProducts لمنع التكرار
  const handleAddMultipleProducts = (selectedProducts: Array<{
    productPriceId: string;
    productName: string;
    priceName: string;
    price: number;
  }>) => {
    // الحصول على المنتجات الموجودة حالياً
    const existingProductPriceIds = new Set(
      itemFields
        .filter(item => item.productPriceId && !item.isCommentOnly)
        .map(item => item.productPriceId)
    );

    // إزالة المنتجات المكررة من القائمة الجديدة
    const newProducts = selectedProducts.filter(
      product => !existingProductPriceIds.has(product.productPriceId)
    );

    // إزالة المنتجات التي لم تعد مختارة
    const selectedProductPriceIds = new Set(selectedProducts.map(p => p.productPriceId));
    const itemsToRemove: number[] = [];
    
    itemFields.forEach((item, index) => {
      if (item.productPriceId && !item.isCommentOnly && !selectedProductPriceIds.has(item.productPriceId)) {
        itemsToRemove.push(index);
      }
    });

    // إزالة المنتجات غير المختارة (من الآخر للأول لتجنب تغيير الفهارس)
    itemsToRemove.reverse().forEach(index => {
      removeItem(index);
    });

    // إضافة المنتجات الجديدة فقط
    newProducts.forEach(product => {
      appendItem({
        name: product.priceName,
        productPriceId: product.productPriceId,
        useOriginalPrice: true,
        extraPrice: 0,
        isCommentOnly: false,
        sortOrder: itemFields.length
      });
    });
  };

  return (
    <>
      <Accordion key={groupIndex}>
       <AccordionSummary expandIcon={<IconChevronDown />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <IconGripVertical size={16} />
            <Typography variant="h6" sx={{ flex: 1 }}>
              {/* ⭐ استخدام state بدلاً من watch */}
              {groupName || `${t('products.form.optionGroup')} ${groupIndex + 1}`}
            </Typography>
            
            <FormControlLabel
              control={
                <Controller
                  name={`productOptionGroups.${groupIndex}.isRequired`}
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                      size="small"
                    />
                  )}
                />
              }
              label={t('products.form.required')}
              labelPlacement="start"
              sx={{ mr: 2 }}
            />
            
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                removeOptionGroup(groupIndex);
              }}
            >
              <IconTrash size={16} />
            </IconButton>
          </Box>
        </AccordionSummary>

        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Controller
                name={`productOptionGroups.${groupIndex}.name`}
                control={control}
                rules={{ required: t('products.validation.optionGroupNameRequired') }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t('products.form.optionGroupName')}
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
              <FormControlLabel
                control={
                  <Controller
                    name={`productOptionGroups.${groupIndex}.allowMultiple`}
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                }
                label={t('products.form.allowMultiple')}
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <Controller
                name={`productOptionGroups.${groupIndex}.minSelection`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('products.form.minSelection')}
                    type="number"
                    fullWidth
                    inputProps={{ min: 1 }}
                    onFocus={(e) => e.target.select()}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <Controller
                name={`productOptionGroups.${groupIndex}.maxSelection`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('products.form.maxSelection')}
                    type="number"
                    fullWidth
                    inputProps={{ min: 1 }}
                    onFocus={(e) => e.target.select()}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">
                  {t('products.form.optionItems')} ({itemFields.length})
                </Typography>
                
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<IconPlus />}
                    onClick={addCommentItem}
                  >
                    {t('products.form.addComment')}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<IconSearch />}
                    onClick={() => setProductSelectionOpen(true)}
                    color="primary"
                  >
                    {t('products.form.selectProducts')}
                  </Button>
                </Stack>
              </Box>

              {itemFields.map((item, itemIndex) => {
                const isComment = watch(`productOptionGroups.${groupIndex}.optionItems.${itemIndex}.isCommentOnly`);
                const hasProductPrice = watch(`productOptionGroups.${groupIndex}.optionItems.${itemIndex}.productPriceId`);
                
                return (
                  <Box key={item.id} sx={{ mb: 2, p: 2, border: 1, borderColor: 'grey.300', borderRadius: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Controller
                            name={`productOptionGroups.${groupIndex}.optionItems.${itemIndex}.name`}
                            control={control}
                            rules={{ required: t('products.validation.optionItemNameRequired') }}
                            render={({ field, fieldState }) => (
                              <TextField
                                {...field}
                                label={t('products.form.optionItemName')}
                                fullWidth
                                size="small"
                                required
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                disabled={!!hasProductPrice && !isComment}
                                onFocus={(e) => e.target.select()}
                              />
                            )}
                          />
                          {isComment && (
                            <Chip label={t('products.form.comment')} size="small" color="info" />
                          )}
                          {hasProductPrice && !isComment && (
                            <Chip label={t('products.form.product')} size="small" color="success" />
                          )}
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Controller
                          name={`productOptionGroups.${groupIndex}.optionItems.${itemIndex}.extraPrice`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={t('products.form.extraPrice')}
                              type="number"
                              fullWidth
                              size="small"
                              inputProps={{ min: 0, step: 0.01 }}
                              onFocus={(e) => e.target.select()}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeItem(itemIndex)}
                        >
                          <IconTrash size={16} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ⭐ تمرير المنتجات المختارة حالياً */}
      <ProductMultiSelectDialog
        open={productSelectionOpen}
        onClose={() => setProductSelectionOpen(false)}
        onSelect={handleAddMultipleProducts}
        excludeProductId={watchedProductId}
        productType={productType}
        preSelectedItems={getCurrentlySelectedProducts()}
      />
    </>
  );
};

  const watchedProductId = initialValues?.id;

  // إعادة تعيين النموذج بعد النجاح في الحفظ
  React.useEffect(() => {
    if (isSubmitSuccessful && mode === 'add') {
      const timer = setTimeout(() => {
        reset(defaults);
        setCurrentTab(0);
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
          description: initialValues.description || '',
          reorderLevel: initialValues.reorderLevel,
          cost: initialValues.cost,
          lastPurePrice: initialValues.lastPurePrice,
          expirationDays: initialValues.expirationDays,
          isActive: initialValues.isActive, // ⭐ إضافة isActive
          posScreenId: initialValues.posScreenId || '',
          productPrices: initialValues.productPrices?.map(p => ({
            productPriceId: p.id,
            unitId: p.unitId,
            unitFactor: p.unitFactor,
            barcode: p.barcode,
            Price: p.price,
            posPriceName: p.posPriceName || '', // ⭐ إضافة posPriceName
            productComponents: p.productComponents?.map(c => ({
              componentId: c.componentId,
              rawProductPriceId: c.rawProductPriceId,
              quantity: c.quantity,
              notes: c.notes || ''
            })) || []
          })) ?? [],
          productOptionGroups: initialValues.productOptionGroups?.map(g => ({
            id: g.id,
            name: g.name,
            isRequired: g.isRequired,
            allowMultiple: g.allowMultiple,
            minSelection: Math.max(g.minSelection, 1), // ⭐ ضمان الحد الأدنى 1
            maxSelection: Math.max(g.maxSelection, 1), // ⭐ ضمان الحد الأدنى 1
            sortOrder: g.sortOrder,
            optionItems: g.optionItems?.map(i => ({
              id: i.id,
              name: i.name,
              productPriceId: i.productPriceId ?? undefined,
              useOriginalPrice: i.useOriginalPrice,
              extraPrice: i.extraPrice,
              isCommentOnly: i.isCommentOnly,
              sortOrder: i.sortOrder
            })) || []
          })) || []
        });
      }
    }
  }, [open, mode, initialValues, reset]);

  const flattenPosScreens = (screens: PosScreen[]): PosScreen[] => {
    const result: PosScreen[] = [];
    
    const flatten = (items: PosScreen[], level = 0) => {
      items.forEach(item => {
        result.push({ ...item, displayOrder: level });
        if (item.children && item.children.length > 0) {
          flatten(item.children, level + 1);
        }
      });
    };
    
    flatten(screens);
    return result;
  };

  const flatPosScreens = React.useMemo(() => flattenPosScreens(posScreens), [posScreens]);

  // دالة نسخ المنتج
  const handleCopyProduct = () => {
    const currentValues = getValues();
    
    if (!currentValues.productName.trim()) {
      set({
        open: true,
        message: t('products.nameRequiredForCopy'),
        severity: 'warning'
      });
      return;
    }

    const copyData: ProductCopyData = {
      groupId: currentValues.groupId,
      productType: productType,
      description: currentValues.description,
      reorderLevel: currentValues.reorderLevel,
      expirationDays: currentValues.expirationDays,
      isActive: currentValues.isActive, // ⭐ إضافة isActive
      posScreenId: currentValues.posScreenId,
      priceTemplates: currentValues.productPrices.map(price => ({
        unitId: price.unitId,
        unitFactor: price.unitFactor,
        posPriceName: price.posPriceName, // ⭐ إضافة posPriceName
        productComponents: price.productComponents.map(component => ({
          rawProductPriceId: component.rawProductPriceId,
          quantity: component.quantity,
          notes: component.notes
        }))
      })),
      optionGroupTemplates: currentValues.productOptionGroups.map(group => ({
        name: group.name,
        isRequired: group.isRequired,
        allowMultiple: group.allowMultiple,
        minSelection: group.minSelection,
        maxSelection: group.maxSelection,
        sortOrder: group.sortOrder,
        optionItems: group.optionItems.map(item => ({
          name: item.name,
          productPriceId: item.productPriceId,
          useOriginalPrice: item.useOriginalPrice,
          extraPrice: item.extraPrice,
          isCommentOnly: item.isCommentOnly,
          sortOrder: item.sortOrder
        }))
      }))
    };
    
    productCopyPaste.copyData(copyData);
  };

  // دالة لصق المنتج
  const handlePasteProduct = () => {
    const pastedData = productCopyPaste.pasteData();
    
    if (!pastedData) return;

    setValue('groupId', pastedData.groupId);
    setValue('productType', pastedData.productType);
    setValue('description', pastedData.description);
    setValue('reorderLevel', pastedData.reorderLevel);
    setValue('expirationDays', pastedData.expirationDays);
    setValue('isActive', pastedData.isActive); // ⭐ إضافة isActive
    setValue('posScreenId', pastedData.posScreenId || '');
    
    setValue('productPrices', pastedData.priceTemplates.map(template => ({
      productPriceId: undefined,
      unitId: template.unitId,
      unitFactor: template.unitFactor,
      barcode: '',
      Price: 0,
      posPriceName: template.posPriceName || '', // ⭐ إضافة posPriceName
      productComponents: template.productComponents
    })));

    setValue('productOptionGroups', pastedData.optionGroupTemplates.map(template => ({
      name: template.name,
      isRequired: template.isRequired,
      allowMultiple: template.allowMultiple,
      minSelection: template.minSelection,
      maxSelection: template.maxSelection,
      sortOrder: template.sortOrder,
      optionItems: template.optionItems
    })));
  };

  const addPrice = () => {
    const newIndex = fields.length;
    append({
      unitId: '',
      unitFactor: 1,
      barcode: '',
      Price: 0,
      posPriceName: '', // ⭐ إضافة posPriceName
      productComponents: []
    });
    setLastAddedPriceIndex(newIndex);
  };

const submit = async (data: FormValues, saveAction: 'save' | 'saveAndNew') => {
  if (isSubmitting) return;
  
  setIsSubmitting(true);
  try {
    if (mode === 'edit' && initialValues) {
      const updateData = {
        ProductId: initialValues.id,
        productName: data.productName,
        groupId: data.groupId,
        ProductType: productType,
        description: data.description,
        reorderLevel: data.reorderLevel,
        lastPurePrice: data.lastPurePrice,
        expirationDays: data.expirationDays,
        isActive: data.isActive,
        ...(productType === 1 && { posScreenId: data.posScreenId }),
        productPrices: data.productPrices.map(price => {
          const priceData: any = {
            ...(price.productPriceId && { productPriceId: price.productPriceId }),
            barcode: price.barcode,
            Price: Number(price.Price),
            productComponents: price.productComponents?.map(component => ({
              ...(component.componentId && { componentId: component.componentId }),
              rawProductPriceId: component.rawProductPriceId,
              quantity: Number(component.quantity),
              notes: component.notes || ""
            })) || []
          };

          // ⭐ إضافة unitId و unitFactor فقط للـ Materials (type 2)
          if (productType === 2) {
            priceData.unitId = price.unitId;
            priceData.unitFactor = Number(price.unitFactor);
          }

          // ⭐ إضافة posPriceName فقط للـ POS (1) أو Addition (3)
          if (productType === 1 || productType === 3) {
            priceData.posPriceName = price.posPriceName || '';
          }

          return priceData;
        }),
        ...((productType === 1 || productType === 3) && { 
          productOptionGroups: data.productOptionGroups?.map(group => ({
            ...(group.id && { id: group.id }),
            name: group.name,
            isRequired: group.isRequired,
            allowMultiple: group.allowMultiple,
            minSelection: Math.max(group.minSelection, 1),
            maxSelection: Math.max(group.maxSelection, 1),
            sortOrder: group.sortOrder,
            optionItems: group.optionItems.map(item => ({
              ...(item.id && { id: item.id }),
              name: item.name,
              productPriceId: item.productPriceId || null,
              useOriginalPrice: item.useOriginalPrice,
              extraPrice: Number(item.extraPrice),
              isCommentOnly: item.isCommentOnly,
              sortOrder: item.sortOrder
            }))
          })) || []
        })
      };
      await onSubmit(updateData, saveAction);
    } else {
      const addData = {
        productName: data.productName,
        groupId: data.groupId,
        productType: productType,
        description: data.description,
        reorderLevel: data.reorderLevel,
        cost: data.cost,
        lastPurePrice: data.lastPurePrice,
        expirationDays: data.expirationDays,
        isActive: data.isActive,
        ...(productType === 1 && { posScreenId: data.posScreenId }),
        productPrices: data.productPrices.map(price => {
          const priceData: any = {
            barcode: price.barcode,
            Price: Number(price.Price),
            productComponents: price.productComponents?.map(component => ({
              rawProductPriceId: component.rawProductPriceId,
              quantity: Number(component.quantity),
              notes: component.notes || ""
            })) || []
          };

          // ⭐ إضافة unitId و unitFactor فقط للـ Materials (type 2)
          if (productType === 2) {
            priceData.unitId = price.unitId;
            priceData.unitFactor = Number(price.unitFactor);
          }

          // ⭐ إضافة posPriceName فقط للـ POS (1) أو Addition (3)
          if (productType === 1 || productType === 3) {
            priceData.posPriceName = price.posPriceName || '';
          }

          return priceData;
        }),
        ...((productType === 1 || productType === 3) && { 
          productOptionGroups: data.productOptionGroups?.map(group => ({
            name: group.name,
            isRequired: group.isRequired,
            allowMultiple: group.allowMultiple,
            minSelection: Math.max(group.minSelection, 1),
            maxSelection: Math.max(group.maxSelection, 1),
            sortOrder: group.sortOrder,
            optionItems: group.optionItems.map(item => ({
              name: item.name,
              productPriceId: item.productPriceId || null,
              useOriginalPrice: item.useOriginalPrice,
              extraPrice: Number(item.extraPrice),
              isCommentOnly: item.isCommentOnly,
              sortOrder: item.sortOrder
            }))
          })) || []
        })
      };
      await onSubmit(addData, saveAction);
    }

    if (mode === 'add' && saveAction === 'saveAndNew') {
      setTimeout(() => {
        reset(defaults);
        setCurrentTab(0);
        if (nameFieldRef.current) {
          nameFieldRef.current.focus();
          nameFieldRef.current.select();
        }
      }, 100);
    }
    
  } catch (error: any) {
    // ... error handling
  } finally {
    setIsSubmitting(false);
  }
};

// ⭐ دالة لتحويل أسماء الحقول للعربية

  // مكون إدارة المكونات لكل سعر
  const ProductComponentsManager: React.FC<{ priceIndex: number }> = React.memo(({ priceIndex }) => {
    const { fields: componentFields, append: appendComponent, remove: removeComponent } = useFieldArray({
      control,
      name: `productPrices.${priceIndex}.productComponents`
    });

    const [componentDetails, setComponentDetails] = React.useState<{[key: string]: any}>({});
    const [loadingComponents, setLoadingComponents] = React.useState<{[key: string]: boolean}>({});

    const addComponent = React.useCallback(() => {
      appendComponent({
        rawProductPriceId: '',
        quantity: 1,
        notes: ''
      });
    }, [appendComponent]);

    const copyComponents = React.useCallback(() => {
      const components = getValues(`productPrices.${priceIndex}.productComponents`);
      if (components && components.length > 0) {
        const copyData = components.map(comp => ({
          rawProductPriceId: comp.rawProductPriceId,
          quantity: comp.quantity,
          notes: comp.notes
        }));
        
        localStorage.setItem(`componentsCopy_${priceIndex}`, JSON.stringify(copyData));
        
        set({
          open: true,
          message: t('products.componentsCopySuccess'),
          severity: 'success'
        });
      } else {
        set({
          open: true,
          message: t('products.noComponentsToCopy'),
          severity: 'warning'
        });
      }
    }, [priceIndex, getValues, set, t]);

    const pasteComponents = React.useCallback(() => {
      try {
        const savedData = localStorage.getItem(`componentsCopy_${priceIndex}`);
        if (savedData) {
          const componentsToPaste = JSON.parse(savedData);
          
          for (let i = componentFields.length - 1; i >= 0; i--) {
            removeComponent(i);
          }
          
          setTimeout(() => {
            componentsToPaste.forEach((comp: any) => {
              appendComponent({
                rawProductPriceId: comp.rawProductPriceId,
                quantity: comp.quantity,
                notes: comp.notes
              });
            });
            
            set({
              open: true,
              message: t('products.componentsPasteSuccess'),
              severity: 'success'
            });
          }, 100);
        } else {
          set({
            open: true,
            message: 'لا توجد مكونات منسوخة',
            severity: 'warning'
          });
        }
      } catch (error) {
        set({
          open: true,
          message: 'خطأ في لصق المكونات',
          severity: 'error'
        });
      }
    }, [priceIndex, componentFields.length, removeComponent, appendComponent, set, t]);

    const hasCopiedData = React.useMemo(() => {
      return localStorage.getItem(`componentsCopy_${priceIndex}`) !== null;
    }, [priceIndex]);

    const fetchComponentDetails = React.useCallback(async (rawProductPriceId: string) => {
      if (!rawProductPriceId || componentDetails[rawProductPriceId] || loadingComponents[rawProductPriceId]) {
        return;
      }

      setLoadingComponents(prev => ({ ...prev, [rawProductPriceId]: true }));

      try {
        const searchResponse = await searchProductPricesByNameOrBarcode(rawProductPriceId, 1, 10);
        const foundInSearch = searchResponse.data.find((item: { productPriceId: string; }) => item.productPriceId === rawProductPriceId);

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
        }
      } catch (error) {
        } finally {
        setLoadingComponents(prev => ({ ...prev, [rawProductPriceId]: false }));
      }
    }, [componentDetails, loadingComponents]);

    return (
      <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconComponents size={16} />
            {t('products.components')} ({componentFields.length})
          </Typography>
          
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={copyComponents}
              disabled={componentFields.length === 0}
              startIcon={<IconCopy size={14} />}
              sx={{ minWidth: 80 }}
            >
              {t('common.copy')}
            </Button>
            
            <Button
              size="small"
              variant="outlined"
              onClick={pasteComponents}
              disabled={!hasCopiedData}
              startIcon={hasCopiedData ? <IconClipboardCheck size={14} /> : <IconClipboard size={14} />}
              color={hasCopiedData ? 'success' : 'inherit'}
              sx={{ minWidth: 80 }}
            >
              {t('common.paste')}
            </Button>
            
            <Button
              size="small"
              variant="outlined"
              onClick={addComponent}
              startIcon={<IconPlus size={14} />}
              sx={{ minWidth: 80 }}
            >
              {t('products.addComponent')}
            </Button>
          </Stack>
        </Box>

        {componentFields.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            {t('products.noComponents')}
          </Typography>
        ) : (
          <Stack spacing={2}>
            {componentFields.map((field, componentIndex) => {
              
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
                              if (value && !componentDetails[value]) {
                                fetchComponentDetails(value);
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

                </Card>
              );
            })}
          </Stack>
        )}
      </Box>
    );
  });

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

          {/* ⭐ إضافة posPriceName للـ POS/Addition */}
          {(productType === 1 || productType === 3) && (
            <Controller
              name={`productPrices.${index}.posPriceName`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('products.form.posPriceName')}
                  fullWidth
                  size="small"
                />
              )}
            />
          )}

          {/* ⭐ إخفاء الوحدة ومعامل التحويل للـ POS/Addition */}
          {productType === 2 && (
            <>
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
            </>
          )}

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
          {(productType === 1 || productType === 3) && (
            <TableCell>{t('products.form.posPriceName')}</TableCell>
          )}
          {productType === 2 && (
            <>
              <TableCell>{t('products.unit')}</TableCell>
              <TableCell>{t('products.unitFactor')}</TableCell>
            </>
          )}
          <TableCell>{t('products.price')}</TableCell>
          <TableCell>{t('products.components')}</TableCell>
          <TableCell width={50}></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {fields.length === 0 ? (
          <TableRow>
            <TableCell colSpan={productType === 2 ? 6 : 5} align="center">
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
                        // ⭐ إضافة keyboard navigation
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            const nextField = document.querySelector(`[name="productPrices.${index + 1}.barcode"]`) as HTMLElement;
                            if (nextField) {
                              nextField.focus();
                            }
                          }
                          if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            const prevField = document.querySelector(`[name="productPrices.${index - 1}.barcode"]`) as HTMLElement;
                            if (prevField) {
                              prevField.focus();
                            }
                          }
                          if (e.key === 'ArrowRight') {
                            e.preventDefault();
                            const nextField = productType === 1 || productType === 3 
                              ? document.querySelector(`[name="productPrices.${index}.posPriceName"]`) as HTMLElement
                              : document.querySelector(`[name="productPrices.${index}.unitId"]`) as HTMLElement;
                            nextField?.focus();
                          }
                        }}
                        // ⭐ تحديد النص عند Focus
                        onFocus={(e) => e.target.select()}
                      />
                    )}
                  />
                </TableCell>
                
                {(productType === 1 || productType === 3) && (
                  <TableCell>
                    <Controller
                      name={`productPrices.${index}.posPriceName`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          size="small"
                          placeholder={t('products.form.posNamePlaceholder')}
                          fullWidth
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowDown') {
                              e.preventDefault();
                              const nextField = document.querySelector(`[name="productPrices.${index + 1}.posPriceName"]`) as HTMLElement;
                              if (nextField) {
                                nextField.focus();
                              }
                            }
                            if (e.key === 'ArrowUp') {
                              e.preventDefault();
                              const prevField = document.querySelector(`[name="productPrices.${index - 1}.posPriceName"]`) as HTMLElement;
                              if (prevField) {
                                prevField.focus();
                              }
                            }
                            if (e.key === 'ArrowLeft') {
                              e.preventDefault();
                              const prevField = document.querySelector(`[name="productPrices.${index}.barcode"]`) as HTMLElement;
                              prevField?.focus();
                            }
                            if (e.key === 'ArrowRight') {
                              e.preventDefault();
                              const nextField = document.querySelector(`[name="productPrices.${index}.Price"]`) as HTMLElement;
                              nextField?.focus();
                            }
                          }}
                          onFocus={(e) => e.target.select()}
                        />
                      )}
                    />
                  </TableCell>
                )}
                
                {productType === 2 && (
                  <>
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
                              onKeyDown={(e) => {
                                if (e.key === 'ArrowRight') {
                                  e.preventDefault();
                                  const nextField = document.querySelector(`[name="productPrices.${index}.unitFactor"]`) as HTMLElement;
                                  nextField?.focus();
                                }
                                if (e.key === 'ArrowLeft') {
                                  e.preventDefault();
                                  const prevField = document.querySelector(`[name="productPrices.${index}.barcode"]`) as HTMLElement;
                                  prevField?.focus();
                                }
                              }}
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
                            onKeyDown={(e) => {
                              if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                const nextField = document.querySelector(`[name="productPrices.${index + 1}.unitFactor"]`) as HTMLElement;
                                if (nextField) {
                                  nextField.focus();
                                }
                              }
                              if (e.key === 'ArrowUp') {
                                e.preventDefault();
                                const prevField = document.querySelector(`[name="productPrices.${index - 1}.unitFactor"]`) as HTMLElement;
                                if (prevField) {
                                  prevField.focus();
                                }
                              }
                              if (e.key === 'ArrowLeft') {
                                e.preventDefault();
                                const prevField = document.querySelector(`[name="productPrices.${index}.unitId"]`) as HTMLElement;
                                prevField?.focus();
                              }
                              if (e.key === 'ArrowRight') {
                                e.preventDefault();
                                const nextField = document.querySelector(`[name="productPrices.${index}.Price"]`) as HTMLElement;
                                nextField?.focus();
                              }
                            }}
                            onFocus={(e) => e.target.select()}
                          />
                        )}
                      />
                    </TableCell>
                  </>
                )}
                
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
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            const nextField = document.querySelector(`[name="productPrices.${index + 1}.Price"]`) as HTMLElement;
                            if (nextField) {
                              nextField.focus();
                            }
                          }
                          if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            const prevField = document.querySelector(`[name="productPrices.${index - 1}.Price"]`) as HTMLElement;
                            if (prevField) {
                              prevField.focus();
                            }
                          }
                          if (e.key === 'ArrowLeft') {
                            e.preventDefault();
                            const prevField = productType === 2 
                              ? document.querySelector(`[name="productPrices.${index}.unitFactor"]`) as HTMLElement
                              : document.querySelector(`[name="productPrices.${index}.posPriceName"]`) as HTMLElement;
                            prevField?.focus();
                          }
                        }}
                        onFocus={(e) => e.target.select()}
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
                  <TableCell colSpan={productType === 2 ? 6 : 5}>
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
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="lg" 
        fullWidth
        disableEscapeKeyDown={false}
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 }
          }}>
            <Typography variant="h6">
              {mode === 'add' ? t('products.add') : t('products.edit')}
            </Typography>
            
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<IconCopy size={16} />}
                onClick={handleCopyProduct}
                disabled={!watch('productName')}
                sx={{ minWidth: { xs: 'auto', sm: 100 } }}
              >
                {isMobile ? '' : t('common.copy')}
              </Button>
              
              <Button
                variant="outlined"
                size="small"
                startIcon={productCopyPaste.hasCopiedData ? <IconClipboardCheck size={16} /> : <IconClipboard size={16} />}
                onClick={handlePasteProduct}
                disabled={!productCopyPaste.hasCopiedData}
                color={productCopyPaste.hasCopiedData ? 'success' : 'inherit'}
                sx={{ minWidth: { xs: 'auto', sm: 100 } }}
              >
                {isMobile ? '' : t('common.paste')}
              </Button>
              
              {productCopyPaste.hasCopiedData && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<IconTrashX size={16} />}
                  onClick={productCopyPaste.clearData}
                  color="error"
                  sx={{ minWidth: { xs: 'auto', sm: 100 } }}
                >
                  {isMobile ? '' : t('common.clear')}
                </Button>
              )}
            </Stack>
          </Box>
        </DialogTitle>

        <form>
          <DialogContent sx={{ maxHeight: isMobile ? 'none' : '70vh', overflowY: 'auto' }}>
            
            {/* Tabs للتنقل */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
<Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
  <Tab label={t('products.tabs.basicInfoAndPrices')} /> {/* ⭐ تاب مدمج */}
  {(productType === 1 || productType === 3) && <Tab label={t('products.tabs.options')} />}
</Tabs>
            </Box>

{/* Tab 0: المعلومات الأساسية والأسعار */}
{currentTab === 0 && (
  <Box>
    {/* المعلومات الأساسية */}
    <Typography variant="h6" sx={{ mb: 3, color: 'primary.main' }}>
      {t('products.tabs.basicInfo')}
    </Typography>
    
    <Grid container spacing={3} sx={{ mb: 4 }}>
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
              onFocus={(e) => e.target.select()}
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

      {productType === 1 && (
        <Grid item xs={12} md={6}>
          <Controller
            name="posScreenId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>{t('products.form.posScreen')}</InputLabel>
                <Select
                  {...field}
                  label={t('products.form.posScreen')}
                >
                  <MenuItem value="">
                    <em>{t('products.form.noPosScreen')}</em>
                  </MenuItem>
                  {flatPosScreens.map((screen) => (
                    <MenuItem key={screen.id} value={screen.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{ marginLeft: screen.displayOrder * 20 }}>
                          {'└'.repeat(screen.displayOrder)} {screen.displayOrder > 0 && ' '}
                        </span>
                        <span>{screen.icon}</span>
                        <span>{screen.name}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>
      )}

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
              onFocus={(e) => e.target.select()}
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
              onFocus={(e) => e.target.select()}
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
              inputProps={{ min: 1, step: 1 }}
              onFocus={(e) => e.target.select()}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          }
          label={t('products.form.isActive')}
        />
      </Grid>

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
                onFocus={(e) => e.target.select()}
              />
            )}
          />
        </Grid>
      )}

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
    </Grid>

    <Divider sx={{ my: 4 }} />

    {/* الأسعار */}
    <Typography variant="h6" sx={{ mb: 3, color: 'primary.main' }}>
      {t('products.tabs.prices')}
    </Typography>
    
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="subtitle1">
        {t('products.prices')} ({fields.length})
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
  </Box>
)}

{/* Tab 1: خيارات المنتج (POS و Addition) */}
{currentTab === 1 && (productType === 1 || productType === 3) && (
  <Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h6">
        {t('products.form.productOptions')} ({optionGroupFields.length})
      </Typography>
      <Button
        variant="contained"
        startIcon={<IconPlusNew />}
        onClick={addOptionGroup}
      >
        {t('products.form.addOptionGroup')}
      </Button>
    </Box>

    {optionGroupFields.length === 0 ? (
      <Box sx={{ textAlign: 'center', py: 4, backgroundColor: 'grey.50', borderRadius: 1 }}>
        <Typography color="text.secondary">
          {t('products.form.noOptionGroups')}
        </Typography>
      </Box>
    ) : (
      <Box>
        {optionGroupFields.map((group, index) => (
          <OptionGroupComponent key={group.id} groupIndex={index} />
        ))}
      </Box>
    )}
  </Box>
)}

          </DialogContent>

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
      </Dialog></>
  );
};

export default ProductForm;
