// File: src/layouts/full/vertical/header/PrintButton.tsx
import React from 'react';
import {
  IconButton, Tooltip, Snackbar, Alert, Menu, MenuItem,
  ListItemIcon, ListItemText, Divider, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, Switch, FormControlLabel,
  TextField, FormControl, InputLabel, Select, Grid, Box, Typography
} from '@mui/material';
import { 
  IconPrinter, IconSettings, IconUsb, IconNetwork, IconFileText,
  IconTestPipe, IconDeviceFloppy 
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useThermalPrint } from 'src/hooks/useThermalPrint';

const PrintButton: React.FC = () => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = React.useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' | 'warning' 
  });
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  
  // إعدادات الطباعة من localStorage
  const [thermalConfig, setThermalConfig] = React.useState({
    enabled: localStorage.getItem('thermal_printer_enabled') !== 'false',
    type: (localStorage.getItem('thermal_printer_type') as 'usb' | 'network') || 'usb',
    networkConfig: {
      ip: localStorage.getItem('thermal_printer_ip') || '192.168.1.100',
      port: Number(localStorage.getItem('thermal_printer_port')) || 9100
    }
  });

  const { print: thermalPrint } = useThermalPrint({
    printerType: thermalConfig.type,
    networkConfig: thermalConfig.networkConfig
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // دالة استخراج المحتوى
  const getPageContent = () => {
    const selectors = [
      '[data-printable]',
      '.MuiContainer-root',
      '.MuiDataGrid-root',
      'main'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) return element;
    }
    return document.body;
  };

  // تنسيق المحتوى للطباعة الحرارية
  const formatContentForThermal = (element: Element) => {
    const textContent = element.textContent || '';
    const lines = textContent.split('\n').filter(line => line.trim());
    
    const formatted = [
      '='.repeat(32),
      '        طباعة من النظام',
      '='.repeat(32),
      `التاريخ: ${new Date().toLocaleDateString('ar-EG')}`,
      `الوقت: ${new Date().toLocaleTimeString('ar-EG')}`,
      '-'.repeat(32),
      ...lines.map(line => line.length > 32 ? line.substring(0, 32) : line),
      '-'.repeat(32),
      '    شكراً لاستخدام النظام',
      '='.repeat(32)
    ];
    
    return formatted.join('\n');
  };

  // دالة الطباعة العادية
  const handleNormalPrint = () => {
    window.print();
    handleClose();
    setSnackbar({
      open: true,
      message: t('header.print.normalPrintStarted'),
      severity: 'success'
    });
  };

  // دالة الطباعة الحرارية
  const handleThermalPrint = async () => {
    try {
      const content = getPageContent();
      const formattedContent = formatContentForThermal(content);
      
      const result = await thermalPrint(formattedContent);

      if (typeof result === 'object' && result !== null && 'success' in result && typeof (result as any).success === 'boolean') {
        if ((result as { success: boolean }).success) {
          setSnackbar({
            open: true,
            message: t('header.print.printSuccess'),
            severity: 'success'
          });
        } else {
          setSnackbar({
            open: true,
            message: t('header.print.thermalFailed'),
            severity: 'error'
          });
        }
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: t('header.print.printError'),
        severity: 'error'
      });
    }
    handleClose();
  };

  // دالة اختبار الطباعة
  const handleTestPrint = async () => {
    const testContent = `
=================================
        اختبار الطباعة
=================================
التاريخ: ${new Date().toLocaleDateString('ar-EG')}
الوقت: ${new Date().toLocaleTimeString('ar-EG')}

نوع الطابعة: ${thermalConfig.type.toUpperCase()}
${thermalConfig.type === 'network' ? 
  `IP: ${thermalConfig.networkConfig.ip}:${thermalConfig.networkConfig.port}` : 
  'USB Connection'
}

اختبار الطباعة الحرارية
Test Print for Thermal Printer

=================================
      اختبار ناجح ✓
=================================
    `;

    try {
      const result = await thermalPrint(testContent);
      
      if (typeof result === 'object' && result !== null && 'success' in result && typeof (result as any).success === 'boolean') {
        if ((result as { success: boolean }).success) {
          setSnackbar({
            open: true,
            message: t('header.print.testSuccess'),
            severity: 'success'
          });
        } else {
          setSnackbar({
            open: true,
            message: t('header.print.testFailed'),
            severity: 'error'
          });
        }
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: t('header.print.testError'),
        severity: 'error'
      });
    }
    handleClose();
  };

  // حفظ الإعدادات
  const saveSettings = () => {
    localStorage.setItem('thermal_printer_enabled', thermalConfig.enabled.toString());
    localStorage.setItem('thermal_printer_type', thermalConfig.type);
    localStorage.setItem('thermal_printer_ip', thermalConfig.networkConfig.ip);
    localStorage.setItem('thermal_printer_port', thermalConfig.networkConfig.port.toString());
    
    setSettingsOpen(false);
    setSnackbar({
      open: true,
      message: t('header.print.settingsSaved'),
      severity: 'success'
    });
  };

  // تحديث الإعدادات
  const updateConfig = (key: string, value: any) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      setThermalConfig(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setThermalConfig(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  return (
    <>
      <Tooltip title={t('header.print.tooltip')}>
        <IconButton
          size="large"
          aria-label="print-menu"
          color="inherit"
          onClick={handleClick}
        >
          <IconPrinter size="21" stroke="1.5" />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 220,
            mt: 1
          }
        }}
      >
        {/* طباعة عادية */}
        <MenuItem onClick={handleNormalPrint}>
          <ListItemIcon>
            <IconFileText size={20} />
          </ListItemIcon>
          <ListItemText 
            primary={t('header.print.normal')}
            secondary={t('header.print.normalDesc')}
          />
        </MenuItem>

        {/* طباعة حرارية */}
        {thermalConfig.enabled && (
          <MenuItem onClick={handleThermalPrint}>
            <ListItemIcon>
              {thermalConfig.type === 'usb' ? <IconUsb size={20} /> : <IconNetwork size={20} />}
            </ListItemIcon>
            <ListItemText 
              primary={t('header.print.thermal')}
              secondary={`${thermalConfig.type.toUpperCase()} ${t('header.print.printer')}`}
            />
          </MenuItem>
        )}

        <Divider />

        {/* اختبار الطباعة */}
        {thermalConfig.enabled && (
          <MenuItem onClick={handleTestPrint}>
            <ListItemIcon>
              <IconTestPipe size={20} />
            </ListItemIcon>
            <ListItemText 
              primary={t('header.print.test')}
              secondary={t('header.print.testDesc')}
            />
          </MenuItem>
        )}

        {/* إعدادات الطباعة */}
        <MenuItem onClick={() => {
          setSettingsOpen(true);
          handleClose();
        }}>
          <ListItemIcon>
            <IconSettings size={20} />
          </ListItemIcon>
          <ListItemText 
            primary={t('header.print.settings')}
            secondary={t('header.print.configureOptions')}
          />
        </MenuItem>
      </Menu>

      {/* نافذة الإعدادات */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('header.print.printerSettings')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* تفعيل الطباعة الحرارية */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={thermalConfig.enabled}
                    onChange={(e) => updateConfig('enabled', e.target.checked)}
                  />
                }
                label={t('header.print.enableThermal')}
              />
            </Grid>

            {thermalConfig.enabled && (
              <>
                {/* نوع الطابعة */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>{t('header.print.printerType')}</InputLabel>
                    <Select
                      value={thermalConfig.type}
                      onChange={(e) => updateConfig('type', e.target.value)}
                      label={t('header.print.printerType')}
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
                          Network Printer
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* إعدادات الشبكة */}
                {thermalConfig.type === 'network' && (
                  <>
                    <Grid item xs={12} md={8}>
                      <TextField
                        fullWidth
                        label={t('header.print.ipAddress')}
                        value={thermalConfig.networkConfig.ip}
                        onChange={(e) => updateConfig('networkConfig.ip', e.target.value)}
                        placeholder="192.168.1.100"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label={t('header.print.port')}
                        type="number"
                        value={thermalConfig.networkConfig.port}
                        onChange={(e) => updateConfig('networkConfig.port', Number(e.target.value))}
                        placeholder="9100"
                      />
                    </Grid>
                  </>
                )}

                {/* معلومات */}
                <Grid item xs={12}>
                  <Box sx={{ p: 2, backgroundColor: 'info.light', borderRadius: 1 }}>
                    <Typography variant="body2" color="info.dark">
                      {t('header.print.settingsInfo')}
                    </Typography>
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            variant="contained" 
            onClick={saveSettings}
            startIcon={<IconDeviceFloppy />}
          >
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PrintButton;
