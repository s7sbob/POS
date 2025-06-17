// File: src/pages/products/components/mobile/MobileProductsFilter.tsx
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
import { Group } from 'src/utils/api/pagesApi/groupsApi';

export interface ProductsFilterState {
  searchQuery: string;
  groupId: string;
  productType: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface Props {
  open: boolean;
  onClose: () => void;
  filters: ProductsFilterState;
  onFiltersChange: (filters: ProductsFilterState) => void;
  groups: Group[];
  totalResults: number;
  filteredResults: number;
}

const MobileProductsFilter: React.FC<Props> = ({
  open,
  onClose,
  filters,
  onFiltersChange,
  groups,
  totalResults,
  filteredResults
}) => {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState<ProductsFilterState>(filters);
  const [expandedSection, setExpandedSection] = useState<string>('search');

  const productTypeOptions = [
    { value: '', label: t('common.all') },
    { value: '1', label: 'POS' },
    { value: '2', label: 'Material' }
  ];

  const statusOptions = [
    { value: '', label: t('common.all') },
    { value: 'true', label: t('products.active') },
    { value: 'false', label: t('products.inactive') }
  ];

  const sortOptions = [
    { value: 'name', label: t('products.name') },
    { value: 'cost', label: t('products.cost') },
    { value: 'createdOn', label: t('products.created') },
    { value: 'isActive', label: t('products.status') }
  ];

  // تحويل الشجرة إلى قائمة مسطحة
  const flattenGroups = (groups: Group[], level = 0): Array<{ group: Group; level: number }> => {
    const result: Array<{ group: Group; level: number }> = [];
    
    groups.forEach(group => {
      result.push({ group, level });
      if (group.children && group.children.length > 0) {
        result.push(...flattenGroups(group.children, level + 1));
      }
    });
    
    return result;
  };

  const flatGroups = flattenGroups(groups);

  const handleLocalChange = (field: keyof ProductsFilterState, value: any) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const clearFilters = () => {
    const clearedFilters: ProductsFilterState = {
      searchQuery: '',
      groupId: '',
      productType: '',
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
    if (localFilters.groupId) count++;
    if (localFilters.productType) count++;
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
          {t('products.filter.title')}
        </Typography>
        <IconButton onClick={onClose}>
          <IconX />
        </IconButton>
      </Box>

      {/* نتائج الفلترة */}
      <Box sx={{ mb: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {t('products.filter.results')}: {filteredResults} {t('common.of')} {totalResults}
        </Typography>
        {getActiveFiltersCount() > 0 && (
          <Typography variant="caption" color="primary">
            {getActiveFiltersCount()} {t('products.filter.activeFilters')}
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
            <Typography>{t('products.filter.search')}</Typography>
            {localFilters.searchQuery && (
              <Chip size="small" label="1" color="primary" />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            placeholder={t('products.filter.searchPlaceholder')}
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
            <Typography>{t('products.filter.filters')}</Typography>
            {(localFilters.groupId || localFilters.productType || localFilters.status) && (
              <Chip 
                size="small" 
                label={[localFilters.groupId, localFilters.productType, localFilters.status].filter(Boolean).length} 
                color="primary" 
              />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('products.group')}</InputLabel>
              <Select
                value={localFilters.groupId}
                label={t('products.group')}
                onChange={(e) => handleLocalChange('groupId', e.target.value)}
              >
                <MenuItem value="">
                  {t('common.all')}
                </MenuItem>
                {flatGroups.map(({ group, level }) => (
                  <MenuItem key={group.id} value={group.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: level * 20 }} />
                      <Typography>
                        {'─'.repeat(level)} {group.name}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>{t('products.type')}</InputLabel>
              <Select
                value={localFilters.productType}
                label={t('products.type')}
                onChange={(e) => handleLocalChange('productType', e.target.value)}
              >
                {productTypeOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>{t('products.status')}</InputLabel>
              <Select
                value={localFilters.status}
                label={t('products.status')}
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
            <Typography>{t('products.filter.sorting')}</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('products.filter.sortBy')}</InputLabel>
              <Select
                value={localFilters.sortBy}
                label={t('products.filter.sortBy')}
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
              <InputLabel>{t('products.filter.sortOrder')}</InputLabel>
              <Select
                value={localFilters.sortOrder}
                label={t('products.filter.sortOrder')}
                onChange={(e) => handleLocalChange('sortOrder', e.target.value)}
              >
                <MenuItem value="asc">{t('products.filter.ascending')}</MenuItem>
                <MenuItem value="desc">{t('products.filter.descending')}</MenuItem>
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
            {t('products.filter.apply')}
          </Button>
          
          <Button
            variant="outlined"
            fullWidth
            onClick={clearFilters}
            size="large"
          >
            {t('products.filter.clear')}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default MobileProductsFilter;
