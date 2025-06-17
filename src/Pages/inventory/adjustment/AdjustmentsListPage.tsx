// File: src/pages/inventory/adjustments-list/AdjustmentsListPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  useMediaQuery,
  useTheme,
  Alert,
  Snackbar,
  Box,
  Fab,
  Badge
} from '@mui/material';
import { IconFilter } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import * as adjustmentsListApi from 'src/utils/api/pagesApi/inventoryAdjustmentApi';
import * as warehousesApi from 'src/utils/api/pagesApi/warehousesApi';
import AdjustmentsListHeader from './components/AdjustmentsListHeader';
import AdjustmentsTable from './components/AdjustmentsTable';
import AdjustmentsCards from './components/AdjustmentsCards';
import MobileAdjustmentsFilter, { FilterState } from './components/mobile/MobileAdjustmentsFilter';
import ExportButtons from '../../components/ExportButtons';

const AdjustmentsListPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [adjustments, setAdjustments] = useState<adjustmentsListApi.AdjustmentListItem[]>([]);
  const [warehouses, setWarehouses] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('error');
  const [filterOpen, setFilterOpen] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    adjustmentType: '',
    status: '',
    warehouseId: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'adjustmentDate',
    sortOrder: 'desc'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [adjustmentsData, warehousesData] = await Promise.all([
        adjustmentsListApi.getAdjustments(),
        warehousesApi.getAll()
      ]);
      setAdjustments(adjustmentsData);
      setWarehouses(warehousesData.map((w: { id: any; name: any; }) => ({ id: w.id, name: w.name })));
    } catch (error) {
      console.error('Error loading data:', error);
      setAlertMessage(t('adjustments.errors.loadFailed'));
      setAlertSeverity('error');
    } finally {
      setLoading(false);
    }
  };

  // تطبيق الفلاتر والبحث والترتيب
  const filteredAndSortedAdjustments = useMemo(() => {
    let result = [...adjustments];

    // البحث
    if (filters.searchQuery.trim()) {
      const searchLower = filters.searchQuery.toLowerCase();
      result = result.filter(adj => 
        adj.adjustmentId.toLowerCase().includes(searchLower) ||
        adj.warehouseName?.toLowerCase().includes(searchLower) ||
        adj.reason?.toLowerCase().includes(searchLower) ||
        adj.referenceNumber?.toLowerCase().includes(searchLower)
      );
    }

    // فلتر نوع التسوية
    if (filters.adjustmentType) {
      result = result.filter(adj => adj.adjustmentType.toString() === filters.adjustmentType);
    }

    // فلتر الحالة
    if (filters.status) {
      result = result.filter(adj => adj.status.toString() === filters.status);
    }

    // فلتر المخزن
    if (filters.warehouseId) {
      result = result.filter(adj => adj.warehouseId === filters.warehouseId);
    }

    // فلتر التاريخ
    if (filters.dateFrom) {
      result = result.filter(adj => {
        const adjDate = new Date(adj.adjustmentDate).toISOString().split('T')[0];
        return adjDate >= filters.dateFrom;
      });
    }

    if (filters.dateTo) {
      result = result.filter(adj => {
        const adjDate = new Date(adj.adjustmentDate).toISOString().split('T')[0];
        return adjDate <= filters.dateTo;
      });
    }

    // الترتيب
    result.sort((a, b) => {
      let aValue: any = a[filters.sortBy as keyof typeof a];
      let bValue: any = b[filters.sortBy as keyof typeof b];

      // معالجة خاصة للتواريخ
      if (filters.sortBy === 'adjustmentDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // معالجة خاصة للنصوص
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return result;
  }, [adjustments, filters]);

  // حساب عدد الفلاتر النشطة
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.adjustmentType) count++;
    if (filters.status) count++;
    if (filters.warehouseId) count++;
    if (filters.dateFrom || filters.dateTo) count++;
    return count;
  };

  const exportColumns = [
    { 
      field: 'adjustmentId', 
      headerName: t('adjustments.table.adjustmentId'),
      type: 'string' as const,
      format: (value: string) => value.substring(0, 8) + '...'
    },
    { 
      field: 'warehouseName', 
      headerName: t('adjustments.table.warehouse'),
      type: 'string' as const
    },
    { 
      field: 'adjustmentType', 
      headerName: t('adjustments.table.type'),
      type: 'string' as const,
      format: (value: number) => {
        switch (value) {
          case 0: return t('adjustments.types.new');
          case 1: return t('adjustments.types.openingBalance');
          case 2: return t('adjustments.types.manualAdjustment');
          default: return t('adjustments.types.unknown');
        }
      }
    },
    { 
      field: 'adjustmentDate', 
      headerName: t('adjustments.table.date'),
      type: 'date' as const,
      format: (value: string) => {
        if (!value || value === '0001-01-01T00:00:00') return '-';
        return new Date(value).toLocaleDateString();
      }
    },
    { 
      field: 'referenceNumber', 
      headerName: t('adjustments.table.referenceNumber'),
      type: 'string' as const,
      format: (value: string) => value || '-'
    },
    { 
      field: 'reason', 
      headerName: t('adjustments.table.reason'),
      type: 'string' as const,
      format: (value: string) => value || '-'
    },
    { 
      field: 'status', 
      headerName: t('adjustments.table.status'),
      type: 'string' as const,
      format: (value: number) => {
        switch (value) {
          case 1: return t('adjustments.status.saved');
          case 3: return t('adjustments.status.submitted');
          default: return t('adjustments.status.unknown');
        }
      }
    }
  ];

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 1, sm: 2 },
        maxWidth: '100vw',
        overflow: 'hidden'
      }}
    >
      <AdjustmentsListHeader
        onRefresh={loadData}
        isLoading={loading}
      />

      <Box sx={{ mb: { xs: 1, sm: 2 } }}>
        <ExportButtons
          data={filteredAndSortedAdjustments}
          columns={exportColumns}
          fileName="inventory-adjustments"
          title={t('adjustments.list.title')}
          loading={loading}
          compact={isMobile}
        />
      </Box>

      <Box sx={{ 
        width: '100%',
        overflow: 'hidden',
        '& .MuiPaper-root': {
          borderRadius: { xs: 1, sm: 2 },
        }
      }}>
        {isMobile ? (
          <AdjustmentsCards
            adjustments={filteredAndSortedAdjustments}
            loading={loading}
          />
        ) : (
          <AdjustmentsTable
            adjustments={filteredAndSortedAdjustments}
            loading={loading}
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
        <MobileAdjustmentsFilter
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={filters}
          onFiltersChange={setFilters}
          warehouses={warehouses}
          totalResults={adjustments.length}
          filteredResults={filteredAndSortedAdjustments.length}
        />
      )}

      <Snackbar
        open={!!alertMessage}
        autoHideDuration={6000}
        onClose={() => setAlertMessage('')}
        anchorOrigin={{ 
          vertical: 'top', 
          horizontal: 'center' 
        }}
      >
        <Alert
          onClose={() => setAlertMessage('')}
          severity={alertSeverity}
          sx={{ 
            width: '100%',
            maxWidth: { xs: '90vw', sm: 'auto' }
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdjustmentsListPage;
