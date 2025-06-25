// File: src/pages/products/components/ProductMultiSelectDialog.tsx
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Checkbox,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, Stack, Typography, InputAdornment,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { IconSearch, IconSelectAll } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import * as productsApi from 'src/utils/api/pagesApi/productsApi';
import * as groupsApi from 'src/utils/api/pagesApi/groupsApi';
import { Product } from 'src/utils/api/pagesApi/productsApi';
import { Group } from 'src/utils/api/pagesApi/groupsApi';

interface SelectedProduct {
  productPriceId: string;
  productName: string;
  priceName: string;
  price: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (products: SelectedProduct[]) => void;
  excludeProductId?: string;
  productType?: number;
  preSelectedItems?: string[]; // ⭐ إضافة المنتجات المختارة مسبقاً
}

const ProductMultiSelectDialog: React.FC<Props> = ({
  open, onClose, onSelect, excludeProductId, productType = 1, preSelectedItems = []
}) => {
  const { t } = useTranslation();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedGroupId, setSelectedGroupId] = React.useState('');
  const [selectedProducts, setSelectedProducts] = React.useState<Set<string>>(new Set());

  // تحميل المجموعات
  React.useEffect(() => {
    if (open) {
      loadGroups();
      loadProducts();
      // ⭐ تحميل المنتجات المختارة مسبقاً
      setSelectedProducts(new Set(preSelectedItems));
    }
  }, [open, preSelectedItems]);

  const loadGroups = async () => {
    try {
      const groupsData = await groupsApi.getAll();
      setGroups(groupsData);
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsApi.getByType(productType, 1, 100);
      const filteredProducts = data.data.filter(p => 
        p.id !== excludeProductId && 
        p.productPrices && 
        p.productPrices.length > 0 &&
        p.isActive
      );
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  // ⭐ فلترة المنتجات مع البحث في Product Name و Price Name
  const filteredProducts = React.useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      result = result.filter(product => {
        // البحث في اسم المنتج
        const productNameMatch = product.name.toLowerCase().includes(searchLower);
        
        // البحث في أسماء الأسعار
        const priceNameMatch = product.productPrices.some(price => 
          price.posPriceName && price.posPriceName.toLowerCase().includes(searchLower)
        );
        
        return productNameMatch || priceNameMatch;
      });
    }

    if (selectedGroupId) {
      result = result.filter(product => product.groupId === selectedGroupId);
    }

    return result;
  }, [products, searchQuery, selectedGroupId]);

  const allProductPrices = React.useMemo(() => {
    const prices: Array<{
      productPriceId: string;
      productId: string;
      productName: string;
      priceName: string;
      price: number;
      barcode: string;
    }> = [];

    filteredProducts.forEach(product => {
      product.productPrices.forEach(price => {
        prices.push({
          productPriceId: price.id,
          productId: product.id,
          productName: product.name,
          priceName: price.posPriceName || product.name,
          price: price.price,
          barcode: price.barcode
        });
      });
    });

    return prices;
  }, [filteredProducts]);

  const handleSelectAll = () => {
    if (selectedProducts.size === allProductPrices.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(allProductPrices.map(p => p.productPriceId)));
    }
  };

  const handleProductToggle = (productPriceId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productPriceId)) {
      newSelected.delete(productPriceId);
    } else {
      newSelected.add(productPriceId);
    }
    setSelectedProducts(newSelected);
  };

  const handleConfirm = () => {
    const selectedProductsData = allProductPrices
      .filter(p => selectedProducts.has(p.productPriceId))
      .map(p => ({
        productPriceId: p.productPriceId,
        productName: p.productName,
        priceName: p.priceName,
        price: p.price
      }));
    
    onSelect(selectedProductsData);
    onClose();
    setSelectedProducts(new Set());
  };

  const handleCancel = () => {
    onClose();
    setSelectedProducts(new Set());
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="lg" fullWidth>
      <DialogTitle>
        {t('products.form.selectProducts')}
      </DialogTitle>
      
      <DialogContent>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <TextField
            placeholder={t('products.form.searchProductsAndPrices')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={20} />
                </InputAdornment>
              )
            }}
            sx={{ flex: 1 }}
          />
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>{t('products.form.filterByGroup')}</InputLabel>
            <Select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              label={t('products.form.filterByGroup')}
            >
              <MenuItem value="">
                <em>{t('products.form.allGroups')}</em>
              </MenuItem>
              {groups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {t('products.form.productsFound', { count: allProductPrices.length })}
          </Typography>
          
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip 
              label={t('products.form.selected', { count: selectedProducts.size })}
              color="primary"
              variant="outlined"
            />
            <Button
              size="small"
              startIcon={<IconSelectAll />}
              onClick={handleSelectAll}
            >
              {selectedProducts.size === allProductPrices.length 
                ? t('products.form.deselectAll') 
                : t('products.form.selectAll')
              }
            </Button>
          </Stack>
        </Box>

        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedProducts.size === allProductPrices.length && allProductPrices.length > 0}
                    indeterminate={selectedProducts.size > 0 && selectedProducts.size < allProductPrices.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>{t('products.form.productName')}</TableCell>
                <TableCell>{t('products.form.priceName')}</TableCell>
                <TableCell>{t('products.form.price')}</TableCell>
                <TableCell>{t('products.form.barcode')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {t('common.loading')}
                  </TableCell>
                </TableRow>
              ) : allProductPrices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {t('products.form.noProductsFound')}
                  </TableCell>
                </TableRow>
              ) : (
                allProductPrices.map((productPrice) => (
                  <TableRow key={productPrice.productPriceId}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedProducts.has(productPrice.productPriceId)}
                        onChange={() => handleProductToggle(productPrice.productPriceId)}
                      />
                    </TableCell>
                    <TableCell>{productPrice.productName}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {productPrice.priceName}
                        </Typography>
                        {productPrice.priceName !== productPrice.productName && (
                          <Typography variant="caption" color="text.secondary">
                            ({productPrice.productName})
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {productPrice.price.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {productPrice.barcode || '-'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleCancel}>
          {t('common.cancel')}
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained"
          disabled={selectedProducts.size === 0}
        >
          {t('products.form.addSelected', { count: selectedProducts.size })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductMultiSelectDialog;
