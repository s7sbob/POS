// File: src/pages/delivery/companies/components/mobile/MobileCompaniesFilter.tsx
import React from 'react';
import {
  Drawer, Box, Typography, TextField, FormControl, InputLabel,
  Select, MenuItem, Button, Divider, Stack, IconButton, Chip
} from '@mui/material';
import { IconX, IconFilter } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export interface CompaniesFilterState {
  searchQuery: string;
  status: string;
  paymentType: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface Props {
  open: boolean;
  onClose: () => void;
  filters: CompaniesFilterState;
  onFiltersChange: (filters: CompaniesFilterState) => void;
  totalResults: number;
  filteredResults: number;
}

const MobileCompaniesFilter: React.FC<Props> = ({
  open,
  onClose,
  filters,
  onFiltersChange,
  totalResults,
  filteredResults
}) => {
  const { t } = useTranslation();

  const updateFilter = (key: keyof CompaniesFilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchQuery: '',
      status: '',
      paymentType: '',
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.status) count++;
    if (filters.paymentType) count++;
    return count;
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          maxHeight: '80vh'
        }
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconFilter size={20} />
            <Typography variant="h6">
              {t('common.filters')}
            </Typography>
            {getActiveFiltersCount() > 0 && (
              <Chip 
                label={getActiveFiltersCount()} 
                size="small" 
                color="primary" 
              />
            )}
          </Box>
          <IconButton onClick={onClose}>
            <IconX />
          </IconButton>
        </Box>

        <Stack spacing={3}>
          {/* Search */}
          <TextField
            label={t('deliveryCompanies.searchPlaceholder')}
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            fullWidth
          />

          {/* Status Filter */}
          <FormControl fullWidth>
            <InputLabel>{t('common.status')}</InputLabel>
            <Select
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
              label={t('common.status')}
            >
              <MenuItem value="">
                <em>{t('common.all')}</em>
              </MenuItem>
              <MenuItem value="true">{t('common.active')}</MenuItem>
              <MenuItem value="false">{t('common.inactive')}</MenuItem>
            </Select>
          </FormControl>

          {/* Payment Type Filter */}
          <FormControl fullWidth>
            <InputLabel>{t('deliveryCompanies.form.paymentType')}</InputLabel>
            <Select
              value={filters.paymentType}
              onChange={(e) => updateFilter('paymentType', e.target.value)}
              label={t('deliveryCompanies.form.paymentType')}
            >
              <MenuItem value="">
                <em>{t('common.all')}</em>
              </MenuItem>
              <MenuItem value="Cash">{t('deliveryCompanies.form.cash')}</MenuItem>
              <MenuItem value="Visa">{t('deliveryCompanies.form.visa')}</MenuItem>
            </Select>
          </FormControl>

          {/* Sort By */}
          <FormControl fullWidth>
            <InputLabel>{t('common.sortBy')}</InputLabel>
            <Select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              label={t('common.sortBy')}
            >
              <MenuItem value="name">{t('deliveryCompanies.form.name')}</MenuItem>
              <MenuItem value="companySharePercentage">{t('deliveryCompanies.form.companySharePercentage')}</MenuItem>
              <MenuItem value="phone">{t('deliveryCompanies.form.phone')}</MenuItem>
            </Select>
          </FormControl>

          {/* Sort Order */}
          <FormControl fullWidth>
            <InputLabel>{t('common.sortOrder')}</InputLabel>
            <Select
              value={filters.sortOrder}
              onChange={(e) => updateFilter('sortOrder', e.target.value as 'asc' | 'desc')}
              label={t('common.sortOrder')}
            >
              <MenuItem value="asc">{t('common.ascending')}</MenuItem>
              <MenuItem value="desc">{t('common.descending')}</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Results Info */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {t('common.showingResults', { 
              filtered: filteredResults, 
              total: totalResults 
            })}
          </Typography>
        </Box>

        {/* Actions */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={clearFilters}
            fullWidth
            disabled={getActiveFiltersCount() === 0}
          >
            {t('common.clearFilters')}
          </Button>
          <Button
            variant="contained"
            onClick={onClose}
            fullWidth
          >
            {t('common.applyFilters')}
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default MobileCompaniesFilter;
