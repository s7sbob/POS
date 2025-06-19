// File: src/pages/pos-payment-methods/components/mobile/PosPaymentMethodsCards.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
  Box,
  Grid,
  Chip
} from '@mui/material';
import { IconEdit } from '@tabler/icons-react';
import { PosPaymentMethod } from 'src/utils/api/pagesApi/posPaymentMethodsApi';
import { useTranslation } from 'react-i18next';

interface Props {
  paymentMethods: PosPaymentMethod[];
  onEdit: (paymentMethod: PosPaymentMethod) => void;
  loading: boolean;
}

const PosPaymentMethodsCards: React.FC<Props> = ({ paymentMethods, onEdit, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>{t('common.loading')}</Typography>
      </Box>
    );
  }

  if (paymentMethods.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          {t('posPaymentMethods.noPaymentMethods')}
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {paymentMethods.map((paymentMethod) => (
        <Grid item xs={12} sm={6} md={4} key={paymentMethod.id}>
          <Card sx={{ 
            height: '100%',
            borderRadius: { xs: 1, sm: 2 },
            boxShadow: { xs: 1, sm: 2 }
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Stack spacing={1} flex={1}>
                  <Typography 
                    variant="h6" 
                    component="div"
                    sx={{ 
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                      fontWeight: 'bold'
                    }}
                  >
                    {paymentMethod.name}
                  </Typography>
                  
                  {paymentMethod.safeOrAccount && (
                    <>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                      >
                        {t('posPaymentMethods.safeOrAccount')}: {paymentMethod.safeOrAccount.name}
                      </Typography>
                      
                      <Box>
                        <Chip
                          label={t(`accounts.types.${paymentMethod.safeOrAccount.typeName.toLowerCase()}`)}
                          color={paymentMethod.safeOrAccount.safeOrAccountType === 1 ? 'warning' : 'primary'}
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                      
                      {paymentMethod.safeOrAccount.accountNumber && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            fontFamily: 'monospace'
                          }}
                        >
                          {t('posPaymentMethods.accountNumber')}: {paymentMethod.safeOrAccount.accountNumber}
                        </Typography>
                      )}
                      
                      {paymentMethod.safeOrAccount.collectionFeePercent > 0 && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                        >
                          {t('posPaymentMethods.collectionFee')}: {paymentMethod.safeOrAccount.collectionFeePercent}%
                        </Typography>
                      )}
                    </>
                  )}
                  
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={paymentMethod.isActive ? t('posPaymentMethods.active') : t('posPaymentMethods.inactive')}
                      color={paymentMethod.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                </Stack>
                
                <IconButton 
                  onClick={() => onEdit(paymentMethod)} 
                  size="small"
                  sx={{
                    backgroundColor: 'action.hover',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText'
                    }
                  }}
                >
                  <IconEdit size={18} />
                </IconButton>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default PosPaymentMethodsCards;
