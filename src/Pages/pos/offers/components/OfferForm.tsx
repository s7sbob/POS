// File: src/pages/pos/offers/components/OfferForm.tsx
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem,
  Switch, FormControlLabel, Card, CardContent, IconButton, Divider, Box,
  Accordion, AccordionSummary, AccordionDetails, Autocomplete
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
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [, setGroups] = React.useState<any[]>([]);
  const [, setProducts] = React.useState<any[]>([]);
  const [productPrices, setProductPrices] = React.useState<any[]>([]);

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

  const { control, handleSubmit, reset, watch, formState: { isSubmitSuccessful } } = useForm<FormValues>({
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
        
        // تحويل Groups إلى flat array
        const flatGroups = flattenGroups(groupsData);
        setGroups(flatGroups);
        setProducts(productsData.data);

        // جمع كل ProductPrices من كل المنتجات
        const allProductPrices = productsData.data.flatMap(product => 
          product.productPrices.map(price => ({
            ...price,
            productName: product.name,
            displayName: `${product.name} - ${price.posPriceName || 'Default'}`
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
  }, [open]);

  // دالة لتحويل Groups الشجرية إلى flat array
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

  const addOfferGroup = () => {
    appendGroup({
      title: '',
      minSelection: 1,
      maxSelection: 1,
      isMandatory: true,
      isActive: true
    });
  };

  const addOfferItem = () => {
    appendItem({
      productPriceId: '',
      quantity: 1,
      isDefaultSelected: false,
      useOriginalPrice: true,
      customPrice: 0,
      isActive: true
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
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {mode === 'add' ? t('offers.add') : t('offers.edit')}
      </DialogTitle>

      <form>
        <DialogContent>
          <Grid container spacing={1.5}>
            {/* Basic Info */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {t('offers.form.basicInfo')}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
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
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="priceType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
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

            <Grid item xs={12} md={6}>
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
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="orderTypeId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
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

            <Grid item xs={12} md={6}>
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
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
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

            {/* Offer Groups Section */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<IconChevronDown />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconUsers size={20} />
                    <Typography variant="h6">
                      {t('offers.form.offerGroups')} ({groupFields.length})
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<IconPlus />}
                      onClick={addOfferGroup}
                      size="small"
                    >
                      {t('offers.form.addGroup')}
                    </Button>
                  </Box>

                  {groupFields.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
                      <Typography color="text.secondary">
                        {t('offers.form.noGroups')}
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {groupFields.map((group, index) => (
                        <Card key={group.id} variant="outlined">
                          <CardContent sx={{ pb: '16px !important' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="subtitle2">
                                {t('offers.form.group')} {index + 1}
                              </Typography>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => removeGroup(index)}
                              >
                                <IconTrash size={16} />
                              </IconButton>
                            </Box>

                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <Controller
                                  name={`offerGroups.${index}.title`}
                                  control={control}
                                  rules={{ required: t('offers.groupTitleRequired') }}
                                  render={({ field, fieldState }) => (
                                    <TextField
                                      {...field}
                                      label={t('offers.form.groupTitle')}
                                      fullWidth
                                      required
                                      error={!!fieldState.error}
                                      helperText={fieldState.error?.message}
                                      size="small"
                                    />
                                  )}
                                />
                              </Grid>

                              <Grid item xs={6} md={3}>
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

                              <Grid item xs={6} md={3}>
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

                              <Grid item xs={6} md={3}>
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

                              <Grid item xs={6} md={3}>
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
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            </Grid>

            {/* Offer Items Section */}
            <Grid item xs={12}>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<IconChevronDown />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconShoppingCart size={20} />
                    <Typography variant="h6">
                      {t('offers.form.offerItems')} ({itemFields.length})
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<IconPlus />}
                      onClick={addOfferItem}
                      size="small"
                    >
                      {t('offers.form.addItem')}
                    </Button>
                  </Box>

                  {itemFields.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
                      <Typography color="text.secondary">
                        {t('offers.form.noItems')}
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {itemFields.map((item, index) => (
                        <Card key={item.id} variant="outlined">
                          <CardContent sx={{ pb: '16px !important' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="subtitle2">
                                {t('offers.form.item')} {index + 1}
                              </Typography>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => removeItem(index)}
                              >
                                <IconTrash size={16} />
                              </IconButton>
                            </Box>

                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <Controller
                                  name={`offerItems.${index}.productPriceId`}
                                  control={control}
                                  rules={{ required: t('offers.productRequired') }}
                                  render={({ field, fieldState }) => (
                                    <Autocomplete
                                      {...field}
                                      options={productPrices}
                                      getOptionLabel={(option) => option.displayName || ''}
                                      value={productPrices.find(p => p.id === field.value) || null}
                                      onChange={(_, value) => field.onChange(value?.id || '')}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          label={t('offers.form.product')}
                                          required
                                          error={!!fieldState.error}
                                          helperText={fieldState.error?.message}
                                          size="small"
                                        />
                                      )}
                                      renderOption={(props, option) => (
                                        <Box component="li" {...props}>
                                          <Box>
                                            <Typography variant="body2">
                                              {option.productName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                              {option.posPriceName} - {option.price} {t('common.currency')}
                                            </Typography>
                                          </Box>
                                        </Box>
                                      )}
                                    />
                                  )}
                                />
                              </Grid>

                              <Grid item xs={6} md={2}>
                                <Controller
                                  name={`offerItems.${index}.quantity`}
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      label={t('offers.form.quantity')}
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
                                  name={`offerItems.${index}.useOriginalPrice`}
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
                                      label={t('offers.form.useOriginalPrice')}
                                    />
                                  )}
                                />
                              </Grid>

                              {!watch(`offerItems.${index}.useOriginalPrice`) && (
                                <Grid item xs={6} md={3}>
                                  <Controller
                                    name={`offerItems.${index}.customPrice`}
                                    control={control}
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        label={t('offers.form.customPrice')}
                                        type="number"
                                        fullWidth
                                        size="small"
                                        inputProps={{ min: 0, step: 0.01 }}
                                      />
                                    )}
                                  />
                                </Grid>
                              )}

                              <Grid item xs={6} md={3}>
                                <Controller
                                  name={`offerItems.${index}.isDefaultSelected`}
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
                                      label={t('offers.form.defaultSelected')}
                                    />
                                  )}
                                />
                              </Grid>

                              <Grid item xs={6} md={3}>
                                <Controller
                                  name={`offerItems.${index}.isActive`}
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
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
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
            {t('offers.saveAndExit')}
          </Button>
          
          <Button 
            variant="contained"
            startIcon={<IconPlusNew size={20} />}
            onClick={handleSubmit((data) => submit(data, 'saveAndNew'))}
            disabled={isSubmitting}
          >
            {t('offers.saveAndNew')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default OfferForm;
