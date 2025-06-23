// File: src/pages/warehouses/components/WarehouseRow.tsx
import {
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
  Box
} from '@mui/material';
import { IconEdit } from '@tabler/icons-react';
import { Warehouse } from './types';
import { StatusPill } from './StatusPill';
import { useTranslation } from 'react-i18next';

interface Props {
  warehouse: Warehouse;
  onEdit: () => void;
}

const WarehouseRow: React.FC<Props> = ({ warehouse, onEdit }) => {
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
              {warehouse.name}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              {t('warehouses.address')}: {warehouse.address}
            </Typography>

            {warehouse.createdOn && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                {t('warehouses.created')}: {formatDate(warehouse.createdOn)}
              </Typography>
            )}
            
            <Box sx={{ mt: 1 }}>
              <StatusPill status={warehouse.status} />
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

export default WarehouseRow;
