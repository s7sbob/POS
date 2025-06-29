// File: src/pages/purchases/PurchasesPage.tsx
import React from 'react';
import {
  Container, useMediaQuery, Box, Typography, Fab, Badge, Button
} from '@mui/material';
import { IconFilter, IconPlus } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ActionsBar from '../purchase-orders/components/ActionsBar';
import PurchaseTable from './components/PurchaseTable';
import PurchaseRow from './components/PurchaseRow';
import MobilePurchasesFilter, { PurchasesFilterState } from './components/mobile/MobilePurchasesFilter';
import * as apiSrv from 'src/utils/api/pagesApi/purchaseApi';
import * as suppliersApi from 'src/utils/api/pagesApi/suppliersApi';
import * as warehousesApi from 'src/utils/api/pagesApi/warehousesApi';
import { Purchase } from 'src/utils/api/pagesApi/purchaseApi';
import PageHeader from './components/PageHeader';

const PurchasesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [purchases, setPurchases] = React.useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = React.useState<Array<{ id: string; name: string }>>([]);
  const [warehouses, setWarehouses] = React.useState<Array<{ id: string; name: string }>>([]);
  const [query, setQuery] = React.useState('');  const [loading, setLoad] = React.useState(true);
  const [filterOpen, setFilterOpen] = React.useState(false);

  const isDownSm = useMediaQuery((th: any) => th.breakpoints.down('sm'));
  const isMobile = useMediaQuery((th: any) => th.breakpoints.down('md'));

  // حالة الفلاتر للموبايل
  const [mobileFilters, setMobileFilters] = React.useState<PurchasesFilterState>({
    searchQuery: '',
    status: '',
    supplierId: '',
    warehouseId: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'date1',
    sortOrder: 'desc'
  });

  const fetchPurchases = async () => {
    try {
      const purchasesData = await apiSrv.getAll();
      setPurchases(purchasesData);
    } catch (e: any) {
      setErr(e?.message || t('purchases.errors.loadFailed'));
    }
  };

  const fetchSuppliers = async () => {
    try {
      const suppliersData = await suppliersApi.getAll();
      setSuppliers(suppliersData.map((s: { id: any; name: any; }) => ({ id: s.id, name: s.name })));
    } catch (e: any) {
      }
  };

  const fetchWarehouses = async () => {
    try {
      const warehousesData = await warehousesApi.getAll();
      setWarehouses(warehousesData.map((w: { id: any; name: any; }) => ({ id: w.id, name: w.name })));
    } catch (e: any) {
      }
  };

  React.useEffect(() => {
    (async () => {
      try { 
        await Promise.all([
          fetchPurchases(),
          fetchSuppliers(),
          fetchWarehouses()
        ]);
      }
      catch (e: any) { 
        setErr(e?.message || t('purchases.errors.loadFailed')); 
      }
      finally { 
        setLoad(false); 
      }
    })();
  }, [t]);

  /* ───── filter for desktop ───── */
  const desktopFiltered = React.useMemo(
    () => query ? purchases.filter(p => 
      p.referenceDocNumber.toLowerCase().includes(query.toLowerCase()) ||
      p.supplier?.name.toLowerCase().includes(query.toLowerCase()) ||
      p.warehouse?.name.toLowerCase().includes(query.toLowerCase()) ||
      p.purchaseOrder?.referenceDocNumber.toLowerCase().includes(query.toLowerCase())
    ) : purchases,
    [purchases, query]
  );

  /* ───── filter for mobile ───── */
  const mobileFiltered = React.useMemo(() => {
    let result = [...purchases];

    // البحث
    if (mobileFilters.searchQuery.trim()) {
      const searchLower = mobileFilters.searchQuery.toLowerCase();
      result = result.filter(purchase => 
        purchase.referenceDocNumber.toLowerCase().includes(searchLower) ||
        purchase.supplier?.name.toLowerCase().includes(searchLower) ||
        purchase.warehouse?.name.toLowerCase().includes(searchLower) ||
        purchase.purchaseOrder?.referenceDocNumber.toLowerCase().includes(searchLower) ||
        purchase.id?.toLowerCase().includes(searchLower)
      );
    }

    // فلتر الحالة
    if (mobileFilters.status) {
      result = result.filter(purchase => purchase.status.toString() === mobileFilters.status);
    }

    // فلتر المورد
    if (mobileFilters.supplierId) {
      result = result.filter(purchase => purchase.supplierId === mobileFilters.supplierId);
    }

    // فلتر المخزن
    if (mobileFilters.warehouseId) {
      result = result.filter(purchase => purchase.warehouseId === mobileFilters.warehouseId);
    }

    // فلتر التاريخ
    if (mobileFilters.dateFrom) {
      result = result.filter(purchase => {
        const purchaseDate = new Date(purchase.date1).toISOString().split('T')[0];
        return purchaseDate >= mobileFilters.dateFrom;
      });
    }

    if (mobileFilters.dateTo) {
      result = result.filter(purchase => {
        const purchaseDate = new Date(purchase.date1).toISOString().split('T')[0];
        return purchaseDate <= mobileFilters.dateTo;
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
  }, [purchases, mobileFilters]);

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

  const handleAdd = () => {
    navigate('/purchases/purchases/add');
  };

  const handleEdit = (purchase: Purchase) => {
    navigate(`/purchases/purchases/edit/${purchase.id}`);
  };

  const handleView = (purchase: Purchase) => {
    navigate(`/purchases/purchases/view/${purchase.id}`);
  };

  return (
    <Container maxWidth="xl">
      <PageHeader exportData={filtered} loading={loading}/>

      {/* شريط الأدوات - يظهر فقط في الديسكتوب */}
      {!isMobile && (
        <ActionsBar
          query={query}
          onQueryChange={setQuery}
          onAdd={handleAdd}
          searchPlaceholder={t('purchases.searchPlaceholder')}
          addButtonText={t('purchases.addButton')}
        />
      )}

      {/* زر الإضافة للموبايل */}
      {isMobile && (
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Button
            variant="contained"
            startIcon={<IconPlus />}
            onClick={handleAdd}
            fullWidth
            size="large"
            sx={{
              minHeight: 48,
              fontSize: '1rem'
            }}
          >
            {t('purchases.addButton')}
          </Button>
        </Box>
      )}

      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          {t('purchases.listTitle')} {` (${filtered.length})`}
        </Typography>
        
        {loading ? (
          <Box textAlign="center" py={4}>
            <Typography>{t('common.loading')}</Typography>
          </Box>
        ) : filtered.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              {(isMobile ? mobileFilters.searchQuery : query) || getActiveFiltersCount() > 0 
                ? t('common.noSearchResults') 
                : t('purchases.noData')
              }
            </Typography>
          </Box>
        ) : (
          <>
            {isDownSm
              ? filtered.map(p => (
                  <PurchaseRow
                    key={p.id}
                    purchase={p}
                    onEdit={() => handleEdit(p)}
                    onView={() => handleView(p)}
                  />
                ))
              : (
                  <PurchaseTable
                    rows={filtered}
                    onEdit={handleEdit}
                    onView={handleView}
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
        <MobilePurchasesFilter
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={mobileFilters}
          onFiltersChange={setMobileFilters}
          suppliers={suppliers}
          warehouses={warehouses}
          totalResults={purchases.length}
          filteredResults={filtered.length}
        />
      )}</Container>
  );
};

export default PurchasesPage;
function setErr(_arg0: any) {
  throw new Error('Function not implemented.');
}

