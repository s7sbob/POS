// File: src/pages/units/UnitsPage.tsx
import React from 'react';
import {
  Container, useMediaQuery,
  Snackbar, Alert, Fab, Badge, Box, Button
} from '@mui/material';
import { IconFilter, IconPlus } from '@tabler/icons-react';
import PageHeader from './components/PageHeader';
import ActionsBar from './components/ActionsBar';
import UnitTable from './components/UnitTable';
import UnitRow from './components/UnitRow';
import UnitForm from './components/UnitForm';
import MobileUnitsFilter, { UnitsFilterState } from './components/mobile/MobileUnitsFilter';
import * as apiSrv from 'src/utils/api/pagesApi/unitsApi';
import { Unit } from 'src/utils/api/pagesApi/unitsApi';
import { useTranslation } from 'react-i18next';

const UnitsPage: React.FC = () => {
  const { t } = useTranslation();
  const [items, setItems] = React.useState<Unit[]>([]);
  const [query, setQuery] = React.useState('');
  const [error, setErr] = React.useState('');
  const [loading, setLoad] = React.useState(true);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [dialog, setDialog] = React.useState<{
    open: boolean;
    mode: 'add' | 'edit';
    current?: Unit;
  }>({ open: false, mode: 'add' });

  const isDownSm = useMediaQuery((th: any) => th.breakpoints.down('sm'));
  const isMobile = useMediaQuery((th: any) => th.breakpoints.down('md'));

  // حالة الفلاتر للموبايل
  const [mobileFilters, setMobileFilters] = React.useState<UnitsFilterState>({
    searchQuery: '',
    status: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  /* ───── fetch all ───── */
  React.useEffect(() => {
    (async () => {
      try { setItems(await apiSrv.getAll()); }
      catch (e: any) { setErr(e?.message || 'Load failed'); }
      finally { setLoad(false); }
    })();
  }, []);

  /* ───── filter for desktop ───── */
  const desktopFiltered = React.useMemo(
    () => query ? items.filter(u => u.name.toLowerCase().includes(query.toLowerCase())) : items,
    [items, query]
  );

  /* ───── filter for mobile ───── */
  const mobileFiltered = React.useMemo(() => {
    let result = [...items];

    // البحث
    if (mobileFilters.searchQuery.trim()) {
      const searchLower = mobileFilters.searchQuery.toLowerCase();
      result = result.filter(unit => 
        unit.name.toLowerCase().includes(searchLower)      );
    }

    // فلتر الحالة
    if (mobileFilters.status) {
      const isActive = mobileFilters.status === 'true';
      result = result.filter(unit => unit.isActive === isActive);
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
  }, [items, mobileFilters]);

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
  const handleAdd = async (body: { name: string; }) => {
    try {
      const nw = await apiSrv.add(body);
      setItems(p => [nw, ...p]);
      setDialog({ open: false, mode: 'add' });
    } catch (e: any) {
      const msg = e?.errors?.UnitName?.[0] || e?.message || 'Add failed';
      setErr(msg);
    }
  };

  const handleUpdate = async (u: Unit) => {
    try {
      const up = await apiSrv.update(u);
      setItems(p => p.map(x => x.id === up.id ? up : x));
      setDialog({ open: false, mode: 'add' });
    } catch (e: any) {
      const msg =
        e?.errors?.UnitName?.[0] ||
        e?.message ||
        'Update failed';
      setErr(msg);
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
          onAdd={() => setDialog({ open: true, mode: 'add' })}
        />
      )}

      {/* زر الإضافة للموبايل */}
      {isMobile && (
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Button
            variant="contained"
            startIcon={<IconPlus />}
            onClick={() => setDialog({ open: true, mode: 'add' })}
            fullWidth
            size="large"
            sx={{
              minHeight: 48,
              fontSize: '1rem'
            }}
          >
            {t('units.add')}
          </Button>
        </Box>
      )}

      {isDownSm
        ? filtered.map(u => (
            <UnitRow
              key={u.id}
              unit={u}
              onEdit={() => setDialog({ open: true, mode: 'edit', current: u })}
            />
          ))
        : (
            <UnitTable
              rows={filtered}
              onEdit={(u) => setDialog({ open: true, mode: 'edit', current: u })}
            />
          )}

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
        <MobileUnitsFilter
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={mobileFilters}
          onFiltersChange={setMobileFilters}
          totalResults={items.length}
          filteredResults={filtered.length}
        />
      )}

      {/* ------------ Form Dialog ------------ */}
      <UnitForm
        open={dialog.open}
        mode={dialog.mode}
        initialValues={dialog.current}
        onClose={() => setDialog({ open: false, mode: 'add' })}
        onSubmit={dialog.mode === 'add'
          ? ((data) => handleAdd(data as { name: string; }))
          : ((data) => handleUpdate(data as Unit))
        }
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

export default UnitsPage;
