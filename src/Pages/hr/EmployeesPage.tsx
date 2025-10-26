// File: src/Pages/hr/EmployeesPage.tsx
import React from 'react';
import {
  Container, useMediaQuery, Box, Fab, Badge, Button
} from '@mui/material';
import { IconFilter, IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import PageHeader from './components/PageHeader';
import ActionsBar from './components/ActionsBar';
import EmployeeTable from './components/EmployeeTable';
import EmployeeRow from './components/EmployeeRow';
import EmployeeForm from './components/EmployeeForm';
import MobileEmployeesFilter, { EmployeesFilterState } from './components/mobile/MobileEmployeesFilter';
import * as apiSrv from 'src/utils/api/pagesApi/employeesApi';
import { Employee } from 'src/utils/api/pagesApi/employeesApi';

const EmployeesPage: React.FC = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const canAdd = true; // Set to true or fetch from permissions/props as needed
  const [query, setQuery] = React.useState('');
  const [loading, setLoad] = React.useState(true);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [dialog, setDialog] = React.useState<{
    open: boolean;
    mode: 'add' | 'edit';
    current?: Employee;
  }>({ open: false, mode: 'add', current: undefined });

  const isDownSm = useMediaQuery((th: any) => th.breakpoints.down('sm'));
  const isMobile = useMediaQuery((th: any) => th.breakpoints.down('md'));

  // حالة الفلاتر للموبايل
  const [mobileFilters, setMobileFilters] = React.useState<EmployeesFilterState>({
    searchQuery: '',
    status: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  /* ───── fetch all ───── */
  const fetchEmployees = async () => {
    try {
      const employeesData = await apiSrv.getAll();
      setEmployees(employeesData);
    } catch (e: any) {    }
  };

  React.useEffect(() => {
    (async () => {
      try { 
        await fetchEmployees();
      }
      catch (e: any) {      }
      finally { 
        setLoad(false); 
      }
    })();
  }, []);

  /* ───── filter for desktop ───── */
  const desktopFiltered = React.useMemo(
    () => query ? employees.filter(e => 
      e.name.toLowerCase().includes(query.toLowerCase()) ||
      e.code.toString().includes(query)
    ) : employees,
    [employees, query]
  );

  /* ───── filter for mobile ───── */
  const mobileFiltered = React.useMemo(() => {
    let result = [...employees];

    // البحث
    if (mobileFilters.searchQuery.trim()) {
      const searchLower = mobileFilters.searchQuery.toLowerCase();
      result = result.filter(employee => 
        employee.name.toLowerCase().includes(searchLower) ||
        employee.code.toString().includes(searchLower)
      );
    }

    // فلتر الحالة
    if (mobileFilters.status) {
      const isActive = mobileFilters.status === 'true';
      result = result.filter(employee => employee.isActive === isActive);
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
  }, [employees, mobileFilters]);

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
      await apiSrv.add(data);
      await fetchEmployees();
    } catch (e: any) {
      throw e;
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      await apiSrv.update(data);
      await fetchEmployees();
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
            {t('hr.employees.add')}
          </Button>
        )}
        </Box>
      )}

      <Box mb={4}>
        {isDownSm
          ? filtered.map(e => (
              <EmployeeRow
                key={e.id}
                employee={e}
                onEdit={() => setDialog({ open: true, mode: 'edit', current: e })}
              />
            ))
          : (
              <EmployeeTable
                rows={filtered}
                onEdit={(e) => setDialog({ open: true, mode: 'edit', current: e })}
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
        <MobileEmployeesFilter
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={mobileFilters}
          onFiltersChange={setMobileFilters}
          totalResults={employees.length}
          filteredResults={filtered.length}
        />
      )}

      {/* ------------ Form Dialog ------------ */}
      <EmployeeForm
        open={dialog.open}
        mode={dialog.mode}
        initialValues={dialog.current}
        onClose={() => setDialog({ open: false, mode: 'add', current: undefined })}
        onSubmit={handleSubmit}
      />{loading && <div>Loading…</div>}
    </Container>
  );
};

export default EmployeesPage;

