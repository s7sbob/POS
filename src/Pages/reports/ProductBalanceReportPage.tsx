// File: src/pages/reports/ProductBalanceReportPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Link,
  useMediaQuery,
  useTheme,
  Fab,
  Badge
} from '@mui/material';
import { IconHome, IconReportAnalytics, IconFilter } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ProductBalanceFilters from './components/ProductBalanceFilters';
import ProductBalanceStats from './components/ProductBalanceStats';
import ProductBalanceTable from './components/ProductBalanceTable';
import ProductBalanceCards from './components/ProductBalanceCards';
import MobileProductBalanceFilter, { ProductBalanceFilterState } from './components/mobile/MobileProductBalanceFilter';
import * as reportsApi from 'src/utils/api/reportsApi';
import { GroupedProductBalance } from 'src/utils/api/reportsApi';

const ProductBalanceReportPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [data, setData] = useState<GroupedProductBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Desktop filters (existing)
  const [searchQuery, setSearchQuery] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  // Mobile filters
  const [mobileFilters, setMobileFilters] = useState<ProductBalanceFilterState>({
    searchQuery: '',
    warehouseFilter: 'all',
    stockFilter: 'all',
    sortBy: 'productName',
    sortOrder: 'asc'
  });

  // Load data
  const loadData = async () => {
    try {
      setLoading(true);
      const balances = await reportsApi.getProductBalancesReport();
      const grouped = reportsApi.groupProductBalances(balances);
      setData(grouped);
    } catch (err: any) {
      setError(err?.message || t('reports.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Get unique warehouses for filter
  const warehouses = useMemo(() => {
    return Array.from(new Set(data.map(item => item.wareHouseName)));
  }, [data]);

  // Desktop filter data (existing logic)
  const desktopFilteredData = useMemo(() => {
    let filtered = data;

    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.wareHouseName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (warehouseFilter !== 'all') {
      filtered = filtered.filter(item => item.wareHouseName === warehouseFilter);
    }

    if (stockFilter !== 'all') {
      filtered = filtered.filter(item => {
        switch (stockFilter) {
          case 'inStock':
            return item.totalQuantity > 0;
          case 'outOfStock':
            return item.totalQuantity === 0;
          case 'lowStock':
            return item.totalQuantity > 0 && item.totalQuantity < 10;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [data, searchQuery, warehouseFilter, stockFilter]);

  // Mobile filter data
  const mobileFilteredData = useMemo(() => {
    let filtered = data;

    // Search filter
    if (mobileFilters.searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.productName.toLowerCase().includes(mobileFilters.searchQuery.toLowerCase()) ||
        item.wareHouseName.toLowerCase().includes(mobileFilters.searchQuery.toLowerCase())
      );
    }

    // Warehouse filter
    if (mobileFilters.warehouseFilter !== 'all') {
      filtered = filtered.filter(item => item.wareHouseName === mobileFilters.warehouseFilter);
    }

    // Stock filter
    if (mobileFilters.stockFilter !== 'all') {
      filtered = filtered.filter(item => {
        switch (mobileFilters.stockFilter) {
          case 'inStock':
            return item.totalQuantity > 0;
          case 'outOfStock':
            return item.totalQuantity === 0;
          case 'lowStock':
            return item.totalQuantity > 0 && item.totalQuantity < 10;
          default:
            return true;
        }
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[mobileFilters.sortBy as keyof typeof a];
      let bValue: any = b[mobileFilters.sortBy as keyof typeof b];

      // Handle string values
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

    return filtered;
  }, [data, mobileFilters]);

  // Choose filtered data based on device type
  const filteredData = isMobile ? mobileFilteredData : desktopFilteredData;

  // Count active mobile filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (mobileFilters.searchQuery) count++;
    if (mobileFilters.warehouseFilter !== 'all') count++;
    if (mobileFilters.stockFilter !== 'all') count++;
    return count;
  };

  const handleRefresh = () => {
    loadData();
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Breadcrumbs sx={{ mb: { xs: 1, sm: 2 } }}>
          <Link
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            <IconHome size={isMobile ? 14 : 16} style={{ marginRight: 4 }} />
            {t('common.home')}
          </Link>
          <Typography 
            color="text.primary" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            <IconReportAnalytics size={isMobile ? 14 : 16} style={{ marginRight: 4 }} />
            {t('reports.productBalance.title')}
          </Typography>
        </Breadcrumbs>

        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="h1" 
          gutterBottom 
          fontWeight="bold"
          sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}
        >
          {t('reports.productBalance.title')}
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          {t('reports.productBalance.description')}
        </Typography>
      </Box>

      {/* Desktop Filters */}
      {!isMobile && (
        <ProductBalanceFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          warehouseFilter={warehouseFilter}
          onWarehouseFilterChange={setWarehouseFilter}
          stockFilter={stockFilter}
          onStockFilterChange={setStockFilter}
          warehouses={warehouses}
          onRefresh={handleRefresh}
          loading={loading}
        />
      )}

      {/* Stats */}
      <ProductBalanceStats data={filteredData} />

      {/* Data Display */}
      <Box sx={{ 
        width: '100%',
        overflow: 'hidden',
        '& .MuiPaper-root': {
          borderRadius: { xs: 1, sm: 2 },
        }
      }}>
        {isMobile ? (
          <ProductBalanceCards data={filteredData} loading={loading} />
        ) : (
          <ProductBalanceTable data={filteredData} loading={loading} />
        )}
      </Box>

      {/* Mobile Filter FAB */}
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

      {/* Mobile Filter Component */}
      {isMobile && (
        <MobileProductBalanceFilter
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={mobileFilters}
          onFiltersChange={setMobileFilters}
          warehouses={warehouses}
          totalResults={data.length}
          filteredResults={filteredData.length}
        />
      )}

      {/* Error*/}</Container>
  );
};

export default ProductBalanceReportPage;
