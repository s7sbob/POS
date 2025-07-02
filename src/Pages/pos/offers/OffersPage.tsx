// File: src/pages/pos/offers/OffersPage.tsx
import React from 'react';
import {
  Container, useMediaQuery, useTheme, Box, Button, Fab, Badge,
  Snackbar, Alert, Typography, Stack, TextField, 
  InputAdornment, IconButton, Chip, Pagination
} from '@mui/material';
import { IconFilter, IconPlus, IconSearch, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import PageHeader from './components/PageHeader';
import ActionsBar from './components/ActionsBar';
import OfferTable from './components/OfferTable';
import OfferRow from './components/OfferRow';
import OfferForm from './components/OfferForm';
import MobileOffersFilter, { OffersFilterState } from './components/mobile/MobileOffersFilter';
import * as apiSrv from 'src/utils/api/pagesApi/offersApi';
import { Offer, OffersResponse } from 'src/utils/api/pagesApi/offersApi';

interface PermissionProps {
  canAdd?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canExport?: boolean;
  canImport?: boolean;
  canView?: boolean;
}

interface Props extends PermissionProps {}

const OffersPage: React.FC<Props> = (props) => {
  const { canAdd = true, canEdit = true } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDownSm = useMediaQuery(theme.breakpoints.down('sm'));

  const [offersData, setOffersData] = React.useState<OffersResponse>({
    totalCount: 0,
    pageCount: 1,
    pageNumber: 1,
    pageSize: 20,
    data: []
  });
  const [selectedOffer, setSelectedOffer] = React.useState<Offer | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [error, setErr] = React.useState('');
  const [loading, setLoad] = React.useState(true);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [dialog, setDialog] = React.useState<{
    open: boolean;
    mode: 'add' | 'edit';
    current?: Offer;
  }>({ open: false, mode: 'add', current: undefined });

  const [mobileFilters, setMobileFilters] = React.useState<OffersFilterState>({
    searchQuery: '',
    status: '',
    priceType: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const fetchOffers = async (page = 1) => {
    try {
      setLoad(true);
      const data = await apiSrv.getAll(page, offersData.pageSize);
      setOffersData(data);
    } catch (e: any) {
      setErr(e?.message || t('offers.errors.loadFailed'));
    } finally {
      setLoad(false);
    }
  };

  React.useEffect(() => {
    fetchOffers();
    // eslint-disable-next-line
  }, []);

  const searchOffers = (query: string) => {
    if (!query.trim()) {
      return offersData.data;
    }
    
    const searchLower = query.toLowerCase();
    return offersData.data.filter(offer => 
      offer.name.toLowerCase().includes(searchLower) ||
      offer.priceType.toLowerCase().includes(searchLower)
    );
  };

  const mobileFilteredData = React.useMemo(() => {
    let result = [...offersData.data];

    if (mobileFilters.searchQuery.trim()) {
      const searchLower = mobileFilters.searchQuery.toLowerCase();
      result = result.filter(offer => 
        offer.name.toLowerCase().includes(searchLower) ||
        offer.priceType.toLowerCase().includes(searchLower)
      );
    }

    if (mobileFilters.status) {
      const isActive = mobileFilters.status === 'true';
      result = result.filter(offer => offer.isActive === isActive);
    }

    if (mobileFilters.priceType) {
      result = result.filter(offer => offer.priceType === mobileFilters.priceType);
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
  }, [offersData.data, mobileFilters]);

  const displayedData = isMobile ? mobileFilteredData : searchOffers(searchQuery);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (mobileFilters.searchQuery) count++;
    if (mobileFilters.status) count++;
    if (mobileFilters.priceType) count++;
    return count;
  };

  const handleAdd = async (data: any) => {
    try {
      await apiSrv.add(data);
      await fetchOffers(offersData.pageNumber);
    } catch (e: any) {
      throw e;
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      const updatedOffer = await apiSrv.update(data);
      setOffersData(prev => ({
        ...prev,
        data: prev.data.map(o => o.id === updatedOffer.id ? updatedOffer : o)
      }));
      if (selectedOffer && selectedOffer.id === data.id) {
        setSelectedOffer(updatedOffer);
      }
      return updatedOffer;
    } catch (e: any) {
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

  const handleEdit = (offer: Offer) => {
    setDialog({ open: true, mode: 'edit', current: offer });
  };

  const handlePageChange = (_: any, page: number) => {
    fetchOffers(page);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <Container maxWidth="xl">
      <PageHeader 
        exportData={offersData.data} 
        loading={loading}
        onDataChange={fetchOffers}
      />
      
      {!isMobile && (
        <Box mb={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
              <TextField
                placeholder={t('offers.searchPlaceholder')}
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
                  label={`${t('offers.searchResults')}: ${searchQuery}`}
                  onDelete={clearSearch}
                  color="primary"
                  variant="outlined"
                />
                <Typography variant="body2" color="text.secondary">
                  {t('offers.resultsCount', { count: displayedData.length })}
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
              {t('offers.add')}
            </Button>
          )}
        </Box>
      )}

      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          {t('offers.title')} ({offersData.totalCount})
        </Typography>
        
        {loading ? (
          <Box textAlign="center" py={4}>
            <Typography>{t('common.loading')}</Typography>
          </Box>
        ) : displayedData.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              {searchQuery || getActiveFiltersCount() > 0 ? t('offers.noSearchResults') : t('offers.noOffers')}
            </Typography>
          </Box>
        ) : (
          <>
            {isDownSm
              ? displayedData.map(offer => (
                  <OfferRow
                    key={offer.id}
                    offer={offer}
                    onEdit={() => handleEdit(offer)}
                    isSelected={selectedOffer?.id === offer.id}
                    canEdit={canEdit}
                  />
                ))
              : (
                  <OfferTable
                    rows={displayedData}
                    onEdit={handleEdit}
                    selectedOfferId={selectedOffer?.id}
                    canEdit={canEdit}
                  />
                )}
          </>
        )}

        {/* Pagination */}
        {offersData.pageCount > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={offersData.pageCount}
              page={offersData.pageNumber}
              onChange={handlePageChange}
              color="primary"
              size={isMobile ? 'small' : 'medium'}
            />
          </Box>
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
        <MobileOffersFilter
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={mobileFilters}
          onFiltersChange={setMobileFilters}
          totalResults={offersData.totalCount}
          filteredResults={displayedData.length}
        />
      )}

      <OfferForm
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

export default OffersPage;


