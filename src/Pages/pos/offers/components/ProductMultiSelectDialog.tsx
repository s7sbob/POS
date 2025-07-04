// File: src/pages/pos/offers/components/ProductMultiSelectDialog.tsx
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

interface SelectedProduct {
  productPriceId: string;
  productName: string;
  priceName: string;
  price: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (products: SelectedProduct[]) => void;
  title?: string;
  preSelectedItems?: string[]; // المنتجات المختارة مسبقاً
}

const ProductMultiSelectDialog: React.FC<Props> = ({
  open, onClose, onSubmit, title, preSelectedItems = []
}) => {
  const { t } = useTranslation();
  const [products, setProducts] = React.useState<any[]>([]);
  const [groups, setGroups] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedGroupId, setSelectedGroupId] = React.useState('');
  const [selectedProducts, setSelectedProducts] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    if (open) {
      loadGroups();
      loadProducts();
      // ⭐ تحميل المنتجات المختارة مسبقاً عند فتح الـ dialog
      console.log('Pre-selected items:', preSelectedItems);
      setSelectedProducts(new Set(preSelectedItems));
    }
  }, [open, preSelectedItems]);

  // ⭐ تحديث المنتجات المختارة عند تغيير preSelectedItems
  React.useEffect(() => {
    if (open) {
      console.log('Updating selected products with:', preSelectedItems);
      setSelectedProducts(new Set(preSelectedItems));
    }
  }, [preSelectedItems, open]);

  const loadGroups = async () => {
    try {
      const groupsData = await groupsApi.getAll();
      const flatGroups = flattenGroups(groupsData);
      setGroups(flatGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  };

  const flattenGroups = (groups: any[]): any[] => {
    const result: any[] = [];
    
    const flatten = (items: any[], level = 0) => {
      items.forEach(item => {
        result.push({
          ...item,
          displayName: '  '.repeat(level) + item.name,
          level
        });
        if (item.children && item.children.length > 0) {
          flatten(item.children, level + 1);
        }
      });
    };
    
    flatten(groups);
    return result;
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsApi.getAll(1, 100);
      const filteredProducts = data.data.filter(p => 
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

const filteredProducts = React.useMemo(() => {
  let result = [...products];

  if (searchQuery.trim()) {
    const searchLower = searchQuery.toLowerCase();
    result = result.filter(product => {
      // البحث في اسم المنتج
      const productNameMatch = product.name.toLowerCase().includes(searchLower);
      
      // البحث في أسماء الأسعار والاسم المدمج
      const priceNameMatch = product.productPrices.some((price: any) => {
        const priceName = price.posPriceName;
        const combinedName = priceName  && priceName !== product.name
          ? `${product.name} - ${priceName}`
          : product.name;
        
        return priceName.toLowerCase().includes(searchLower) ||
               combinedName.toLowerCase().includes(searchLower);
      });
      
      // البحث في الباركود
      const barcodeMatch = product.productPrices.some((price: any) => 
        price.barcode && price.barcode.toLowerCase().includes(searchLower)
      );
      
      return productNameMatch || priceNameMatch || barcodeMatch;
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
    displayName: string; // ⭐ إضافة displayName محسن
  }> = [];

  filteredProducts.forEach(product => {
    product.productPrices.forEach((price: any) => {
      const priceName = price.posPriceName;
      
      prices.push({
        productPriceId: price.id,
        productId: product.id,
        productName: product.name,
        priceName: priceName,
        price: price.price,
        barcode: price.barcode || '',
        // ⭐ إنشاء displayName محسن
        displayName: priceName  && priceName !== product.name
          ? `${product.name} - ${priceName}`
          : product.name
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
      console.log('Removed product:', productPriceId);
    } else {
      newSelected.add(productPriceId);
      console.log('Added product:', productPriceId);
    }
    setSelectedProducts(newSelected);
  };

  const handleConfirm = () => {
    // ⭐ إرجاع كل المنتجات المختارة (الجديدة والقديمة)
    const selectedProductsData = allProductPrices
      .filter(p => selectedProducts.has(p.productPriceId))
      .map(p => ({
        productPriceId: p.productPriceId,
        productName: p.productName,
        priceName: p.priceName,
        price: p.price
      }));
    
    console.log('Final selected products:', selectedProductsData);
    console.log('Selected product IDs:', Array.from(selectedProducts));
    
    onSubmit(selectedProductsData);
    handleCancel();
  };

  const handleCancel = () => {
    onClose();
    setSearchQuery('');
    setSelectedGroupId('');
    // ⭐ إعادة تعيين للمنتجات المختارة مسبقاً عند الإلغاء
    setSelectedProducts(new Set(preSelectedItems));
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="lg" fullWidth>
      <DialogTitle>
        {title || t('offers.form.selectProducts')}
      </DialogTitle>
      
      <DialogContent>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <TextField
            placeholder={t('offers.form.searchProductsAndPrices')}
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
            <InputLabel>{t('offers.form.filterByGroup')}</InputLabel>
            <Select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              label={t('offers.form.filterByGroup')}
            >
              <MenuItem value="">
                <em>{t('offers.form.allGroups')}</em>
              </MenuItem>
              {groups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.displayName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {t('offers.form.productsFound', { count: allProductPrices.length })}
          </Typography>
          
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip 
              label={t('offers.form.selected', { count: selectedProducts.size })}
              color="primary"
              variant="outlined"
            />
            <Button
              size="small"
              startIcon={<IconSelectAll />}
              onClick={handleSelectAll}
            >
              {selectedProducts.size === allProductPrices.length 
                ? t('offers.form.deselectAll') 
                : t('offers.form.selectAll')
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
        <TableCell>{t('offers.form.productName')}</TableCell>
        {/* ⭐ حذف عمود اسم السعر */}
        <TableCell>{t('offers.form.price')}</TableCell>
        <TableCell>{t('offers.form.barcode')}</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {loading ? (
        <TableRow>
          <TableCell colSpan={4} align="center">
            {t('common.loading')}
          </TableCell>
        </TableRow>
      ) : allProductPrices.length === 0 ? (
        <TableRow>
          <TableCell colSpan={4} align="center">
            {t('offers.form.noProductsFound')}
          </TableCell>
        </TableRow>
      ) : (
        allProductPrices.map((productPrice) => (
          <TableRow 
            key={productPrice.productPriceId}
            hover
            sx={{ cursor: 'pointer' }}
            onClick={() => handleProductToggle(productPrice.productPriceId)}
          >
            <TableCell padding="checkbox">
              <Checkbox
                checked={selectedProducts.has(productPrice.productPriceId)}
                onChange={() => handleProductToggle(productPrice.productPriceId)}
              />
            </TableCell>
            <TableCell>
              {/* ⭐ دمج اسم المنتج مع اسم السعر */}
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {productPrice.displayName
                    ? productPrice.displayName
                    : productPrice.productName
                  }
                </Typography>
                {/* يمكن إضافة معلومات إضافية كـ subtitle إذا لزم الأمر */}
                {productPrice.priceName  && productPrice.priceName !== productPrice.productName && (
                  <Typography variant="caption" color="text.secondary">
                    {productPrice.productName}
                  </Typography>
                )}
              </Box>
            </TableCell>
            <TableCell>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {productPrice.price.toFixed(2)} {t('common.currency')}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body2" color="text.secondary" fontFamily="monospace">
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
          {t('offers.form.addSelected', { count: selectedProducts.size })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductMultiSelectDialog;
