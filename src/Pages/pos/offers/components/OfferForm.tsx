// File: src/pages/pos/offers/components/OfferForm.tsx
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem,
  Switch, FormControlLabel, Card, CardContent, IconButton, Divider, Box,
  Collapse, Checkbox, useMediaQuery, useTheme
} from '@mui/material';
import { 
  IconDeviceFloppy, IconPlus as IconPlusNew, IconTrash, IconPlus, 
  IconChevronDown, IconUsers, IconShoppingCart 
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
  
  // Toggle states
  const [showGroups, setShowGroups] = React.useState(true);
  const [showItems, setShowItems] = React.useState(true);

  // Refs للـ scroll
  const groupsSectionRef = React.useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const itemsSectionRef = React.useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

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
            displayName: `${product.name} - ${price.posPriceName || 'الحجم الافتراضي'}`,
            fullDisplayName: `${product.name} - ${price.posPriceName || 'الحجم الافتراضي'} (${price.price} ${t('common.currency')})`
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
        reset({
          name: initialValues.name,
          priceType: initialValues.priceType,
          fixedPrice: initialValues.fixedPrice || 0,
          startDate: initialValues.startDate ? initialValues.startDate.split('T')[0] : '',
          endDate: initialValues.endDate ? initialValues.endDate.split('T')[0] : '',
          orderTypeId: initialValues.orderTypeId || '1',
          isActive: initialValues.isActive,
          offerGroups: initialValues.offerGroups || [],
          offerItems: initialValues.offerItems || []
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

  // دالة للـ scroll إلى العنصر
  const scrollToElement = (ref: React.RefObject<HTMLDivElement>) => {
    setTimeout(() => {
      if (ref.current) {
        ref.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }
    }, 300); // انتظار انتهاء الـ animation
  };

  const addOfferGroup = () => {
    appendGroup({
      title: '',
      minSelection: 1,
      maxSelection: 1,
      isMandatory: true,
      isActive: true
    });
    
    // فتح قسم المجموعات والـ scroll إليه
    if (!showGroups) {
      setShowGroups(true);
    }
    scrollToElement(groupsSectionRef);
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
    if (currentGroupIndex !== null) {
      // إضافة العناصر المختارة للمجموعة
      selectedProducts.forEach(product => {
        appendItem({
          productPriceId: product.productPriceId,
          offerGroupId: groupFields[currentGroupIndex].id || `group_${currentGroupIndex}`,
          quantity: 1,
          isDefaultSelected: false,
          useOriginalPrice: true,
          customPrice: 0,
          isActive: true
        });
      });
      
      // فتح قسم المجموعات والـ scroll إليه
      if (!showGroups) {
        setShowGroups(true);
      }
      scrollToElement(groupsSectionRef);
    } else {
      // إضافة العناصر خارج المجموعات
      selectedProducts.forEach(product => {
        appendItem({
          productPriceId: product.productPriceId,
          quantity: 1,
          isDefaultSelected: false,
          useOriginalPrice: true,
          customPrice: 0,
          isActive: true
        });
      });
      
      // فتح قسم العناصر العامة والـ scroll إليه
      if (!showItems) {
        setShowItems(true);
      }
      scrollToElement(itemsSectionRef);
    }
    
    setMultiSelectOpen(false);
    setCurrentGroupIndex(null);
  };

  const getGroupItems = (groupIndex: number) => {
    const groupId = groupFields[groupIndex].id || `group_${groupIndex}`;
    return itemFields.filter((_, index) => 
      watch(`offerItems.${index}.offerGroupId`) === groupId
    );
  };

  const getNonGroupItems = () => {
    return itemFields.filter((_, index) => 
      !watch(`offerItems.${index}.offerGroupId`)
    );
  };

  const getPreSelectedItems = () => {
    if (currentGroupIndex !== null) {
      const groupId = groupFields[currentGroupIndex].id || `group_${currentGroupIndex}`;
      return itemFields
        .filter((_, index) => watch(`offerItems.${index}.offerGroupId`) === groupId)
        .map((_, index) => watch(`offerItems.${index}.productPriceId`))
        .filter(Boolean);
    } else {
      return itemFields
        .filter((_, index) => !watch(`offerItems.${index}.offerGroupId`))
        .map((_, index) => watch(`offerItems.${index}.productPriceId`))
        .filter(Boolean);
    }
  };

  const submit = async (data: FormValues, saveAction: 'save' | 'saveAndNew') => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      if (mode === 'edit' && initialValues) {
        const updateData = {
          id: initialValues.id,
          name: data.name,
          priceType: data.priceType,
          fixedPrice: Number(data.fixedPrice),
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
          orderTypeId: data.orderTypeId,
          isActive: data.isActive,
          offerGroups: data.offerGroups.map(group => ({
            ...(group.id && { id: group.id }),
            ...(initialValues.id && { offerId: initialValues.id }),
            title: group.title,
            minSelection: Number(group.minSelection),
            maxSelection: Number(group.maxSelection),
            isMandatory: group.isMandatory,
            isActive: group.isActive
          })),
          offerItems: data.offerItems.map(item => ({
            ...(item.id && { id: item.id }),
            ...(initialValues.id && { offerId: initialValues.id }),
            productPriceId: item.productPriceId,
            offerGroupId: item.offerGroupId || null,
            quantity: Number(item.quantity),
            isDefaultSelected: item.isDefaultSelected,
            useOriginalPrice: item.useOriginalPrice,
            customPrice: item.useOriginalPrice ? null : Number(item.customPrice),
            isActive: item.isActive
          }))
        };
        await onSubmit(updateData, saveAction);
      } else {
        const addData = {
          name: data.name,
          priceType: data.priceType,
          fixedPrice: Number(data.fixedPrice),
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
          orderTypeId: data.orderTypeId,
          isActive: data.isActive,
          offerGroups: data.offerGroups.map(group => ({
            title: group.title,
            minSelection: Number(group.minSelection),
            maxSelection: Number(group.maxSelection),
            isMandatory: group.isMandatory,
            isActive: group.isActive
          })),
          offerItems: data.offerItems.map(item => ({
            productPriceId: item.productPriceId,
            offerGroupId: item.offerGroupId || null,
            quantity: Number(item.quantity),
            isDefaultSelected: item.isDefaultSelected,
            useOriginalPrice: item.useOriginalPrice,
            customPrice: item.useOriginalPrice ? null : Number(item.customPrice),
            isActive: item.isActive
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
      // Error handled by global error handler
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="xl" 
        fullWidth
        fullScreen={isMobile} // فل سكرين في الموبايل
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
              {/* Basic Info - مضغوط أكتر للموبايل */}
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

{/* الزرارين فوق التوجل - حجم صغير */}
<Grid item xs={12}>
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'flex-end', // في الجانب الأيمن
    gap: 1,
    mb: 1 // مساحة أقل
  }}>
    <Button
      variant="outlined"
      startIcon={<IconPlus />}
      onClick={addOfferGroup}
      size="small" // حجم صغير
    >
      {t('offers.form.addGroup')}
    </Button>
    <Button
      variant="outlined"
      startIcon={<IconShoppingCart />}
      onClick={addOfferItem}
      size="small" // حجم صغير
    >
      {t('offers.form.addItem')}
    </Button>
  </Box>
</Grid>

              {/* Offer Groups Section مع Toggle */}
              <Grid item xs={12} ref={groupsSectionRef}>
                <Divider sx={{ my: 1 }} />
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 1,
                  cursor: 'pointer'
                }} onClick={() => setShowGroups(!showGroups)}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconUsers size={20} />
                    <Typography variant="h6" sx={{ 
                      fontSize: isMobile ? '1rem' : '1.1rem' 
                    }}>
                      {t('offers.form.offerGroups')} ({groupFields.length})
                    </Typography>
                    <IconChevronDown 
                      size={16} 
                      style={{ 
                        transform: showGroups ? 'rotate(0deg)' : 'rotate(-90deg)',
                        transition: 'transform 0.2s'
                      }} 
                    />
                  </Box>
                </Box>

                <Collapse in={showGroups}>
                  <Box sx={{ mb: 2 }}>
                    {groupFields.length === 0 ? (
                      <Box sx={{ 
                        textAlign: 'center', 
                        py: isMobile ? 3 : 2, 
                        backgroundColor: 'grey.50', 
                        borderRadius: 1 
                      }}>
                        <Typography color="text.secondary" variant="body2">
                          {t('offers.form.noGroups')}
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 2 : 1.5 }}>
                        {groupFields.map((group, index) => (
                          <Card key={group.id} variant="outlined" sx={{ p: isMobile ? 1.5 : 1 }}>
                            <CardContent sx={{ p: isMobile ? '16px !important' : '12px !important' }}>
                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                mb: isMobile ? 2 : 1.5,
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
                                      size={isMobile ? "medium" : "small"}
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

                              <Grid container spacing={isMobile ? 2 : 1.5} sx={{ mb: isMobile ? 2 : 1.5 }}>
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
                                        size={isMobile ? "medium" : "small"}
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
                                        size={isMobile ? "medium" : "small"}
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
                                            size={isMobile ? "medium" : "small"}
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
                                            size={isMobile ? "medium" : "small"}
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
                                <Typography variant="subtitle2" sx={{ 
                                  mb: 1, 
                                  fontSize: isMobile ? '0.95rem' : '0.9rem' 
                                }}>
                                  {t('offers.form.groupItems')} ({getGroupItems(index).length})
                                </Typography>
                                {getGroupItems(index).length === 0 ? (
                                  <Box sx={{ 
                                    textAlign: 'center', 
                                    py: isMobile ? 2 : 1.5, 
                                    backgroundColor: 'grey.50', 
                                    borderRadius: 1 
                                  }}>
                                    <Typography variant="body2" color="text.secondary">
                                      {t('offers.form.noItemsInGroup')}
                                    </Typography>
                                  </Box>
                                ) : (
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {itemFields.map((item, itemIndex) => {
                                      const groupId = groupFields[index].id || `group_${index}`;
                                      if (watch(`offerItems.${itemIndex}.offerGroupId`) !== groupId) return null;
                                      
                                      const productPrice = productPrices.find(p => p.id === watch(`offerItems.${itemIndex}.productPriceId`));
                                      
                                      return (
                                        <Box key={item.id} sx={{ 
                                          display: 'flex', 
                                          alignItems: 'center', 
                                          gap: 1, 
                                          p: isMobile ? 1.5 : 1, 
                                          border: 1, 
                                          borderColor: 'grey.300', 
                                          borderRadius: 1,
                                          flexDirection: isMobile ? 'column' : 'row'
                                        }}>
                                          <Typography variant="body2" sx={{ 
                                            flex: 1, 
                                            fontSize: isMobile ? '0.9rem' : '0.85rem',
                                            textAlign: isMobile ? 'center' : 'left',
                                            mb: isMobile ? 1 : 0
                                          }}>
                                            {productPrice?.displayName || t('offers.form.selectProduct')}
                                          </Typography>
                                          <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 1,
                                            width: isMobile ? '100%' : 'auto',
                                            justifyContent: isMobile ? 'space-between' : 'flex-end'
                                          }}>
                                            <TextField
                                              label={t('offers.form.quantity')}
                                              type="number"
                                              size="small"
                                              sx={{ width: isMobile ? 80 : 70 }}
                                              value={watch(`offerItems.${itemIndex}.quantity`)}
                                              onChange={(e) => setValue(`offerItems.${itemIndex}.quantity`, Number(e.target.value))}
                                            />
                                            <FormControlLabel
                                              control={
                                                <Checkbox
                                                  checked={watch(`offerItems.${itemIndex}.isDefaultSelected`)}
                                                  onChange={(e) => setValue(`offerItems.${itemIndex}.isDefaultSelected`, e.target.checked)}
                                                  size="small"
                                                />
                                              }
                                              label={<Typography variant="caption">{t('offers.form.defaultSelected')}</Typography>}
                                            />
                                            <IconButton
                                              size="small"
                                              color="error"
                                              onClick={() => removeItem(itemIndex)}
                                            >
                                              <IconTrash size={14} />
                                            </IconButton>
                                          </Box>
                                        </Box>
                                      );
                                    })}
                                  </Box>
                                )}
                              </Box>
                            </CardContent>
                          </Card>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Collapse>
              </Grid>

              {/* Offer Items Section مع Toggle */}
              <Grid item xs={12} ref={itemsSectionRef}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 1,
                  cursor: 'pointer'
                }} onClick={() => setShowItems(!showItems)}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconShoppingCart size={20} />
                    <Typography variant="h6" sx={{ 
                      fontSize: isMobile ? '1rem' : '1.1rem' 
                    }}>
                      {t('offers.form.generalItems')} ({getNonGroupItems().length})
                    </Typography>
                    <IconChevronDown 
                      size={16} 
                      style={{ 
                        transform: showItems ? 'rotate(0deg)' : 'rotate(-90deg)',
                        transition: 'transform 0.2s'
                      }} 
                    />
                  </Box>
                </Box>

                <Collapse in={showItems}>
                  <Box sx={{ mb: 2 }}>
                    {getNonGroupItems().length === 0 ? (
                      <Box sx={{ 
                        textAlign: 'center', 
                        py: isMobile ? 3 : 2, 
                        backgroundColor: 'grey.50', 
                        borderRadius: 1 
                      }}>
                        <Typography color="text.secondary" variant="body2">
                          {t('offers.form.noItems')}
                        </Typography>
                      </Box>
                    ) : (
                      <Card variant="outlined" sx={{ p: isMobile ? 1.5 : 1 }}>
                        <CardContent sx={{ p: isMobile ? '16px !important' : '12px !important' }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {itemFields.map((item, index) => {
                              if (watch(`offerItems.${index}.offerGroupId`)) return null;
                              
                              const productPrice = productPrices.find(p => p.id === watch(`offerItems.${index}.productPriceId`));
                              
                              return (
                                <Box key={item.id} sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: 1, 
                                  p: isMobile ? 1.5 : 1, 
                                  border: 1, 
                                  borderColor: 'grey.300', 
                                  borderRadius: 1,
                                  flexDirection: isMobile ? 'column' : 'row'
                                }}>
                                  <Typography variant="body2" sx={{ 
                                    flex: 1, 
                                    fontSize: isMobile ? '0.9rem' : '0.85rem',
                                    textAlign: isMobile ? 'center' : 'left',
                                    mb: isMobile ? 1 : 0
                                  }}>
                                    {productPrice?.displayName || t('offers.form.selectProduct')}
                                  </Typography>
                                  <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1,
                                    width: isMobile ? '100%' : 'auto',
                                    justifyContent: isMobile ? 'space-between' : 'flex-end'
                                  }}>
                                    <TextField
                                      label={t('offers.form.quantity')}
                                      type="number"
                                      size="small"
                                      sx={{ width: isMobile ? 80 : 70 }}
                                      value={watch(`offerItems.${index}.quantity`)}
                                      onChange={(e) => setValue(`offerItems.${index}.quantity`, Number(e.target.value))}
                                    />
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={watch(`offerItems.${index}.isDefaultSelected`)}
                                          onChange={(e) => setValue(`offerItems.${index}.isDefaultSelected`, e.target.checked)}
                                          size="small"
                                        />
                                      }
                                      label={<Typography variant="caption">{t('offers.form.defaultSelected')}</Typography>}
                                    />
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => removeItem(index)}
                                    >
                                      <IconTrash size={14} />
                                    </IconButton>
                                  </Box>
                                </Box>
                              );
                            })}
                          </Box>
                        </CardContent>
                      </Card>
                    )}
                  </Box>
                </Collapse>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ 
            p: isMobile ? 2 : 2, 
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
          t('offers.form.selectGeneralItems')
        }
        preSelectedItems={getPreSelectedItems()}
      />
    </>
  );
};

export default OfferForm;
