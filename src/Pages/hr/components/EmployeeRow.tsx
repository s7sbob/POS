// File: src/Pages/hr/components/EmployeeRow.tsx
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
import { Employee } from 'src/utils/api/pagesApi/employeesApi';
import { useTranslation } from 'react-i18next';

interface Props {
  employee: Employee;
  onEdit: () => void;
}

const EmployeeRow: React.FC<Props> = ({ employee, onEdit }) => {
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
              {employee.name}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              {t('hr.employees.code')}: {employee.code}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                lineHeight: 1.3
              }}
            >
              {t('hr.employees.workingHours')}: {employee.workingHours} {t('hr.employees.hours')}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                lineHeight: 1.3
              }}
            >
              {t('hr.employees.hourSalary')}: {employee.hourSalary} {t('hr.employees.currency')}
            </Typography>
            
            {employee.createdOn && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                {t('hr.employees.created')}: {formatDate(employee.createdOn)}
              </Typography>
            )}
            
            <Box sx={{ mt: 1 }}>
              <Chip
                label={employee.isActive ? t('hr.employees.active') : t('hr.employees.inactive')}
                color={employee.isActive ? 'success' : 'default'}
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

export default EmployeeRow;

