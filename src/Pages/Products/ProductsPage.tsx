// File: src/pages/products/ProductsPage.tsx
import React from 'react';
import {
  Container, useMediaQuery, Box, Typography, Pagination,
  Stack, TextField, InputAdornment, IconButton, Chip, Button, Fab, Badge
} from '@mui/material';
import { IconSearch, IconBarcode, IconX, IconFilter, IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import PageHeader from './components/PageHeader';
import ActionsBar from './components/ActionsBar';
import ProductTable from './components/ProductTable';
import ProductRow from './components/ProductsRow';
import ProductForm from './components/ProductForm';
import ProductPricesDrawer from './components/ProductPricesDrawer';
import MobileProductsFilter, { ProductsFilterState } from './components/mobile/MobileProductsFilter';
import * as apiSrv from 'src/utils/api/pagesApi/productsApi';
import * as groupsApi from 'src/utils/api/pagesApi/groupsApi';
import * as unitsApi from 'src/utils/api/pagesApi/unitsApi';
import { Product, ProductsResponse } from 'src/utils/api/pagesApi/productsApi';
import { Group } from 'src/utils/api/pagesApi/groupsApi';
import { Unit } from 'src/utils/api/pagesApi/unitsApi';

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

const ProductsPage: React.FC<Props> = (props) => {
  const { canAdd = true } = props;
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
  const [currentPage, setCurrentPage] = React.useState(1);  const [loading, setLoad] = React.useState(true);
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

  // حالة الفلاتر للموبايل
  const [mobileFilters, setMobileFilters] = React.useState<ProductsFilterState>({
    searchQuery: '',
    groupId: '',
    productType: '',
    status: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  /* ───── fetch products with pagination ───── */
const fetchProducts = async (page: number = 1, pageSize: number = 20) => {
  try {
    setLoad(true);
    // ⭐ هنا التغيير الوحيد - نجيب Materials بس
    const data = await apiSrv.getByType(2, page, pageSize); // ProductType.Material = 2
    setProductsData(data);
    setCurrentPage(page);
  } catch (e: any) {  } finally {
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
    } catch (e: any) {    } finally {
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
      catch (e: any) {      }
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
      } catch (e: any) {      } finally {
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

  /* ───── mobile filter data ───── */
  const mobileFilteredData = React.useMemo(() => {
    let result = [...productsData.data];

    // تطبيق فلاتر الموبايل على البيانات المحملة
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

    if (mobileFilters.productType) {
      result = result.filter(product => product.productType.toString() === mobileFilters.productType);
    }

    if (mobileFilters.status) {
      const isActive = mobileFilters.status === 'true';
      result = result.filter(product => product.isActive === isActive);
    }

    // الترتيب
    result.sort((a, b) => {
      let aValue: any = a[mobileFilters.sortBy as keyof typeof a];
      let bValue: any = b[mobileFilters.sortBy as keyof typeof b];

      // معالجة خاصة للتواريخ
      if (mobileFilters.sortBy === 'createdOn') {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      }

      // معالجة خاصة للنصوص
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

  // اختيار البيانات المعروضة حسب نوع الجهاز
  const displayedData = isMobile ? mobileFilteredData : productsData.data;

  // حساب عدد الفلاتر النشطة للموبايل
  const getActiveFiltersCount = () => {
    let count = 0;
    if (mobileFilters.searchQuery) count++;
    if (mobileFilters.groupId) count++;
    if (mobileFilters.productType) count++;
    if (mobileFilters.status) count++;
    return count;
  };

  /* ───── CRUD ───── */
  const handleAdd = async (data: any) => {
    try {
      await apiSrv.add(data);
      // إعادة تحميل الصفحة الحالية
      if (searchMode) {
        await clearSearch();
      } else {
        await fetchProducts(currentPage);
      }
    } catch (e: any) {
      throw e;
    }
  };

  const handleUpdate = async (data: any) => {
    try {
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
      <PageHeader exportData={displayedData} loading={loading} title={t('products.title')}/>
      
      {/* شريط البحث المحسن - يظهر فقط في الديسكتوب */}
      {!isMobile && (
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
      )}

      {/* زر الإضافة للموبايل */}
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
            {t('products.add')}
          </Button>
        )}
        </Box>
      )}

      {/* جدول المنتجات */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          {t('products.title')} ({isMobile ? displayedData.length : productsData.totalCount})
        </Typography>
        
        {loading || searching ? (
          <Box textAlign="center" py={4}>
            <Typography>{searching ? t('products.searching') : t('common.loading')}</Typography>
          </Box>
        ) : displayedData.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              {searchMode || getActiveFiltersCount() > 0 ? t('products.noSearchResults') : t('products.noProducts')}
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

            {/* Pagination - يظهر فقط في الديسكتوب */}
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

      {/* زر الفلترة للموبايل */}
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

      {/* مكون الفلترة للموبايل */}
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

      {/* Form Dialog */}
<ProductForm
  open={dialog.open}
  mode={dialog.mode}
  initialValues={dialog.current}
  groups={groups}
  units={units}
  productType={2} // ⭐ Material
  onClose={() => setDialog({ open: false, mode: 'add', current: undefined })}
  onSubmit={handleSubmit}
/>

      {/* Prices Drawer */}
      <ProductPricesDrawer
        open={pricesDrawerOpen}
        product={selectedProduct}
        units={units}
        onClose={() => setPricesDrawerOpen(false)}
      /></Container>
  );
};

export default ProductsPage;
