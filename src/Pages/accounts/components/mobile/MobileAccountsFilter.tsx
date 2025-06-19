// File: src/pages/accounts/components/mobile/MobileAccountsFilter.tsx
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

export interface AccountsFilterState {
  searchQuery: string;
  accountType: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface Props {
  open: boolean;
  onClose: () => void;
  filters: AccountsFilterState;
  onFiltersChange: (filters: AccountsFilterState) => void;
  totalResults: number;
  filteredResults: number;
}

const MobileAccountsFilter: React.FC<Props> = ({
  open,
  onClose,
  filters,
  onFiltersChange,
  totalResults,
  filteredResults
}) => {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState<AccountsFilterState>(filters);
  const [expandedSection, setExpandedSection] = useState<string>('search');

  const accountTypeOptions = [
    { value: '', label: t('common.all') },
    { value: 'Bank', label: t('accounts.types.bank') },
    { value: 'Wallet', label: t('accounts.types.wallet') },
    { value: 'Visa', label: t('accounts.types.visa') },
    { value: 'InstaPay', label: t('accounts.types.instapay') },
    { value: 'StaffAccount', label: t('accounts.types.staffAccount') }
  ];

  const statusOptions = [
    { value: '', label: t('common.all') },
    { value: 'true', label: t('accounts.active') },
    { value: 'false', label: t('accounts.inactive') }
  ];

  const sortOptions = [
    { value: 'name', label: t('accounts.name') },
    { value: 'typeName', label: t('accounts.type') },
    { value: 'accountNumber', label: t('accounts.accountNumber') },
    { value: 'collectionFeePercent', label: t('accounts.collectionFeePercent') },
    { value: 'isActive', label: t('accounts.status') }
  ];

  const handleLocalChange = (field: keyof AccountsFilterState, value: any) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const clearFilters = () => {
    const clearedFilters: AccountsFilterState = {
      searchQuery: '',
      accountType: '',
      status: '',
      sortBy: 'name',
      sortOrder: 'asc'
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.searchQuery) count++;
    if (localFilters.accountType) count++;
    if (localFilters.status) count++;
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
          {t('accounts.filter.title')}
        </Typography>
        <IconButton onClick={onClose}>
          <IconX />
        </IconButton>
      </Box>

      {/* نتائج الفلترة */}
      <Box sx={{ mb: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {t('accounts.filter.results')}: {filteredResults} {t('common.of')} {totalResults}
        </Typography>
        {getActiveFiltersCount() > 0 && (
          <Typography variant="caption" color="primary">
            {getActiveFiltersCount()} {t('accounts.filter.activeFilters')}
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
            <Typography>{t('accounts.filter.search')}</Typography>
            {localFilters.searchQuery && (
              <Chip size="small" label="1" color="primary" />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            placeholder={t('accounts.filter.searchPlaceholder')}
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
            <Typography>{t('accounts.filter.filters')}</Typography>
            {(localFilters.accountType || localFilters.status) && (
              <Chip 
                size="small" 
                label={[localFilters.accountType, localFilters.status].filter(Boolean).length} 
                color="primary" 
              />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('accounts.type')}</InputLabel>
              <Select
                value={localFilters.accountType}
                label={t('accounts.type')}
                onChange={(e) => handleLocalChange('accountType', e.target.value)}
              >
                {accountTypeOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>{t('accounts.status')}</InputLabel>
              <Select
                value={localFilters.status}
                label={t('accounts.status')}
                onChange={(e) => handleLocalChange('status', e.target.value)}
              >
                {statusOptions.map(option => (
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
            <Typography>{t('accounts.filter.sorting')}</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('accounts.filter.sortBy')}</InputLabel>
              <Select
                value={localFilters.sortBy}
                label={t('accounts.filter.sortBy')}
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
              <InputLabel>{t('accounts.filter.sortOrder')}</InputLabel>
              <Select
                value={localFilters.sortOrder}
                label={t('accounts.filter.sortOrder')}
                onChange={(e) => handleLocalChange('sortOrder', e.target.value)}
              >
                <MenuItem value="asc">{t('accounts.filter.ascending')}</MenuItem>
                <MenuItem value="desc">{t('accounts.filter.descending')}</MenuItem>
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
            {t('accounts.filter.apply')}
          </Button>
          
          <Button
            variant="outlined"
            fullWidth
            onClick={clearFilters}
            size="large"
          >
            {t('accounts.filter.clear')}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default MobileAccountsFilter;
