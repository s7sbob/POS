// File: src/pages/reports/components/ProductBalanceFilters.tsx
import React from 'react';
import {
  Paper,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography
} from '@mui/material';
import { IconSearch, IconFilter, IconRefresh } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface Props {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  warehouseFilter: string;
  onWarehouseFilterChange: (warehouse: string) => void;
  stockFilter: string;
  onStockFilterChange: (filter: string) => void;
  warehouses: string[];
  onRefresh: () => void;
  loading: boolean;
}

const ProductBalanceFilters: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  warehouseFilter,
  onWarehouseFilterChange,
  stockFilter,
  onStockFilterChange,
  warehouses,
  onRefresh,
  loading
}) => {
  const { t } = useTranslation();

  const stockFilterOptions = [
    { value: 'all', label: t('reports.stockFilter.all') },
    { value: 'inStock', label: t('reports.stockFilter.inStock') },
    { value: 'outOfStock', label: t('reports.stockFilter.outOfStock') },
    { value: 'lowStock', label: t('reports.stockFilter.lowStock') },
  ];

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconFilter size={20} />
        <Typography variant="h6" sx={{ ml: 1 }}>
          {t('reports.filters.title')}
        </Typography>
      </Box>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder={t('reports.filters.searchProducts')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={20} />
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>{t('reports.filters.warehouse')}</InputLabel>
            <Select
              value={warehouseFilter}
              onChange={(e) => onWarehouseFilterChange(e.target.value)}
              label={t('reports.filters.warehouse')}
            >
              <MenuItem value="all">{t('reports.filters.allWarehouses')}</MenuItem>
              {warehouses.map((warehouse) => (
                <MenuItem key={warehouse} value={warehouse}>
                  {warehouse}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>{t('reports.filters.stockStatus')}</InputLabel>
            <Select
              value={stockFilter}
              onChange={(e) => onStockFilterChange(e.target.value)}
              label={t('reports.filters.stockStatus')}
            >
              {stockFilterOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={2}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<IconRefresh />}
            onClick={onRefresh}
            disabled={loading}
          >
            {t('common.refresh')}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProductBalanceFilters;
