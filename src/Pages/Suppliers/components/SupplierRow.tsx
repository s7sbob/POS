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
import { Supplier } from 'src/utils/api/suppliersApi';
import { useTranslation } from 'react-i18next';

interface Props {
  supplier: Supplier;
  onEdit: () => void;
}

const SupplierRow: React.FC<Props> = ({ supplier, onEdit }) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack spacing={1} flex={1}>
            <Typography variant="h6" component="div">
              {supplier.name}
            </Typography>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('suppliers.phone')}: {supplier.phone}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('suppliers.address')}: {supplier.address}
              </Typography>
              {supplier.notes && (
                <Typography variant="body2" color="text.secondary">
                  {t('suppliers.notes')}: {supplier.notes}
                </Typography>
              )}
            </Box>
            <Chip
              label={supplier.isActive ? t('suppliers.active') : t('suppliers.inactive')}
              color={supplier.isActive ? 'success' : 'default'}
              size="small"
              sx={{ alignSelf: 'flex-start' }}
            />
          </Stack>
          
          <IconButton onClick={onEdit}>
            <IconEdit size={18} />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SupplierRow;
