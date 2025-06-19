// File: src/pages/safes/components/mobile/MobileSafesFilter.tsx
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

export interface SafesFilterState {
  searchQuery: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface Props {
  open: boolean;
  onClose: () => void;
  filters: SafesFilterState;
  onFiltersChange: (filters: SafesFilterState) => void;
  totalResults: number;
  filteredResults: number;
}

const MobileSafesFilter: React.FC<Props> = ({
  open,
  onClose,
  filters,
  onFiltersChange,
  totalResults,
  filteredResults
}) => {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState<SafesFilterState>(filters);
  const [expandedSection, setExpandedSection] = useState<string>('search');

  const statusOptions = [
    { value: '', label: t('common.all') },
    { value: 'true', label: t('safes.active') },
    { value: 'false', label: t('safes.inactive') }
  ];

  const sortOptions = [
    { value: 'name', label: t('safes.name') },
    { value: 'typeName', label: t('safes.type') },
    { value: 'collectionFeePercent', label: t('safes.collectionFeePercent') },
    { value: 'isActive', label: t('safes.status') }
  ];

  const handleLocalChange = (field: keyof SafesFilterState, value: any) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const clearFilters = () => {
    const clearedFilters: SafesFilterState = {
      searchQuery: '',
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
          {t('safes.filter.title')}
        </Typography>
        <IconButton onClick={onClose}>
          <IconX />
        </IconButton>
      </Box>

      {/* نتائج الفلترة */}
      <Box sx={{ mb: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {t('safes.filter.results')}: {filteredResults} {t('common.of')} {totalResults}
        </Typography>
        {getActiveFiltersCount() > 0 && (
          <Typography variant="caption" color="primary">
            {getActiveFiltersCount()} {t('safes.filter.activeFilters')}
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
            <Typography>{t('safes.filter.search')}</Typography>
            {localFilters.searchQuery && (
              <Chip size="small" label="1" color="primary" />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            placeholder={t('safes.filter.searchPlaceholder')}
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
            <Typography>{t('safes.filter.filters')}</Typography>
            {localFilters.status && (
              <Chip size="small" label="1" color="primary" />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth size="small">
            <InputLabel>{t('safes.status')}</InputLabel>
            <Select
              value={localFilters.status}
              label={t('safes.status')}
              onChange={(e) => handleLocalChange('status', e.target.value)}
            >
              {statusOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
            <Typography>{t('safes.filter.sorting')}</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('safes.filter.sortBy')}</InputLabel>
              <Select
                value={localFilters.sortBy}
                label={t('safes.filter.sortBy')}
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
              <InputLabel>{t('safes.filter.sortOrder')}</InputLabel>
              <Select
                value={localFilters.sortOrder}
                label={t('safes.filter.sortOrder')}
                onChange={(e) => handleLocalChange('sortOrder', e.target.value)}
              >
                <MenuItem value="asc">{t('safes.filter.ascending')}</MenuItem>
                <MenuItem value="desc">{t('safes.filter.descending')}</MenuItem>
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
            {t('safes.filter.apply')}
          </Button>
          
          <Button
            variant="outlined"
            fullWidth
            onClick={clearFilters}
            size="large"
          >
            {t('safes.filter.clear')}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default MobileSafesFilter;
