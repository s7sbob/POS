import {
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
  Chip,
  Box
} from '@mui/material';
import { IconEdit, IconEye } from '@tabler/icons-react';
import { Product } from 'src/utils/api/productsApi';
import { useTranslation } from 'react-i18next';

interface Props {
  product: Product;
  onEdit: () => void;
  onViewPrices: () => void;
  isSelected: boolean;
}

const ProductRow: React.FC<Props> = ({ product, onEdit, onViewPrices, isSelected }) => {
  const { t } = useTranslation();

  const getProductTypeLabel = (type: number) => {
    switch (type) {
      case 1: return 'POS';
      case 2: return 'Material';
      default: return 'Unknown';
    }
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        border: isSelected ? 2 : 1,
        borderColor: isSelected ? 'primary.main' : 'divider',
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack spacing={1} flex={1}>
            <Typography variant="h6" component="div">
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('products.code')}: {product.code}
            </Typography>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('products.group')}: {product.group?.name || 'No Group'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('products.cost')}: {Number(product.cost).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('products.pricesCount')}: {product.productPrices?.length || 0}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Chip
                label={getProductTypeLabel(product.productType)}
                color={product.productType === 1 ? 'primary' : 'secondary'}
                size="small"
              />
              <Chip
                label={product.isActive ? t('products.active') : t('products.inactive')}
                color={product.isActive ? 'success' : 'default'}
                size="small"
              />
            </Stack>
          </Stack>
          
          <Stack direction="row" spacing={1}>
            <IconButton 
              onClick={onViewPrices}
              color={isSelected ? 'primary' : 'default'}
              title={t('products.viewPrices')}
            >
              <IconEye size={18} />
            </IconButton>
            <IconButton 
              onClick={onEdit}
              title={t('products.edit')}
            >
              <IconEdit size={18} />
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProductRow;
