// File: src/pages/pos/hall-captains/components/CaptainRow.tsx
import React from 'react';
import {
  Card, CardContent, Typography, Box, Chip, IconButton,
  Stack, Divider, Tooltip
} from '@mui/material';
import { IconEdit, IconPhone } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { HallCaptain } from 'src/utils/api/pagesApi/hallCaptainsApi';

interface Props {
  captain: HallCaptain;
  onEdit: () => void;
  canEdit?: boolean;
}

const CaptainRow: React.FC<Props> = ({ 
  captain, onEdit, canEdit = true 
}) => {
  const { t } = useTranslation();

  const handlePhoneCall = () => {
    window.open(`tel:${captain.phone}`, '_self');
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 0.5 }}>
              {captain.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {captain.branchName || t('common.notSpecified')}
            </Typography>
          </Box>
          
          <Chip
            label={captain.isActive ? t('common.active') : t('common.inactive')}
            color={captain.isActive ? 'success' : 'error'}
            size="small"
            variant={captain.isActive ? 'filled' : 'outlined'}
          />
        </Box>

        {/* Captain Info */}
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('hallCaptains.form.phone')}:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" fontFamily="monospace" fontWeight={500}>
                {captain.phone}
              </Typography>
              <IconButton
                size="small"
                onClick={handlePhoneCall}
                color="primary"
                sx={{ p: 0.5 }}
              >
                <IconPhone size={16} />
              </IconButton>
            </Box>
          </Box>

          {captain.notes && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {t('hallCaptains.form.notes')}:
              </Typography>
              <Typography variant="body2">
                {captain.notes}
              </Typography>
            </Box>
          )}
        </Stack>

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

export default CaptainRow;
