// src/Pages/pos/newSales/components/CustomerDetailsPopup.tsx
import React, { useState, useEffect } from 'react';
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
        maxWidth="md" 
        fullWidth
        PaperProps={{
          style: { minHeight: '600px' }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">بيانات العميل</Typography>
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
                المعلومات الأساسية
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <TextField
                  label="الاسم"
                  value={updatedCustomer.name}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                />
                <TextField
                  label="الهاتف الأساسي"
                  value={updatedCustomer.phone1}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                />
                {updatedCustomer.phone2 && (
                  <TextField
                    label="الهاتف الثاني"
                    value={updatedCustomer.phone2}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                )}
                {updatedCustomer.phone3 && (
                  <TextField
                    label="الهاتف الثالث"
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
                    عميل VIP
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
                    محظور
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>

          <Divider sx={{ my: 2 }} />

          {/* Address Selection */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            اختر العنوان للطلب ({updatedCustomer.addresses.length})
          </Typography>
          
          <RadioGroup
            value={selectedAddressId}
            onChange={(e) => handleAddressSelect(e.target.value)}
          >
            {updatedCustomer.addresses.map((address) => (
              <FormControlLabel
                key={address.id}
                value={address.id}
                control={<Radio />}
                label={
                  <Card 
                    sx={{ 
                      width: '100%', 
                      ml: 1,
                      border: selectedAddressId === address.id ? '2px solid #1976d2' : '1px solid #e0e0e0'
                    }}
                  >
                    <CardContent sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <LocationIcon color="primary" />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" fontWeight="bold">
                            {address.addressLine}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            المنطقة: {getZoneName(address.zoneId)}
                          </Typography>
                          <Typography variant="body2" color="primary">
                            رسوم التوصيل: {getDeliveryCharge(address.zoneId)} جنيه
                          </Typography>
                          
                          {address.floor && (
                            <Typography variant="body2" color="text.secondary">
                              الدور: {address.floor}
                            </Typography>
                          )}
                          {address.apartment && (
                            <Typography variant="body2" color="text.secondary">
                              الشقة: {address.apartment}
                            </Typography>
                          )}
                          {address.landmark && (
                            <Typography variant="body2" color="text.secondary">
                              علامة مميزة: {address.landmark}
                            </Typography>
                          )}
                          {address.notes && (
                            <Typography variant="body2" color="text.secondary">
                              ملاحظات: {address.notes}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                }
                sx={{ 
                  alignItems: 'flex-start',
                  mb: 1,
                  ml: 0,
                  mr: 0
                }}
              />
            ))}
          </RadioGroup>

          {updatedCustomer.addresses.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                لا توجد عناوين مسجلة لهذا العميل
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>
            إلغاء
          </Button>
          <Button 
            variant="contained" 
            onClick={handleConfirmSelection}
            disabled={!selectedAddressId}
          >
            حفظ واختيار
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
