import {
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
  Box,
  Chip
} from '@mui/material';
import { IconEdit, IconEye } from '@tabler/icons-react';
import { PurchaseOrder } from 'src/utils/api/pagesApi/purchaseOrdersApi';
import { useTranslation } from 'react-i18next';

interface Props {
  purchaseOrder: PurchaseOrder;
  onEdit: () => void;
}

const PurchaseOrderRow: React.FC<Props> = ({ purchaseOrder, onEdit }) => {
  const { t } = useTranslation();

  const renderStatus = (status: number | undefined) => {
    switch (status) {
      case 1:
        return t('purchaseOrders.pending');
      case 3:
        return t('purchaseOrders.submitted');
      default:
        return '-';
    }
  };

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
              label={renderStatus(purchaseOrder.status)}
              color={purchaseOrder.status === 1 ? 'warning' : purchaseOrder.status === 3 ? 'primary' : 'default'}
              size="small"
              sx={{ alignSelf: 'flex-start' }}
            />
          </Stack>

          {/*
            إذا كان status === 3 → iconEye (view)، وإلا iconEdit.
          */}
          <IconButton onClick={onEdit}>
            {purchaseOrder.status === 3 ? <IconEye size={18} /> : <IconEdit size={18} />}
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PurchaseOrderRow;
