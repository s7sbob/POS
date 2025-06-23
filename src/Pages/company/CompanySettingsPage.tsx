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
  useTheme
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
  const { selectedBranch, branches } = useAuth();
  
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [allBranches, setAllBranches] = useState<Branch[]>([]);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
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
    phone: ''
  });

  // تحميل بيانات الشركة والفروع
  useEffect(() => {
    if (selectedBranch?.company) {
      setCompanyForm({
        name: selectedBranch.company.name || '',
        address: selectedBranch.company.address || '',
        phone: selectedBranch.company.phone || '',
        email: selectedBranch.company.email || ''
      });
    }
    
    setAllBranches(branches);
  }, [selectedBranch, branches]);

  // تحديث بيانات الشركة
  const handleCompanyUpdate = async () => {
    try {
      setLoading(true);
      console.log('Updating company:', companyForm);
      
      setSnackbar({
        open: true,
        message: t('company.messages.updateSuccess'),
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: t('company.errors.updateFailed'),
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
      phone: branch.phone || ''
    });
    setDialogOpen(true);
  };

  // تحديث بيانات الفرع
  const handleBranchUpdate = async () => {
    try {
      setLoading(true);
      console.log('Updating branch:', editingBranch?.id, branchForm);
      
      setSnackbar({
        open: true,
        message: t('company.messages.branchUpdateSuccess'),
        severity: 'success'
      });
      setDialogOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: t('company.errors.branchUpdateFailed'),
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('company.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('company.description')}
        </Typography>
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
              label={t('company.tabs.companyInfo')}
              icon={<IconBuilding size={20} />}
              iconPosition="start"
            />
            <Tab 
              label={t('company.tabs.branchManagement')}
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
                  label={t('company.form.companyName')}
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm(prev => ({ ...prev, name: e.target.value }))}
                  fullWidth
                  InputProps={{
                    startAdornment: <IconBuilding size={20} style={{ marginRight: 8 }} />
                  }}
                />

                <TextField
                  label={t('company.form.companyAddress')}
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
                  label={t('company.form.companyPhone')}
                  value={companyForm.phone}
                  onChange={(e) => setCompanyForm(prev => ({ ...prev, phone: e.target.value }))}
                  fullWidth
                  InputProps={{
                    startAdornment: <IconPhone size={20} style={{ marginRight: 8 }} />
                  }}
                />

                <TextField
                  label={t('company.form.companyEmail')}
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
                  {t('common.saveChanges')}
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {t('company.info.currentCompanyInfo')}
                  </Typography>
                  
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('company.info.companyName')}
                      </Typography>
                      <Typography variant="body2">
                        {selectedBranch?.company.name || t('common.notSpecified')}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('company.info.branchCount')}
                      </Typography>
                      <Typography variant="body2">
                        {t('company.info.branchCountValue', { count: branches.length })}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('company.info.currentBranch')}
                      </Typography>
                      <Typography variant="body2">
                        {selectedBranch?.name || t('common.notSpecified')}
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
                {t('company.branches.title', { count: allBranches.length })}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<IconRefresh />}
                onClick={() => setAllBranches(branches)}
                size="small"
              >
                {t('common.refresh')}
              </Button>
            </Stack>
          </Box>

          {isMobile ? (
            // Mobile View - Cards
            <Stack spacing={2}>
              {allBranches.map((branch) => (
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

                          <Chip
                            label={branch.id === selectedBranch?.id ? t('company.branches.currentBranch') : t('company.branches.otherBranch')}
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
              ))}
            </Stack>
          ) : (
            // Desktop View - Table
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('company.table.branchName')}</TableCell>
                    <TableCell>{t('company.table.address')}</TableCell>
                    <TableCell>{t('company.table.phone')}</TableCell>
                    <TableCell>{t('company.table.status')}</TableCell>
                    <TableCell>{t('company.table.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allBranches.map((branch) => (
                    <TableRow key={branch.id}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <IconBuilding size={20} />
                          <Typography>{branch.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{branch.address || t('common.notSpecified')}</TableCell>
                      <TableCell>{branch.phone || t('common.notSpecified')}</TableCell>
                      <TableCell>
                        <Chip
                          label={branch.id === selectedBranch?.id ? t('company.branches.currentBranch') : t('company.branches.otherBranch')}
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
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
      </Card>

      {/* Edit Branch Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {t('company.dialog.editBranch')}
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label={t('company.form.branchName')}
              value={branchForm.name}
              onChange={(e) => setBranchForm(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
              required
            />
            
            <TextField
              label={t('company.form.branchAddress')}
              value={branchForm.address}
              onChange={(e) => setBranchForm(prev => ({ ...prev, address: e.target.value }))}
              fullWidth
              multiline
              rows={2}
            />
            
            <TextField
              label={t('company.form.branchPhone')}
              value={branchForm.phone}
              onChange={(e) => setBranchForm(prev => ({ ...prev, phone: e.target.value }))}
              fullWidth
            />
          </Stack>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleBranchUpdate} variant="contained" disabled={loading}>
            {t('common.saveChanges')}
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
