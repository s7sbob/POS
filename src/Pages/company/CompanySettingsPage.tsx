// File: src/pages/company/CompanySettingsPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Stack,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  Autocomplete,
  CircularProgress,
  Skeleton
} from '@mui/material';
import {
  IconBuilding,
  IconMapPin,
  IconPhone,
  IconMail,
  IconEdit,
  IconGavel,
  IconRefresh
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/contexts/AuthContext';
import { Branch } from 'src/utils/api/authApi';
import { getAll as getAllWarehouses, Warehouse } from 'src/utils/api/pagesApi/warehousesApi';
import api from 'src/utils/axios';

// ⭐ Types للـ API Response
interface CompanyData {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  branches: Branch[];
  isActive: boolean;
}

interface CompanyResponse {
  isvalid: boolean;
  errors: string[];
  data: CompanyData;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const CompanySettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { selectedBranch } = useAuth();
  
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [allBranches, setAllBranches] = useState<Branch[]>([]);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // States للمخازن
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const [companyForm, setCompanyForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: ''
  });

  const [branchForm, setBranchForm] = useState({
    name: '',
    address: '',
    phone: '',
    defWareHouse: ''
  });

  // ⭐ تحميل بيانات الشركة من الـ API
  const loadCompanyData = async () => {
    try {
      setInitialLoading(true);
      
      const companyId = selectedBranch?.refCompanyId || selectedBranch?.company?.id;
      
      if (!companyId) {
        throw new Error('Company ID not found');
      }

      const response = await api.get<CompanyResponse>(`/GetCompany?id=${companyId}`);
      
      if (response.data.isvalid && response.data.data) {
        const data = response.data.data;
        setCompanyData(data);
        setAllBranches(data.branches || []);
        
        // تعبئة الفورم
        setCompanyForm({
          name: data.name || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || ''
        });
      }
    } catch (error) {
      console.error('Error loading company data:', error);
      setSnackbar({
        open: true,
        message: t('company.errors.loadFailed') || 'Failed to load company data',
        severity: 'error'
      });
    } finally {
      setInitialLoading(false);
    }
  };

  // ⭐ تحميل بيانات الفرع من الـ API (اختياري - للحصول على assignedUsers)
  const loadBranchData = async (branchId: string) => {
    try {
      const response = await api.get(`/GetBranch?branchid=${branchId}`);
      
      if (response.data.isvalid && response.data.data) {
        return response.data.data;
      }
    } catch (error) {
      console.error('Error loading branch data:', error);
    }
    return null;
  };

  // تحميل المخازن
  const loadWarehouses = async () => {
    try {
      setLoadingWarehouses(true);
      const data = await getAllWarehouses();
      setWarehouses(data);
    } catch (error) {
      console.error('Error loading warehouses:', error);
      setSnackbar({
        open: true,
        message: t('company.errors.warehousesLoadFailed') || 'Failed to load warehouses',
        severity: 'error'
      });
    } finally {
      setLoadingWarehouses(false);
    }
  };

  // ⭐ تحميل البيانات عند فتح الصفحة
  useEffect(() => {
    loadCompanyData();
    loadWarehouses();
  }, [selectedBranch?.refCompanyId]);

  // تحديث بيانات الشركة
  const handleCompanyUpdate = async () => {
    try {
      setLoading(true);
      
      if (!companyData) return;

      const response = await api.post('/UpdateCompany', {
        id: companyData.id,
        name: companyForm.name,
        address: companyForm.address,
        phone: companyForm.phone,
        email: companyForm.email,
        branches: allBranches.map(branch => ({
          id: branch.id,
          name: branch.name,
          address: branch.address,
          phone: branch.phone,
          refCompanyId: branch.refCompanyId,
          defWareHouse: branch.defWareHouse
        }))
      });

      if (response.data.isvalid) {
        setSnackbar({
          open: true,
          message: t('company.messages.updateSuccess') || 'Company updated successfully',
          severity: 'success'
        });
        
        // ⭐ إعادة تحميل البيانات من الـ API
        await loadCompanyData();
      }
    } catch (error) {
      console.error('Error updating company:', error);
      setSnackbar({
        open: true,
        message: t('company.errors.updateFailed') || 'Failed to update company',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // فتح dialog لتعديل الفرع
  const handleEditBranch = (branch: Branch) => {
    setEditingBranch(branch);
    setBranchForm({
      name: branch.name,
      address: branch.address || '',
      phone: branch.phone || '',
      defWareHouse: branch.defWareHouse || ''
    });

    // البحث عن المخزن في القائمة
    const warehouse = warehouses.find(w => w.id === branch.defWareHouse);
    setSelectedWarehouse(warehouse || null);

    setDialogOpen(true);
  };

  // تحديث بيانات الفرع
  const handleBranchUpdate = async () => {
    try {
      setLoading(true);

      if (!editingBranch || !companyData) return;

      // التأكد من وجود warehouse مختار
      if (!selectedWarehouse) {
        setSnackbar({
          open: true,
          message: t('company.messages.warehouseRequired') || 'Please select a default warehouse',
          severity: 'warning'
        });
        setLoading(false);
        return;
      }

      // تحديث الفرع في القائمة المحلية
      const updatedBranches = allBranches.map(branch => 
        branch.id === editingBranch.id 
          ? {
              ...branch,
              name: branchForm.name,
              address: branchForm.address,
              phone: branchForm.phone,
              defWareHouse: selectedWarehouse.id
            }
          : branch
      );

      // استدعاء API UpdateCompany مع الفروع المحدثة
      const response = await api.post('/UpdateCompany', {
        id: companyData.id,
        name: companyForm.name,
        address: companyForm.address,
        phone: companyForm.phone,
        email: companyForm.email,
        branches: updatedBranches.map(branch => ({
          id: branch.id,
          name: branch.name,
          address: branch.address,
          phone: branch.phone,
          refCompanyId: branch.refCompanyId,
          defWareHouse: branch.defWareHouse
        }))
      });

      if (response.data.isvalid) {
        // ⭐ تحديث localStorage إذا كان الفرع الحالي
        if (editingBranch.id === selectedBranch?.id) {
          localStorage.setItem('warehouse_id', selectedWarehouse.id);
          
          const updatedCurrentBranch = updatedBranches.find(b => b.id === selectedBranch.id);
          if (updatedCurrentBranch) {
            localStorage.setItem('selected_branch', JSON.stringify(updatedCurrentBranch));
          }
        }

        setSnackbar({
          open: true,
          message: t('company.messages.branchUpdateSuccess') || 'Branch updated successfully',
          severity: 'success'
        });
        setDialogOpen(false);
        
        // ⭐ إعادة تحميل البيانات من الـ API
        await loadCompanyData();
      }
    } catch (error) {
      console.error('Error updating branch:', error);
      setSnackbar({
        open: true,
        message: t('company.errors.branchUpdateFailed') || 'Failed to update branch',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // ⭐ Refresh البيانات يدوياً
  const handleRefresh = async () => {
    await loadCompanyData();
    await loadWarehouses();
    setSnackbar({
      open: true,
      message: t('company.messages.dataRefreshed') || 'Data refreshed successfully',
      severity: 'success'
    });
  };

  // Loading Skeleton
  if (initialLoading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width={250} height={40} />
          <Skeleton variant="text" width={400} height={24} />
        </Box>
        <Card>
          <Skeleton variant="rectangular" height={400} />
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {t('company.title') || 'Company Settings'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('company.description') || 'Manage company and branch information'}
            </Typography>
          </Box>
          
          {/* ⭐ زر Refresh */}
          <Button
            variant="outlined"
            startIcon={<IconRefresh />}
            onClick={handleRefresh}
            disabled={initialLoading}
          >
            {t('common.refresh') || 'Refresh'}
          </Button>
        </Stack>
      </Box>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={(_, newValue) => setTabValue(newValue)}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
          >
            <Tab 
              label={t('company.tabs.companyInfo') || 'Company Info'}
              icon={<IconBuilding size={20} />}
              iconPosition="start"
            />
            <Tab 
              label={t('company.tabs.branchManagement') || 'Branch Management'}
              icon={<IconMapPin size={20} />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Tab 1: Company Settings */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                <TextField
                  label={t('company.form.companyName') || 'Company Name'}
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm(prev => ({ ...prev, name: e.target.value }))}
                  fullWidth
                  InputProps={{
                    startAdornment: <IconBuilding size={20} style={{ marginRight: 8 }} />
                  }}
                />

                <TextField
                  label={t('company.form.companyAddress') || 'Company Address'}
                  value={companyForm.address}
                  onChange={(e) => setCompanyForm(prev => ({ ...prev, address: e.target.value }))}
                  fullWidth
                  multiline
                  rows={2}
                  InputProps={{
                    startAdornment: <IconMapPin size={20} style={{ marginRight: 8 }} />
                  }}
                />

                <TextField
                  label={t('company.form.companyPhone') || 'Company Phone'}
                  value={companyForm.phone}
                  onChange={(e) => setCompanyForm(prev => ({ ...prev, phone: e.target.value }))}
                  fullWidth
                  InputProps={{
                    startAdornment: <IconPhone size={20} style={{ marginRight: 8 }} />
                  }}
                />

                <TextField
                  label={t('company.form.companyEmail') || 'Company Email'}
                  value={companyForm.email}
                  onChange={(e) => setCompanyForm(prev => ({ ...prev, email: e.target.value }))}
                  fullWidth
                  type="email"
                  InputProps={{
                    startAdornment: <IconMail size={20} style={{ marginRight: 8 }} />
                  }}
                />

                <Button
                  variant="contained"
                  startIcon={<IconGavel />}
                  onClick={handleCompanyUpdate}
                  disabled={loading}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  {loading ? <CircularProgress size={20} /> : (t('common.saveChanges') || 'Save Changes')}
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {t('company.info.currentCompanyInfo') || 'Current Company Info'}
                  </Typography>
                  
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('company.info.companyName') || 'Company Name'}
                      </Typography>
                      <Typography variant="body2">
                        {companyData?.name || t('common.notSpecified') || 'Not specified'}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('company.info.companyId') || 'Company ID'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        {companyData?.id || t('common.notSpecified') || 'Not specified'}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('company.info.branchCount') || 'Branch Count'}
                      </Typography>
                      <Typography variant="body2">
                        {allBranches.length} {t('company.info.branches') || 'branches'}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('company.info.currentBranch') || 'Current Branch'}
                      </Typography>
                      <Typography variant="body2">
                        {selectedBranch?.name || t('common.notSpecified') || 'Not specified'}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 2: Branches Management */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
                {t('company.branches.title') || 'Branches'} ({allBranches.length})
              </Typography>
            </Stack>
          </Box>

          {isMobile ? (
            // Mobile View - Cards
            <Stack spacing={2}>
              {allBranches.map((branch) => {
                const branchWarehouse = warehouses.find(w => w.id === branch.defWareHouse);
                return (
                  <Card key={branch.id} variant="outlined">
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {branch.name}
                          </Typography>
                          
                          <Stack spacing={1}>
                            {branch.address && (
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <IconMapPin size={16} />
                                <Typography variant="body2">{branch.address}</Typography>
                              </Stack>
                            )}
                            
                            {branch.phone && (
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <IconPhone size={16} />
                                <Typography variant="body2">{branch.phone}</Typography>
                              </Stack>
                            )}

                            {branchWarehouse && (
                              <Typography variant="caption" color="text.secondary">
                                {t('company.table.warehouse')}: {branchWarehouse.name}
                              </Typography>
                            )}

                            <Chip
                              label={branch.id === selectedBranch?.id ? t('company.branches.currentBranch') || 'Current' : t('company.branches.otherBranch') || 'Other'}
                              size="small"
                              color={branch.id === selectedBranch?.id ? 'primary' : 'default'}
                              variant="outlined"
                            />
                          </Stack>
                        </Box>
                        
                        <IconButton
                          size="small"
                          onClick={() => handleEditBranch(branch)}
                          color="primary"
                        >
                          <IconEdit size={16} />
                        </IconButton>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          ) : (
            // Desktop View - Table
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('company.table.branchName') || 'Branch Name'}</TableCell>
                    <TableCell>{t('company.table.address') || 'Address'}</TableCell>
                    <TableCell>{t('company.table.phone') || 'Phone'}</TableCell>
                    <TableCell>{t('company.table.warehouse') || 'Warehouse'}</TableCell>
                    <TableCell>{t('company.table.status') || 'Status'}</TableCell>
                    <TableCell>{t('company.table.actions') || 'Actions'}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allBranches.map((branch) => {
                    const branchWarehouse = warehouses.find(w => w.id === branch.defWareHouse);
                    return (
                      <TableRow key={branch.id}>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <IconBuilding size={20} />
                            <Typography>{branch.name}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{branch.address || t('common.notSpecified') || '-'}</TableCell>
                        <TableCell>{branch.phone || t('common.notSpecified') || '-'}</TableCell>
                        <TableCell>
                          {branchWarehouse ? (
                            <Typography variant="body2">{branchWarehouse.name}</Typography>
                          ) : (
                            <Typography variant="body2" color="error">
                              {t('company.table.noWarehouse') || 'Not set'}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={branch.id === selectedBranch?.id ? t('company.branches.currentBranch') || 'Current' : t('company.branches.otherBranch') || 'Other'}
                            size="small"
                            color={branch.id === selectedBranch?.id ? 'primary' : 'default'}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleEditBranch(branch)}
                            color="primary"
                          >
                            <IconEdit size={16} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
      </Card>

      {/* Edit Branch Dialog مع Autocomplete */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {t('company.dialog.editBranch') || 'Edit Branch'}
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label={t('company.form.branchName') || 'Branch Name'}
              value={branchForm.name}
              onChange={(e) => setBranchForm(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
              required
            />
            
            <TextField
              label={t('company.form.branchAddress') || 'Branch Address'}
              value={branchForm.address}
              onChange={(e) => setBranchForm(prev => ({ ...prev, address: e.target.value }))}
              fullWidth
              multiline
              rows={2}
            />

            <TextField
              label={t('company.form.branchPhone') || 'Branch Phone'}
              value={branchForm.phone}
              onChange={(e) => setBranchForm(prev => ({ ...prev, phone: e.target.value }))}
              fullWidth
            />

            {/* Autocomplete للمخازن */}
            <Autocomplete
              options={warehouses}
              value={selectedWarehouse}
              onChange={(event, newValue) => {
                setSelectedWarehouse(newValue);
                setBranchForm(prev => ({ 
                  ...prev, 
                  defWareHouse: newValue?.id || '' 
                }));
              }}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              loading={loadingWarehouses}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('company.form.defaultWarehouse') || 'Default Warehouse'}
                  required
                  helperText={t('company.form.defaultWarehouseHelper') || 'Select the default warehouse for this branch'}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingWarehouses ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  <Stack sx={{ width: '100%' }}>
                    <Typography variant="body1">{option.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.address || 'No address'} • ID: {option.id}
                    </Typography>
                  </Stack>
                </li>
              )}
            />
          </Stack>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            {t('common.cancel') || 'Cancel'}
          </Button>
          <Button 
            onClick={handleBranchUpdate} 
            variant="contained" 
            disabled={loading || !selectedWarehouse}
          >
            {loading ? <CircularProgress size={20} /> : (t('common.saveChanges') || 'Save Changes')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CompanySettingsPage;
