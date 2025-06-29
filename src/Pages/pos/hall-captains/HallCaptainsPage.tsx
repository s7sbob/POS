// File: src/pages/pos/hall-captains/HallCaptainsPage.tsx
import React from 'react';
import {
  Container, useMediaQuery, useTheme, Box, Button, Fab, Badge,
  Snackbar, Alert, Typography, Stack, TextField, 
  InputAdornment, IconButton, Chip
} from '@mui/material';
import { IconFilter, IconPlus, IconSearch, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import PageHeader from './components/PageHeader';
import ActionsBar from './components/ActionsBar';
import CaptainTable from './components/CaptainTable';
import CaptainRow from './components/CaptainRow';
import CaptainForm from './components/CaptainForm';
import MobileCaptainsFilter, { CaptainsFilterState } from './components/mobile/MobileCaptainsFilter';
import * as apiSrv from 'src/utils/api/pagesApi/hallCaptainsApi';
import { HallCaptain } from 'src/utils/api/pagesApi/hallCaptainsApi';

interface Props {
  canAdd?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canExport?: boolean;
  canImport?: boolean;
}

const HallCaptainsPage: React.FC<Props> = (props) => {
  const { canAdd = true, canEdit = true } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDownSm = useMediaQuery(theme.breakpoints.down('sm'));

  const [captains, setCaptains] = React.useState<HallCaptain[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [error, setErr] = React.useState('');
  const [loading, setLoad] = React.useState(true);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [dialog, setDialog] = React.useState<{
    open: boolean;
    mode: 'add' | 'edit';
    current?: HallCaptain;
  }>({ open: false, mode: 'add', current: undefined });

  const [mobileFilters, setMobileFilters] = React.useState<CaptainsFilterState>({
    searchQuery: '',
    status: '',
    branchFilter: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const fetchCaptains = async () => {
    try {
      setLoad(true);
      const data = await apiSrv.getAll();
      setCaptains(data);
    } catch (e: any) {
      setErr(e?.message || t('hallCaptains.errors.loadFailed'));
    } finally {
      setLoad(false);
    }
  };

  React.useEffect(() => {
    fetchCaptains();
  }, []);

  const searchCaptains = (query: string) => {
    if (!query.trim()) {
      return captains;
    }
    
    const searchLower = query.toLowerCase();
    return captains.filter(captain => 
      captain.name.toLowerCase().includes(searchLower) ||
      captain.phone.toLowerCase().includes(searchLower) ||
      captain.notes?.toLowerCase().includes(searchLower) ||
      captain.branchName?.toLowerCase().includes(searchLower)
    );
  };

  const mobileFilteredData = React.useMemo(() => {
    let result = [...captains];

    if (mobileFilters.searchQuery.trim()) {
      const searchLower = mobileFilters.searchQuery.toLowerCase();
      result = result.filter(captain => 
        captain.name.toLowerCase().includes(searchLower) ||
        captain.phone.toLowerCase().includes(searchLower) ||
        captain.notes?.toLowerCase().includes(searchLower) ||
        captain.branchName?.toLowerCase().includes(searchLower)
      );
    }

    if (mobileFilters.status) {
      const isActive = mobileFilters.status === 'true';
      result = result.filter(captain => captain.isActive === isActive);
    }

    if (mobileFilters.branchFilter) {
      result = result.filter(captain => captain.branchId === mobileFilters.branchFilter);
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
  }, [captains, mobileFilters]);

  const displayedData = isMobile ? mobileFilteredData : searchCaptains(searchQuery);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (mobileFilters.searchQuery) count++;
    if (mobileFilters.status) count++;
    if (mobileFilters.branchFilter) count++;
    return count;
  };

  const handleAdd = async (data: any) => {
    try {
      await apiSrv.add(data);
      await fetchCaptains();
    } catch (e: any) {
      const msg = e?.message || t('hallCaptains.errors.addFailed');
      setErr(msg);
      throw e;
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      await apiSrv.update(data);
      await fetchCaptains();
    } catch (e: any) {
      const msg = e?.message || t('hallCaptains.errors.updateFailed');
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

  const handleEdit = (captain: HallCaptain) => {
    setDialog({ open: true, mode: 'edit', current: captain });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <Container maxWidth="xl">
      <PageHeader 
        exportData={captains} 
        loading={loading}
      />
      
      {/* ⭐ تنسيق البحث والإضافة زي الصفحات القديمة */}
      {!isMobile && (
        <Box mb={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
              <TextField
                placeholder={t('hallCaptains.searchPlaceholder')}
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
                  label={`${t('hallCaptains.searchResults')}: ${searchQuery}`}
                  onDelete={clearSearch}
                  color="primary"
                  variant="outlined"
                />
                <Typography variant="body2" color="text.secondary">
                  {t('hallCaptains.resultsCount', { count: displayedData.length })}
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
              {t('hallCaptains.add')}
            </Button>
          )}
        </Box>
      )}

      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          {t('hallCaptains.title')} ({displayedData.length})
        </Typography>
        
        {loading ? (
          <Box textAlign="center" py={4}>
            <Typography>{t('common.loading')}</Typography>
          </Box>
        ) : displayedData.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              {searchQuery || getActiveFiltersCount() > 0 ? t('hallCaptains.noSearchResults') : t('hallCaptains.noCaptains')}
            </Typography>
          </Box>
        ) : (
          <>
            {isDownSm
              ? displayedData.map(captain => (
                  <CaptainRow
                    key={captain.id}
                    captain={captain}
                    onEdit={() => handleEdit(captain)}
                    canEdit={canEdit}
                  />
                ))
              : (
                  <CaptainTable
                    rows={displayedData}
                    onEdit={handleEdit}
                    canEdit={canEdit}
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
        <MobileCaptainsFilter
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={mobileFilters}
          onFiltersChange={setMobileFilters}
          totalResults={captains.length}
          filteredResults={displayedData.length}
        />
      )}

      <CaptainForm
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

export default HallCaptainsPage;
