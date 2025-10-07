// File: src/pages/pos/offers/components/OfferForm.tsx
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem,
  Switch, FormControlLabel, Card, CardContent, IconButton, Box,
  Checkbox, useMediaQuery, useTheme, Tabs, Tab
} from '@mui/material';
import { 
  IconDeviceFloppy, IconPlus as IconPlusNew, IconTrash, IconPlus, 
  IconUsers, IconShoppingCart 
} from '@tabler/icons-react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Offer, OfferGroup, OfferItem } from 'src/utils/api/pagesApi/offersApi';
import * as groupsApi from 'src/utils/api/pagesApi/groupsApi';
import * as productsApi from 'src/utils/api/pagesApi/productsApi';
import ProductMultiSelectDialog from './ProductMultiSelectDialog';

type FormValues = {
  name: string;
  priceType: 'Fixed' | 'Dynamic';
  fixedPrice: number;
  startDate: string;
  endDate: string;
  orderTypeId: string;
  isActive: boolean;
  offerGroups: OfferGroup[];
  offerItems: OfferItem[];
};

interface Props {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues?: Offer;
  onClose: () => void;
  onSubmit: (data: any, saveAction: 'save' | 'saveAndNew') => Promise<void>;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`offer-tabpanel-${index}`}
      aria-labelledby={`offer-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const OfferForm: React.FC<Props> = ({
  open, mode, initialValues, onClose, onSubmit
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [, setGroups] = React.useState<any[]>([]);
  const [, setProducts] = React.useState<any[]>([]);
  const [productPrices, setProductPrices] = React.useState<any[]>([]);
  const [multiSelectOpen, setMultiSelectOpen] = React.useState(false);
  const [currentGroupIndex, setCurrentGroupIndex] = React.useState<number | null>(null);
  const [tabValue, setTabValue] = React.useState(0);

  const defaults: FormValues = {
    name: '',
    priceType: 'Fixed',
    fixedPrice: 0,
    startDate: '',
    endDate: '',
    orderTypeId: '1',
    isActive: true,
    offerGroups: [],
    offerItems: []
  };

  const { control, handleSubmit, reset, watch, setValue, formState: { isSubmitSuccessful } } = useForm<FormValues>({
    defaultValues: defaults
  });

  const { fields: groupFields, append: appendGroup, remove: removeGroup } = useFieldArray({
    control,
    name: 'offerGroups'
  });

  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
    control,
    name: 'offerItems'
  });

  // تحميل البيانات المطلوبة
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [groupsData, productsData] = await Promise.all([
          groupsApi.getAll(),
          productsApi.getAll(1, 100)
        ]);
        
        const flatGroups = flattenGroups(groupsData);
        setGroups(flatGroups);
        setProducts(productsData.data);

        const allProductPrices = productsData.data.flatMap(product => 
          product.productPrices.map(price => ({
            ...price,
            productName: product.name,
            displayName: `${product.name} - ${price.posPriceName}`,
            fullDisplayName: `${product.name} - ${price.posPriceName} (${price.price} ${t('common.currency')})`
          }))
        );
        setProductPrices(allProductPrices);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    if (open) {
      loadData();
    }
  }, [open, t]);

  const flattenGroups = (groups: any[]): any[] => {
    const result: any[] = [];
    
    const flatten = (items: any[], level = 0) => {
      items.forEach(item => {
        result.push({
          ...item,
          displayName: '  '.repeat(level) + item.name,
          level
        });
        if (item.children && item.children.length > 0) {
          flatten(item.children, level + 1);
        }
      });
    };
    
    flatten(groups);
    return result;
  };

React.useEffect(() => {
  if (open) {
    if (mode === 'add') {
      reset(defaults);
    } else if (initialValues) {
      // ✅ تجميع كل المنتجات من المجموعات والمستقلة
      const groupItems = initialValues.offerGroups?.flatMap(group => 
        group.items?.map(item => ({
          ...item,
          offerGroupId: group.id
        })) || []
      ) || [];

      // ✅ المنتجات المستقلة (اللي offerGroupId = null)
      const independentItems = initialValues.offerItems?.filter(item => 
        !item.offerGroupId || item.offerGroupId === null
      ) || [];

      const allItems = [...groupItems, ...independentItems];

      reset({
        name: initialValues.name,
        priceType: initialValues.priceType,
        fixedPrice: initialValues.fixedPrice || 0,
        startDate: initialValues.startDate ? initialValues.startDate.split('T')[0] : '',
        endDate: initialValues.endDate ? initialValues.endDate.split('T')[0] : '',
        orderTypeId: initialValues.orderTypeId || '1',
        isActive: initialValues.isActive,
        offerGroups: initialValues.offerGroups?.map(group => ({
          id: group.id,
          title: group.title,
          minSelection: group.minSelection,
          maxSelection: group.maxSelection,
          isMandatory: group.isMandatory,
          isActive: group.isActive
        })) || [],
        offerItems: allItems
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

const addOfferGroup = () => {
  // ✅ بدون ID مؤقت - خلي المجموعة تاخد ID من الـ backend
  appendGroup({
    title: '',
    minSelection: 1,
    maxSelection: 1,
    isMandatory: true,
    isActive: true,
    items: []
  });
  setTabValue(0);
};


  const addOfferItem = () => {
    setCurrentGroupIndex(null);
    setMultiSelectOpen(true);
  };

  const addItemToGroup = (groupIndex: number) => {
    setCurrentGroupIndex(groupIndex);
    setMultiSelectOpen(true);
  };

const handleMultiSelectSubmit = (selectedProducts: Array<{
  productPriceId: string;
  productName: string;
  priceName: string;
  price: number;
}>) => {
  console.log('Received selected products:', selectedProducts);
  
  if (currentGroupIndex !== null) {
    // ✅ استخدام الـ ID الحقيقي للمجموعة من الفورم
    const actualGroup = watch(`offerGroups.${currentGroupIndex}`);
    const groupId = actualGroup.id; // ✅ استخدام الـ ID الموجود فعلاً
    
    console.log('Using group ID:', groupId, 'from group:', actualGroup);
    
    // إزالة كل العناصر الموجودة في هذه المجموعة
    const itemsToRemove: number[] = [];
    itemFields.forEach((_item, index) => {
      const itemGroupId = watch(`offerItems.${index}.offerGroupId`);
      if (itemGroupId === groupId) {
        itemsToRemove.push(index);
      }
    });
    
    // إزالة من الآخر للأول لتجنب تغيير الفهارس
    itemsToRemove.reverse().forEach(index => {
      console.log('Removing item at index:', index);
      removeItem(index);
    });
    
    // إضافة كل المنتجات المختارة الجديدة مع الـ groupId الصحيح
    selectedProducts.forEach(product => {
      console.log('Adding product to group:', product, 'groupId:', groupId);
      appendItem({
        productPriceId: product.productPriceId,
        offerGroupId: groupId, // ✅ استخدام الـ ID الصحيح
        quantity: 1,
        isDefaultSelected: true,
        useOriginalPrice: true,
        customPrice: 0,
        isActive: true
      });
    });
    
    setTabValue(0);
  } else {
    // للعناصر الثابتة: استبدال كامل للعناصر
    const itemsToRemove: number[] = [];
    itemFields.forEach((_item, index) => {
      const itemGroupId = watch(`offerItems.${index}.offerGroupId`);
      if (!itemGroupId) {
        itemsToRemove.push(index);
      }
    });
    
    itemsToRemove.reverse().forEach(index => {
      console.log('Removing fixed item at index:', index);
      removeItem(index);
    });
    
    selectedProducts.forEach(product => {
      console.log('Adding fixed product:', product);
      appendItem({
        productPriceId: product.productPriceId,
        offerGroupId: null,
        quantity: 1,
        isDefaultSelected: true,
        useOriginalPrice: true,
        customPrice: 0,
        isActive: true
      });
    });
    
    setTabValue(1);
  }
  
  setMultiSelectOpen(false);
  setCurrentGroupIndex(null);
};



const getGroupItems = (groupIndex: number) => {
  const actualGroup = watch(`offerGroups.${groupIndex}`);
  const groupId = actualGroup?.id;
  
  if (!groupId) return [];
  
  return itemFields.filter((_, index) => {
    const itemGroupId = watch(`offerItems.${index}.offerGroupId`);
    return itemGroupId === groupId;
  });
};



const getNonGroupItems = () => {
  return itemFields.filter((_, index) => {
    const offerGroupId = watch(`offerItems.${index}.offerGroupId`);
    return !offerGroupId || offerGroupId === null || offerGroupId === '';
  });
};



const getPreSelectedItems = () => {
  if (currentGroupIndex !== null) {
    const actualGroup = watch(`offerGroups.${currentGroupIndex}`);
    const groupId = actualGroup?.id;
    
    if (!groupId) return [];
    
    return itemFields
      .map((_, index) => {
        const itemGroupId = watch(`offerItems.${index}.offerGroupId`);
        const productPriceId = watch(`offerItems.${index}.productPriceId`);
        return itemGroupId === groupId ? productPriceId : null;
      })
      .filter(Boolean);
  } else {
    return itemFields
      .map((_, index) => {
        const itemGroupId = watch(`offerItems.${index}.offerGroupId`);
        const productPriceId = watch(`offerItems.${index}.productPriceId`);
        return (!itemGroupId || itemGroupId === null || itemGroupId === '') ? productPriceId : null;
      })
      .filter(Boolean);
  }
};



const submit = async (data: FormValues, saveAction: 'save' | 'saveAndNew') => {
  if (isSubmitting) return;
  
  setIsSubmitting(true);
  try {
    // ✅ فصل المنتجات حسب النوع
    const groupItems = data.offerItems.filter(item => item.offerGroupId);
    const independentItems = data.offerItems.filter(item => !item.offerGroupId);
    
    const processedData = {
      ...data,
      // ✅ المجموعات مع منتجاتها في items
      offerGroups: data.offerGroups.map((group, groupIndex) => {
        const groupId = group.id || `temp_group_${groupIndex}_${Date.now()}`;
        
        // الحصول على المنتجات الخاصة بهذه المجموعة
        const groupSpecificItems = groupItems
          .filter(item => item.offerGroupId === groupId)
          .map(item => ({
            ...(item.id && { id: item.id }),
            ...(mode === 'edit' && initialValues && { offerId: initialValues.id }),
            productPriceId: item.productPriceId,
            offerGroupId: groupId,
            quantity: Number(item.quantity),
            isDefaultSelected: Boolean(item.isDefaultSelected),
            useOriginalPrice: Boolean(item.useOriginalPrice),
            customPrice: item.useOriginalPrice ? null : Number(item.customPrice || 0),
            branchId: null,
            companyID: null,
            isActive: Boolean(item.isActive)
          }));

        return {
          ...(group.id && { id: group.id }),
          ...(mode === 'edit' && initialValues && { offerId: initialValues.id }),
          title: group.title,
          minSelection: Number(group.minSelection),
          maxSelection: Number(group.maxSelection),
          isMandatory: Boolean(group.isMandatory),
          items: groupSpecificItems, // ✅ المنتجات داخل المجموعة
          branchId: null,
          companyID: null,
          isActive: Boolean(group.isActive)
        };
      }),
      
      // ✅ المنتجات المستقلة بس في offerItems
      offerItems: independentItems.map(item => ({
        ...(item.id && { id: item.id }),
        ...(mode === 'edit' && initialValues && { offerId: initialValues.id }),
        productPriceId: item.productPriceId,
        offerGroupId: null, // ✅ null للمنتجات المستقلة
        quantity: Number(item.quantity),
        isDefaultSelected: Boolean(item.isDefaultSelected),
        useOriginalPrice: Boolean(item.useOriginalPrice),
        customPrice: item.useOriginalPrice ? null : Number(item.customPrice || 0),
        branchId: null,
        companyID: null,
        isActive: Boolean(item.isActive)
      }))
    };

    const apiData = {
      ...(mode === 'edit' && initialValues && { id: initialValues.id }),
      name: processedData.name,
      priceType: processedData.priceType,
      fixedPrice: Number(processedData.fixedPrice),
      startDate: new Date(processedData.startDate).toISOString(),
      endDate: new Date(processedData.endDate).toISOString(),
      orderTypeId: processedData.orderTypeId,
      isActive: Boolean(processedData.isActive),
      offerGroups: processedData.offerGroups,
      offerItems: processedData.offerItems // ✅ المنتجات المستقلة بس
    };

    console.log('Sending to API:', JSON.stringify(apiData, null, 2));
    
    await onSubmit(apiData, saveAction);

    if (mode === 'add' && saveAction === 'saveAndNew') {
      setTimeout(() => {
        reset(defaults);
      }, 100);
    }
  } catch (error) {
    console.error('Submit error:', error);
    throw error;
  } finally {
    setIsSubmitting(false);
  }
};



  // مكون لعرض العناصر في 3 أعمدة مع تمييز المجموعات والعناصر الثابتة
  const ItemsGrid: React.FC<{ items: any[], groupIndex?: number }> = ({ items, groupIndex }) => {
    const isGroupItems = groupIndex !== undefined;
    
    return (
      <Grid container spacing={1}>
        {items.map((item, itemIndex) => {
          const actualIndex = itemFields.findIndex(field => field.id === item.id);
          
          if (actualIndex === -1) return null;
          
          const productPrice = productPrices.find(p => p.id === watch(`offerItems.${actualIndex}.productPriceId`));
          const useOriginalPrice = watch(`offerItems.${actualIndex}.useOriginalPrice`);
          
          return (
            <Grid item xs={12} md={4} key={item.id}>
              <Box sx={{ 
                p: 1,
                border: 2, // زيادة سمك البوردر للتمييز
                borderColor: isGroupItems ? 'primary.main' : 'secondary.main', // ألوان مختلفة للتمييز
                borderRadius: 1,
                backgroundColor: itemIndex % 2 === 0 ? 
                  (isGroupItems ? 'primary.50' : 'secondary.50') : 
                  'background.paper',
                minHeight: 80,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}>
                {/* شارة للتمييز */}
                <Box sx={{
                  position: 'absolute',
                  top: -1,
                  right: -1,
                  backgroundColor: isGroupItems ? 'primary.main' : 'secondary.main',
                  color: 'white',
                  px: 0.5,
                  py: 0.25,
                  borderRadius: '0 0 0 4px',
                  fontSize: '0.6rem',
                  fontWeight: 'bold'
                }}>
                  {isGroupItems ? t('offers.form.group') : t('offers.form.fixed')}
                </Box>
                
                {/* اسم المنتج */}
                <Typography variant="body2" sx={{ 
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  mb: 0.5,
                  minHeight: 20,
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  mt: 1 // مساحة للشارة
                }}>
                  {productPrice?.displayName || t('offers.form.selectProduct')}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* الكمية */}
                  <TextField
                    label={t('offers.form.quantity')}
                    type="number"
                    size="small"
                    sx={{ width: 60 }}
                    value={watch(`offerItems.${actualIndex}.quantity`)}
                    onChange={(e) => setValue(`offerItems.${actualIndex}.quantity`, Number(e.target.value))}
                    inputProps={{ min: 1 }}
                  />
                  
                  {/* استخدام السعر الأصلي */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={useOriginalPrice}
                        onChange={(e) => {
                          setValue(`offerItems.${actualIndex}.useOriginalPrice`, e.target.checked);
                          if (e.target.checked) {
                            setValue(`offerItems.${actualIndex}.customPrice`, 0);
                          }
                        }}
                        size="small"
                      />
                    }
                    label={<Typography variant="caption" sx={{ fontSize: '0.7rem' }}>{t('offers.form.original')}</Typography>}
                  />
                  
                  {/* السعر المخصص */}
                  {!useOriginalPrice && (
                    <TextField
                      label={t('offers.form.price')}
                      type="number"
                      size="small"
                      sx={{ width: 70 }}
                      value={watch(`offerItems.${actualIndex}.customPrice`)}
                      onChange={(e) => setValue(`offerItems.${actualIndex}.customPrice`, Number(e.target.value))}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  )}
                  
                  {/* زرار الحذف */}
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => removeItem(actualIndex)}
                    sx={{ ml: 'auto' }}
                  >
                    <IconTrash size={12} />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="xl" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 1, 
          backgroundColor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          {mode === 'add' ? t('offers.add') : t('offers.edit')}
        </DialogTitle>

        <form>
          <DialogContent sx={{ 
            maxHeight: isMobile ? 'calc(100vh - 120px)' : '85vh', 
            overflowY: 'auto', 
            p: isMobile ? 1.5 : 2 
          }}>
            <Grid container spacing={isMobile ? 1.5 : 2}>
              {/* Basic Info */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ 
                  mb: isMobile ? 1 : 1.5, 
                  fontSize: isMobile ? '1rem' : '1.1rem' 
                }}>
                  {t('offers.form.basicInfo')}
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: t('offers.nameRequired') }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label={t('offers.form.name')}
                      fullWidth
                      required
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      onFocus={(e) => e.target.select()}
                      size={isMobile ? "medium" : "small"}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="priceType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size={isMobile ? "medium" : "small"}>
                      <InputLabel>{t('offers.form.priceType')}</InputLabel>
                      <Select
                        {...field}
                        label={t('offers.form.priceType')}
                      >
                        <MenuItem value="Fixed">{t('offers.form.fixed')}</MenuItem>
                        <MenuItem value="Dynamic">{t('offers.form.dynamic')}</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="fixedPrice"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('offers.form.fixedPrice')}
                      type="number"
                      fullWidth
                      inputProps={{ min: 0, step: 0.01 }}
                      onFocus={(e) => e.target.select()}
                      size={isMobile ? "medium" : "small"}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="orderTypeId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size={isMobile ? "medium" : "small"}>
                      <InputLabel>{t('offers.form.orderType')}</InputLabel>
                      <Select
                        {...field}
                        label={t('offers.form.orderType')}
                      >
                        <MenuItem value="1">{t('offers.form.dineIn')}</MenuItem>
                        <MenuItem value="2">{t('offers.form.takeaway')}</MenuItem>
                        <MenuItem value="3">{t('offers.form.delivery')}</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="startDate"
                  control={control}
                  rules={{ required: t('offers.startDateRequired') }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label={t('offers.form.startDate')}
                      type="date"
                      fullWidth
                      required
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputLabelProps={{ shrink: true }}
                      size={isMobile ? "medium" : "small"}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="endDate"
                  control={control}
                  rules={{ required: t('offers.endDateRequired') }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label={t('offers.form.endDate')}
                      type="date"
                      fullWidth
                      required
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputLabelProps={{ shrink: true }}
                      size={isMobile ? "medium" : "small"}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      }
                      label={t('offers.form.isActive')}
                    />
                  )}
                />
              </Grid>

              {/* الزرارين فوق التابات */}
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end',
                  gap: 1,
                  mb: 1
                }}>
                  <Button
                    variant="outlined"
                    startIcon={<IconPlus />}
                    onClick={addOfferGroup}
                    size="small"
                  >
                    {t('offers.form.addGroup')}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<IconShoppingCart />}
                    onClick={addOfferItem}
                    size="small"
                  >
                    {t('offers.form.addItem')}
                  </Button>
                </Box>
              </Grid>

              {/* التابات */}
              <Grid item xs={12}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={tabValue} onChange={handleTabChange} aria-label="offer tabs">
                    <Tab 
                      icon={<IconUsers size={18} />}
                      label={`${t('offers.form.offerGroups')} (${groupFields.length})`}
                      id="offer-tab-0"
                      aria-controls="offer-tabpanel-0"
                      sx={{ 
                        color: 'primary.main',
                        '&.Mui-selected': { 
                          color: 'primary.main',
                          fontWeight: 'bold'
                        }
                      }}
                    />
                    <Tab 
                      icon={<IconShoppingCart size={18} />}
                      label={`${t('offers.form.fixedItems')} (${getNonGroupItems().length})`}
                      id="offer-tab-1"
                      aria-controls="offer-tabpanel-1"
                      sx={{ 
                        color: 'secondary.main',
                        '&.Mui-selected': { 
                          color: 'secondary.main',
                          fontWeight: 'bold'
                        }
                      }}
                    />
                  </Tabs>
                </Box>

                {/* تاب المجموعات */}
                <TabPanel value={tabValue} index={0}>
                  {groupFields.length === 0 ? (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 4, 
                      backgroundColor: 'primary.50', 
                      borderRadius: 1,
                      border: 1,
                      borderColor: 'primary.main'
                    }}>
                      <Typography color="primary.main" variant="body2" fontWeight={500}>
                        {t('offers.form.noGroups')}
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {groupFields.map((group, index) => (
                        <Card key={group.id} variant="outlined" sx={{ 
                          borderColor: 'primary.main',
                          borderWidth: 2
                        }}>
                          <CardContent sx={{ p: '16px !important' }}>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center', 
                              mb: 2,
                              flexDirection: isMobile ? 'column' : 'row',
                              gap: isMobile ? 1 : 0
                            }}>
                              <Controller
                                name={`offerGroups.${index}.title`}
                                control={control}
                                rules={{ required: t('offers.groupTitleRequired') }}
                                render={({ field, fieldState }) => (
                                  <TextField
                                    {...field}
                                    label={t('offers.form.groupTitle')}
                                    required
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    size="small"
                                    sx={{ 
                                      flex: 1, 
                                      mr: isMobile ? 0 : 2,
                                      width: isMobile ? '100%' : 'auto'
                                    }}
                                  />
                                )}
                              />
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                  variant="outlined"
                                  startIcon={<IconPlus />}
                                  onClick={() => addItemToGroup(index)}
                                  size="small"
                                  color="primary"
                                >
                                  {t('offers.form.addItem')}
                                </Button>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => removeGroup(index)}
                                >
                                  <IconTrash size={16} />
                                </IconButton>
                              </Box>
                            </Box>

                            <Grid container spacing={1.5} sx={{ mb: 2 }}>
                              <Grid item xs={6} md={2}>
                                <Controller
                                  name={`offerGroups.${index}.minSelection`}
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      label={t('offers.form.minSelection')}
                                      type="number"
                                      fullWidth
                                      size="small"
                                      inputProps={{ min: 0 }}
                                    />
                                  )}
                                />
                              </Grid>

                              <Grid item xs={6} md={2}>
                                <Controller
                                  name={`offerGroups.${index}.maxSelection`}
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      label={t('offers.form.maxSelection')}
                                      type="number"
                                      fullWidth
                                      size="small"
                                      inputProps={{ min: 1 }}
                                    />
                                  )}
                                />
                              </Grid>

                              <Grid item xs={6} md={4}>
                                <Controller
                                  name={`offerGroups.${index}.isMandatory`}
                                  control={control}
                                  render={({ field }) => (
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={field.value}
                                          onChange={field.onChange}
                                          size="small"
                                        />
                                      }
                                      label={t('offers.form.mandatory')}
                                    />
                                  )}
                                />
                              </Grid>

                              <Grid item xs={6} md={4}>
                                <Controller
                                  name={`offerGroups.${index}.isActive`}
                                  control={control}
                                  render={({ field }) => (
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={field.value}
                                          onChange={field.onChange}
                                          size="small"
                                        />
                                      }
                                      label={t('offers.form.active')}
                                    />
                                  )}
                                />
                              </Grid>
                            </Grid>

                            {/* عناصر المجموعة */}
                            <Box>
                              <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.9rem', color: 'primary.main' }}>
                                {t('offers.form.groupItems')} ({getGroupItems(index).length})
                              </Typography>
                              {getGroupItems(index).length === 0 ? (
                                <Box sx={{ 
                                  textAlign: 'center', 
                                  py: 2, 
                                  backgroundColor: 'primary.50', 
                                  borderRadius: 1,
                                  border: 1,
                                  borderColor: 'primary.main'
                                }}>
                                  <Typography variant="body2" color="primary.main">
                                    {t('offers.form.noItemsInGroup')}
                                  </Typography>
                                </Box>
                              ) : (
                                <ItemsGrid items={getGroupItems(index)} groupIndex={index} />
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  )}
                </TabPanel>

                {/* تاب العناصر الثابتة */}
                <TabPanel value={tabValue} index={1}>
                  {getNonGroupItems().length === 0 ? (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 4, 
                      backgroundColor: 'secondary.50', 
                      borderRadius: 1,
                      border: 1,
                      borderColor: 'secondary.main'
                    }}>
                      <Typography color="secondary.main" variant="body2" fontWeight={500}>
                        {t('offers.form.noFixedItems')}
                      </Typography>
                    </Box>
                  ) : (
                    <Card variant="outlined" sx={{ 
                      borderColor: 'secondary.main',
                      borderWidth: 2
                    }}>
                      <CardContent sx={{ p: '16px !important' }}>
                        <ItemsGrid items={getNonGroupItems()} />
                      </CardContent>
                    </Card>
                  )}
                </TabPanel>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ 
            p: 2, 
            gap: 1,
            position: 'sticky',
            bottom: 0,
            backgroundColor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            <Button 
              onClick={onClose} 
              disabled={isSubmitting}
              fullWidth={isMobile}
              size={isMobile ? "large" : "medium"}
            >
              {t('common.cancel')}
            </Button>
            
            <Button 
              variant="outlined"
              startIcon={<IconDeviceFloppy size={20} />}
              onClick={handleSubmit((data) => submit(data, 'save'))}
              disabled={isSubmitting}
              fullWidth={isMobile}
              size={isMobile ? "large" : "medium"}
            >
              {t('offers.saveAndExit')}
            </Button>
            
            <Button 
              variant="contained"
              startIcon={<IconPlusNew size={20} />}
              onClick={handleSubmit((data) => submit(data, 'saveAndNew'))}
              disabled={isSubmitting}
              fullWidth={isMobile}
              size={isMobile ? "large" : "medium"}
            >
              {t('offers.saveAndNew')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ProductMultiSelectDialog
        open={multiSelectOpen}
        onClose={() => {
          setMultiSelectOpen(false);
          setCurrentGroupIndex(null);
        }}
        onSubmit={handleMultiSelectSubmit}
        title={currentGroupIndex !== null ? 
          t('offers.form.selectItemsForGroup') : 
          t('offers.form.selectFixedItems')
        }
        preSelectedItems={getPreSelectedItems().filter((item): item is string => item !== null)}
      />
    </>
  );
};

export default OfferForm;
