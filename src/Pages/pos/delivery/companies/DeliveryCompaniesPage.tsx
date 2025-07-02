// File: src/pages/delivery/companies/DeliveryCompaniesPage.tsx
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
import CompanyTable from './components/CompanyTable';
import CompanyRow from './components/CompanyRow';
import CompanyForm from './components/CompanyForm';
import MobileCompaniesFilter, { CompaniesFilterState } from './components/mobile/MobileCompaniesFilter';
import * as apiSrv from 'src/utils/api/pagesApi/deliveryCompaniesApi';
import { DeliveryCompany } from 'src/utils/api/pagesApi/deliveryCompaniesApi';

interface PermissionProps {
  canAdd?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canExport?: boolean;
  canImport?: boolean;
  canView?: boolean;
}

interface Props extends PermissionProps {}

const DeliveryCompaniesPage: React.FC<Props> = (props) => {
  const { canAdd = true, canEdit = true } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDownSm = useMediaQuery(theme.breakpoints.down('sm'));

  const [companies, setCompanies] = React.useState<DeliveryCompany[]>([]);
  const [selectedCompany, setSelectedCompany] = React.useState<DeliveryCompany | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [error, setErr] = React.useState('');
  const [loading, setLoad] = React.useState(true);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [dialog, setDialog] = React.useState<{
    open: boolean;
    mode: 'add' | 'edit';
    current?: DeliveryCompany;
  }>({ open: false, mode: 'add', current: undefined });

  const [mobileFilters, setMobileFilters] = React.useState<CompaniesFilterState>({
    searchQuery: '',
    status: '',
    paymentType: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const fetchCompanies = async () => {
    try {
      setLoad(true);
      const data = await apiSrv.getAll();
      setCompanies(data);
    } catch (e: any) {
      setErr(e?.message || t('deliveryCompanies.errors.loadFailed'));
    } finally {
      setLoad(false);
    }
  };

  React.useEffect(() => {
    fetchCompanies();
  }, []);

  const searchCompanies = (query: string) => {
    if (!query.trim()) {
      return companies;
    }
    
    const searchLower = query.toLowerCase();
    return companies.filter(company => 
      company.name.toLowerCase().includes(searchLower) ||
      company.phone.toLowerCase().includes(searchLower) ||
      company.email.toLowerCase().includes(searchLower) ||
      company.contactPerson.toLowerCase().includes(searchLower)
    );
  };

  const mobileFilteredData = React.useMemo(() => {
    let result = [...companies];

    if (mobileFilters.searchQuery.trim()) {
      const searchLower = mobileFilters.searchQuery.toLowerCase();
      result = result.filter(company => 
        company.name.toLowerCase().includes(searchLower) ||
        company.phone.toLowerCase().includes(searchLower) ||
        company.email.toLowerCase().includes(searchLower) ||
        company.contactPerson.toLowerCase().includes(searchLower)
      );
    }

    if (mobileFilters.status) {
      const isActive = mobileFilters.status === 'true';
      result = result.filter(company => company.isActive === isActive);
    }

    if (mobileFilters.paymentType) {
      result = result.filter(company => company.paymentType === mobileFilters.paymentType);
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
  }, [companies, mobileFilters]);

  const displayedData = isMobile ? mobileFilteredData : searchCompanies(searchQuery);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (mobileFilters.searchQuery) count++;
    if (mobileFilters.status) count++;
    if (mobileFilters.paymentType) count++;
    return count;
  };

  const handleAdd = async (data: any) => {
    try {
      await apiSrv.add(data);
      await fetchCompanies();
    } catch (e: any) {
      throw e;
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      const updatedCompany = await apiSrv.update(data);
      setCompanies(prev => prev.map(c => c.id === updatedCompany.id ? updatedCompany : c));
      if (selectedCompany && selectedCompany.id === data.id) {
        setSelectedCompany(updatedCompany);
      }
      return updatedCompany;
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

  const handleEdit = (company: DeliveryCompany) => {
    setDialog({ open: true, mode: 'edit', current: company });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <Container maxWidth="xl">
      <PageHeader 
        exportData={companies} 
        loading={loading}
        onDataChange={fetchCompanies}
      />
      
      {!isMobile && (
        <Box mb={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
              <TextField
                placeholder={t('deliveryCompanies.searchPlaceholder')}
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
                  label={`${t('deliveryCompanies.searchResults')}: ${searchQuery}`}
                  onDelete={clearSearch}
                  color="primary"
                  variant="outlined"
                />
                <Typography variant="body2" color="text.secondary">
                  {t('deliveryCompanies.resultsCount', { count: displayedData.length })}
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
              {t('deliveryCompanies.add')}
            </Button>
          )}
        </Box>
      )}

      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          {t('deliveryCompanies.title')} ({displayedData.length})
        </Typography>
        
        {loading ? (
          <Box textAlign="center" py={4}>
            <Typography>{t('common.loading')}</Typography>
          </Box>
        ) : displayedData.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              {searchQuery || getActiveFiltersCount() > 0 ? t('deliveryCompanies.noSearchResults') : t('deliveryCompanies.noCompanies')}
            </Typography>
          </Box>
        ) : (
          <>
            {isDownSm
              ? displayedData.map(company => (
                  <CompanyRow
                    key={company.id}
                    company={company}
                    onEdit={() => handleEdit(company)}
                    isSelected={selectedCompany?.id === company.id}
                    canEdit={canEdit}
                  />
                ))
              : (
                  <CompanyTable
                    rows={displayedData}
                    onEdit={handleEdit}
                    selectedCompanyId={selectedCompany?.id}
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
        <MobileCompaniesFilter
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={mobileFilters}
          onFiltersChange={setMobileFilters}
          totalResults={companies.length}
          filteredResults={displayedData.length}
        />
      )}

      <CompanyForm
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

export default DeliveryCompaniesPage;


