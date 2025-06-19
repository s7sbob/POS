// File: src/pages/safes/components/mobile/SafesCards.tsx
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
import { Safe } from 'src/utils/api/pagesApi/safesApi';
import { useTranslation } from 'react-i18next';

interface Props {
  safes: Safe[];
  onEdit: (safe: Safe) => void;
  loading: boolean;
}

const SafesCards: React.FC<Props> = ({ safes, onEdit, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>{t('common.loading')}</Typography>
      </Box>
    );
  }

  if (safes.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          {t('safes.noSafes')}
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {safes.map((safe) => (
        <Grid item xs={12} sm={6} md={4} key={safe.id}>
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
                    {safe.name}
                  </Typography>
                  
                  <Box>
                    <Chip
                      label={t(`safes.types.${safe.typeName.toLowerCase()}`)}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  
                  {safe.accountNumber && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                      {t('safes.accountNumber')}: {safe.accountNumber}
                    </Typography>
                  )}
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    {t('safes.collectionFeePercent')}: {safe.collectionFeePercent}%
                  </Typography>
                  
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={safe.isActive ? t('safes.active') : t('safes.inactive')}
                      color={safe.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                </Stack>
                
                <IconButton 
                  onClick={() => onEdit(safe)} 
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

export default SafesCards;
