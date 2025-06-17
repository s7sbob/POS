// File: src/pages/purchases/components/mobile/MobilePurchasesFilter.tsx
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

export interface PurchasesFilterState {
  searchQuery: string;
  status: string;
  supplierId: string;
  warehouseId: string;
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface Props {
  open: boolean;
  onClose: () => void;
  filters: PurchasesFilterState;
  onFiltersChange: (filters: PurchasesFilterState) => void;
  suppliers: Array<{ id: string; name: string }>;
  warehouses: Array<{ id: string; name: string }>;
  totalResults: number;
  filteredResults: number;
}

const MobilePurchasesFilter: React.FC<Props> = ({
  open,
  onClose,
  filters,
  onFiltersChange,
  suppliers,
  warehouses,
  totalResults,
  filteredResults
}) => {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState<PurchasesFilterState>(filters);
  const [expandedSection, setExpandedSection] = useState<string>('search');

  const statusOptions = [
    { value: '', label: t('common.all') },
    { value: '1', label: t('purchases.status.pending') },
    { value: '3', label: t('purchases.status.submitted') }
  ];

  const sortOptions = [
    { value: 'referenceDocNumber', label: t('purchases.table.invoiceNumber') },
    { value: 'date1', label: t('purchases.table.invoiceDate') },
    { value: 'total', label: t('purchases.table.total') },
    { value: 'status', label: t('purchases.table.status') }
  ];

  const handleLocalChange = (field: keyof PurchasesFilterState, value: any) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const clearFilters = () => {
    const clearedFilters: PurchasesFilterState = {
      searchQuery: '',
      status: '',
      supplierId: '',
      warehouseId: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'date1',
      sortOrder: 'desc'
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.searchQuery) count++;
    if (localFilters.status) count++;
    if (localFilters.supplierId) count++;
    if (localFilters.warehouseId) count++;
    if (localFilters.dateFrom || localFilters.dateTo) count++;
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
          {t('purchases.filter.title')}
        </Typography>
        <IconButton onClick={onClose}>
          <IconX />
        </IconButton>
      </Box>

      {/* نتائج الفلترة */}
      <Box sx={{ mb: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {t('purchases.filter.results')}: {filteredResults} {t('common.of')} {totalResults}
        </Typography>
        {getActiveFiltersCount() > 0 && (
          <Typography variant="caption" color="primary">
            {getActiveFiltersCount()} {t('purchases.filter.activeFilters')}
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
            <Typography>{t('purchases.filter.search')}</Typography>
            {localFilters.searchQuery && (
              <Chip size="small" label="1" color="primary" />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            placeholder={t('purchases.filter.searchPlaceholder')}
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
            <Typography>{t('purchases.filter.filters')}</Typography>
            {(localFilters.status || localFilters.supplierId || localFilters.warehouseId) && (
              <Chip 
                size="small" 
                label={[localFilters.status, localFilters.supplierId, localFilters.warehouseId].filter(Boolean).length} 
                color="primary" 
              />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('purchases.table.status')}</InputLabel>
              <Select
                value={localFilters.status}
                label={t('purchases.table.status')}
                onChange={(e) => handleLocalChange('status', e.target.value)}
              >
                {statusOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>{t('purchases.table.supplier')}</InputLabel>
              <Select
                value={localFilters.supplierId}
                label={t('purchases.table.supplier')}
                onChange={(e) => handleLocalChange('supplierId', e.target.value)}
              >
                <MenuItem value="">
                  {t('common.all')}
                </MenuItem>
                {suppliers.map(supplier => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>{t('purchases.table.warehouse')}</InputLabel>
              <Select
                value={localFilters.warehouseId}
                label={t('purchases.table.warehouse')}
                onChange={(e) => handleLocalChange('warehouseId', e.target.value)}
              >
                <MenuItem value="">
                  {t('common.all')}
                </MenuItem>
                {warehouses.map(warehouse => (
                  <MenuItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* التواريخ */}
      <Accordion 
        expanded={expandedSection === 'dates'} 
        onChange={handleAccordionChange('dates')}
        sx={{ mb: 1 }}
      >
        <AccordionSummary expandIcon={expandedSection === 'dates' ? <IconChevronUp /> : <IconChevronDown />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography>{t('purchases.filter.dateRange')}</Typography>
            {(localFilters.dateFrom || localFilters.dateTo) && (
              <Chip size="small" label="1" color="primary" />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <TextField
              label={t('purchases.filter.dateFrom')}
              type="date"
              value={localFilters.dateFrom}
              onChange={(e) => handleLocalChange('dateFrom', e.target.value)}
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label={t('purchases.filter.dateTo')}
              type="date"
              value={localFilters.dateTo}
              onChange={(e) => handleLocalChange('dateTo', e.target.value)}
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
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
            <Typography>{t('purchases.filter.sorting')}</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('purchases.filter.sortBy')}</InputLabel>
              <Select
                value={localFilters.sortBy}
                label={t('purchases.filter.sortBy')}
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
              <InputLabel>{t('purchases.filter.sortOrder')}</InputLabel>
              <Select
                value={localFilters.sortOrder}
                label={t('purchases.filter.sortOrder')}
                onChange={(e) => handleLocalChange('sortOrder', e.target.value)}
              >
                <MenuItem value="asc">{t('purchases.filter.ascending')}</MenuItem>
                <MenuItem value="desc">{t('purchases.filter.descending')}</MenuItem>
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
            {t('purchases.filter.apply')}
          </Button>
          
          <Button
            variant="outlined"
            fullWidth
            onClick={clearFilters}
            size="large"
          >
            {t('purchases.filter.clear')}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default MobilePurchasesFilter;
