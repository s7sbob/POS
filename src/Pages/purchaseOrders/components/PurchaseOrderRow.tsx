import {
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
  Box,
  Chip
} from '@mui/material';
import { IconEdit } from '@tabler/icons-react';
import { PurchaseOrder } from 'src/utils/api/purchaseOrdersApi';
import { useTranslation } from 'react-i18next';

interface Props {
  purchaseOrder: PurchaseOrder;
  onEdit: () => void;
}

const PurchaseOrderRow: React.FC<Props> = ({ purchaseOrder, onEdit }) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack spacing={1} flex={1}>
            <Typography variant="h6" component="div">
              {purchaseOrder.referenceDocNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('purchaseOrders.code')}: {purchaseOrder.code}
            </Typography>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('purchaseOrders.supplier')}: {purchaseOrder.supplier?.name || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('purchaseOrders.warehouse')}: {purchaseOrder.warehouse?.name || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('purchaseOrders.date')}: {new Date(purchaseOrder.date1).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('purchaseOrders.total')}: {purchaseOrder.total.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('purchaseOrders.itemsCount')}: {purchaseOrder.details?.length || 0}
              </Typography>
            </Box>
            <Chip
              label={purchaseOrder.isActive ? t('purchaseOrders.active') : t('purchaseOrders.inactive')}
              color={purchaseOrder.isActive ? 'success' : 'default'}
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

export default PurchaseOrderRow;
