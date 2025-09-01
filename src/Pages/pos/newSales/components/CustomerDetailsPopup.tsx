// src/Pages/pos/newSales/components/CustomerDetailsPopup.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography, Card, CardContent,
  Radio, RadioGroup, FormControlLabel, Divider, IconButton
} from '@mui/material';
import { Customer, CustomerAddress } from 'src/utils/api/pagesApi/customersApi';
import * as customersApi from 'src/utils/api/pagesApi/customersApi';
import * as deliveryZonesApi from 'src/utils/api/pagesApi/deliveryZonesApi';
import { Edit as EditIcon, LocationOn as LocationIcon } from '@mui/icons-material';
import CustomerForm from '../../customers/components/CustomerForm';

interface CustomerDetailsPopupProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onSelectCustomer: (customer: Customer, address: CustomerAddress) => void;
}

const CustomerDetailsPopup: React.FC<CustomerDetailsPopupProps> = ({
  open,
  customer,
  onClose,
  onSelectCustomer
}) => {
  const { t } = useTranslation();
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [zones, setZones] = useState<any[]>([]);
  const [updatedCustomer, setUpdatedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    if (customer) {
      setUpdatedCustomer(customer);
      setSelectedAddressId('');
    }
  }, [customer]);

  useEffect(() => {
    const loadZones = async () => {
      try {
        const zonesData = await deliveryZonesApi.getAll();
        setZones(zonesData);
      } catch (error) {
        console.error('Error loading zones:', error);
      }
    };
    
    if (open) {
      loadZones();
    }
  }, [open]);

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
  };

  const handleConfirmSelection = () => {
    if (updatedCustomer && selectedAddressId) {
      const selectedAddress = updatedCustomer.addresses.find(
        addr => addr.id === selectedAddressId
      );
      if (selectedAddress) {
        onSelectCustomer(updatedCustomer, selectedAddress);
        onClose();
      }
    }
  };

  const handleEditCustomer = () => {
    setShowEditForm(true);
  };

  const handleCustomerUpdate = async (data: any) => {
    try {
      const updated = await customersApi.update(data);
      setUpdatedCustomer(updated);
      setShowEditForm(false);
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const getZoneName = (zoneId: string): string => {
    const zone = zones.find(z => z.id === zoneId);
    return zone ? zone.name : 'غير محدد';
  };

  const getDeliveryCharge = (zoneId: string): number => {
    const zone = zones.find(z => z.id === zoneId);
    return zone ? zone.deliveryCharge : 0;
  };

  if (!updatedCustomer) return null;

  return (
    <>
      <Dialog 
        open={open && !showEditForm} 
        onClose={onClose} 
        maxWidth="lg" // ✅ تكبير عرض الـ Dialog لاستيعاب الكروت جنب بعض
        fullWidth
        PaperProps={{
          style: { minHeight: '600px' }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{t("pos.newSales.customer.details")}</Typography>
            <IconButton onClick={handleEditCustomer} color="primary">
              <EditIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {/* Customer Basic Info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t("pos.newSales.customer.basicInfo")}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <TextField
                  label={t("pos.newSales.customer.name")}
                  value={updatedCustomer.name}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                />
                <TextField
                  label={t("pos.newSales.customer.phone1")}
                  value={updatedCustomer.phone1}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                />
                {updatedCustomer.phone2 && (
                  <TextField
                    label={t("pos.newSales.customer.phone2")}
                    value={updatedCustomer.phone2}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                )}
                {updatedCustomer.phone3 && (
                  <TextField
                    label={t("pos.newSales.customer.phone3")}
                    value={updatedCustomer.phone3}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                )}
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                {updatedCustomer.isVIP && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      bgcolor: 'gold', 
                      color: 'white', 
                      px: 1, 
                      py: 0.5, 
                      borderRadius: 1 
                    }}
                  >
                    {t("pos.newSales.customer.vip")}
                  </Typography>
                )}
                {updatedCustomer.isBlocked && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      bgcolor: '#f44336', 
                      color: 'white', 
                      px: 1, 
                      py: 0.5, 
                      borderRadius: 1 
                    }}
                  >
                    {t("pos.newSales.customer.blocked")}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>

          <Divider sx={{ my: 2 }} />

          {/* Address Selection */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t("pos.newSales.customer.selectAddress", { count: updatedCustomer.addresses.length })}
          </Typography>
          
          {/* ✅ تعديل RadioGroup لعرض الكروت جنب بعض */}
          {/* <RadioGroup
            value={selectedAddressId}
            onChange={(e) => handleAddressSelect(e.target.value)}
            sx={{ 
              display: 'flex', 
              flexDirection: 'row', 
              flexWrap: 'wrap', 
              gap: 2,
              '& .MuiFormControlLabel-root': {
                margin: 0,
                alignItems: 'flex-start'
              }
            }}
          >
            {updatedCustomer.addresses.map((address) => (
              <FormControlLabel
                key={address.id}
                value={address.id}
                control={
                  <Radio 
                    sx={{ 
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      zIndex: 1,
                      bgcolor: 'white',
                      borderRadius: '50%'
                    }} 
                  />
                }
                label=""
                sx={{ 
                  position: 'relative',
                  margin: 0,
                  flexBasis: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 10.667px)' }, // responsive width
                  maxWidth: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 10.667px)' }
                }}
              />
            ))}
          </RadioGroup> */}

          {/* ✅ عرض الكروت منفصلة عن الـ RadioGroup */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 2,
              mt: 0.5
            }}
          >
            {updatedCustomer.addresses.map((address) => (
              <Card 
                key={`card-${address.id}`}
                sx={{ 
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease-in-out',
                  border: selectedAddressId === address.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)'
                  },
                  minHeight: '200px' // ✅ حد أدنى للارتفاع لتوحيد شكل الكروت
                }}
                onClick={() => handleAddressSelect(address.id)}
              >
                <CardContent sx={{ py: 2, position: 'relative', pt: 5 }}>
                  {/* ✅ Radio button في الزاوية */}
                  <Radio
                    checked={selectedAddressId === address.id}
                    sx={{ 
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      zIndex: 1,
                      bgcolor: 'rgba(255,255,255,0.9)',
                      borderRadius: '50%'
                    }}
                  />
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 1 }}>
                    <LocationIcon color="primary" sx={{ mt: 0.5 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
                        {address.addressLine}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {t("pos.newSales.customer.zone")}: {getZoneName(address.zoneId)}
                      </Typography>
                      <Typography variant="body2" color="primary" sx={{ mb: 1, fontWeight: 'medium' }}>
                        {t("pos.newSales.customer.deliveryCharge")}: {getDeliveryCharge(address.zoneId)} {t("pos.newSales.products.currency")}
                      </Typography>
                      
                      {/* ✅ تفاصيل إضافية في صندوق منفصل */}
                      {(address.floor || address.apartment || address.landmark || address.notes) && (
                        <Box sx={{ 
                          bgcolor: '#f5f5f5', 
                          p: 1, 
                          borderRadius: 1, 
                          mt: 1,
                          fontSize: '0.75rem'
                        }}>
                          {address.floor && (
                            <Typography variant="caption" display="block" color="text.secondary">
                              {t("pos.newSales.customer.floor")}: {address.floor}
                            </Typography>
                          )}
                          {address.apartment && (
                            <Typography variant="caption" display="block" color="text.secondary">
                              {t("pos.newSales.customer.apartment")}: {address.apartment}
                            </Typography>
                          )}
                          {address.landmark && (
                            <Typography variant="caption" display="block" color="text.secondary">
                              {t("pos.newSales.customer.landmark")}: {address.landmark}
                            </Typography>
                          )}
                          {address.notes && (
                            <Typography variant="caption" display="block" color="text.secondary">
                              {t("pos.newSales.customer.notes")}: {address.notes}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {updatedCustomer.addresses.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                {t("pos.newSales.customer.noAddresses")}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>
            {t("pos.newSales.actions.cancel")}
          </Button>
          <Button 
            variant="contained" 
            onClick={handleConfirmSelection}
            disabled={!selectedAddressId}
          >
            {t("pos.newSales.customer.saveAndSelect")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Customer Edit Form */}
      {showEditForm && (
        <CustomerForm
          open={showEditForm}
          mode="edit"
          initialValues={updatedCustomer}
          onClose={() => setShowEditForm(false)}
          onSubmit={handleCustomerUpdate}
        />
      )}
    </>
  );
};

export default CustomerDetailsPopup;
