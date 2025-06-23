// File: src/pages/inventory/adjustments-list/components/AdjustmentsCards.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Grid,
  Stack,
  Divider
} from '@mui/material';
import { IconEye } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AdjustmentListItem } from 'src/utils/api/pagesApi/inventoryAdjustmentApi';

interface Props {
  adjustments: AdjustmentListItem[];
  loading: boolean;
}

const AdjustmentsCards: React.FC<Props> = ({ adjustments, loading }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getAdjustmentTypeLabel = (type: number) => {
    switch (type) {
      case 0:
        return t('adjustments.types.new');
      case 1:
        return t('adjustments.types.openingBalance');
      case 2:
        return t('adjustments.types.manualAdjustment');
      default:
        return t('adjustments.types.unknown');
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1:
        return { label: t('adjustments.status.saved'), color: 'warning' as const };
      case 3:
        return { label: t('adjustments.status.submitted'), color: 'success' as const };
      default:
        return { label: t('adjustments.status.unknown'), color: 'default' as const };
    }
  };

  const handleViewAdjustment = (adjustmentId: string) => {
    navigate(`/inventory/inventory-adjustments/${adjustmentId}`);
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === '0001-01-01T00:00:00') {
      return '-';
    }
    return new Date(dateString).toLocaleDateString();
  };

  const getTotalItems = (details: any[]) => {
    return details.length;
  };

  const getTotalDifference = (details: any[]) => {
    return details.reduce((sum, detail) => sum + Math.abs(detail.diffQty), 0);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>{t('common.loading')}</Typography>
      </Box>
    );
  }

  if (adjustments.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          {t('adjustments.list.noAdjustments')}
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {adjustments.map((adjustment) => {
        const statusInfo = getStatusLabel(adjustment.status);
        return (
          <Grid item xs={12} sm={6} md={4} key={adjustment.adjustmentId}>
            <Card sx={{ height: '100%', position: 'relative' }}>
              <CardContent>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                      {getAdjustmentTypeLabel(adjustment.adjustmentType)}
                    </Typography>
                    <Chip
                      label={statusInfo.label}
                      color={statusInfo.color}
                      size="small"
                    />
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('adjustments.table.warehouse')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {adjustment.warehouseName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {adjustment.warehouseId.substring(0, 8)}...
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('adjustments.table.adjustmentId')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {adjustment.adjustmentId.substring(0, 8)}...
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('adjustments.table.date')}
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(adjustment.adjustmentDate)}
                    </Typography>
                  </Box>

                  {adjustment.referenceNumber && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('adjustments.table.referenceNumber')}
                      </Typography>
                      <Typography variant="body2">
                        {adjustment.referenceNumber}
                      </Typography>
                    </Box>
                  )}

                  {adjustment.reason && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('adjustments.table.reason')}
                      </Typography>
                      <Typography variant="body2">
                        {adjustment.reason}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('adjustments.table.totalItems')}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {getTotalItems(adjustment.details)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('adjustments.table.totalDifference')}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {getTotalDifference(adjustment.details).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                    <IconButton
                      onClick={() => handleViewAdjustment(adjustment.adjustmentId)}
                      color="primary"
                      sx={{
                        border: '1px solid',
                        borderColor: 'primary.main',
                        borderRadius: 1
                      }}
                    >
                      <IconEye size={18} />
                    </IconButton>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default AdjustmentsCards;
