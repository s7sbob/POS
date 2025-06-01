import React from 'react';
import {
  Container, useMediaQuery,
  Snackbar, Alert, Box, Typography
} from '@mui/material';
import PageHeader from './components/PageHeader';
import ActionsBar from './components/ActionsBar';
import ProductTable from './components/ProductTable';
import ProductRow from './components/ProductsRow';
import ProductForm from './components/ProductForm';
import ProductPricesDrawer from './components/ProductPricesDrawer';
import * as apiSrv from 'src/utils/productsApi';
import * as groupsApi from 'src/utils/groupsApi';
import * as unitsApi from 'src/utils/unitsApi';
import { Product } from 'src/utils/productsApi';
import { Group } from 'src/utils/groupsApi';
import { Unit } from 'src/utils/unitsApi';
import { t } from 'i18next';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [units, setUnits] = React.useState<Unit[]>([]);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [query, setQuery] = React.useState('');
  const [error, setErr] = React.useState('');
  const [loading, setLoad] = React.useState(true);
  const [dialog, setDialog] = React.useState<{
    open: boolean;
    mode: 'add' | 'edit';
    current?: Product;
  }>({ open: false, mode: 'add', current: undefined });
  const [pricesDrawerOpen, setPricesDrawerOpen] = React.useState(false);

  const isDownSm = useMediaQuery((th: any) => th.breakpoints.down('sm'));

  /* ───── fetch all ───── */
  const fetchProducts = async () => {
    try {
      const productsData = await apiSrv.getAll();
      setProducts(productsData);
    } catch (e: any) {
      setErr(e?.message || 'Failed to load products');
    }
  };

  React.useEffect(() => {
    (async () => {
      try { 
        const [productsData, groupsData, unitsData] = await Promise.all([
          apiSrv.getAll(),
          groupsApi.getAll(),
          unitsApi.getAll()
        ]);
        setProducts(productsData);
        setGroups(groupsData);
        setUnits(unitsData);
      }
      catch (e: any) { 
        setErr(e?.message || 'Load failed'); 
      }
      finally { 
        setLoad(false); 
      }
    })();
  }, []);

  /* ───── filter ───── */
  const filtered = React.useMemo(
    () => query ? products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.group?.name.toLowerCase().includes(query.toLowerCase())
    ) : products,
    [products, query]
  );

  /* ───── flatten groups for dropdown ───── */


  /* ───── CRUD ───── */
  const handleAdd = async (data: any) => {
    try {
      console.log('Adding product:', data);
      const newProduct = await apiSrv.add(data);
      await fetchProducts();
      return newProduct;
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
      console.log('Updated product result:', updatedProduct);
      
      await fetchProducts();
      
      // تحديث المنتج في الـ drawer إذا كان مفتوح
      if (selectedProduct && selectedProduct.id === data.ProductId) {
        const refreshedProduct = await apiSrv.getById(data.ProductId);
        setSelectedProduct(refreshedProduct);
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
        // saveAndNew - إعادة تعيين النموذج للإضافة
        setDialog({ open: true, mode: 'add', current: undefined });
      }
    } catch (error) {
      // في حالة الخطأ، لا نغلق المودال
      throw error;
    }
  };

  // دالة منفصلة لعرض الأسعار فقط - تفتح الـ drawer
  const handleViewPrices = (product: Product) => {
    setSelectedProduct(product);
    setPricesDrawerOpen(true);
  };

  // دالة منفصلة للتعديل فقط - تفتح المودال
  const handleEdit = (product: Product) => {
    setDialog({ open: true, mode: 'edit', current: product });
  };

  /* ───── UI ───── */
  return (
    <Container maxWidth="xl">
      <PageHeader />
      <ActionsBar
        query={query}
        onQueryChange={setQuery}
        onAdd={() => setDialog({ open: true, mode: 'add', current: undefined })}
      />

      {/* جدول المنتجات */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          {t('products.title')}
        </Typography>
        {isDownSm
          ? filtered.map(p => (
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
                rows={filtered}
                onEdit={handleEdit}
                onViewPrices={handleViewPrices}
                selectedProductId={selectedProduct?.id}
              />
            )}
      </Box>

      {/* ------------ Form Dialog ------------ */}
      <ProductForm
        open={dialog.open}
        mode={dialog.mode}
        initialValues={dialog.current}
        groups={groups}
        units={units}
        onClose={() => setDialog({ open: false, mode: 'add', current: undefined })}
        onSubmit={handleSubmit}
      />

      {/* ------------ Prices Drawer ------------ */}
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

      {loading && <div>Loading…</div>}
    </Container>
  );
};

export default ProductsPage;
