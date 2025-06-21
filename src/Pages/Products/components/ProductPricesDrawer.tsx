// File: src/pages/products/components/ProductPricesDrawer.tsx
import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent
} from '@mui/material';
import { IconX, IconChevronDown, IconComponents } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Product } from 'src/utils/api/pagesApi/productsApi';
import { Unit } from 'src/utils/api/pagesApi/unitsApi';

interface Props {
  open: boolean;
  product: Product | null;
  units: Unit[];
  onClose: () => void;
}

const ProductPricesDrawer: React.FC<Props> = ({ open, product, units, onClose }) => {
  const { t } = useTranslation();

  const getUnitName = (unitId: string) => {
    const unit = units.find(u => u.id === unitId);
    return unit?.name || 'Unknown Unit';
  };

  const getComponentProductName = (component: any) => {
    return component.rawProductPrice?.product?.productName || 'منتج غير محدد';
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 700 },
          maxWidth: '100vw'
        }
      }}
    >
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">
            {t('products.pricesFor')}: {product?.name || ''}
          </Typography>
          <IconButton onClick={onClose}>
            <IconX size={24} />
          </IconButton>
        </Box>

        {product && (
          <>
            {/* Product Info */}
            <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                {product.name}
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Typography variant="body2" color="text.secondary">
                  {t('products.group')}: {product.group?.name || 'No Group'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('products.cost')}: {Number(product.cost).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('products.reorderLevel')}: {product.reorderLevel}
                </Typography>
              </Stack>
              {product.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {t('products.description')}: {product.description}
                </Typography>
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Prices Table */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <Typography variant="h6" gutterBottom>
                {t('products.prices')} ({product.productPrices?.length || 0})
              </Typography>

              {product.productPrices?.length === 0 ? (
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                      {t('products.noPrices')}
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                <Stack spacing={2}>
                  {product.productPrices?.map((price, index) => (
                    <Card key={price.id || index} variant="outlined">
                      <CardContent>
                        {/* معلومات السعر الأساسية */}
                        <Box sx={{ mb: 2 }}>
                          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                            <Typography variant="h6">
                              {getUnitName(price.unitId)} × {price.unitFactor}
                            </Typography>
                            <Typography variant="h6" color="primary">
                              {price.price.toFixed(2)}
                            </Typography>
                            <Chip
                              label={price.isActive ? t('products.active') : t('products.inactive')}
                              color={price.isActive ? 'success' : 'default'}
                              size="small"
                            />
                          </Stack>
                          
                          {price.barcode && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {t('products.barcode')}: {price.barcode}
                              {price.isGenerated && (
                                <Chip 
                                  label={t('products.autoGenerated')} 
                                  size="small" 
                                  color="info"
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Typography>
                          )}
                        </Box>

                        {/* المكونات */}
                        {price.productComponents && price.productComponents.length > 0 && (
                          <Accordion>
                            <AccordionSummary expandIcon={<IconChevronDown />}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconComponents size={20} />
                                <Typography variant="subtitle2">
                                  {t('products.components')} ({price.productComponents.length})
                                </Typography>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>{t('products.componentProduct')}</TableCell>
                                      <TableCell>{t('products.unit')}</TableCell>
                                      <TableCell>{t('products.quantity')}</TableCell>
                                      <TableCell>{t('products.notes')}</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {price.productComponents.map((component, componentIndex) => (
                                      <TableRow key={componentIndex}>
                                        <TableCell>
                                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                            {getComponentProductName(component)}
                                          </Typography>
                                          {component.rawProductPrice && (
                                            <Typography variant="caption" color="text.secondary">
                                              {t('products.barcode')}: {component.rawProductPrice.barcode}
                                            </Typography>
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          {component.rawProductPrice && (
                                            <Typography variant="body2">
                                              {getUnitName(component.rawProductPrice.unitId)} × {component.rawProductPrice.unitFactor}
                                            </Typography>
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                            {component.quantity}
                                          </Typography>
                                        </TableCell>
                                        <TableCell>
                                          <Typography variant="body2">
                                            {component.notes || '-'}
                                          </Typography>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </AccordionDetails>
                          </Accordion>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </Box>
          </>
        )}

        {!product && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Typography variant="h6" color="text.secondary">
              {t('products.selectProductToViewPrices')}
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default ProductPricesDrawer;
