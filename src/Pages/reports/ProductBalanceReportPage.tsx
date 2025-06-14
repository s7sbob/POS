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
  Snackbar,
  Alert
} from '@mui/material';
import { IconHome, IconReportAnalytics } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ProductBalanceFilters from './components/ProductBalanceFilters';
import ProductBalanceStats from './components/ProductBalanceStats';
import ProductBalanceTable from './components/ProductBalanceTable';
import ProductBalanceCards from './components/ProductBalanceCards';
import * as reportsApi from 'src/utils/api/reportsApi';
import { GroupedProductBalance } from 'src/utils/api/reportsApi';

const ProductBalanceReportPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [data, setData] = useState<GroupedProductBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

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

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    let filtered = data;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.wareHouseName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Warehouse filter
    if (warehouseFilter !== 'all') {
      filtered = filtered.filter(item => item.wareHouseName === warehouseFilter);
    }

    // Stock filter
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

  const handleRefresh = () => {
    loadData();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <IconHome size={16} style={{ marginRight: 4 }} />
            {t('common.home')}
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <IconReportAnalytics size={16} style={{ marginRight: 4 }} />
            {t('reports.productBalance.title')}
          </Typography>
        </Breadcrumbs>

        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          {t('reports.productBalance.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('reports.productBalance.description')}
        </Typography>
      </Box>

      {/* Filters */}
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

      {/* Stats */}
      <ProductBalanceStats data={filteredData} />

      {/* Data Display */}
      {isMobile ? (
        <ProductBalanceCards data={filteredData} loading={loading} />
      ) : (
        <ProductBalanceTable data={filteredData} loading={loading} />
      )}

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductBalanceReportPage;
