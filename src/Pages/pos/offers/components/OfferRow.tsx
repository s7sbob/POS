// File: src/pages/pos/offers/components/OfferRow.tsx
import React from 'react';
import {
  Card, CardContent, Typography, Box, Chip, IconButton,
  Divider, Tooltip, Grid
} from '@mui/material';
import { IconEdit, IconCalendar, IconCurrencyDollar } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Offer } from 'src/utils/api/pagesApi/offersApi';

interface Props {
  offer: Offer;
  onEdit: () => void;
  isSelected?: boolean;
  canEdit?: boolean;
}

const OfferRow: React.FC<Props> = ({ 
  offer, onEdit, isSelected = false, canEdit = true 
}) => {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG');
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
              {offer.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t(`offers.form.${offer.priceType.toLowerCase()}`)}
            </Typography>
          </Box>
          
          <Chip
            label={offer.isActive ? t('common.active') : t('common.inactive')}
            color={offer.isActive ? 'success' : 'error'}
            size="small"
            variant={offer.isActive ? 'filled' : 'outlined'}
          />
        </Box>

        {/* Offer Info */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconCurrencyDollar size={16} />
              <Typography variant="body2" color="text.secondary">
                {t('offers.form.fixedPrice')}:
              </Typography>
            </Box>
            <Typography variant="body2" color="primary.main" fontWeight={600}>
              {offer.fixedPrice?.toFixed(2) || '0.00'} {t('common.currency')}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconCalendar size={16} />
              <Typography variant="body2" color="text.secondary">
                {t('offers.form.period')}:
              </Typography>
            </Box>
            <Typography variant="body2">
              {formatDate(offer.startDate)} - {formatDate(offer.endDate)}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              {t('offers.form.groups')}: {offer.offerGroups?.length || 0} | {t('offers.form.items')}: {offer.offerItems?.length || 0}
            </Typography>
          </Grid>
        </Grid>

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

export default OfferRow;
