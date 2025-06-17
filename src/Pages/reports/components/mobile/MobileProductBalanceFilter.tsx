// File: src/pages/reports/components/mobile/MobileProductBalanceFilter.tsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Chip,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import {
  IconChevronDown,
  IconChevronUp,
  IconFilter,
  IconX,
  IconSearch,
  IconSortAscending,
  IconSortDescending
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export interface ProductBalanceFilterState {
  searchQuery: string;
  warehouseFilter: string;
  stockFilter: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface Props {
  open: boolean;
  onClose: () => void;
  filters: ProductBalanceFilterState;
  onFiltersChange: (filters: ProductBalanceFilterState) => void;
  warehouses: string[];
  totalResults: number;
  filteredResults: number;
}

const MobileProductBalanceFilter: React.FC<Props> = ({
  open,
  onClose,
  filters,
  onFiltersChange,
  warehouses,
  totalResults,
  filteredResults
}) => {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState<ProductBalanceFilterState>(filters);
  const [expandedSection, setExpandedSection] = useState<string>('search');

  const stockFilterOptions = [
    { value: 'all', label: t('reports.stockFilter.all') },
    { value: 'inStock', label: t('reports.stockFilter.inStock') },
    { value: 'outOfStock', label: t('reports.stockFilter.outOfStock') },
    { value: 'lowStock', label: t('reports.stockFilter.lowStock') },
  ];

  const sortOptions = [
    { value: 'productName', label: t('reports.table.product') },
    { value: 'wareHouseName', label: t('reports.table.warehouse') },
    { value: 'totalQuantity', label: t('reports.table.totalQuantity') },
    { value: 'totalCost', label: t('reports.table.totalCostValue') },
    { value: 'totalLastPurePrice', label: t('reports.table.totalLastPurePriceValue') }
  ];

  const handleLocalChange = (field: keyof ProductBalanceFilterState, value: any) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const clearFilters = () => {
    const clearedFilters: ProductBalanceFilterState = {
      searchQuery: '',
      warehouseFilter: 'all',
      stockFilter: 'all',
      sortBy: 'productName',
      sortOrder: 'asc'
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.searchQuery) count++;
    if (localFilters.warehouseFilter !== 'all') count++;
    if (localFilters.stockFilter !== 'all') count++;
    return count;
  };

  const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSection(isExpanded ? panel : '');
  };

  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'background.paper',
        zIndex: 1300,
        overflow: 'auto',
        p: 2
      }}
    >
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        position: 'sticky',
        top: 0,
        backgroundColor: 'background.paper',
        zIndex: 1,
        pb: 1
      }}>
        <Typography variant="h6">
          {t('reports.filter.title')}
        </Typography>
        <IconButton onClick={onClose}>
          <IconX />
        </IconButton>
      </Box>

      {/* نتائج الفلترة */}
      <Box sx={{ mb: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {t('reports.filter.results')}: {filteredResults} {t('common.of')} {totalResults}
        </Typography>
        {getActiveFiltersCount() > 0 && (
          <Typography variant="caption" color="primary">
            {getActiveFiltersCount()} {t('reports.filter.activeFilters')}
          </Typography>
        )}
      </Box>

      {/* البحث */}
      <Accordion 
        expanded={expandedSection === 'search'} 
        onChange={handleAccordionChange('search')}
        sx={{ mb: 1 }}
      >
        <AccordionSummary expandIcon={expandedSection === 'search' ? <IconChevronUp /> : <IconChevronDown />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconSearch size={20} />
            <Typography>{t('reports.filter.search')}</Typography>
            {localFilters.searchQuery && (
              <Chip size="small" label="1" color="primary" />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            placeholder={t('reports.filter.searchPlaceholder')}
            value={localFilters.searchQuery}
            onChange={(e) => handleLocalChange('searchQuery', e.target.value)}
            size="small"
          />
        </AccordionDetails>
      </Accordion>

      {/* الفلاتر */}
      <Accordion 
        expanded={expandedSection === 'filters'} 
        onChange={handleAccordionChange('filters')}
        sx={{ mb: 1 }}
      >
        <AccordionSummary expandIcon={expandedSection === 'filters' ? <IconChevronUp /> : <IconChevronDown />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconFilter size={20} />
            <Typography>{t('reports.filter.filters')}</Typography>
            {(localFilters.warehouseFilter !== 'all' || localFilters.stockFilter !== 'all') && (
              <Chip 
                size="small" 
                label={[localFilters.warehouseFilter !== 'all', localFilters.stockFilter !== 'all'].filter(Boolean).length} 
                color="primary" 
              />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('reports.filters.warehouse')}</InputLabel>
              <Select
                value={localFilters.warehouseFilter}
                label={t('reports.filters.warehouse')}
                onChange={(e) => handleLocalChange('warehouseFilter', e.target.value)}
              >
                <MenuItem value="all">{t('reports.filters.allWarehouses')}</MenuItem>
                {warehouses.map((warehouse) => (
                  <MenuItem key={warehouse} value={warehouse}>
                    {warehouse}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>{t('reports.filters.stockStatus')}</InputLabel>
              <Select
                value={localFilters.stockFilter}
                label={t('reports.filters.stockStatus')}
                onChange={(e) => handleLocalChange('stockFilter', e.target.value)}
              >
                {stockFilterOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* الترتيب */}
      <Accordion 
        expanded={expandedSection === 'sort'} 
        onChange={handleAccordionChange('sort')}
        sx={{ mb: 1 }}
      >
        <AccordionSummary expandIcon={expandedSection === 'sort' ? <IconChevronUp /> : <IconChevronDown />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {localFilters.sortOrder === 'asc' ? <IconSortAscending size={20} /> : <IconSortDescending size={20} />}
            <Typography>{t('reports.filter.sorting')}</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('reports.filter.sortBy')}</InputLabel>
              <Select
                value={localFilters.sortBy}
                label={t('reports.filter.sortBy')}
                onChange={(e) => handleLocalChange('sortBy', e.target.value)}
              >
                {sortOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>{t('reports.filter.sortOrder')}</InputLabel>
              <Select
                value={localFilters.sortOrder}
                label={t('reports.filter.sortOrder')}
                onChange={(e) => handleLocalChange('sortOrder', e.target.value)}
              >
                <MenuItem value="asc">{t('reports.filter.ascending')}</MenuItem>
                <MenuItem value="desc">{t('reports.filter.descending')}</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* الأزرار */}
      <Box sx={{ 
        position: 'sticky', 
        bottom: 0, 
        backgroundColor: 'background.paper', 
        pt: 2, 
        mt: 2 
      }}>
        <Stack spacing={1}>
          <Button
            variant="contained"
            fullWidth
            onClick={applyFilters}
            size="large"
          >
            {t('reports.filter.apply')}
          </Button>
          
          <Button
            variant="outlined"
            fullWidth
            onClick={clearFilters}
            size="large"
          >
            {t('reports.filter.clear')}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default MobileProductBalanceFilter;
