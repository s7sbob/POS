// File: src/pages/inventory/adjustments-list/components/mobile/MobileAdjustmentsFilter.tsx
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

export interface FilterState {
  searchQuery: string;
  adjustmentType: string;
  status: string;
  warehouseId: string;
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface Props {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  warehouses: Array<{ id: string; name: string }>;
  totalResults: number;
  filteredResults: number;
}

const MobileAdjustmentsFilter: React.FC<Props> = ({
  open,
  onClose,
  filters,
  onFiltersChange,
  warehouses,
  totalResults,
  filteredResults
}) => {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [expandedSection, setExpandedSection] = useState<string>('search');

  const adjustmentTypeOptions = [
    { value: '', label: t('common.all') },
    { value: '0', label: t('adjustments.types.new') },
    { value: '1', label: t('adjustments.types.openingBalance') },
    { value: '2', label: t('adjustments.types.manualAdjustment') }
  ];

  const statusOptions = [
    { value: '', label: t('common.all') },
    { value: '1', label: t('adjustments.status.saved') },
    { value: '3', label: t('adjustments.status.submitted') }
  ];

  const sortOptions = [
    { value: 'adjustmentDate', label: t('adjustments.table.date') },
    { value: 'adjustmentType', label: t('adjustments.table.type') },
    { value: 'status', label: t('adjustments.table.status') },
    { value: 'warehouseName', label: t('adjustments.table.warehouse') }
  ];

  const handleLocalChange = (field: keyof FilterState, value: any) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      searchQuery: '',
      adjustmentType: '',
      status: '',
      warehouseId: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'adjustmentDate',
      sortOrder: 'desc'
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.searchQuery) count++;
    if (localFilters.adjustmentType) count++;
    if (localFilters.status) count++;
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
          {t('adjustments.filter.title')}
        </Typography>
        <IconButton onClick={onClose}>
          <IconX />
        </IconButton>
      </Box>

      {/* نتائج الفلترة */}
      <Box sx={{ mb: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {t('adjustments.filter.results')}: {filteredResults} {t('common.of')} {totalResults}
        </Typography>
        {getActiveFiltersCount() > 0 && (
          <Typography variant="caption" color="primary">
            {getActiveFiltersCount()} {t('adjustments.filter.activeFilters')}
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
            <Typography>{t('adjustments.filter.search')}</Typography>
            {localFilters.searchQuery && (
              <Chip size="small" label="1" color="primary" />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            placeholder={t('adjustments.filter.searchPlaceholder')}
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
            <Typography>{t('adjustments.filter.filters')}</Typography>
            {(localFilters.adjustmentType || localFilters.status || localFilters.warehouseId) && (
              <Chip 
                size="small" 
                label={[localFilters.adjustmentType, localFilters.status, localFilters.warehouseId].filter(Boolean).length} 
                color="primary" 
              />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('adjustments.table.type')}</InputLabel>
              <Select
                value={localFilters.adjustmentType}
                label={t('adjustments.table.type')}
                onChange={(e) => handleLocalChange('adjustmentType', e.target.value)}
              >
                {adjustmentTypeOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>{t('adjustments.table.status')}</InputLabel>
              <Select
                value={localFilters.status}
                label={t('adjustments.table.status')}
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
              <InputLabel>{t('adjustments.table.warehouse')}</InputLabel>
              <Select
                value={localFilters.warehouseId}
                label={t('adjustments.table.warehouse')}
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
            <Typography>{t('adjustments.filter.dateRange')}</Typography>
            {(localFilters.dateFrom || localFilters.dateTo) && (
              <Chip size="small" label="1" color="primary" />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <TextField
              label={t('adjustments.filter.dateFrom')}
              type="date"
              value={localFilters.dateFrom}
              onChange={(e) => handleLocalChange('dateFrom', e.target.value)}
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label={t('adjustments.filter.dateTo')}
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
            <Typography>{t('adjustments.filter.sorting')}</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('adjustments.filter.sortBy')}</InputLabel>
              <Select
                value={localFilters.sortBy}
                label={t('adjustments.filter.sortBy')}
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
              <InputLabel>{t('adjustments.filter.sortOrder')}</InputLabel>
              <Select
                value={localFilters.sortOrder}
                label={t('adjustments.filter.sortOrder')}
                onChange={(e) => handleLocalChange('sortOrder', e.target.value)}
              >
                <MenuItem value="asc">{t('adjustments.filter.ascending')}</MenuItem>
                <MenuItem value="desc">{t('adjustments.filter.descending')}</MenuItem>
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
            {t('adjustments.filter.apply')}
          </Button>
          
          <Button
            variant="outlined"
            fullWidth
            onClick={clearFilters}
            size="large"
          >
            {t('adjustments.filter.clear')}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default MobileAdjustmentsFilter;
