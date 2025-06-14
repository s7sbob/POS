// File: src/pages/purchases/components/PurchaseRow.tsx
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
import { useTranslation } from 'react-i18next';
import { Purchase } from 'src/utils/api/pagesApi/purchaseApi';

interface Props {
  purchase: Purchase;
  onEdit: () => void;
  onView: () => void;
}

const PurchaseRow: React.FC<Props> = ({ purchase, onEdit, onView }) => {
  const { t } = useTranslation();

  const renderStatus = (status: number | undefined) => {
    switch (status) {
      case 1:
        return t('purchases.status.pending');
      case 3:
        return t('purchases.status.submitted');
      default:
        return '-';
    }
  };

  const getStatusColor = (status: number | undefined) => {
    switch (status) {
      case 1:
        return 'warning';
      case 3:
        return 'success';
      default:
        return 'default';
    }
  };

  const renderPurchaseOrderInfo = () => {
    if (purchase.purchaseOrder) {
      return `${purchase.purchaseOrder.referenceDocNumber} (${purchase.purchaseOrder.code})`;
    }
    return t('purchases.table.directInvoice');
  };

  const handleAction = () => {
    if (purchase.status === 3) {
      onView(); // Submitted - View only
    } else {
      onEdit(); // Pending - Edit
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack spacing={1} flex={1}>
            <Typography variant="h6" component="div">
              {purchase.referenceDocNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('purchases.table.code')}: {purchase.code}
            </Typography>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('purchases.table.purchaseOrder')}: {renderPurchaseOrderInfo()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('purchases.table.supplier')}: {purchase.supplier?.name || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('purchases.table.warehouse')}: {purchase.warehouse?.name || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('purchases.table.invoiceDate')}: {new Date(purchase.date1).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('purchases.table.total')}: {purchase.total.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('purchases.table.itemsCount')}: {purchase.details?.length || 0}
              </Typography>
            </Box>
            <Chip
              label={renderStatus(purchase.status)}
              color={getStatusColor(purchase.status) as any}
              size="small"
              sx={{ alignSelf: 'flex-start' }}
            />
          </Stack>

          <IconButton onClick={handleAction}>
            {purchase.status === 3 ? <IconEye size={18} /> : <IconEdit size={18} />}
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PurchaseRow;
