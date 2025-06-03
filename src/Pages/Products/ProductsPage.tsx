import React from 'react';
import {
  Container, useMediaQuery,
  Snackbar, Alert, Box, Typography, Pagination,
  Stack, TextField, InputAdornment, IconButton, Chip
} from '@mui/material';
import { IconSearch, IconBarcode, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import PageHeader from './components/PageHeader';
import ActionsBar from './components/ActionsBar';
import ProductTable from './components/ProductTable';
import ProductRow from './components/ProductsRow';
import ProductForm from './components/ProductForm';
import ProductPricesDrawer from './components/ProductPricesDrawer';
import * as apiSrv from 'src/utils/api/productsApi';
import * as groupsApi from 'src/utils/api/groupsApi';
import * as unitsApi from 'src/utils/api/unitsApi';
import { Product, ProductsResponse } from 'src/utils/api/productsApi';
import { Group } from 'src/utils/api/groupsApi';
import { Unit } from 'src/utils/api/unitsApi';

const ProductsPage: React.FC = () => {
  const { t } = useTranslation();
  const [productsData, setProductsData] = React.useState<ProductsResponse>({
    totalCount: 0,
    pageCount: 0,
    pageNumber: 1,
    pageSize: 20,
    data: []
  });
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [units, setUnits] = React.useState<Unit[]>([]);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchMode, setSearchMode] = React.useState<'name' | 'barcode' | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [error, setErr] = React.useState('');
  const [loading, setLoad] = React.useState(true);
  const [searching, setSearching] = React.useState(false);
  const [dialog, setDialog] = React.useState<{
    open: boolean;
    mode: 'add' | 'edit';
    current?: Product;
  }>({ open: false, mode: 'add', current: undefined });
  const [pricesDrawerOpen, setPricesDrawerOpen] = React.useState(false);

  const isDownSm = useMediaQuery((th: any) => th.breakpoints.down('sm'));

  /* ───── fetch products with pagination ───── */
  const fetchProducts = async (page: number = 1, pageSize: number = 20) => {
    try {
      setLoad(true);
      const data = await apiSrv.getAll(page, pageSize);
      setProductsData(data);
      setCurrentPage(page);
    } catch (e: any) {
      setErr(e?.message || 'Failed to load products');
    } finally {
      setLoad(false);
    }
  };

  /* ───── search products ───── */
  const searchProducts = async (query: string, mode: 'name' | 'barcode') => {
    if (!query.trim()) {
      clearSearch();
      return;
    }

    try {
      setSearching(true);
      
      if (mode === 'barcode') {
        const product = await apiSrv.getByBarcode(query);
        if (product) {
          setProductsData({
            totalCount: 1,
            pageCount: 1,
            pageNumber: 1,
            pageSize: 1,
            data: [product]
          });
        } else {
          setProductsData({
            totalCount: 0,
            pageCount: 0,
            pageNumber: 1,
            pageSize: 20,
            data: []
          });
        }
      } else {
        const data = await apiSrv.searchByName(query, 1, 50);
        setProductsData(data);
      }
      
      setSearchMode(mode);
      setCurrentPage(1);
    } catch (e: any) {
      setErr(e?.message || 'Search failed');
    } finally {
      setSearching(false);
    }
  };

  /* ───── clear search ───── */
  const clearSearch = async () => {
    setSearchQuery('');
    setSearchMode(null);
    await fetchProducts(1);
  };

  /* ───── initial load ───── */
  React.useEffect(() => {
    (async () => {
      try { 
        const [groupsData, unitsData] = await Promise.all([
          groupsApi.getAll(),
          unitsApi.getAll()
        ]);
        setGroups(groupsData);
        setUnits(unitsData);
        await fetchProducts(1);
      }
      catch (e: any) { 
        setErr(e?.message || 'Load failed'); 
      }
    })();
  }, []);

  /* ───── handle page change ───── */
  const handlePageChange = async (_event: React.ChangeEvent<unknown>, page: number) => {
    if (searchMode === 'name' && searchQuery) {
      try {
        setSearching(true);
        const data = await apiSrv.searchByName(searchQuery, page, 50);
        setProductsData(data);
        setCurrentPage(page);
      } catch (e: any) {
        setErr(e?.message || 'Search failed');
      } finally {
        setSearching(false);
      }
    } else if (!searchMode) {
      await fetchProducts(page);
    }
  };

  /* ───── search handlers ───── */
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      // تحديد نوع البحث بناءً على المحتوى
      const isBarcode = /^\d+$/.test(query.trim());
      searchProducts(query, isBarcode ? 'barcode' : 'name');
    } else {
      clearSearch();
    }
  };

  const handleBarcodeSearch = () => {
    if (searchQuery.trim()) {
      searchProducts(searchQuery, 'barcode');
    }
  };

  /* ───── flatten groups for dropdown ───── */


  /* ───── CRUD ───── */
  const handleAdd = async (data: any) => {
    try {
      console.log('Adding product:', data);
      await apiSrv.add(data);
      // إعادة تحميل الصفحة الحالية
      if (searchMode) {
        await clearSearch();
      } else {
        await fetchProducts(currentPage);
      }
    } catch (e: any) {
      const msg = e?.errors?.productName?.[0] || e?.message || 'Add failed';
      setErr(msg);
      throw e;
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      console.log('Updating product:', data);
      const updatedProduct = await apiSrv.update(data);
      
      // تحديث المنتج في القائمة الحالية
      setProductsData(prev => ({
        ...prev,
        data: prev.data.map(p => p.id === updatedProduct.id ? updatedProduct : p)
      }));
      
      // تحديث المنتج في الـ drawer إذا كان مفتوح
      if (selectedProduct && selectedProduct.id === data.ProductId) {
        setSelectedProduct(updatedProduct);
      }
      
      return updatedProduct;
    } catch (e: any) {
      console.error('Update error:', e);
      const msg = e?.errors?.productName?.[0] || e?.message || 'Update failed';
      setErr(msg);
      throw e;
    }
  };

  const handleSubmit = async (data: any, saveAction: 'save' | 'saveAndNew') => {
    try {
      if (dialog.mode === 'add') {
        await handleAdd(data);
      } else {
        await handleUpdate(data);
      }
      
      if (saveAction === 'save') {
        setDialog({ open: false, mode: 'add', current: undefined });
      } else {
        setDialog({ open: true, mode: 'add', current: undefined });
      }
    } catch (error) {
      throw error;
    }
  };

  const handleViewPrices = (product: Product) => {
    setSelectedProduct(product);
    setPricesDrawerOpen(true);
  };

  const handleEdit = (product: Product) => {
    setDialog({ open: true, mode: 'edit', current: product });
  };

  /* ───── UI ───── */
  return (
    <Container maxWidth="xl">
      <PageHeader />
      
      {/* شريط البحث المحسن */}
      <Box mb={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
            <TextField
              placeholder={t('products.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size={20} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={clearSearch}>
                      <IconX size={16} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ width: { xs: '100%', sm: 300 } }}
              disabled={searching}
            />
            
            <IconButton 
              onClick={handleBarcodeSearch}
              color="primary"
              title={t('products.searchByBarcode')}
              disabled={!searchQuery.trim() || searching}
            >
              <IconBarcode size={20} />
            </IconButton>
          </Box>

          <ActionsBar
            onAdd={() => setDialog({ open: true, mode: 'add', current: undefined })}
          />
        </Stack>

        {/* مؤشرات البحث */}
        {searchMode && (
          <Box mt={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={searchMode === 'barcode' 
                  ? `${t('products.searchByBarcode')}: ${searchQuery}`
                  : `${t('products.searchByName')}: ${searchQuery}`
                }
                onDelete={clearSearch}
                color="primary"
                variant="outlined"
              />
              <Typography variant="body2" color="text.secondary">
                {t('products.searchResults', { count: productsData.totalCount })}
              </Typography>
            </Stack>
          </Box>
        )}
      </Box>

      {/* جدول المنتجات */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          {t('products.title')} ({productsData.totalCount})
        </Typography>
        
        {loading || searching ? (
          <Box textAlign="center" py={4}>
            <Typography>{searching ? t('products.searching') : t('common.loading')}</Typography>
          </Box>
        ) : productsData.data.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              {searchMode ? t('products.noSearchResults') : t('products.noProducts')}
            </Typography>
          </Box>
        ) : (
          <>
            {isDownSm
              ? productsData.data.map(p => (
                  <ProductRow
                    key={p.id}
                    product={p}
                    onEdit={() => handleEdit(p)}
                    onViewPrices={() => handleViewPrices(p)}
                    isSelected={selectedProduct?.id === p.id}
                  />
                ))
              : (
                  <ProductTable
                    rows={productsData.data}
                    onEdit={handleEdit}
                    onViewPrices={handleViewPrices}
                    selectedProductId={selectedProduct?.id}
                  />
                )}

            {/* Pagination */}
            {productsData.pageCount > 1 && (
              <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                  count={productsData.pageCount}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size={isDownSm ? "small" : "medium"}
                  disabled={searching}
                />
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Form Dialog */}
      <ProductForm
        open={dialog.open}
        mode={dialog.mode}
        initialValues={dialog.current}
        groups={groups}
        units={units}
        onClose={() => setDialog({ open: false, mode: 'add', current: undefined })}
        onSubmit={handleSubmit}
      />

      {/* Prices Drawer */}
      <ProductPricesDrawer
        open={pricesDrawerOpen}
        product={selectedProduct}
        units={units}
        onClose={() => setPricesDrawerOpen(false)}
      />

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setErr('')}>
        <Alert severity="error" onClose={() => setErr('')}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductsPage;
