// File: src/pages/users/UsersManagementPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Stack,
  Card,
  CardContent,
  useMediaQuery,
  useTheme
  ,
  Switch,
  FormControlLabel,
  Chip
} from '@mui/material';
import {
  IconPlus,
  IconEdit,
  IconUser,
  IconPhone,
  IconMail,
  IconRefresh
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { getAllUsers, register, User } from 'src/utils/api/authApi';
import ImportExportManager from '../components/ImportExportManager';
import { usersImportExportConfig } from '../components/configs/importExportConfigs';

const UsersManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const [formData, setFormData] = useState({
    userName: '',
    phoneNo: '',
    password: '',
    // users are active by default when created
    isActive: true
  });

  // تحميل المستخدمين
  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      if (response.isvalid && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setSnackbar({
        open: true,
        message: t('users.errors.loadFailed'),
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // فتح dialog للإضافة
  const handleAdd = () => {
    setEditingUser(null);
    setFormData({ userName: '', phoneNo: '', password: '', isActive: true });
    setDialogOpen(true);
  };

  // فتح dialog للتعديل
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      userName: user.userName,
      phoneNo: user.phoneNo,
      password: '',
      isActive: user.isActive ?? true
    });
    setDialogOpen(true);
  };

  // حفظ المستخدم
  const handleSave = async () => {
    try {
      if (!formData.userName.trim() || !formData.phoneNo.trim()) {
        setSnackbar({
          open: true,
          message: t('users.validation.requiredFields'),
          severity: 'warning'
        });
        return;
      }

      if (!editingUser && !formData.password.trim()) {
        setSnackbar({
          open: true,
          message: t('users.validation.passwordRequired'),
          severity: 'warning'
        });
        return;
      }

      if (editingUser) {
        setSnackbar({
          open: true,
          message: t('users.messages.editComingSoon'),
          severity: 'warning'
        });
      } else {
        const success = await register(
          formData.userName,
          formData.phoneNo,
          formData.password,
          formData.isActive
        );
        
        if (success) {
          setSnackbar({
            open: true,
            message: t('users.messages.addSuccess'),
            severity: 'success'
          });
          setDialogOpen(false);
          loadUsers();
        } else {
          setSnackbar({
            open: true,
            message: t('users.messages.addFailed'),
            severity: 'error'
          });
        }
      }
    } catch (error) {
      console.error('Error saving user:', error);
      setSnackbar({
        open: true,
        message: t('users.errors.saveFailed'),
        severity: 'error'
      });
    }
  };

  // مكون عرض المستخدمين للموبايل
  const UserCard: React.FC<{ user: User }> = ({ user }) => (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              {user.userName}
            </Typography>
            
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconPhone size={16} />
                <Typography variant="body2">{user.phoneNo}</Typography>
              </Stack>
              
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconMail size={16} />
                <Typography variant="body2">{user.email || t('common.notSpecified')}</Typography>
              </Stack>

              {/* User status chip */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip
                  label={user.isActive ? t('users.active') : t('users.inactive')}
                  color={user.isActive ? 'success' : 'default'}
                  size="small"
                  variant="outlined"
                />
              </Stack>
            </Stack>
          </Box>
          
          <Stack direction="row" spacing={1}>
            <IconButton
              size="small"
              onClick={() => handleEdit(user)}
              color="primary"
            >
              <IconEdit size={16} />
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );

  const config = {
    ...usersImportExportConfig,
    onExport: () => users.map(user => ({
      userName: user.userName,
      phoneNo: user.phoneNo,
      email: user.email || '',
      id: user.id
    }))
  };

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('users.title')}
        </Typography>
        
        {/* Import/Export */}
        <ImportExportManager
          config={config}
          data={users}
          loading={loading}
          compact={isMobile}
        />
      </Box>

      {/* Actions */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<IconPlus />}
          onClick={handleAdd}
        >
          {t('users.actions.add')}
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<IconRefresh />}
          onClick={loadUsers}
          disabled={loading}
        >
          {t('common.refresh')}
        </Button>
      </Stack>

      {/* Content */}
      {isMobile ? (
        // Mobile View
        <Box>
          {users.length === 0 ? (
            <Card>
              <CardContent>
                <Typography color="text.secondary" align="center">
                  {t('users.noUsers')}
                </Typography>
              </CardContent>
            </Card>
          ) : (
            users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))
          )}
        </Box>
      ) : (
        // Desktop View
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('users.table.userName')}</TableCell>
                <TableCell>{t('users.table.phoneNumber')}</TableCell>
                <TableCell>{t('users.table.email')}</TableCell>
                {/* Status column to display user activation state */}
                <TableCell>{t('users.status')}</TableCell>
                <TableCell>{t('users.table.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  {/* Increase colspan to account for the additional status column */}
                  <TableCell colSpan={5} align="center">
                    <Typography color="text.secondary">
                      {t('users.noUsers')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconUser size={20} />
                        <Typography>{user.userName}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{user.phoneNo}</TableCell>
                    <TableCell>{user.email || t('common.notSpecified')}</TableCell>
                    {/* Display user activation status */}
                    <TableCell>
                      <Chip
                        label={user.isActive ? t('users.active') : t('users.inactive')}
                        color={user.isActive ? 'success' : 'default'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(user)}
                        color="primary"
                      >
                        <IconEdit size={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? t('users.dialog.editTitle') : t('users.dialog.addTitle')}
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label={t('users.form.userName')}
              value={formData.userName}
              onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
              fullWidth
              required
            />
            
            <TextField
              label={t('users.form.phoneNumber')}
              value={formData.phoneNo}
              onChange={(e) => setFormData(prev => ({ ...prev, phoneNo: e.target.value }))}
              fullWidth
              required
            />
            
            <TextField
              label={t('users.form.password')}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              fullWidth
              required={!editingUser}
              helperText={editingUser ? t('users.form.passwordHelp') : ''}
            />

            {/* Active status toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                />
              }
              label={t('users.status')}
            />
          </Stack>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} variant="contained">
            {editingUser ? t('common.update') : t('common.add')}
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

export default UsersManagementPage;
