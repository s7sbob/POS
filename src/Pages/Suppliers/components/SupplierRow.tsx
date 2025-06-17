// File: src/pages/suppliers/components/SupplierRow.tsx
import {
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
  Chip,
  Box
} from '@mui/material';
import { IconEdit } from '@tabler/icons-react';
import { Supplier } from 'src/utils/api/pagesApi/suppliersApi';
import { useTranslation } from 'react-i18next';

interface Props {
  supplier: Supplier;
  onEdit: () => void;
}

const SupplierRow: React.FC<Props> = ({ supplier, onEdit }) => {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return '-';
    }
  };

  return (
    <Card sx={{ 
      mb: 2,
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
              {supplier.name}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              {t('suppliers.phone')}: {supplier.phone || '-'}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                lineHeight: 1.3
              }}
            >
              {t('suppliers.address')}: {supplier.address || '-'}
            </Typography>
            
            {supplier.notes && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  lineHeight: 1.3,
                  fontStyle: 'italic'
                }}
              >
                {t('suppliers.notes')}: {supplier.notes}
              </Typography>
            )}
            
            {supplier.createdOn && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                {t('suppliers.created')}: {formatDate(supplier.createdOn)}
              </Typography>
            )}
            
            <Box sx={{ mt: 1 }}>
              <Chip
                label={supplier.isActive ? t('suppliers.active') : t('suppliers.inactive')}
                color={supplier.isActive ? 'success' : 'default'}
                size="small"
                sx={{ alignSelf: 'flex-start' }}
              />
            </Box>
          </Stack>
          
          <IconButton 
            onClick={onEdit} 
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
  );
};

export default SupplierRow;
