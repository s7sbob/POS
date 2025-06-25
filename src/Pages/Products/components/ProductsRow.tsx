// File: src/pages/products/components/ProductsRow.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack,
  Divider,
  Tooltip
} from '@mui/material';
import { IconEdit, IconEye, IconBarcode } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Product } from 'src/utils/api/pagesApi/productsApi';

interface Props {
  product: Product;
  onEdit: () => void;
  onViewPrices: () => void;
  isSelected?: boolean;
}

const ProductRow: React.FC<Props> = ({
  product,
  onEdit,
  onViewPrices,
  isSelected = false
}) => {
  const { t } = useTranslation();

  const getProductTypeLabel = (type: number) => {
    switch (type) {
      case 1: return t('products.types.pos');
      case 2: return t('products.types.material');
      case 3: return t('products.types.addition');
      default: return t('products.types.unknown');
    }
  };

  const getProductTypeColor = (type: number): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (type) {
      case 1: return 'primary';   // POS
      case 2: return 'secondary'; // Material
      case 3: return 'info';      // Addition
      default: return 'default';
    }
  };

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        mb: 2,
        ...(isSelected && {
          borderColor: 'primary.main',
          backgroundColor: 'action.selected'
        })
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 0.5 }}>
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('products.code')}: {product.code}
            </Typography>
          </Box>
          
          {/* ⭐ عرض حالة المنتج */}
          <Chip
            label={product.isActive ? t('products.status.active') : t('products.status.inactive')}
            color={product.isActive ? 'success' : 'error'}
            size="small"
            variant={product.isActive ? 'filled' : 'outlined'}
          />
        </Box>

        {/* Product Info */}
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('products.group')}:
            </Typography>
            <Typography variant="body2">
              {product.group?.name || t('common.notSpecified')}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('products.type')}:
            </Typography>
            <Chip
              label={getProductTypeLabel(product.productType)}
              color={getProductTypeColor(product.productType)}
              size="small"
              variant="outlined"
            />
          </Box>
          
          {/* ⭐ عرض POS Screen للمنتجات من نوع POS */}
          {product.productType === 1 && product.posScreen && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('products.form.posScreen')}:
              </Typography>
              <Typography variant="body2">
                📱 {product.posScreen.name}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('products.prices')}:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">
                {product.productPrices.length}
              </Typography>
              {product.productPrices.some(p => p.barcode) && (
                <Tooltip title={t('products.hasBarcode')}>
                  <IconBarcode size={16} color="green" />
                </Tooltip>
              )}
            </Box>
          </Box>
        </Stack>

        {/* Description */}
        {product.description && (
          <>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              {product.description}
            </Typography>
          </>
        )}

        {/* Actions */}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Tooltip title={t('products.viewPrices')}>
            <IconButton
              size="small"
              onClick={onViewPrices}
              color="info"
            >
              <IconEye size={18} />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={t('common.edit')}>
            <IconButton
              size="small"
              onClick={onEdit}
              color="primary"
            >
              <IconEdit size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductRow;
