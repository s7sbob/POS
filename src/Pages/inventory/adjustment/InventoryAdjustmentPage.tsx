// File: src/pages/inventory/adjustment/InventoryAdjustmentPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  useMediaQuery,
  useTheme,
  Alert,
  Snackbar,
  Typography,
  Box,
  Paper
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as adjustmentApi from 'src/utils/api/pagesApi/inventoryAdjustmentApi';
import * as warehousesApi from 'src/utils/api/pagesApi/warehousesApi';
import { Warehouse } from 'src/utils/api/pagesApi/warehousesApi';
import AdjustmentHeader from './components/AdjustmentHeader';
import AdjustmentForm from './components/AdjustmentForm';
import AdjustmentItemsTable from './components/AdjustmentItemsTable';
import AdjustmentItemsCards from './components/AdjustmentItemsCards';
import NewAdjustmentDialog from './components/NewAdjustmentDialog';
import ProductSearchBox from './components/ProductSearchBox';

type FormValues = {
  warehouseId: string;
  adjustmentType: number;
  reason: string;
  referenceNumber: string;
  details: Array<{
    detailsAdjustmentId: string;
    productId: string;
    productPriceId: string;
    productName: string;
    unitName: string;
    oldQuantity: number;
    newQuantity: number;
    unitFactor: number;
    diffQty: number;
    notes: string;
    barcode?: string;
  }>;
};

const InventoryAdjustmentPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [adjustment, setAdjustment] = useState<adjustmentApi.InventoryAdjustment | null>(null);
  const [, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('error');
  const [showNewAdjustmentDialog, setShowNewAdjustmentDialog] = useState(false);
  const [selectedAdjustmentType, setSelectedAdjustmentType] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDetails, setFilteredDetails] = useState<any[]>([]);

  const { control, handleSubmit, reset, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      warehouseId: '',
      adjustmentType: 0,
      reason: '',
      referenceNumber: '',
      details: []
    }
  });

  const watchedWarehouseId = watch('warehouseId');
  const watchedDetails = watch('details');

  useEffect(() => {
    loadWarehouses();
  }, []);

  useEffect(() => {
    if (watchedWarehouseId) {
      loadAdjustment(watchedWarehouseId);
    }
  }, [watchedWarehouseId]);

  useEffect(() => {
    watchedDetails.forEach((detail, index) => {
      const diffQty = detail.newQuantity - detail.oldQuantity;
      if (detail.diffQty !== diffQty) {
        setValue(`details.${index}.diffQty`, diffQty);
      }
    });
  }, [watchedDetails, setValue]);

  useEffect(() => {
    if (!adjustment?.details) {
      setFilteredDetails([]);
      return;
    }

    if (!searchQuery.trim()) {
      setFilteredDetails(adjustment.details);
      return;
    }

    const filtered = adjustment.details.filter(detail => {
      const searchLower = searchQuery.toLowerCase();
      return (
        detail.productName.toLowerCase().includes(searchLower) ||
        detail.unitName.toLowerCase().includes(searchLower) ||
        (detail.barcode && detail.barcode.toLowerCase().includes(searchLower))
      );
    });

    setFilteredDetails(filtered);
  }, [adjustment?.details, searchQuery]);

  const loadWarehouses = async () => {
    try {
      const data = await warehousesApi.getAll();
      setWarehouses(data);
    } catch (error) {
      setAlertMessage(t('adjustment.errors.loadWarehousesFailed'));
      setAlertSeverity('error');
    }
  };

  const loadAdjustment = async (warehouseId: string) => {
    try {
      setLoading(true);
      const data = await adjustmentApi.getOrCreatePendingAdjustment(warehouseId);
      setAdjustment(data);

      if (data.adjustmentType === 0) {
        setShowNewAdjustmentDialog(true);
        setSelectedAdjustmentType(0);
      } else {
        setSelectedAdjustmentType(data.adjustmentType);
        populateForm(data);
      }
    } catch (error) {
      setAlertMessage(t('adjustment.errors.loadAdjustmentFailed'));
      setAlertSeverity('error');
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (data: adjustmentApi.InventoryAdjustment) => {
    reset({
      warehouseId: data.warehouseId,
      adjustmentType: data.adjustmentType,
      reason: data.reason || '',
      referenceNumber: data.referenceNumber || '',
      details: data.details.map(d => ({
        detailsAdjustmentId: d.detailsAdjustmentId,
        productId: d.productId,
        productPriceId: d.productPriceId,
        productName: d.productName,
        unitName: d.unitName,
        oldQuantity: d.oldQuantity,
        newQuantity: d.newQuantity,
        unitFactor: d.unitFactor,
        diffQty: d.diffQty,
        notes: d.notes || '',
        barcode: d.barcode || ''
      }))
    });
  };

  const handleNewAdjustmentConfirm = (adjustmentType: number) => {
    setSelectedAdjustmentType(adjustmentType);
    setValue('adjustmentType', adjustmentType);
    
    if (adjustment) {
      populateForm(adjustment);
    }
    
    setShowNewAdjustmentDialog(false);
    setAlertMessage(t('adjustment.messages.newAdjustmentStarted'));
    setAlertSeverity('success');
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    setValue(`details.${index}.newQuantity`, newQuantity);
    const oldQuantity = watch(`details.${index}.oldQuantity`);
    const diffQty = newQuantity - oldQuantity;
    setValue(`details.${index}.diffQty`, diffQty);
  };

  const handleSave = async () => {
    handleSubmit(async (data) => {
      if (isSubmitting || !adjustment?.adjustmentId) return;

      try {
        setIsSubmitting(true);
        
        const updateData = {
          adjustmentId: adjustment.adjustmentId,
          adjustmentType: selectedAdjustmentType,
          reason: data.reason,
          referenceNumber: data.referenceNumber,
          warehouseId: data.warehouseId,
          status: 1,
          details: data.details.map(d => ({
            detailsAdjustmentId: d.detailsAdjustmentId,
            adjustmentId: adjustment.adjustmentId,
            productId: d.productId,
            productPriceId: d.productPriceId,
            productName: d.productName,
            unitName: d.unitName,
            oldQuantity: d.oldQuantity,
            newQuantity: d.newQuantity,
            unitFactor: d.unitFactor,
            diffQty: d.diffQty,
            notes: d.notes,
            branchID: null,
            companyID: null,
            isActive: true
          }))
        };

        const result = await adjustmentApi.updateAdjustment(updateData);
        setAdjustment(result);
        setAlertMessage(t('adjustment.messages.saveSuccess'));
        setAlertSeverity('success');
      } catch (error) {
        setAlertMessage(t('adjustment.errors.saveFailed'));
        setAlertSeverity('error');
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  const handleSubmitAdjustment = async () => {
    handleSubmit(async (data) => {
      if (isSubmitting || !adjustment?.adjustmentId) return;

      try {
        setIsSubmitting(true);
        
        const updateData = {
          adjustmentId: adjustment.adjustmentId,
          adjustmentType: selectedAdjustmentType,
          reason: data.reason,
          referenceNumber: data.referenceNumber,
          warehouseId: data.warehouseId,
          status: 3,
          details: data.details.map(d => ({
            detailsAdjustmentId: d.detailsAdjustmentId,
            adjustmentId: adjustment.adjustmentId,
            productId: d.productId,
            productPriceId: d.productPriceId,
            productName: d.productName,
            unitName: d.unitName,
            oldQuantity: d.oldQuantity,
            newQuantity: d.newQuantity,
            unitFactor: d.unitFactor,
            diffQty: d.diffQty,
            notes: d.notes,
            branchID: null,
            companyID: null,
            isActive: true
          }))
        };

        const result = await adjustmentApi.updateAdjustment(updateData);
        setAdjustment(result);
        setAlertMessage(t('adjustment.messages.submitSuccess'));
        setAlertSeverity('success');
        
        if (watchedWarehouseId) {
          setTimeout(() => loadAdjustment(watchedWarehouseId), 1000);
        }
      } catch (error) {
        setAlertMessage(t('adjustment.errors.submitFailed'));
        setAlertSeverity('error');
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  const handleRefresh = () => {
    if (watchedWarehouseId) {
      loadAdjustment(watchedWarehouseId);
    }
  };

  const scrollToProductAndFocus = (productId: string) => {
    const element = document.getElementById(`product-row-${productId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.style.backgroundColor = '#fff3cd';
      
      focusOnQuantityField(productId);
      
      setTimeout(() => {
        element.style.backgroundColor = '';
      }, 2000);
    }
  };

  const focusOnQuantityField = (productId: string) => {
    if (!adjustment?.details) return;
    
    const productIndex = adjustment.details.findIndex(detail => detail.productId === productId);
    if (productIndex !== -1) {
      setTimeout(() => {
        const quantityInput = document.getElementById(`quantity-${productId}`) as HTMLInputElement;
        if (quantityInput) {
          quantityInput.focus();
          quantityInput.select();
        }
      }, 300);
    }
  };

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 1, sm: 2 },
        maxWidth: '100vw',
        overflow: 'hidden'
      }}
    >
      <AdjustmentHeader
        isSubmitting={isSubmitting}
        hasAdjustment={!!adjustment}
        warehouseId={watchedWarehouseId}
        onSave={handleSave}
        onSubmit={handleSubmitAdjustment}
        onRefresh={handleRefresh}
      />

      {!watchedWarehouseId && (
        <Paper sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: { xs: 2, sm: 3 }, 
          backgroundColor: 'info.light', 
          border: '1px solid', 
          borderColor: 'info.main',
          borderRadius: { xs: 1, sm: 2 }
        }}>
          <Typography 
            variant={isMobile ? "body1" : "h6"} 
            color="info.dark" 
            sx={{ 
              textAlign: 'center',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            {t('adjustment.messages.selectWarehouseToStart')}
          </Typography>
        </Paper>
      )}

      <Box sx={{ mb: { xs: 1, sm: 2 } }}>
        <AdjustmentForm
          control={control}
          warehouses={warehouses}
          hasAdjustment={!!adjustment}
          adjustmentType={selectedAdjustmentType}
          isReadOnly={selectedAdjustmentType !== 0}
        />
      </Box>

      {adjustment && (
        <Box sx={{ mb: { xs: 1, sm: 2 } }}>
          <ProductSearchBox
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filteredDetails={filteredDetails}
            onProductSelect={scrollToProductAndFocus}
            onProductFocus={focusOnQuantityField}
          />
        </Box>
      )}

      {adjustment && (
        <Box sx={{ 
          width: '100%',
          overflow: 'hidden',
          '& .MuiPaper-root': {
            borderRadius: { xs: 1, sm: 2 },
          }
        }}>
          {isMobile ? (
            <AdjustmentItemsCards
              control={control}
              details={filteredDetails}
              itemsCount={filteredDetails.length}
              onQuantityChange={handleQuantityChange}
              watch={watch}
            />
          ) : (
            <AdjustmentItemsTable
              control={control}
              details={watchedDetails}
              itemsCount={filteredDetails.length}
              onQuantityChange={handleQuantityChange}
              watch={watch}
              rawDetails={filteredDetails}
              searchQuery={searchQuery}
            />
          )}
        </Box>
      )}

      <NewAdjustmentDialog
        open={showNewAdjustmentDialog}
        onClose={() => setShowNewAdjustmentDialog(false)}
        onConfirm={handleNewAdjustmentConfirm}
      />

      <Snackbar
        open={!!alertMessage}
        autoHideDuration={6000}
        onClose={() => setAlertMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setAlertMessage('')}
          severity={alertSeverity}
          sx={{ 
            width: '100%',
            maxWidth: { xs: '90vw', sm: 'auto' }
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default InventoryAdjustmentPage;
