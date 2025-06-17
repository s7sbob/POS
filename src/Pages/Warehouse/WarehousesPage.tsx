// File: src/pages/warehouses/WarehousesPage.tsx
import React from 'react';
import {
  Container, useMediaQuery,
  Snackbar, Alert, Fab, Badge, Box, Button
} from '@mui/material';
import { IconFilter, IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import PageHeader     from './components/PageHeader';
import ActionsBar     from './components/ActionsBar';
import WarehouseTable from './components/WarehouseTable';
import WarehouseRow   from './components/WarehouseRow';
import WarehouseForm  from './components/WarehouseForm';
import MobileWarehousesFilter, { WarehousesFilterState } from './components/mobile/MobileWarehousesFilter';

import * as apiSrv from 'src/utils/api/pagesApi/warehousesApi';
import { Warehouse } from 'src/utils/api/pagesApi/warehousesApi';

const WarehousesPage: React.FC = () => {
  const { t } = useTranslation();
  const [items, setItems] = React.useState<Warehouse[]>([]);
  const [query, setQuery] = React.useState('');
  const [error, setErr]   = React.useState('');
  const [loading, setLoad] = React.useState(true);
  const [filterOpen, setFilterOpen] = React.useState(false);

  const [dialog, setDialog] = React.useState<{
    open: boolean;
    mode: 'add' | 'edit';
    current?: Warehouse;
  }>({ open: false, mode: 'add' });

  const isDownSm = useMediaQuery((th: any) => th.breakpoints.down('sm'));
  const isMobile = useMediaQuery((th: any) => th.breakpoints.down('md'));

  // حالة الفلاتر للموبايل
  const [mobileFilters, setMobileFilters] = React.useState<WarehousesFilterState>({
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
    () => query ? items.filter(w => w.name.toLowerCase().includes(query.toLowerCase())) : items,
    [items, query]
  );

  /* ───── filter for mobile ───── */
  const mobileFiltered = React.useMemo(() => {
    let result = [...items];

    // البحث
    if (mobileFilters.searchQuery.trim()) {
      const searchLower = mobileFilters.searchQuery.toLowerCase();
      result = result.filter(warehouse => 
        warehouse.name.toLowerCase().includes(searchLower) ||
        warehouse.address?.toLowerCase().includes(searchLower) ||
        warehouse.code?.toString().includes(searchLower)
      );
    }

    // فلتر الحالة
    if (mobileFilters.status) {
      const isActive = mobileFilters.status === 'true';
      result = result.filter(warehouse => warehouse.isActive === isActive);
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
  const handleAdd = async (body: { name: string; address: string }) => {
    try {
      const nw = await apiSrv.add(body);
      setItems(p => [nw, ...p]);
      setDialog({ open: false, mode: 'add' });
    } catch (e: any) {
      const msg = e?.errors?.WarehouseName?.[0] || e?.message || 'Add failed';
      setErr(msg)
    }
  };

  const handleUpdate = async (w: Warehouse) => {
    try {
      const up = await apiSrv.update(w);
      setItems(p => p.map(x => x.id === up.id ? up : x));
      setDialog({ open: false, mode: 'add' });
    } catch (e: any) {
      const msg =
        e?.errors?.WarehouseName?.[0] ||
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
            {t('warehouses.add')}
          </Button>
        </Box>
      )}

      {isDownSm
        ? filtered.map(w => (
            <WarehouseRow
              key={w.id}
              warehouse={{
                ...w,
                status: w.isActive ? "active" : "inactive"
              }}
              onEdit={() => setDialog({ open: true, mode: 'edit', current: w })}
            />
          ))
        : (
          <WarehouseTable
            rows={filtered}
            onEdit={w => setDialog({ open: true, mode: 'edit', current: w })}
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
        <MobileWarehousesFilter
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={mobileFilters}
          onFiltersChange={setMobileFilters}
          totalResults={items.length}
          filteredResults={filtered.length}
        />
      )}

      {/* ------------ Form Dialog ------------ */}
      <WarehouseForm
        open={dialog.open}
        mode={dialog.mode}
        initialValues={dialog.current}
        onClose={() => setDialog({ open: false, mode: 'add' })}
        onSubmit={dialog.mode === 'add'
          ? ((data) => handleAdd(data as { name: string; address: string }))
          : ((data) => handleUpdate(data as Warehouse))
        }
      />

      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setErr('')}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      {loading && <p>Loading…</p>}
    </Container>
  );
};

export default WarehousesPage;
