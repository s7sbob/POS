// File: src/pages/pos/table-sections/TableSectionsPage.tsx
import React from 'react';
import {
  Container, useMediaQuery, useTheme, Box, Button, Fab, Badge,
  Snackbar, Alert, Typography, Stack, TextField, 
  InputAdornment, IconButton, Chip
} from '@mui/material';
import { IconSearch, IconX, IconFilter, IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import PageHeader from './components/PageHeader';
import ActionsBar from './components/ActionsBar';
import SectionTable from './components/SectionTable';
import SectionRow from './components/SectionRow';
import SectionForm from './components/SectionForm';
import MobileSectionsFilter, { SectionsFilterState } from './components/mobile/MobileSectionsFilter';
import * as apiSrv from 'src/utils/api/pagesApi/tableSectionsApi';
import { TableSection } from 'src/utils/api/pagesApi/tableSectionsApi';

interface PermissionProps {
  canAdd?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canExport?: boolean;
  canImport?: boolean;
  canView?: boolean;
}

interface Props extends PermissionProps {}

const TableSectionsPage: React.FC<Props> = (props) => {
  const { canAdd = true } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDownSm = useMediaQuery(theme.breakpoints.down('sm'));

  const [sections, setSections] = React.useState<TableSection[]>([]);
  const [selectedSection, setSelectedSection] = React.useState<TableSection | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [error, setErr] = React.useState('');
  const [loading, setLoad] = React.useState(true);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [dialog, setDialog] = React.useState<{
    open: boolean;
    mode: 'add' | 'edit';
    current?: TableSection;
  }>({ open: false, mode: 'add', current: undefined });

  const [mobileFilters, setMobileFilters] = React.useState<SectionsFilterState>({
    searchQuery: '',
    status: '',
    branchFilter: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const fetchSections = async () => {
    try {
      setLoad(true);
      const data = await apiSrv.getAll();
      setSections(data);
    } catch (e: any) {
      setErr(e?.message || t('tableSections.errors.loadFailed'));
    } finally {
      setLoad(false);
    }
  };

  React.useEffect(() => {
    fetchSections();
  }, []);

  const searchSections = (query: string) => {
    if (!query.trim()) {
      return sections;
    }
    
    const searchLower = query.toLowerCase();
    return sections.filter(section => 
      section.name.toLowerCase().includes(searchLower) ||
      section.branchName?.toLowerCase().includes(searchLower) ||
      section.tables.some(table => table.name.toLowerCase().includes(searchLower))
    );
  };

  const mobileFilteredData = React.useMemo(() => {
    let result = [...sections];

    if (mobileFilters.searchQuery.trim()) {
      const searchLower = mobileFilters.searchQuery.toLowerCase();
      result = result.filter(section => 
        section.name.toLowerCase().includes(searchLower) ||
        section.branchName?.toLowerCase().includes(searchLower) ||
        section.tables.some(table => table.name.toLowerCase().includes(searchLower))
      );
    }

    if (mobileFilters.status) {
      const isActive = mobileFilters.status === 'true';
      result = result.filter(section => section.isActive === isActive);
    }

    if (mobileFilters.branchFilter) {
      result = result.filter(section => section.branchId === mobileFilters.branchFilter);
    }

    result.sort((a, b) => {
      let aValue: any = a[mobileFilters.sortBy as keyof typeof a];
      let bValue: any = b[mobileFilters.sortBy as keyof typeof b];

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

    return result;
  }, [sections, mobileFilters]);

  const displayedData = isMobile ? mobileFilteredData : searchSections(searchQuery);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (mobileFilters.searchQuery) count++;
    if (mobileFilters.status) count++;
    if (mobileFilters.branchFilter) count++;
    return count;
  };

  const getTotalTablesCount = () => {
    return displayedData.reduce((total, section) => total + section.tables.length, 0);
  };

  const handleAdd = async (data: any) => {
    try {
      await apiSrv.add(data);
      await fetchSections();
    } catch (e: any) {
      const msg = e?.message || t('tableSections.errors.addFailed');
      setErr(msg);
      throw e;
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      const updatedSection = await apiSrv.update(data);
      setSections(prev => prev.map(s => s.id === updatedSection.id ? updatedSection : s));
      
      if (selectedSection && selectedSection.id === data.id) {
        setSelectedSection(updatedSection);
      }
      
      return updatedSection;
    } catch (e: any) {
      console.error('Update error:', e);
      const msg = e?.message || t('tableSections.errors.updateFailed');
      setErr(msg);
      throw e;
    }
  };

  const handleSubmit = async (data: any, saveAction: 'save' | 'saveAndNew') => {
    try {
      if (dialog.mode === 'add') {
        await handleAdd(data);
      } else {
        await handleUpdate(data);
      }
      
      if (saveAction === 'save') {
        setDialog({ open: false, mode: 'add', current: undefined });
      } else {
        setDialog({ open: true, mode: 'add', current: undefined });
      }
    } catch (error) {
      throw error;
    }
  };

  const handleEdit = (section: TableSection) => {
    setDialog({ open: true, mode: 'edit', current: section });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <Container maxWidth="xl">
<PageHeader 
  exportData={sections} 
  loading={loading}
  onDataChange={fetchSections} // ⭐ إضافة callback
/>
      
      {!isMobile && (
        <Box mb={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
              <TextField
                placeholder={t('tableSections.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconSearch size={20} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={clearSearch}>
                        <IconX size={16} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ width: { xs: '100%', sm: 300 } }}
              />
            </Box>

            <ActionsBar
              onAdd={() => setDialog({ open: true, mode: 'add', current: undefined })}
            />
          </Stack>

          {searchQuery && (
            <Box mt={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={`${t('tableSections.searchResults')}: ${searchQuery}`}
                  onDelete={clearSearch}
                  color="primary"
                  variant="outlined"
                />
                <Typography variant="body2" color="text.secondary">
                  {t('tableSections.resultsCount', { count: displayedData.length })}
                </Typography>
              </Stack>
            </Box>
          )}
        </Box>
      )}

      {isMobile && (
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          {canAdd && (
            <Button
              variant="contained"
              startIcon={<IconPlus />}
              onClick={() => setDialog({ open: true, mode: 'add', current: undefined })}
              fullWidth
              size="large"
              sx={{ minHeight: 48, fontSize: '1rem' }}
            >
              {t('tableSections.add')}
            </Button>
          )}
        </Box>
      )}

      <Box mb={4}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5">
            {t('tableSections.title')} ({displayedData.length})
          </Typography>
          <Chip 
            label={t('tableSections.totalTables', { count: getTotalTablesCount() })}
            color="primary"
            variant="outlined"
          />
        </Stack>
        
        {loading ? (
          <Box textAlign="center" py={4}>
            <Typography>{t('common.loading')}</Typography>
          </Box>
        ) : displayedData.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              {searchQuery || getActiveFiltersCount() > 0 ? t('tableSections.noSearchResults') : t('tableSections.noSections')}
            </Typography>
          </Box>
        ) : (
          <>
            {isDownSm
              ? displayedData.map(section => (
                  <SectionRow
                    key={section.id}
                    section={section}
                    onEdit={() => handleEdit(section)}
                    isSelected={selectedSection?.id === section.id}
                  />
                ))
              : (
                  <SectionTable
                    rows={displayedData}
                    onEdit={handleEdit}
                    selectedSectionId={selectedSection?.id}
                  />
                )}
          </>
        )}
      </Box>

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

      {isMobile && (
        <MobileSectionsFilter
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={mobileFilters}
          onFiltersChange={setMobileFilters}
          totalResults={sections.length}
          filteredResults={displayedData.length}
        />
      )}

      <SectionForm
        open={dialog.open}
        mode={dialog.mode}
        initialValues={dialog.current}
        onClose={() => setDialog({ open: false, mode: 'add', current: undefined })}
        onSubmit={handleSubmit}
      />

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setErr('')}>
        <Alert severity="error" onClose={() => setErr('')}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TableSectionsPage;
