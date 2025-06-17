// File: src/pages/inventory/adjustment-view/components/AdjustmentViewCards.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Stack,
  Divider,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
  details: any[];
}

const AdjustmentViewCards: React.FC<Props> = ({ details }) => {
  const { t } = useTranslation();

  if (details.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: { xs: 2, sm: 4 } }}>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          {t('adjustment.form.noItems')}
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={{ xs: 1, sm: 2 }}>
      {details.map((detail) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={detail.detailsAdjustmentId}>
          <Card sx={{ 
            height: '100%',
            borderRadius: { xs: 1, sm: 2 }
          }}>
            <CardContent sx={{ 
              p: { xs: 1.5, sm: 2 },
              '&:last-child': { pb: { xs: 1.5, sm: 2 } }
            }}>
              <Stack spacing={{ xs: 1, sm: 1.5 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontSize: { xs: '0.875rem', sm: '1rem' }, 
                    fontWeight: 'bold',
                    lineHeight: 1.2
                  }}
                >
                  {detail.productName}
                </Typography>
                
                <Divider />
                
                <Box>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                  >
                    {t('adjustment.form.unit')}
                  </Typography>
                  <Typography 
                    variant="body2"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    {detail.unitName}
                  </Typography>
                </Box>

                {detail.barcode && (
                  <Box>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                    >
                      {t('adjustment.form.barcode')}
                    </Typography>
                    <Typography 
                      variant="body2"
                      sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        fontFamily: 'monospace'
                      }}
                    >
                      {detail.barcode}
                    </Typography>
                  </Box>
                )}

                <Box>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                  >
                    {t('adjustment.form.unitFactor')}
                  </Typography>
                  <Typography 
                    variant="body2"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    {detail.unitFactor}
                  </Typography>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 1, sm: 0 }
                }}>
                  <Box>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                    >
                      {t('adjustment.form.oldQuantity')}
                    </Typography>
                    <Typography 
                      variant="body2"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                      {detail.oldQuantity?.toFixed(2) || '0.00'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                    >
                      {t('adjustment.form.newQuantity')}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}
                    >
                      {detail.newQuantity?.toFixed(2) || '0.00'}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                  >
                    {t('adjustment.form.difference')}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      color: detail.diffQty > 0 ? 'success.main' : 
                             detail.diffQty < 0 ? 'error.main' : 'text.primary'
                    }}
                  >
                    {detail.diffQty > 0 ? '+' : ''}{detail.diffQty?.toFixed(2) || '0.00'}
                  </Typography>
                </Box>

                {detail.notes && (
                  <Box>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                    >
                      {t('adjustment.form.notes')}
                    </Typography>
                    <Typography 
                      variant="body2"
                      sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        lineHeight: 1.3
                      }}
                    >
                      {detail.notes}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AdjustmentViewCards;
