// File: src/pages/reports/components/ProductBalanceCards.tsx
import React from 'react';
import {
  Card,
  Typography,
  Box,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  useTheme,
  Divider
} from '@mui/material';
import {
  IconChevronDown,
  IconTriangle,
  IconCheck,
  IconPackage,
  IconBuilding,
  IconCurrencyDollar
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { GroupedProductBalance } from 'src/utils/api/reportsApi';

interface Props {
  data: GroupedProductBalance[];
  loading: boolean;
}

const ProductBalanceCards: React.FC<Props> = ({ data, loading }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return {
        label: t('reports.stockStatus.outOfStock'),
        color: 'error' as const,
        icon: IconTriangle
      };
    } else if (quantity < 10) {
      return {
        label: t('reports.stockStatus.lowStock'),
        color: 'warning' as const,
        icon: IconTriangle
      };
    } else {
      return {
        label: t('reports.stockStatus.inStock'),
        color: 'success' as const,
        icon: IconCheck
      };
    }
  };

  if (loading) {
    return (
      <Card sx={{ p: 4, textAlign: 'center' }}>
        <Typography>{t('common.loading')}</Typography>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">
          {t('reports.noData')}
        </Typography>
      </Card>
    );
  }

  return (
    <Box>
      {data.map((item) => {
        const status = getStockStatus(item.totalQuantity);
        
        return (
          <Card key={`${item.productID}-${item.warehouseID}`} sx={{ mb: 2 }}>
            <Accordion>
              <AccordionSummary expandIcon={<IconChevronDown />}>
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <IconPackage size={18} color={theme.palette.primary.main} />
                    <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 'bold', fontSize: '0.9rem' }}>
                      {item.productName}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <IconBuilding size={14} color={theme.palette.text.secondary} />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontSize: '0.8rem' }}>
                      {item.wareHouseName}
                    </Typography>
                  </Box>

                  <Grid container spacing={1} sx={{ mb: 1 }}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        {t('reports.table.totalQuantity')}: {item.totalQuantity.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Chip
                        label={status.label}
                        color={status.color}
                        size="small"
                        icon={<status.icon size={12} />}
                        sx={{ fontSize: '0.65rem', height: '18px' }}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconCurrencyDollar size={12} color={theme.palette.success.main} />
                        <Typography variant="caption" color="success.main" sx={{ ml: 0.5, fontWeight: 'medium' }}>
                          {t('reports.table.totalCostValue')}: {item.totalCost.toFixed(2)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconCurrencyDollar size={12} color={theme.palette.warning.main} />
                        <Typography variant="caption" color="warning.main" sx={{ ml: 0.5, fontWeight: 'medium' }}>
                          {t('reports.table.totalLastPurePriceValue')}: {item.totalLastPurePrice.toFixed(2)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </AccordionSummary>
              
              <AccordionDetails>
                <Typography variant="subtitle2" gutterBottom fontSize="0.8rem">
                  {t('reports.table.unitBreakdown')}
                </Typography>
                
                <Grid container spacing={1}>
                  {item.units.map((unit, index) => (
                    <Grid item xs={12} key={`${unit.unitId}-${index}`}>
                      <Card variant="outlined" sx={{ p: 1 }}>
                        <Typography variant="body2" fontWeight="medium" fontSize="0.8rem">
                          {unit.unitName}
                        </Typography>
                        <Divider sx={{ my: 0.5 }} />
                        
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              {t('reports.table.quantity')}: {unit.unitQuantity}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              {t('reports.table.cost')}: {unit.cost.toFixed(2)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="success.main" fontWeight="medium">
                              {t('reports.table.totalCost')}: {unit.totalCost.toFixed(2)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              {t('reports.table.lastPurePrice')}: {unit.lastPurePrice.toFixed(2)}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="caption" color="warning.main" fontWeight="medium">
                              {t('reports.table.totalLastPurePrice')}: {unit.totalLastPurePrice.toFixed(2)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Card>
        );
      })}
    </Box>
  );
};

export default ProductBalanceCards;
