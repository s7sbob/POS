// File: src/pages/products/components/ProductPricesDrawer.tsx
import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  Card,
  CardContent,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { IconX, IconBarcode, IconComponents } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Product } from 'src/utils/api/pagesApi/productsApi';
import { Unit } from 'src/utils/api/pagesApi/unitsApi';

interface Props {
  open: boolean;
  product: Product | null;
  units: Unit[];
  onClose: () => void;
}

const ProductPricesDrawer: React.FC<Props> = ({
  open,
  product,
  units,
  onClose
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!product) return null;

  const getUnitName = (unitId: string) => {
    const unit = units.find(u => u.id === unitId);
    return unit?.name || t('common.notSpecified');
  };

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
      case 1: return 'primary';
      case 2: return 'secondary';
      case 3: return 'info';
      default: return 'default';
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: isMobile ? '100%' : 600,
          maxWidth: '100%'
        }
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {product.name}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Chip
                label={getProductTypeLabel(product.productType)}
                color={getProductTypeColor(product.productType)}
                size="small"
                variant="outlined"
              />
              {/* ⭐ عرض حالة المنتج */}
              <Chip
                label={product.isActive ? t('products.status.active') : t('products.status.inactive')}
                color={product.isActive ? 'success' : 'error'}
                size="small"
                variant={product.isActive ? 'filled' : 'outlined'}
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {t('products.code')}: {product.code}
            </Typography>
            {product.group && (
              <Typography variant="body2" color="text.secondary">
                {t('products.group')}: {product.group.name}
              </Typography>
            )}
            {/* ⭐ عرض POS Screen للمنتجات من نوع POS */}
            {product.productType === 1 && product.posScreen && (
              <Typography variant="body2" color="text.secondary">
                📱 {t('products.form.posScreen')}: {product.posScreen.name}
              </Typography>
            )}
          </Box>
          
          <IconButton onClick={onClose}>
            <IconX />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Product Description */}
        {product.description && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t('products.description')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {product.description}
            </Typography>
          </Box>
        )}

        {/* Product Options (للـ POS و Addition فقط) */}
        {(product.productType === 1 || product.productType === 3) && 
         product.productOptionGroups && 
         product.productOptionGroups.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              {t('products.form.productOptions')} ({product.productOptionGroups.length})
            </Typography>
            {product.productOptionGroups.map((group, index) => (
              <Card key={group.id || index} variant="outlined" sx={{ mb: 2 }}>
                <CardContent sx={{ pb: '16px !important' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2">
                      {group.name}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      {group.isRequired && (
                        <Chip label={t('products.form.required')} size="small" color="error" variant="outlined" />
                      )}
                      {group.allowMultiple && (
                        <Chip label={t('products.form.allowMultiple')} size="small" color="info" variant="outlined" />
                      )}
                    </Stack>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                    {t('products.form.minSelection')}: {group.minSelection} | {t('products.form.maxSelection')}: {group.maxSelection}
                  </Typography>
                  
                  {group.optionItems && group.optionItems.length > 0 && (
                    <Box>
                      {group.optionItems.map((item, itemIndex) => (
                        <Box key={item.id || itemIndex} sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          py: 0.5,
                          borderBottom: itemIndex < group.optionItems.length - 1 ? 1 : 0,
                          borderColor: 'divider'
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">
                              {item.name}
                            </Typography>
                            {item.isCommentOnly && (
                              <Chip label={t('products.form.comment')} size="small" color="info" />
                            )}
                          </Box>
                          {item.extraPrice > 0 && (
                            <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                              +{item.extraPrice.toFixed(2)}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* Prices */}
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          {t('products.prices')} ({product.productPrices.length})
        </Typography>

        {product.productPrices.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            {t('products.noPrices')}
          </Typography>
        ) : isMobile ? (
          // Mobile View
          <Stack spacing={2}>
            {product.productPrices.map((price, index) => (
              <Card key={price.id} variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="subtitle2">
                      {t('products.price')} #{index + 1}
                    </Typography>
                    <Typography variant="h6" color="primary.main">
                      {price.price.toFixed(2)}
                    </Typography>
                  </Box>

                  <Stack spacing={1}>
                    {/* ⭐ عرض posPriceName للـ POS/Addition */}
                    {(product.productType === 1 || product.productType === 3) && price.posPriceName && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          {t('products.form.priceName')}:
                        </Typography>
                        <Typography variant="body2">
                          {price.posPriceName}
                        </Typography>
                      </Box>
                    )}

                    {/* ⭐ إخفاء الوحدة ومعامل التحويل للـ POS/Addition */}
                    {product.productType === 2 && (
                      <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            {t('products.unit')}:
                          </Typography>
                          <Typography variant="body2">
                            {getUnitName(price.unitId)}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            {t('products.unitFactor')}:
                          </Typography>
                          <Typography variant="body2">
                            {price.unitFactor}x
                          </Typography>
                        </Box>
                      </>
                    )}

                    {price.barcode && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          {t('products.barcode')}:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconBarcode size={16} />
                          <Typography variant="body2" fontFamily="monospace">
                            {price.barcode}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {price.productComponents && price.productComponents.length > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          {t('products.components')}:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconComponents size={16} />
                          <Typography variant="body2">
                            {price.productComponents.length}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          // Desktop Table View
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  {/* ⭐ عرض posPriceName للـ POS/Addition */}
                  {(product.productType === 1 || product.productType === 3) && (
                    <TableCell>{t('products.form.priceName')}</TableCell>
                  )}
                  {/* ⭐ إخفاء الوحدة ومعامل التحويل للـ POS/Addition */}
                  {product.productType === 2 && (
                    <>
                      <TableCell>{t('products.unit')}</TableCell>
                      <TableCell>{t('products.unitFactor')}</TableCell>
                    </>
                  )}
                  <TableCell>{t('products.price')}</TableCell>
                  <TableCell>{t('products.barcode')}</TableCell>
                  <TableCell>{t('products.components')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {product.productPrices.map((price) => (
                  <TableRow key={price.id}>
                    {/* ⭐ عرض posPriceName للـ POS/Addition */}
                    {(product.productType === 1 || product.productType === 3) && (
                      <TableCell>
                        <Typography variant="body2">
                          {price.posPriceName || '-'}
                        </Typography>
                      </TableCell>
                    )}
                    
                    {/* ⭐ إخفاء الوحدة ومعامل التحويل للـ POS/Addition */}
                    {product.productType === 2 && (
                      <>
                        <TableCell>
                          <Typography variant="body2">
                            {getUnitName(price.unitId)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {price.unitFactor}x
                          </Typography>
                        </TableCell>
                      </>
                    )}
                    
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="primary.main">
                        {price.price.toFixed(2)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      {price.barcode ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconBarcode size={16} />
                          <Typography variant="body2" fontFamily="monospace">
                            {price.barcode}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">-</Typography>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      {price.productComponents && price.productComponents.length > 0 ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconComponents size={16} />
                          <Typography variant="body2">
                            {price.productComponents.length}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">-</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Drawer>
  );
};

export default ProductPricesDrawer;
