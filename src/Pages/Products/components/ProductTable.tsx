// File: src/pages/products/components/ProductTable.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
  Tooltip
} from '@mui/material';
import { IconEdit, IconEye, IconBarcode } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Product } from 'src/utils/api/pagesApi/productsApi';

interface Props {
  rows: Product[];
  onEdit: (product: Product) => void;
  onViewPrices: (product: Product) => void;
  selectedProductId?: string;
}

const ProductTable: React.FC<Props> = ({
  rows,
  onEdit,
  onViewPrices,
  selectedProductId
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
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('products.code')}</TableCell>
            <TableCell>{t('products.name')}</TableCell>
            <TableCell>{t('products.group')}</TableCell>
            <TableCell>{t('products.type')}</TableCell>
            <TableCell>{t('products.prices')}</TableCell>
            {/* ⭐ إضافة عمود الحالة */}
            <TableCell>{t('products.status.title')}</TableCell>
            <TableCell>{t('products.description')}</TableCell>
            <TableCell width={120}>{t('common.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((product) => (
            <TableRow
              key={product.id}
              selected={selectedProductId === product.id}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                ...(selectedProductId === product.id && {
                  backgroundColor: 'action.selected',
                }),
              }}
            >
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {product.code}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {product.name}
                  </Typography>
                  {/* ⭐ عرض POS Screen للمنتجات من نوع POS */}
                  {product.productType === 1 && product.posScreen && (
                    <Typography variant="caption" color="text.secondary">
                      📱 {product.posScreen.name}
                    </Typography>
                  )}
                </Box>
              </TableCell>
              
              <TableCell>
                <Typography variant="body2">
                  {product.group?.name || t('common.notSpecified')}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Chip
                  label={getProductTypeLabel(product.productType)}
                  color={getProductTypeColor(product.productType)}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              
              <TableCell>
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
              </TableCell>
              
              {/* ⭐ عمود الحالة */}
              <TableCell>
                <Chip
                  label={product.isActive ? t('products.status.active') : t('products.status.inactive')}
                  color={product.isActive ? 'success' : 'error'}
                  size="small"
                  variant={product.isActive ? 'filled' : 'outlined'}
                />
              </TableCell>
              
              <TableCell>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {product.description || '-'}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Tooltip title={t('common.edit')}>
                    <IconButton
                      size="small"
                      onClick={() => onEdit(product)}
                      color="primary"
                    >
                      <IconEdit size={18} />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title={t('products.viewPrices')}>
                    <IconButton
                      size="small"
                      onClick={() => onViewPrices(product)}
                      color="info"
                    >
                      <IconEye size={18} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTable;
