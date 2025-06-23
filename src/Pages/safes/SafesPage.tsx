// File: src/pages/safes/SafesPage.tsx
import React from 'react';
import {
  Container, useMediaQuery,
  Snackbar, Alert, Box, Button, Fab, Badge
} from '@mui/material';
import { IconFilter, IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import PageHeader from './components/PageHeader';
import ActionsBar from './components/ActionsBar';
import SafesTable from './components/SafesTable';
import SafesCards from './components/mobile/SafesCards';
import SafeForm from './components/SafeForm';
import MobileSafesFilter, { SafesFilterState } from './components/mobile/MobileSafesFilter';
import * as apiSrv from 'src/utils/api/pagesApi/safesApi';
import { Safe } from 'src/utils/api/pagesApi/safesApi';

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


const SafesPage: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const [safes, setSafes] = React.useState<Safe[]>([]);
  const { canAdd = true } = props; // Default to true if not provided
  const [query, setQuery] = React.useState('');
  const [error, setErr] = React.useState('');
  const [loading, setLoad] = React.useState(true);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [dialog, setDialog] = React.useState<{
    open: boolean;
    mode: 'add' | 'edit';
    current?: Safe;
  }>({ open: false, mode: 'add', current: undefined });

  const isDownSm = useMediaQuery((th: any) => th.breakpoints.down('sm'));
  const isMobile = useMediaQuery((th: any) => th.breakpoints.down('md'));

  // حالة الفلاتر للموبايل
  const [mobileFilters, setMobileFilters] = React.useState<SafesFilterState>({
    searchQuery: '',
    status: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  /* ───── fetch all ───── */
  const fetchSafes = async () => {
    try {
      const safesData = await apiSrv.getAll();
      setSafes(safesData);
    } catch (e: any) {
      setErr(e?.message || t('safes.errors.loadFailed'));
    }
  };

  React.useEffect(() => {
    (async () => {
      try { 
        await fetchSafes();
      }
      catch (e: any) { 
        setErr(e?.message || t('safes.errors.loadFailed')); 
      }
      finally { 
        setLoad(false); 
      }
    })();
  }, [t]);

  /* ───── filter for desktop ───── */
  const desktopFiltered = React.useMemo(
    () => query ? safes.filter(s => 
      s.name.toLowerCase().includes(query.toLowerCase())
    ) : safes,
    [safes, query]
  );

  /* ───── filter for mobile ───── */
  const mobileFiltered = React.useMemo(() => {
    let result = [...safes];

    // البحث
    if (mobileFilters.searchQuery.trim()) {
      const searchLower = mobileFilters.searchQuery.toLowerCase();
      result = result.filter(safe => 
        safe.name.toLowerCase().includes(searchLower) ||
        safe.typeName.toLowerCase().includes(searchLower)
      );
    }

    // فلتر الحالة
    if (mobileFilters.status) {
      const isActive = mobileFilters.status === 'true';
      result = result.filter(safe => safe.isActive === isActive);
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
  }, [safes, mobileFilters]);

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
      console.log('Adding safe:', data);
      await apiSrv.add(data);
      await fetchSafes();
    } catch (e: any) {
      console.error('Add error:', e);
      const msg = e?.errors?.SafeName?.[0] || e?.message || t('safes.errors.addFailed');
      setErr(msg);
      throw e;
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      console.log('Updating safe:', data);
      await apiSrv.update(data);
      await fetchSafes();
    } catch (e: any) {
      console.error('Update error:', e);
      const msg = e?.errors?.SafeName?.[0] || e?.message || t('safes.errors.updateFailed');
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
            {t('safes.add')}
          </Button>
        )}
        </Box>
      )}

      <Box mb={4}>
        {isDownSm
          ? (
              <SafesCards
                safes={filtered}
                onEdit={(s) => setDialog({ open: true, mode: 'edit', current: s })}
                loading={loading}
              />
            )
          : (
              <SafesTable
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
        <MobileSafesFilter
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={mobileFilters}
          onFiltersChange={setMobileFilters}
          totalResults={safes.length}
          filteredResults={filtered.length}
        />
      )}

      {/* ------------ Form Dialog ------------ */}
      <SafeForm
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

export default SafesPage;
