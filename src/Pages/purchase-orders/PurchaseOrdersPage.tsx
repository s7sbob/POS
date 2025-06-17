// File: src/pages/purchases/purchase-orders/PurchaseOrdersPage.tsx
import React from 'react';
import {
  Container, useMediaQuery,
  Snackbar, Alert, Box, Typography, Fab, Badge
} from '@mui/material';
import { IconFilter } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from './components/PageHeader';
import ActionsBar from './components/ActionsBar';
import PurchaseOrderTable from './components/PurchaseOrderTable';
import PurchaseOrderRow from './components/PurchaseOrderRow';
import MobilePurchaseOrdersFilter, { PurchaseOrderFilterState } from './components/mobile/MobilePurchaseOrdersFilter';
import * as apiSrv from 'src/utils/api/pagesApi/purchaseOrdersApi';
import * as suppliersApi from 'src/utils/api/pagesApi/suppliersApi';
import * as warehousesApi from 'src/utils/api/pagesApi/warehousesApi';
import { PurchaseOrder } from 'src/utils/api/pagesApi/purchaseOrdersApi';
import { t } from 'i18next';

const PurchaseOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [purchaseOrders, setPurchaseOrders] = React.useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = React.useState<Array<{ id: string; name: string }>>([]);
  const [warehouses, setWarehouses] = React.useState<Array<{ id: string; name: string }>>([]);
  const [query, setQuery] = React.useState('');
  const [error, setErr] = React.useState('');
  const [loading, setLoad] = React.useState(true);
  const [filterOpen, setFilterOpen] = React.useState(false);

  const isDownSm = useMediaQuery((th: any) => th.breakpoints.down('sm'));
  const isMobile = useMediaQuery((th: any) => th.breakpoints.down('md'));

  // حالة الفلاتر للموبايل
  const [mobileFilters, setMobileFilters] = React.useState<PurchaseOrderFilterState>({
    searchQuery: '',
    status: '',
    supplierId: '',
    warehouseId: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'date1',
    sortOrder: 'desc'
  });

  /* ───── fetch all ───── */
  const fetchPurchaseOrders = async () => {
    try {
      const purchaseOrdersData = await apiSrv.getAll();
      setPurchaseOrders(purchaseOrdersData);
    } catch (e: any) {
      setErr(e?.message || 'Failed to load purchase orders');
    }
  };

  const fetchSuppliers = async () => {
    try {
      const suppliersData = await suppliersApi.getAll();
      setSuppliers(suppliersData.map((s: { id: any; name: any; }) => ({ id: s.id, name: s.name })));
    } catch (e: any) {
      console.error('Failed to load suppliers:', e);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const warehousesData = await warehousesApi.getAll();
      setWarehouses(warehousesData.map((w: { id: any; name: any; }) => ({ id: w.id, name: w.name })));
    } catch (e: any) {
      console.error('Failed to load warehouses:', e);
    }
  };

  React.useEffect(() => {
    (async () => {
      try { 
        await Promise.all([
          fetchPurchaseOrders(),
          fetchSuppliers(),
          fetchWarehouses()
        ]);
      }
      catch (e: any) { 
        setErr(e?.message || 'Load failed'); 
      }
      finally { 
        setLoad(false); 
      }
    })();
  }, []);

  /* ───── filter for desktop ───── */
  const desktopFiltered = React.useMemo(
    () => query ? purchaseOrders.filter(po => 
      po.referenceDocNumber.toLowerCase().includes(query.toLowerCase()) ||
      po.supplier?.name.toLowerCase().includes(query.toLowerCase()) ||
      po.warehouse?.name.toLowerCase().includes(query.toLowerCase())
    ) : purchaseOrders,
    [purchaseOrders, query]
  );

  /* ───── filter for mobile ───── */
  const mobileFiltered = React.useMemo(() => {
    let result = [...purchaseOrders];

    // البحث
    if (mobileFilters.searchQuery.trim()) {
      const searchLower = mobileFilters.searchQuery.toLowerCase();
      result = result.filter(order => 
        order.referenceDocNumber.toLowerCase().includes(searchLower) ||
        order.supplier?.name.toLowerCase().includes(searchLower) ||
        order.warehouse?.name.toLowerCase().includes(searchLower) ||
        order.id?.toLowerCase().includes(searchLower)
      );
    }

    // فلتر الحالة
    if (mobileFilters.status) {
      result = result.filter(order => order.status.toString() === mobileFilters.status);
    }

    // فلتر المورد
    if (mobileFilters.supplierId) {
      result = result.filter(order => order.supplierId === mobileFilters.supplierId);
    }

    // فلتر المخزن
    if (mobileFilters.warehouseId) {
      result = result.filter(order => order.warehouseId === mobileFilters.warehouseId);
    }

    // فلتر التاريخ
    if (mobileFilters.dateFrom) {
      result = result.filter(order => {
        const orderDate = new Date(order.date1).toISOString().split('T')[0];
        return orderDate >= mobileFilters.dateFrom;
      });
    }

    if (mobileFilters.dateTo) {
      result = result.filter(order => {
        const orderDate = new Date(order.date1).toISOString().split('T')[0];
        return orderDate <= mobileFilters.dateTo;
      });
    }

    // الترتيب
    result.sort((a, b) => {
      let aValue: any = a[mobileFilters.sortBy as keyof typeof a];
      let bValue: any = b[mobileFilters.sortBy as keyof typeof b];

      // معالجة خاصة للتواريخ
      if (mobileFilters.sortBy === 'date1') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
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
  }, [purchaseOrders, mobileFilters]);

  // اختيار البيانات المفلترة حسب نوع الجهاز
  const filtered = isMobile ? mobileFiltered : desktopFiltered;

  // حساب عدد الفلاتر النشطة للموبايل
  const getActiveFiltersCount = () => {
    let count = 0;
    if (mobileFilters.searchQuery) count++;
    if (mobileFilters.status) count++;
    if (mobileFilters.supplierId) count++;
    if (mobileFilters.warehouseId) count++;
    if (mobileFilters.dateFrom || mobileFilters.dateTo) count++;
    return count;
  };

  /* ───── Navigation handlers ───── */
  const handleAdd = () => {
    navigate('/purchases/purchase-orders/add');
  };

  const handleEdit = (purchaseOrder: PurchaseOrder) => {
    navigate(`/purchases/purchase-orders/edit/${purchaseOrder.id}`);
  };

  /* ───── UI ───── */
  return (
    <Container maxWidth="xl">
      <PageHeader exportData={filtered} loading={loading}/>
      
      {/* شريط الأدوات - يظهر فقط في الديسكتوب */}
      {!isMobile && (
        <ActionsBar
          query={query}
          onQueryChange={setQuery}
          onAdd={handleAdd}
        />
      )}

      {/* زر الإضافة للموبايل */}
      {isMobile && (
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <ActionsBar
            onAdd={handleAdd} query={''} onQueryChange={function (): void {
              throw new Error('Function not implemented.');
            } }          />
        </Box>
      )}

      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          {t('purchaseOrders.title')} {` (${filtered.length})`}
        </Typography>
        
        {loading ? (
          <Box textAlign="center" py={4}>
            <Typography>جاري التحميل...</Typography>
          </Box>
        ) : filtered.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              {(isMobile ? mobileFilters.searchQuery : query) || getActiveFiltersCount() > 0 
                ? 'لا توجد نتائج للبحث' 
                : 'لا توجد أوامر شراء'
              }
            </Typography>
          </Box>
        ) : (
          <>
            {isDownSm
              ? filtered.map(po => (
                  <PurchaseOrderRow
                    key={po.id}
                    purchaseOrder={po}
                    onEdit={() => handleEdit(po)}
                  />
                ))
              : (
                  <PurchaseOrderTable
                    rows={filtered}
                    onEdit={handleEdit}
                  />
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
        <MobilePurchaseOrdersFilter
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={mobileFilters}
          onFiltersChange={setMobileFilters}
          suppliers={suppliers}
          warehouses={warehouses}
          totalResults={purchaseOrders.length}
          filteredResults={filtered.length}
        />
      )}

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setErr('')}>
        <Alert severity="error" onClose={() => setErr('')}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PurchaseOrdersPage;
