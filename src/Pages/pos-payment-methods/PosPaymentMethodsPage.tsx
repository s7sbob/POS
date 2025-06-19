// File: src/pages/pos-payment-methods/PosPaymentMethodsPage.tsx
import React from 'react';
import {
  Container, useMediaQuery,
  Snackbar, Alert, Box, Button, Fab, Badge
} from '@mui/material';
import { IconFilter, IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import PageHeader from './components/PageHeader';
import ActionsBar from './components/ActionsBar';
import PosPaymentMethodsTable from './components/PosPaymentMethodsTable';
import PosPaymentMethodsCards from './components/mobile/PosPaymentMethodsCards';
import PosPaymentMethodForm from './components/PosPaymentMethodForm';
import MobilePosPaymentMethodsFilter, { PosPaymentMethodsFilterState } from './components/mobile/MobilePosPaymentMethodsFilter';
import * as apiSrv from 'src/utils/api/pagesApi/posPaymentMethodsApi';
import * as safesAndAccountsApi from 'src/utils/api/pagesApi/safesAndAccountsApi';
import { PosPaymentMethod } from 'src/utils/api/pagesApi/posPaymentMethodsApi';
import { SafeOrAccount } from 'src/utils/api/pagesApi/safesAndAccountsApi';

const PosPaymentMethodsPage: React.FC = () => {
  const { t } = useTranslation();
  const [paymentMethods, setPaymentMethods] = React.useState<PosPaymentMethod[]>([]);
  const [safesAndAccounts, setSafesAndAccounts] = React.useState<SafeOrAccount[]>([]);
  const [query, setQuery] = React.useState('');
  const [error, setErr] = React.useState('');
  const [loading, setLoad] = React.useState(true);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [dialog, setDialog] = React.useState<{
    open: boolean;
    mode: 'add' | 'edit';
    current?: PosPaymentMethod;
  }>({ open: false, mode: 'add', current: undefined });

  const isDownSm = useMediaQuery((th: any) => th.breakpoints.down('sm'));
  const isMobile = useMediaQuery((th: any) => th.breakpoints.down('md'));

  // حالة الفلاتر للموبايل
  const [mobileFilters, setMobileFilters] = React.useState<PosPaymentMethodsFilterState>({
    searchQuery: '',
    accountType: '',
    status: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  /* ───── fetch all ───── */
  const fetchData = async () => {
    try {
      const [paymentMethodsData, safesAndAccountsData] = await Promise.all([
        apiSrv.getAll(),
        safesAndAccountsApi.getAllSafesAndAccounts()
      ]);
      setPaymentMethods(paymentMethodsData);
      setSafesAndAccounts(safesAndAccountsData);
    } catch (e: any) {
      setErr(e?.message || t('posPaymentMethods.errors.loadFailed'));
    }
  };

  React.useEffect(() => {
    (async () => {
      try { 
        await fetchData();
      }
      catch (e: any) { 
        setErr(e?.message || t('posPaymentMethods.errors.loadFailed')); 
      }
      finally { 
        setLoad(false); 
      }
    })();
  }, [t]);

  /* ───── filter for desktop ───── */
  const desktopFiltered = React.useMemo(
    () => query ? paymentMethods.filter(pm => 
      pm.name.toLowerCase().includes(query.toLowerCase()) ||
      pm.safeOrAccount?.name.toLowerCase().includes(query.toLowerCase()) ||
      pm.safeOrAccount?.typeName.toLowerCase().includes(query.toLowerCase())
    ) : paymentMethods,
    [paymentMethods, query]
  );

  /* ───── filter for mobile ───── */
  const mobileFiltered = React.useMemo(() => {
    let result = [...paymentMethods];

    // البحث
    if (mobileFilters.searchQuery.trim()) {
      const searchLower = mobileFilters.searchQuery.toLowerCase();
      result = result.filter(pm => 
        pm.name.toLowerCase().includes(searchLower) ||
        pm.safeOrAccount?.name.toLowerCase().includes(searchLower) ||
        pm.safeOrAccount?.typeName.toLowerCase().includes(searchLower)
      );
    }

    // فلتر نوع الحساب
    if (mobileFilters.accountType) {
      result = result.filter(pm => pm.safeOrAccount?.typeName === mobileFilters.accountType);
    }

    // فلتر الحالة
    if (mobileFilters.status) {
      const isActive = mobileFilters.status === 'true';
      result = result.filter(pm => pm.isActive === isActive);
    }

    // الترتيب
    result.sort((a, b) => {
      let aValue: any = a[mobileFilters.sortBy as keyof typeof a];
      let bValue: any = b[mobileFilters.sortBy as keyof typeof b];

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
  }, [paymentMethods, mobileFilters]);

  // اختيار البيانات المفلترة حسب نوع الجهاز
  const filtered = isMobile ? mobileFiltered : desktopFiltered;

  // حساب عدد الفلاتر النشطة للموبايل
  const getActiveFiltersCount = () => {
    let count = 0;
    if (mobileFilters.searchQuery) count++;
    if (mobileFilters.accountType) count++;
    if (mobileFilters.status) count++;
    return count;
  };

  /* ───── CRUD ───── */
  const handleAdd = async (data: any) => {
    try {
      console.log('Adding POS payment method:', data);
      await apiSrv.add(data);
      await fetchData();
    } catch (e: any) {
      console.error('Add error:', e);
      const msg = e?.errors?.Name?.[0] || e?.message || t('posPaymentMethods.errors.addFailed');
      setErr(msg);
      throw e;
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      console.log('Updating POS payment method:', data);
      await apiSrv.update(data);
      await fetchData();
    } catch (e: any) {
      console.error('Update error:', e);
      const msg = e?.errors?.Name?.[0] || e?.message || t('posPaymentMethods.errors.updateFailed');
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
            {t('posPaymentMethods.add')}
          </Button>
        </Box>
      )}

      <Box mb={4}>
        {isDownSm
          ? (
              <PosPaymentMethodsCards
                paymentMethods={filtered}
                onEdit={(pm) => setDialog({ open: true, mode: 'edit', current: pm })}
                loading={loading}
              />
            )
          : (
              <PosPaymentMethodsTable
                rows={filtered}
                onEdit={(pm) => setDialog({ open: true, mode: 'edit', current: pm })}
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
        <MobilePosPaymentMethodsFilter
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={mobileFilters}
          onFiltersChange={setMobileFilters}
          totalResults={paymentMethods.length}
          filteredResults={filtered.length}
        />
      )}

      {/* ------------ Form Dialog ------------ */}
      <PosPaymentMethodForm
        open={dialog.open}
        mode={dialog.mode}
        initialValues={dialog.current}
        safesAndAccounts={safesAndAccounts}
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

export default PosPaymentMethodsPage;
