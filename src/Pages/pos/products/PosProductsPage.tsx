// File: src/Pages/pos/products/PosProductsPage.tsx
import React from 'react';
import {
  Container, useMediaQuery,
  Snackbar, Alert, Box, Typography, Pagination,
  Stack, TextField, InputAdornment, IconButton, Chip, Button, Fab, Badge
} from '@mui/material';
import { IconSearch, IconBarcode, IconX, IconFilter, IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../../products/components/PageHeader';
import ActionsBar from '../../products/components/ActionsBar';
import ProductTable from '../../products/components/ProductTable';
import ProductRow from '../../products/components/ProductsRow';
import ProductForm from '../../products/components/ProductForm';
import ProductPricesDrawer from '../../products/components/ProductPricesDrawer';
import MobileProductsFilter, { ProductsFilterState } from '../../products/components/mobile/MobileProductsFilter';
import * as apiSrv from 'src/utils/api/pagesApi/productsApi';
import * as groupsApi from 'src/utils/api/pagesApi/groupsApi';
import * as unitsApi from 'src/utils/api/pagesApi/unitsApi';
import * as posScreensApi from 'src/utils/api/pagesApi/posScreensApi'; // ⭐ إضافة import للـ POS Screens
import { Product, ProductsResponse } from 'src/utils/api/pagesApi/productsApi';
import { Group } from 'src/utils/api/pagesApi/groupsApi';
import { Unit } from 'src/utils/api/pagesApi/unitsApi';
import { PosScreen } from 'src/utils/api/pagesApi/posScreensApi'; // ⭐ إضافة import للـ PosScreen type

interface PermissionProps {
  canAdd?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canExport?: boolean;
  canImport?: boolean;
  canView?: boolean;
}

interface Props extends PermissionProps {
  // Add other props here if needed
}

const PosProductsPage: React.FC<Props> = (props) => {
  const { canAdd = true, canImport = true, canExport = true } = props;
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
  const [posScreens, setPosScreens] = React.useState<PosScreen[]>([]); // ⭐ إضافة state للـ POS Screens
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchMode, setSearchMode] = React.useState<'name' | 'barcode' | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [error, setErr] = React.useState('');
  const [loading, setLoad] = React.useState(true);
  const [searching, setSearching] = React.useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [dialog, setDialog] = React.useState<{
    open: boolean;
    mode: 'add' | 'edit';
    current?: Product;
  }>({ open: false, mode: 'add', current: undefined });
  const [pricesDrawerOpen, setPricesDrawerOpen] = React.useState(false);

  const isDownSm = useMediaQuery((th: any) => th.breakpoints.down('sm'));
  const isMobile = useMediaQuery((th: any) => th.breakpoints.down('md'));

  const [mobileFilters, setMobileFilters] = React.useState<ProductsFilterState>({
    searchQuery: '',
    groupId: '',
    productType: '',
    status: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  /* ───── fetch POS products only ───── */
  const fetchProducts = async (page: number = 1, pageSize: number = 20) => {
    try {
      setLoad(true);
      const data = await apiSrv.getByType(1, page, pageSize);
      setProductsData(data);
      setCurrentPage(page);
    } catch (e: any) {
      setErr(e?.message || t('posProducts.errors.loadFailed'));
    } finally {
      setLoad(false);
    }
  };

  /* ───── search POS products ───── */
  const searchProducts = async (query: string, mode: 'name' | 'barcode') => {
    if (!query.trim()) {
      clearSearch();
      return;
    }

    try {
      setSearching(true);
      
      if (mode === 'barcode') {
        const product = await apiSrv.getByBarcode(query);
        if (product && product.productType === 1) {
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
        const filteredData = {
          ...data,
          data: data.data.filter(p => p.productType === 1)
        };
        setProductsData(filteredData);
      }
      
      setSearchMode(mode);
      setCurrentPage(1);
    } catch (e: any) {
      setErr(e?.message || t('posProducts.errors.searchFailed'));
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = async () => {
    setSearchQuery('');
    setSearchMode(null);
    await fetchProducts(1);
  };

  // ⭐ تحديث useEffect لتحميل POS Screens
  React.useEffect(() => {
    (async () => {
      try { 
        const [groupsData, unitsData, posScreensData] = await Promise.all([
          groupsApi.getAll(),
          unitsApi.getAll(),
          posScreensApi.getAll() // ⭐ تحميل POS Screens
        ]);
        setGroups(groupsData);
        setUnits(unitsData);
        setPosScreens(posScreensData); // ⭐ حفظ POS Screens في الـ state
        await fetchProducts(1);
      }
      catch (e: any) { 
        setErr(e?.message || t('posProducts.errors.loadFailed')); 
      }
    })();
  }, []);

  const handlePageChange = async (_event: React.ChangeEvent<unknown>, page: number) => {
    if (searchMode === 'name' && searchQuery) {
      try {
        setSearching(true);
        const data = await apiSrv.searchByName(searchQuery, page, 50);
        const filteredData = {
          ...data,
          data: data.data.filter(p => p.productType === 1)
        };
        setProductsData(filteredData);
        setCurrentPage(page);
      } catch (e: any) {
        setErr(e?.message || t('posProducts.errors.searchFailed'));
      } finally {
        setSearching(false);
      }
    } else if (!searchMode) {
      await fetchProducts(page);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
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

  const mobileFilteredData = React.useMemo(() => {
    let result = [...productsData.data];

    if (mobileFilters.searchQuery.trim()) {
      const searchLower = mobileFilters.searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.code.toString().includes(searchLower) ||
        product.group?.name.toLowerCase().includes(searchLower)
      );
    }

    if (mobileFilters.groupId) {
      result = result.filter(product => product.groupId === mobileFilters.groupId);
    }

    if (mobileFilters.status) {
      const isActive = mobileFilters.status === 'true';
      result = result.filter(product => product.isActive === isActive);
    }

    result.sort((a, b) => {
      let aValue: any = a[mobileFilters.sortBy as keyof typeof a];
      let bValue: any = b[mobileFilters.sortBy as keyof typeof b];

      if (mobileFilters.sortBy === 'createdOn') {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (mobileFilters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return result;
  }, [productsData.data, mobileFilters]);

  const displayedData = isMobile ? mobileFilteredData : productsData.data;

  const getActiveFiltersCount = () => {
    let count = 0;
    if (mobileFilters.searchQuery) count++;
    if (mobileFilters.groupId) count++;
    if (mobileFilters.status) count++;
    return count;
  };

  const handleAdd = async (data: any) => {
    try {
      const addData = {
        ...data,
        productType: 1
      };
      await apiSrv.add(addData);
      if (searchMode) {
        await clearSearch();
      } else {
        await fetchProducts(currentPage);
      }
    } catch (e: any) {
      const msg = e?.errors?.productName?.[0] || e?.message || t('posProducts.errors.addFailed');
      setErr(msg);
      throw e;
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      const updateData = {
        ...data,
        productType: 1
      };
      const updatedProduct = await apiSrv.update(updateData);
      
      setProductsData(prev => ({
        ...prev,
        data: prev.data.map(p => p.id === updatedProduct.id ? updatedProduct : p)
      }));
      
      if (selectedProduct && selectedProduct.id === data.productId) {
        setSelectedProduct(updatedProduct);
      }
      
      return updatedProduct;
    } catch (e: any) {
      console.error('Update error:', e);
      const msg = e?.errors?.productName?.[0] || e?.message || t('posProducts.errors.updateFailed');
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

  return (
    <Container maxWidth="xl">
      <PageHeader 
        title={t('posProducts.title')}
        exportData={displayedData} 
        loading={loading}
        showImport={canImport}
        showExport={canExport}
      />
      
      {!isMobile && (
        <Box mb={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
              <TextField
                placeholder={t('posProducts.searchPlaceholder')}
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
                title={t('posProducts.searchByBarcode')}
                disabled={!searchQuery.trim() || searching}
              >
                <IconBarcode size={20} />
              </IconButton>
            </Box>

            <ActionsBar
              onAdd={() => setDialog({ open: true, mode: 'add', current: undefined })}
            />
          </Stack>

          {searchMode && (
            <Box mt={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={searchMode === 'barcode' 
                    ? `${t('posProducts.searchByBarcode')}: ${searchQuery}`
                    : `${t('posProducts.searchByName')}: ${searchQuery}`
                  }
                  onDelete={clearSearch}
                  color="primary"
                  variant="outlined"
                />
                <Typography variant="body2" color="text.secondary">
                  {t('posProducts.searchResults', { count: productsData.totalCount })}
                </Typography>
              </Stack>
            </Box>
          )}
        </Box>
      )}

      {isMobile && (
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          {canAdd && (
            <Button
              variant="contained"
              startIcon={<IconPlus />}
              onClick={() => setDialog({ open: true, mode: 'add', current: undefined })}
              fullWidth
              size="large"
              sx={{
                minHeight: 48,
                fontSize: '1rem'
              }}
            >
              {t('posProducts.add')}
            </Button>
          )}
        </Box>
      )}

      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          {t('posProducts.title')} ({isMobile ? displayedData.length : productsData.totalCount})
        </Typography>
        
        {loading || searching ? (
          <Box textAlign="center" py={4}>
            <Typography>{searching ? t('posProducts.searching') : t('common.loading')}</Typography>
          </Box>
        ) : displayedData.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              {searchMode || getActiveFiltersCount() > 0 ? t('posProducts.noSearchResults') : t('posProducts.noProducts')}
            </Typography>
          </Box>
        ) : (
          <>
            {isDownSm
              ? displayedData.map(p => (
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
                    rows={displayedData}
                    onEdit={handleEdit}
                    onViewPrices={handleViewPrices}
                    selectedProductId={selectedProduct?.id}
                  />
                )}

            {!isMobile && productsData.pageCount > 1 && (
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

      {isMobile && (
        <Fab
          color="primary"
          onClick={() => setFilterOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 16,
            left: 16,
            zIndex: 1000
          }}
        >
          <Badge badgeContent={getActiveFiltersCount()} color="error">
            <IconFilter />
          </Badge>
        </Fab>
      )}

      {isMobile && (
        <MobileProductsFilter
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={mobileFilters}
          onFiltersChange={setMobileFilters}
          groups={groups}
          totalResults={productsData.totalCount}
          filteredResults={displayedData.length}
        />
      )}

      {/* ⭐ تمرير posScreens للـ ProductForm */}
      <ProductForm
        open={dialog.open}
        mode={dialog.mode}
        initialValues={dialog.current}
        groups={groups}
        units={units}
        posScreens={posScreens} // ⭐ تمرير POS Screens
        productType={1}
        onClose={() => setDialog({ open: false, mode: 'add', current: undefined })}
        onSubmit={handleSubmit}
      />

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

export default PosProductsPage;
