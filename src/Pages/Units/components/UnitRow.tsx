// File: src/pages/units/components/UnitRow.tsx
import {
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
  Box
} from '@mui/material';
import { IconEdit } from '@tabler/icons-react';
import { Unit } from 'src/utils/api/pagesApi/unitsApi';
import { StatusPill } from './StatusPill';
import { useTranslation } from 'react-i18next';

interface Props {
  unit: Unit;
  onEdit: () => void;
}

const UnitRow: React.FC<Props> = ({ unit, onEdit }) => {
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
              {unit.name}
            </Typography>
            
            
            {unit.createdOn && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                {t('units.created')}: {formatDate(unit.createdOn)}
              </Typography>
            )}
            
            <Box sx={{ mt: 1 }}>
              <StatusPill status={unit.isActive ? 'active' : 'inactive'} />
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

export default UnitRow;
