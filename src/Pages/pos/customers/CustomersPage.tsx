// File: src/pages/pos/customers/CustomersPage.tsx
import React from 'react';
import {
  Container, useMediaQuery, useTheme, Box, Button, Fab, Badge,
  Snackbar, Alert, Typography, Stack, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Pagination,
  TextField, InputAdornment, IconButton, Chip
} from '@mui/material';
import { IconFilter, IconPlus, IconTrash, IconSearch, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import PageHeader from './components/PageHeader';
import ActionsBar from './components/ActionsBar';
import CustomerTable from './components/CustomerTable';
import CustomerRow from './components/CustomerRow';
import CustomerForm from './components/CustomerForm';
import MobileCustomersFilter, { CustomersFilterState } from './components/mobile/MobileCustomersFilter';
import * as apiSrv from 'src/utils/api/pagesApi/customersApi';
import { Customer, CustomersResponse } from 'src/utils/api/pagesApi/customersApi';

interface Props {
  canAdd?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canExport?: boolean;
  canImport?: boolean;
}

const CustomersPage: React.FC<Props> = (props) => {
  const { canAdd = true, canEdit = true, canDelete = true } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDownSm = useMediaQuery(theme.breakpoints.down('sm'));

  const [customersData, setCustomersData] = React.useState<CustomersResponse>({
    totalCount: 0,
    pageCount: 0,
    pageNumber: 1,
    pageSize: 25,
    data: []
  });
  const [searchQuery, setSearchQuery] = React.useState('');
  const [error, setErr] = React.useState('');
  const [loading, setLoad] = React.useState(true);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [dialog, setDialog] = React.useState<{
    open: boolean;
    mode: 'add' | 'edit';
    current?: Customer;
  }>({ open: false, mode: 'add', current: undefined });

  const [deleteDialog, setDeleteDialog] = React.useState<{
    open: boolean;
    customer?: Customer;
  }>({ open: false });

  const [mobileFilters, setMobileFilters] = React.useState<CustomersFilterState>({
    searchQuery: '',
    status: '',
    customerType: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 25;

  const fetchCustomers = async (page: number = currentPage) => {
    try {
      setLoad(true);
      const data = await apiSrv.getAll(page, pageSize);
      setCustomersData(data);
    } catch (e: any) {
      setErr(e?.message || t('customers.errors.loadFailed'));
    } finally {
      setLoad(false);
    }
  };

  React.useEffect(() => {
    fetchCustomers(currentPage);
  }, [currentPage]);

  const searchCustomers = (query: string) => {
    if (!query.trim()) {
      return customersData.data;
    }
    
    const searchLower = query.toLowerCase();
    return customersData.data.filter(customer => 
      customer.name.toLowerCase().includes(searchLower) ||
      customer.phone1.toLowerCase().includes(searchLower) ||
      customer.phone2?.toLowerCase().includes(searchLower) ||
      customer.addresses.some(addr => 
        addr.addressLine.toLowerCase().includes(searchLower) ||
        addr.zoneName?.toLowerCase().includes(searchLower)
      )
    );
  };

  const mobileFilteredData = React.useMemo(() => {
    let result = [...customersData.data];

    if (mobileFilters.searchQuery.trim()) {
      const searchLower = mobileFilters.searchQuery.toLowerCase();
      result = result.filter(customer => 
        customer.name.toLowerCase().includes(searchLower) ||
        customer.phone1.toLowerCase().includes(searchLower) ||
        customer.phone2?.toLowerCase().includes(searchLower) ||
        customer.addresses.some(addr => 
          addr.addressLine.toLowerCase().includes(searchLower) ||
          addr.zoneName?.toLowerCase().includes(searchLower)
        )
      );
    }

    if (mobileFilters.status) {
      const isActive = mobileFilters.status === 'true';
      result = result.filter(customer => customer.isActive === isActive);
    }

    if (mobileFilters.customerType) {
      if (mobileFilters.customerType === 'vip') {
        result = result.filter(customer => customer.isVIP);
      } else if (mobileFilters.customerType === 'blocked') {
        result = result.filter(customer => customer.isBlocked);
      } else if (mobileFilters.customerType === 'regular') {
        result = result.filter(customer => !customer.isVIP && !customer.isBlocked);
      }
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
  }, [customersData.data, mobileFilters]);

  const displayedData = isMobile ? mobileFilteredData : searchCustomers(searchQuery);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (mobileFilters.searchQuery) count++;
    if (mobileFilters.status) count++;
    if (mobileFilters.customerType) count++;
    return count;
  };

  const handleAdd = async (data: any) => {
    try {
      await apiSrv.add(data);
      await fetchCustomers(currentPage);
    } catch (e: any) {
      const msg = e?.message || t('customers.errors.addFailed');
      setErr(msg);
      throw e;
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      await apiSrv.update(data);
      await fetchCustomers(currentPage);
    } catch (e: any) {
      const msg = e?.message || t('customers.errors.updateFailed');
      setErr(msg);
      throw e;
    }
  };

  const handleDelete = async (customer: Customer) => {
    try {
      await apiSrv.deleteCustomer(customer.id);
      await fetchCustomers(currentPage);
      setDeleteDialog({ open: false });
    } catch (e: any) {
      const msg = e?.message || t('customers.errors.deleteFailed');
      setErr(msg);
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

  const handleEdit = (customer: Customer) => {
    setDialog({ open: true, mode: 'edit', current: customer });
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <Container maxWidth="xl">
      <PageHeader 
        exportData={customersData.data} 
        loading={loading}
      />
      
      {/* ⭐ تنسيق البحث والإضافة زي الصفحات القديمة */}
      {!isMobile && (
        <Box mb={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
              <TextField
                placeholder={t('customers.searchPlaceholder')}
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
                  label={`${t('customers.searchResults')}: ${searchQuery}`}
                  onDelete={clearSearch}
                  color="primary"
                  variant="outlined"
                />
                <Typography variant="body2" color="text.secondary">
                  {t('customers.resultsCount', { count: displayedData.length })}
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
              {t('customers.add')}
            </Button>
          )}
        </Box>
      )}

      <Box mb={4}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5">
            {t('customers.title')} ({customersData.totalCount})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('customers.pageInfo', { 
              page: customersData.pageNumber, 
              total: customersData.pageCount 
            })}
          </Typography>
        </Stack>
        
        {loading ? (
          <Box textAlign="center" py={4}>
            <Typography>{t('common.loading')}</Typography>
          </Box>
        ) : displayedData.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              {searchQuery || getActiveFiltersCount() > 0 ? t('customers.noSearchResults') : t('customers.noCustomers')}
            </Typography>
          </Box>
        ) : (
          <>
            {isDownSm
              ? displayedData.map(customer => (
                  <CustomerRow
                    key={customer.id}
                    customer={customer}
                    onEdit={() => handleEdit(customer)}
                    onDelete={() => setDeleteDialog({ open: true, customer })}
                    canEdit={canEdit}
                    canDelete={canDelete}
                  />
                ))
              : (
                  <CustomerTable
                    rows={displayedData}
                    onEdit={handleEdit}
                    onDelete={(customer) => setDeleteDialog({ open: true, customer })}
                    canEdit={canEdit}
                    canDelete={canDelete}
                  />
                )}
          </>
        )}

        {/* Pagination */}
        {customersData.pageCount > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={customersData.pageCount}
              page={currentPage}
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
        <MobileCustomersFilter
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={mobileFilters}
          onFiltersChange={setMobileFilters}
          totalResults={customersData.totalCount}
          filteredResults={displayedData.length}
        />
      )}

      <CustomerForm
        open={dialog.open}
        mode={dialog.mode}
        initialValues={dialog.current}
        onClose={() => setDialog({ open: false, mode: 'add', current: undefined })}
        onSubmit={handleSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false })}>
        <DialogTitle>{t('customers.deleteConfirmTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('customers.deleteConfirmMessage', { name: deleteDialog.customer?.name })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false })}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={() => deleteDialog.customer && handleDelete(deleteDialog.customer)}
            color="error"
            variant="contained"
            startIcon={<IconTrash />}
          >
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setErr('')}>
        <Alert severity="error" onClose={() => setErr('')}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CustomersPage;
