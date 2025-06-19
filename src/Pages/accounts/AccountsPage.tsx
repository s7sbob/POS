// File: src/pages/accounts/AccountsPage.tsx
import React from 'react';
import {
  Container, useMediaQuery,
  Snackbar, Alert, Box, Button, Fab, Badge
} from '@mui/material';
import { IconFilter, IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import PageHeader from './components/PageHeader';
import ActionsBar from './components/ActionsBar';
import AccountsTable from './components/AccountsTable';
import AccountsCards from './components/mobile/AccountsCards';
import AccountForm from './components/AccountForm';
import MobileAccountsFilter, { AccountsFilterState } from './components/mobile/MobileAccountsFilter';
import * as apiSrv from 'src/utils/api/pagesApi/accountsApi';
import { Account } from 'src/utils/api/pagesApi/accountsApi';

const AccountsPage: React.FC = () => {
  const { t } = useTranslation();
  const [accounts, setAccounts] = React.useState<Account[]>([]);
  const [query, setQuery] = React.useState('');
  const [error, setErr] = React.useState('');
  const [loading, setLoad] = React.useState(true);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [dialog, setDialog] = React.useState<{
    open: boolean;
    mode: 'add' | 'edit';
    current?: Account;
  }>({ open: false, mode: 'add', current: undefined });

  const isDownSm = useMediaQuery((th: any) => th.breakpoints.down('sm'));
  const isMobile = useMediaQuery((th: any) => th.breakpoints.down('md'));

  // حالة الفلاتر للموبايل
  const [mobileFilters, setMobileFilters] = React.useState<AccountsFilterState>({
    searchQuery: '',
    accountType: '',
    status: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  /* ───── fetch all ───── */
  const fetchAccounts = async () => {
    try {
      const accountsData = await apiSrv.getAll();
      setAccounts(accountsData);
    } catch (e: any) {
      setErr(e?.message || t('accounts.errors.loadFailed'));
    }
  };

  React.useEffect(() => {
    (async () => {
      try { 
        await fetchAccounts();
      }
      catch (e: any) { 
        setErr(e?.message || t('accounts.errors.loadFailed')); 
      }
      finally { 
        setLoad(false); 
      }
    })();
  }, [t]);

  /* ───── filter for desktop ───── */
  const desktopFiltered = React.useMemo(
    () => query ? accounts.filter(a => 
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.typeName.toLowerCase().includes(query.toLowerCase()) ||
      a.accountNumber.toLowerCase().includes(query.toLowerCase())
    ) : accounts,
    [accounts, query]
  );

  /* ───── filter for mobile ───── */
  const mobileFiltered = React.useMemo(() => {
    let result = [...accounts];

    // البحث
    if (mobileFilters.searchQuery.trim()) {
      const searchLower = mobileFilters.searchQuery.toLowerCase();
      result = result.filter(account => 
        account.name.toLowerCase().includes(searchLower) ||
        account.typeName.toLowerCase().includes(searchLower) ||
        account.accountNumber.toLowerCase().includes(searchLower)
      );
    }

    // فلتر نوع الحساب
    if (mobileFilters.accountType) {
      result = result.filter(account => account.typeName === mobileFilters.accountType);
    }

    // فلتر الحالة
    if (mobileFilters.status) {
      const isActive = mobileFilters.status === 'true';
      result = result.filter(account => account.isActive === isActive);
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
  }, [accounts, mobileFilters]);

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
      console.log('Adding account:', data);
      await apiSrv.add(data);
      await fetchAccounts();
    } catch (e: any) {
      console.error('Add error:', e);
      const msg = e?.errors?.AccountName?.[0] || e?.message || t('accounts.errors.addFailed');
      setErr(msg);
      throw e;
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      console.log('Updating account:', data);
      await apiSrv.update(data);
      await fetchAccounts();
    } catch (e: any) {
      console.error('Update error:', e);
      const msg = e?.errors?.AccountName?.[0] || e?.message || t('accounts.errors.updateFailed');
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
            {t('accounts.add')}
          </Button>
        </Box>
      )}

      <Box mb={4}>
        {isDownSm
          ? (
              <AccountsCards
                accounts={filtered}
                onEdit={(a) => setDialog({ open: true, mode: 'edit', current: a })}
                loading={loading}
              />
            )
          : (
              <AccountsTable
                rows={filtered}
                onEdit={(a) => setDialog({ open: true, mode: 'edit', current: a })}
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
        <MobileAccountsFilter
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={mobileFilters}
          onFiltersChange={setMobileFilters}
          totalResults={accounts.length}
          filteredResults={filtered.length}
        />
      )}

      {/* ------------ Form Dialog ------------ */}
      <AccountForm
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

export default AccountsPage;
