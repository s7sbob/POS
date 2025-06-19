// File: src/pages/accounts/components/mobile/AccountsCards.tsx
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
import { Account } from 'src/utils/api/pagesApi/accountsApi';
import { useTranslation } from 'react-i18next';

interface Props {
  accounts: Account[];
  onEdit: (account: Account) => void;
  loading: boolean;
}

const AccountsCards: React.FC<Props> = ({ accounts, onEdit, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>{t('common.loading')}</Typography>
      </Box>
    );
  }

  if (accounts.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          {t('accounts.noAccounts')}
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {accounts.map((account) => (
        <Grid item xs={12} sm={6} md={4} key={account.id}>
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
                    {account.name}
                  </Typography>
                  
                  <Box>
                    <Chip
                      label={t(`accounts.types.${account.typeName.toLowerCase()}`)}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      fontFamily: 'monospace'
                    }}
                  >
                    {t('accounts.accountNumber')}: {account.accountNumber}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    {t('accounts.collectionFeePercent')}: {account.collectionFeePercent}%
                  </Typography>
                  
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={account.isActive ? t('accounts.active') : t('accounts.inactive')}
                      color={account.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                </Stack>
                
                <IconButton 
                  onClick={() => onEdit(account)} 
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

export default AccountsCards;
