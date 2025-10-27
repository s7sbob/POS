import React from 'react';
import {
  Container, Card, CardContent, Typography, Grid, Box, Button,
  List, ListItemButton, ListItemIcon, ListItemText, Divider
} from '@mui/material';
import {
  IconPrinter, IconSettings, IconDevices, IconNetwork,
  IconArrowRight
} from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // Retrieve tenantId so that navigation remains within the tenant
  const { tenantId } = useParams<{ tenantId: string }>();

  const settingsOptions = [
    {
      title: 'إدارة الطابعات',
      description: 'إضافة وإدارة طابعات الفواتير',
      icon: <IconPrinter />,
      path: '/settings/printers',
      color: 'primary'
    },
    {
      title: 'إعدادات الطباعة',
      description: 'تكوين خيارات الطباعة الحرارية',
      icon: <IconSettings />,
      path: '/settings/printer-settings',
      color: 'secondary'
    },
    {
      title: 'الأجهزة المتصلة',
      description: 'عرض وإدارة الأجهزة المتصلة',
      icon: <IconDevices />,
      path: '/settings/devices',
      color: 'info'
    },
    {
      title: 'إعدادات الشبكة',
      description: 'تكوين اتصالات الشبكة',
      icon: <IconNetwork />,
      path: '/settings/network',
      color: 'success'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          الإعدادات
        </Typography>
        <Typography variant="body1" color="text.secondary">
          إدارة وتكوين إعدادات النظام
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {settingsOptions.map((option, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}
              onClick={() => {
                // Build a tenant-aware path.  If a tenantId is present we
                // prefix it to the option path, otherwise use the path as is.
                const target = tenantId ? `/${tenantId}${option.path}` : option.path;
                navigate(target);
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box 
                    sx={{ 
                      p: 1, 
                      borderRadius: 1, 
                      bgcolor: `${option.color}.light`,
                      color: `${option.color}.main`,
                      mr: 2
                    }}
                  >
                    {option.icon}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">
                      {option.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.description}
                    </Typography>
                  </Box>
                  <IconArrowRight />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            إجراءات سريعة
          </Typography>
          <List>
            <ListItemButton onClick={() => {
              const target = tenantId ? `/${tenantId}/settings/printers` : '/settings/printers';
              navigate(target);
            }}>
              <ListItemIcon>
                <IconPrinter />
              </ListItemIcon>
              <ListItemText 
                primary="إضافة طابعة جديدة"
                secondary="إعداد طابعة فواتير جديدة للنظام"
              />
            </ListItemButton>
            <Divider />
            <ListItemButton onClick={() => {
              const target = tenantId ? `/${tenantId}/settings/printer-settings` : '/settings/printer-settings';
              navigate(target);
            }}>
              <ListItemIcon>
                <IconSettings />
              </ListItemIcon>
              <ListItemText 
                primary="اختبار الطباعة"
                secondary="اختبار اتصال الطابعات المكونة"
              />
            </ListItemButton>
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SettingsPage;
