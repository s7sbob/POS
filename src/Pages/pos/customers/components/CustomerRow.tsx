// File: src/pages/pos/customers/components/CustomerRow.tsx
import React from 'react';
import {
  Card, CardContent, Typography, Box, Chip, IconButton,
  Stack, Divider, Tooltip, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { IconEdit, IconTrash, IconPhone, IconMapPin, IconChevronDown } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Customer } from 'src/utils/api/pagesApi/customersApi';

interface Props {
  customer: Customer;
  onEdit: () => void;
  onDelete: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const CustomerRow: React.FC<Props> = ({ 
  customer, onEdit, onDelete, canEdit = true, canDelete = true 
}) => {
  const { t } = useTranslation();

  const handlePhoneCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const getCustomerTypeChip = () => {
    if (customer.isBlocked) {
      return <Chip label={t('customers.form.blocked')} color="error" size="small" />;
    }
    if (customer.isVIP) {
      return <Chip label={t('customers.form.vip')} color="warning" size="small" />;
    }
    return <Chip label={t('customers.form.regular')} color="default" size="small" variant="outlined" />;
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 0.5 }}>
              {customer.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {getCustomerTypeChip()}
              <Chip
                label={customer.isActive ? t('common.active') : t('common.inactive')}
                color={customer.isActive ? 'success' : 'error'}
                size="small"
                variant={customer.isActive ? 'filled' : 'outlined'}
              />
            </Box>
          </Box>
        </Box>

        {/* Customer Info */}
        <Stack spacing={1} sx={{ mb: 2 }}>
          {/* Primary Phone */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('customers.form.phone1')}:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" fontFamily="monospace" fontWeight={500}>
                {customer.phone1}
              </Typography>
              <IconButton
                size="small"
                onClick={() => handlePhoneCall(customer.phone1)}
                color="primary"
                sx={{ p: 0.5 }}
              >
                <IconPhone size={16} />
              </IconButton>
            </Box>
          </Box>

          {/* Additional Phones */}
          {[customer.phone2, customer.phone3, customer.phone4].filter(Boolean).map((phone, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t(`customers.form.phone${index + 2}`)}:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" fontFamily="monospace">
                  {phone}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => handlePhoneCall(phone!)}
                  color="primary"
                  sx={{ p: 0.5 }}
                >
                  <IconPhone size={16} />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Stack>

        {/* Addresses */}
        {customer.addresses.length > 0 && (
          <Accordion sx={{ mt: 2, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
            <AccordionSummary expandIcon={<IconChevronDown />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconMapPin size={16} />
                <Typography variant="body2" fontWeight={500}>
                  {customer.addresses.length} {t('customers.form.addressCount')}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                {customer.addresses.map((address, index) => (
                  <Box key={address.id || index} sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                      {address.addressLine}
                    </Typography>
                    {address.zoneName && (
                      <Typography variant="caption" color="primary.main">
                        {address.zoneName}
                      </Typography>
                    )}
                    {(address.floor || address.apartment) && (
                      <Typography variant="caption" display="block" color="text.secondary">
                        {address.floor && `${t('customers.form.floor')}: ${address.floor}`}
                        {address.floor && address.apartment && ' - '}
                        {address.apartment && `${t('customers.form.apartment')}: ${address.apartment}`}
                      </Typography>
                    )}
                    {address.landmark && (
                      <Typography variant="caption" display="block" color="text.secondary">
                        {t('customers.form.landmark')}: {address.landmark}
                      </Typography>
                    )}
                    {address.notes && (
                      <Typography variant="caption" display="block" color="text.secondary">
                        {t('customers.form.notes')}: {address.notes}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Actions */}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          {canEdit && (
            <Tooltip title={t('common.edit')}>
              <IconButton
                size="small"
                onClick={onEdit}
                color="primary"
              >
                <IconEdit size={18} />
              </IconButton>
            </Tooltip>
          )}
          
          {canDelete && (
            <Tooltip title={t('common.delete')}>
              <IconButton
                size="small"
                onClick={onDelete}
                color="error"
              >
                <IconTrash size={18} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CustomerRow;
