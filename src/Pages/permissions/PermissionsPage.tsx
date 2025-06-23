// File: src/pages/permissions/PermissionsPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Chip,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  IconChevronDown,
  IconUser,
  IconRefresh
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { getAllUsers, getUserPages, getUserPagePermission, User, UserPage, PagePermission } from 'src/utils/api/authApi';

interface UserPermissions {
  user: User;
  pages: UserPage[];
  permissions: { [pageId: number]: PagePermission[] };
}

const PermissionsPage: React.FC = () => {
  const { t } = useTranslation();
  
  const [, setUsers] = useState<User[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermissions[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // تحميل المستخدمين والصلاحيات
  const loadUsersAndPermissions = async () => {
    try {
      setLoading(true);
      const usersResponse = await getAllUsers();
      
      if (usersResponse.isvalid && usersResponse.data) {
        setUsers(usersResponse.data);
        
        const permissionsData: UserPermissions[] = [];
        
        for (const user of usersResponse.data) {
          try {
            const pages = await getUserPages();
            const permissions: { [pageId: number]: PagePermission[] } = {};
            
            for (const page of pages) {
              try {
                const pagePermissions = await getUserPagePermission(page.pageId);
                permissions[page.pageId] = pagePermissions;
              } catch (error) {
                console.error(`Error loading permissions for page ${page.pageId}:`, error);
                permissions[page.pageId] = [];
              }
            }
            
            permissionsData.push({
              user,
              pages,
              permissions
            });
          } catch (error) {
            console.error(`Error loading data for user ${user.id}:`, error);
          }
        }
        
        setUserPermissions(permissionsData);
      }
    } catch (error) {
      console.error('Error loading users and permissions:', error);
      setSnackbar({
        open: true,
        message: t('permissions.errors.loadFailed'),
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsersAndPermissions();
  }, []);

  // تحديث صلاحية صفحة
  const updatePagePermission = async (userId: string, pageId: number, hasAccess: boolean) => {
    try {
      console.log('Updating page permission:', { userId, pageId, hasAccess });
      
      setSnackbar({
        open: true,
        message: t('permissions.messages.updateSuccess'),
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: t('permissions.errors.updateFailed'),
        severity: 'error'
      });
    }
  };

  // تحديث صلاحية فرعية
  const updateSubPermission = async (userId: string, pageId: number, permissionId: number, hasPermission: boolean) => {
    try {
      console.log('Updating sub permission:', { userId, pageId, permissionId, hasPermission });
      
      setSnackbar({
        open: true,
        message: t('permissions.messages.updateSuccess'),
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: t('permissions.errors.updateFailed'),
        severity: 'error'
      });
    }
  };

  // مكون عرض صلاحيات المستخدم
  const UserPermissionsCard: React.FC<{ userPermission: UserPermissions }> = ({ userPermission }) => (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <Accordion
        expanded={expandedUser === userPermission.user.id}
        onChange={() => setExpandedUser(
          expandedUser === userPermission.user.id ? null : userPermission.user.id
        )}
      >
        <AccordionSummary expandIcon={<IconChevronDown />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <IconUser size={24} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">
                {userPermission.user.userName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {userPermission.user.phoneNo}
              </Typography>
            </Box>
            <Chip
              label={t('permissions.pagesCount', { 
                accessible: userPermission.pages.filter(p => p.hasAccess).length,
                total: userPermission.pages.length 
              })}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        </AccordionSummary>

        <AccordionDetails>
          <Stack spacing={2}>
            {userPermission.pages.map((page) => (
              <Card key={page.pageId} variant="outlined">
                <CardContent sx={{ py: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1">
                      {page.description}
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={page.hasAccess}
                          onChange={(e) => updatePagePermission(
                            userPermission.user.id,
                            page.pageId,
                            e.target.checked
                          )}
                          color="primary"
                        />
                      }
                      label={page.hasAccess ? t('permissions.enabled') : t('permissions.disabled')}
                    />
                  </Box>

                  {/* الصلاحيات الفرعية */}
                  {page.hasAccess && userPermission.permissions[page.pageId] && (
                    <Box sx={{ mt: 2, pl: 2, borderLeft: 2, borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary" gutterBottom>
                        {t('permissions.subPermissions')}:
                      </Typography>
                      <Grid container spacing={1}>
                        {userPermission.permissions[page.pageId].map((permission) => (
                          <Grid item xs={12} sm={6} md={4} key={permission.permissionId}>
                            <FormControlLabel
                              control={
                                <Switch
                                  size="small"
                                  checked={permission.hasPermission}
                                  onChange={(e) => updateSubPermission(
                                    userPermission.user.id,
                                    page.pageId,
                                    permission.permissionId,
                                    e.target.checked
                                  )}
                                />
                              }
                              label={
                                <Typography variant="caption">
                                  {permission.permissionName}
                                </Typography>
                              }
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Card>
  );

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('permissions.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('permissions.description')}
        </Typography>
      </Box>

      {/* Actions */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<IconRefresh />}
          onClick={loadUsersAndPermissions}
          disabled={loading}
        >
          {t('common.refresh')}
        </Button>
      </Stack>

      {/* Content */}
      {loading ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary" align="center">
              {t('permissions.loading')}
            </Typography>
          </CardContent>
        </Card>
      ) : userPermissions.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary" align="center">
              {t('permissions.noData')}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box>
          {userPermissions.map((userPermission) => (
            <UserPermissionsCard
              key={userPermission.user.id}
              userPermission={userPermission}
            />
          ))}
        </Box>
      )}

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

export default PermissionsPage;
