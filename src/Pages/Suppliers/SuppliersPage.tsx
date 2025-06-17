// File: src/pages/suppliers/SuppliersPage.tsx
import React from 'react';
import {
  Container, useMediaQuery,
  Snackbar, Alert, Box, Fab, Badge, Button
} from '@mui/material';
import { IconFilter, IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import PageHeader from './components/PageHeader';
import ActionsBar from './components/ActionsBar';
import SupplierTable from './components/SupplierTable';
import SupplierRow from './components/SupplierRow';
import SupplierForm from './components/SupplierForm';
import MobileSuppliersFilter, { SuppliersFilterState } from './components/mobile/MobileSuppliersFilter';
import * as apiSrv from 'src/utils/api/pagesApi/suppliersApi';
import { Supplier } from 'src/utils/api/pagesApi/suppliersApi';

const SuppliersPage: React.FC = () => {
  const { t } = useTranslation();
  const [suppliers, setSuppliers] = React.useState<Supplier[]>([]);
  const [query, setQuery] = React.useState('');
  const [error, setErr] = React.useState('');
  const [loading, setLoad] = React.useState(true);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [dialog, setDialog] = React.useState<{
    open: boolean;
    mode: 'add' | 'edit';
    current?: Supplier;
  }>({ open: false, mode: 'add', current: undefined });

  const isDownSm = useMediaQuery((th: any) => th.breakpoints.down('sm'));
  const isMobile = useMediaQuery((th: any) => th.breakpoints.down('md'));

  // حالة الفلاتر للموبايل
  const [mobileFilters, setMobileFilters] = React.useState<SuppliersFilterState>({
    searchQuery: '',
    status: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  /* ───── fetch all ───── */
  const fetchSuppliers = async () => {
    try {
      const suppliersData = await apiSrv.getAll();
      setSuppliers(suppliersData);
    } catch (e: any) {
      setErr(e?.message || 'Failed to load suppliers');
    }
  };

  React.useEffect(() => {
    (async () => {
      try { 
        await fetchSuppliers();
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
    () => query ? suppliers.filter(s => 
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.phone.toLowerCase().includes(query.toLowerCase()) ||
      s.address.toLowerCase().includes(query.toLowerCase())
    ) : suppliers,
    [suppliers, query]
  );

  /* ───── filter for mobile ───── */
  const mobileFiltered = React.useMemo(() => {
    let result = [...suppliers];

    // البحث
    if (mobileFilters.searchQuery.trim()) {
      const searchLower = mobileFilters.searchQuery.toLowerCase();
      result = result.filter(supplier => 
        supplier.name.toLowerCase().includes(searchLower) ||
        supplier.phone.toLowerCase().includes(searchLower) ||
        supplier.address.toLowerCase().includes(searchLower) ||
        supplier.notes?.toLowerCase().includes(searchLower)
      );
    }

    // فلتر الحالة
    if (mobileFilters.status) {
      const isActive = mobileFilters.status === 'true';
      result = result.filter(supplier => supplier.isActive === isActive);
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
  }, [suppliers, mobileFilters]);

  // اختيار البيانات المفلترة حسب نوع الجهاز
  const filtered = isMobile ? mobileFiltered : desktopFiltered;

  // حساب عدد الفلاتر النشطة للموبايل
  const getActiveFiltersCount = () => {
    let count = 0;
    if (mobileFilters.searchQuery) count++;
    if (mobileFilters.status) count++;
    return count;
  };

  /* ───── CRUD ───── */
  const handleAdd = async (data: any) => {
    try {
      console.log('Adding supplier:', data);
      await apiSrv.add(data);
      await fetchSuppliers();
    } catch (e: any) {
      console.error('Add error:', e);
      const msg = e?.errors?.SupplierName?.[0] || e?.message || 'Add failed';
      setErr(msg);
      throw e;
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      console.log('Updating supplier:', data);
      await apiSrv.update(data);
      await fetchSuppliers();
    } catch (e: any) {
      console.error('Update error:', e);
      const msg = e?.errors?.SupplierName?.[0] || e?.message || 'Update failed';
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
      }
      
    } catch (error) {
      throw error;
    }
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
          onAdd={() => setDialog({ open: true, mode: 'add', current: undefined })}
        />
      )}

      {/* زر الإضافة للموبايل */}
      {isMobile && (
        <Box sx={{ mb: 2, textAlign: 'center' }}>
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
            {t('suppliers.add')}
          </Button>
        </Box>
      )}

      <Box mb={4}>
        {isDownSm
          ? filtered.map(s => (
              <SupplierRow
                key={s.id}
                supplier={s}
                onEdit={() => setDialog({ open: true, mode: 'edit', current: s })}
              />
            ))
          : (
              <SupplierTable
                rows={filtered}
                onEdit={(s) => setDialog({ open: true, mode: 'edit', current: s })}
              />
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
        <MobileSuppliersFilter
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={mobileFilters}
          onFiltersChange={setMobileFilters}
          totalResults={suppliers.length}
          filteredResults={filtered.length}
        />
      )}

      {/* ------------ Form Dialog ------------ */}
      <SupplierForm
        open={dialog.open}
        mode={dialog.mode}
        initialValues={dialog.current}
        onClose={() => setDialog({ open: false, mode: 'add', current: undefined })}
        onSubmit={handleSubmit}
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

export default SuppliersPage;
