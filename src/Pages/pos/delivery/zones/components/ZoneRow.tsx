// File: src/pages/delivery/zones/components/ZoneRow.tsx
import React from 'react';
import {
  Card, CardContent, Typography, Box, Chip, IconButton,
  Stack, Divider, Tooltip
} from '@mui/material';
import { IconEdit } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { DeliveryZone } from 'src/utils/api/pagesApi/deliveryZonesApi';

interface Props {
  zone: DeliveryZone;
  onEdit: () => void;
  isSelected?: boolean;
}

const ZoneRow: React.FC<Props> = ({ zone, onEdit, isSelected = false }) => {
  const { t } = useTranslation();

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        mb: 2,
        ...(isSelected && {
          borderColor: 'primary.main',
          backgroundColor: 'action.selected'
        })
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 0.5 }}>
              {zone.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {zone.branchName || t('deliveryZones.form.allBranches')}
            </Typography>
          </Box>
          
          <Chip
            label={zone.isActive ? t('common.active') : t('common.inactive')}
            color={zone.isActive ? 'success' : 'error'}
            size="small"
            variant={zone.isActive ? 'filled' : 'outlined'}
          />
        </Box>

        {/* Zone Info */}
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('deliveryZones.form.deliveryCharge')}:
            </Typography>
            <Typography variant="body2" color="primary.main" fontWeight={600}>
              {zone.deliveryCharge.toFixed(2)} {t('common.currency')}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('deliveryZones.form.defaultBonus')}:
            </Typography>
            <Typography variant="body2" color="success.main" fontWeight={600}>
              {zone.defaultBonus.toFixed(2)} {t('common.currency')}
            </Typography>
          </Box>
        </Stack>

        {/* Actions */}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Tooltip title={t('common.edit')}>
            <IconButton
              size="small"
              onClick={onEdit}
              color="primary"
            >
              <IconEdit size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ZoneRow;
