// File: src/pages/settings/PrinterSettingsPage.tsx
import React from 'react';
import {
  Container, Card, CardContent, Typography, Switch, FormControlLabel,
  TextField, Select, MenuItem, FormControl, InputLabel,
  Button, Box, Alert, Snackbar, Grid, Divider, Paper,
  List, ListItem, ListItemIcon, ListItemText, Chip
} from '@mui/material';
import { 
  IconPrinter, IconUsb, IconNetwork, 
  IconCheck, IconX, IconTestPipe, IconDeviceFloppy 
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useThermalPrint } from 'src/hooks/useThermalPrint';

const PrinterSettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const [snackbar, setSnackbar] = React.useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' | 'warning' 
  });
  
  const [settings, setSettings] = React.useState({
    thermalEnabled: localStorage.getItem('thermal_printer_enabled') !== 'false',
    printerType: localStorage.getItem('thermal_printer_type') || 'usb',
    networkIp: localStorage.getItem('thermal_printer_ip') || '192.168.1.100',
    networkPort: Number(localStorage.getItem('thermal_printer_port')) || 9100,
    autoConnect: localStorage.getItem('thermal_auto_connect') !== 'false',
    silentPrint: localStorage.getItem('thermal_silent_print') !== 'false'
  });

  const [connectionStatus, setConnectionStatus] = React.useState<{
    status: 'unknown' | 'connected' | 'disconnected' | 'testing';
    message: string;
  }>({ status: 'unknown', message: '' });

  const { print: thermalPrint } = useThermalPrint({
    printerType: settings.printerType as 'usb' | 'network',
    networkConfig: {
      ip: settings.networkIp,
      port: settings.networkPort
    }
  });

  // تحديث الإعدادات
  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // حفظ الإعدادات
  const saveSettings = () => {
    try {
      localStorage.setItem('thermal_printer_enabled', settings.thermalEnabled.toString());
      localStorage.setItem('thermal_printer_type', settings.printerType);
      localStorage.setItem('thermal_printer_ip', settings.networkIp);
      localStorage.setItem('thermal_printer_port', settings.networkPort.toString());
      localStorage.setItem('thermal_auto_connect', settings.autoConnect.toString());
      localStorage.setItem('thermal_silent_print', settings.silentPrint.toString());
      
      setSnackbar({ 
        open: true, 
        message: t('settings.printer.saved'), 
        severity: 'success' 
      });
      
      // إعادة تحميل الصفحة لتطبيق الإعدادات
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: t('settings.printer.saveError'), 
        severity: 'error' 
      });
    }
  };

  // تفعيل سريع للطباعة الحرارية
  const quickEnable = () => {
    setSettings(prev => ({
      ...prev,
      thermalEnabled: true,
      printerType: 'usb',
      autoConnect: true,
      silentPrint: true
    }));
  };

  // اختبار الاتصال
  const testConnection = async () => {
    setConnectionStatus({ status: 'testing', message: t('settings.printer.testing') });
    
    try {
      const testContent = `
=================================
        اختبار الاتصال
=================================
التاريخ: ${new Date().toLocaleDateString('ar-EG')}
الوقت: ${new Date().toLocaleTimeString('ar-EG')}

نوع الطابعة: ${settings.printerType.toUpperCase()}
${settings.printerType === 'network' ? 
  `IP: ${settings.networkIp}:${settings.networkPort}` : 
  'USB Connection'
}

اختبار الطباعة الحرارية
Test Print for Thermal Printer

=================================
      اختبار ناجح ✓
=================================
      `;

      const result = await thermalPrint(testContent);

      // Type assertion for result
      const typedResult = result as { success: boolean; error?: string };

      if (typedResult.success) {
        setConnectionStatus({ 
          status: 'connected', 
          message: t('settings.printer.connectionSuccess') 
        });
        setSnackbar({
          open: true,
          message: t('settings.printer.testSuccess'),
          severity: 'success'
        });
      } else {
        setConnectionStatus({ 
          status: 'disconnected', 
          message: typedResult.error || t('settings.printer.connectionFailed') 
        });
        setSnackbar({
          open: true,
          message: t('settings.printer.testFailed'),
          severity: 'error'
        });
      }
    } catch (error: any) {
      setConnectionStatus({ 
        status: 'disconnected', 
        message: error.message || t('settings.printer.connectionError') 
      });
      setSnackbar({
        open: true,
        message: t('settings.printer.testError'),
        severity: 'error'
      });
    }
  };

  // إعادة تعيين الإعدادات
  const resetSettings = () => {
    setSettings({
      thermalEnabled: false,
      printerType: 'usb',
      networkIp: '192.168.1.100',
      networkPort: 9100,
      autoConnect: true,
      silentPrint: true
    });
    
    // مسح البيانات المحفوظة
    localStorage.removeItem('thermal_usb_port');
    
    setSnackbar({
      open: true,
      message: t('settings.printer.resetSuccess'),
      severity: 'success'
    });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {t('settings.printer.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('settings.printer.description')}
        </Typography>
      </Box>

      {/* حالة الاتصال */}
      {connectionStatus.status !== 'unknown' && (
        <Alert 
          severity={
            connectionStatus.status === 'connected' ? 'success' : 
            connectionStatus.status === 'testing' ? 'info' : 'error'
          }
          sx={{ mb: 3 }}
          icon={
            connectionStatus.status === 'connected' ? <IconCheck /> :
            connectionStatus.status === 'testing' ? <IconTestPipe /> : <IconX />
          }
        >
          {connectionStatus.message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* الإعدادات الأساسية */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <IconPrinter />
                <Typography variant="h6">
                  {t('settings.printer.basicSettings')}
                </Typography>
              </Box>

              {!settings.thermalEnabled && (
                <Alert 
                  severity="info" 
                  sx={{ mb: 3 }}
                  action={
                    <Button color="inherit" size="small" onClick={quickEnable}>
                      {t('settings.printer.quickEnable')}
                    </Button>
                  }
                >
                  {t('settings.printer.disabledInfo')}
                </Alert>
              )}

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.thermalEnabled}
                        onChange={(e) => updateSetting('thermalEnabled', e.target.checked)}
                      />
                    }
                    label={t('settings.printer.enableThermal')}
                  />
                </Grid>

                {settings.thermalEnabled && (
                  <>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>{t('settings.printer.type')}</InputLabel>
                        <Select
                          value={settings.printerType}
                          onChange={(e) => updateSetting('printerType', e.target.value)}
                          label={t('settings.printer.type')}
                        >
                          <MenuItem value="usb">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <IconUsb size={16} />
                              USB Printer
                            </Box>
                          </MenuItem>
                          <MenuItem value="network">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <IconNetwork size={16} />
                              {t('settings.printer.network')} Printer
                            </Box>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {settings.printerType === 'network' && (
                      <>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label={t('settings.printer.ip')}
                            value={settings.networkIp}
                            onChange={(e) => updateSetting('networkIp', e.target.value)}
                            placeholder="192.168.1.100"
                            helperText={t('settings.printer.ipHelp')}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label={t('settings.printer.port')}
                            type="number"
                            value={settings.networkPort}
                            onChange={(e) => updateSetting('networkPort', Number(e.target.value))}
                            placeholder="9100"
                            helperText={t('settings.printer.portHelp')}
                          />
                        </Grid>
                      </>
                    )}
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* الإعدادات المتقدمة */}
        {settings.thermalEnabled && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  {t('settings.printer.advancedSettings')}
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.autoConnect}
                          onChange={(e) => updateSetting('autoConnect', e.target.checked)}
                        />
                      }
                      label={t('settings.printer.autoConnect')}
                    />
                    <Typography variant="caption" color="text.secondary" display="block">
                      {t('settings.printer.autoConnectDesc')}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.silentPrint}
                          onChange={(e) => updateSetting('silentPrint', e.target.checked)}
                        />
                      }
                      label={t('settings.printer.silentPrint')}
                    />
                    <Typography variant="caption" color="text.secondary" display="block">
                      {t('settings.printer.silentPrintDesc')}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* معلومات النظام */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {t('settings.printer.systemInfo')}
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <IconCheck size={20} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Web Serial API"
                    secondary={
                      'serial' in navigator ? 
                        t('settings.printer.supported') : 
                        t('settings.printer.notSupported')
                    }
                  />
                  <Chip 
                    label={'serial' in navigator ? t('common.supported') : t('common.notSupported')}
                    color={'serial' in navigator ? 'success' : 'error'}
                    size="small"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <IconNetwork size={20} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={t('settings.printer.networkPrinting')}
                    secondary={t('settings.printer.networkDesc')}
                  />
                  <Chip 
                    label={t('common.supported')}
                    color="success"
                    size="small"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* الأزرار */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {settings.thermalEnabled && (
                  <Button
                    variant="outlined"
                    onClick={testConnection}
                    startIcon={<IconTestPipe />}
                    disabled={connectionStatus.status === 'testing'}
                  >
                    {connectionStatus.status === 'testing' ? 
                      t('settings.printer.testing') : 
                      t('settings.printer.testConnection')
                    }
                  </Button>
                )}
                
                <Button
                  variant="outlined"
                  color="error"
                  onClick={resetSettings}
                >
                  {t('settings.printer.reset')}
                </Button>
              </Box>

              <Button
                variant="contained"
                onClick={saveSettings}
                startIcon={<IconDeviceFloppy />}
                size="large"
              >
                {t('common.save')}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PrinterSettingsPage;
