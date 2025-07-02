// File: src/pages/delivery/companies/components/CompanyRow.tsx
import React from 'react';
import {
  Card, CardContent, Typography, Box, Chip, IconButton,
  Stack, Divider, Tooltip, Grid
} from '@mui/material';
import { IconEdit, IconPhone, IconMail, IconUser, IconCreditCard } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { DeliveryCompany } from 'src/utils/api/pagesApi/deliveryCompaniesApi';

interface Props {
  company: DeliveryCompany;
  onEdit: () => void;
  isSelected?: boolean;
  canEdit?: boolean;
}

const CompanyRow: React.FC<Props> = ({ 
  company, onEdit, isSelected = false, canEdit = true 
}) => {
  const { t } = useTranslation();

  const handlePhoneCall = () => {
    window.open(`tel:${company.phone}`, '_self');
  };

  const handleEmailOpen = () => {
    window.open(`mailto:${company.email}`, '_self');
  };

  return (
    <Card variant="outlined" sx={{ 
      mb: 2,
      ...(isSelected && {
        borderColor: 'primary.main',
        backgroundColor: 'action.selected'
      })
    }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 0.5 }}>
              {company.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<IconCreditCard size={14} />}
                label={t(`deliveryCompanies.form.${company.paymentType.toLowerCase()}`)}
                size="small"
                variant="outlined"
                color="primary"
              />
            </Box>
          </Box>
          
          <Chip
            label={company.isActive ? t('common.active') : t('common.inactive')}
            color={company.isActive ? 'success' : 'error'}
            size="small"
            variant={company.isActive ? 'filled' : 'outlined'}
          />
        </Box>

        {/* Company Info */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <IconPhone size={16} />
              <Typography variant="body2" color="text.secondary">
                {t('deliveryCompanies.form.phone')}:
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" fontFamily="monospace" fontWeight={500}>
                {company.phone}
              </Typography>
              <IconButton
                size="small"
                onClick={handlePhoneCall}
                color="primary"
                sx={{ p: 0.5 }}
              >
                <IconPhone size={14} />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <IconMail size={16} />
              <Typography variant="body2" color="text.secondary">
                {t('deliveryCompanies.form.email')}:
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                {company.email}
              </Typography>
              <IconButton
                size="small"
                onClick={handleEmailOpen}
                color="primary"
                sx={{ p: 0.5 }}
              >
                <IconMail size={14} />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <IconUser size={16} />
              <Typography variant="body2" color="text.secondary">
                {t('deliveryCompanies.form.contactPerson')}:
              </Typography>
            </Box>
            <Typography variant="body2" fontWeight={500}>
              {company.contactPerson}
            </Typography>
          </Grid>
        </Grid>

        {/* Percentages */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {t('deliveryCompanies.form.percentages')}:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5}>
            <Chip
              label={`${t('deliveryCompanies.form.companyShare')}: ${company.companySharePercentage}%`}
              size="small"
              variant="outlined"
              color="primary"
            />
            <Chip
              label={`${t('deliveryCompanies.form.visaCommission')}: ${company.visaCollectionCommissionPercentage}%`}
              size="small"
              variant="outlined"
              color="secondary"
            />
            <Chip
              label={`${t('deliveryCompanies.form.tax')}: ${company.taxPercentage}%`}
              size="small"
              variant="outlined"
              color="warning"
            />
          </Stack>
        </Box>

        {/* Notes */}
        {company.notes && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {t('deliveryCompanies.form.notes')}:
            </Typography>
            <Typography variant="body2">
              {company.notes}
            </Typography>
          </Box>
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
        </Box>
      </CardContent>
    </Card>
  );
};

export default CompanyRow;
