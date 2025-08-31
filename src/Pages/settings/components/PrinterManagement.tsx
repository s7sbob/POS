import React, { useState, useEffect } from 'react';
import {
  Container, Card, CardContent, Typography, Button, Box, Alert, Snackbar,
  Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, Divider
} from '@mui/material';
import {
  IconPrinter, IconPlus, IconEdit, IconTrash, IconCheck, IconX,
  IconUsb, IconNetwork, IconTestPipe, IconDeviceFloppy, IconStar
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Printer } from '../../../types/printer';

const PrinterManagement: React.FC = () => {
  const { t } = useTranslation();
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState<Printer | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning'
  });

  const [formData, setFormData] = useState({
    name: '',
    type: 'usb' as 'usb' | 'network',
    address: '', // For network IP, or a placeholder for USB
    usbVendorId: undefined as number | undefined,
    usbProductId: undefined as number | undefined,
    port: 9100,
    isDefault: false
  });

  // Load printers from localStorage on component mount
  useEffect(() => {
    const savedPrinters = localStorage.getItem('pos_printers');
    if (savedPrinters) {
      try {
        setPrinters(JSON.parse(savedPrinters));
      } catch (error) {
        console.error('Error loading printers:', error);
      }
    }
  }, []);

  // Save printers to localStorage
  const savePrinters = (updatedPrinters: Printer[]) => {
    localStorage.setItem('pos_printers', JSON.stringify(updatedPrinters));
    setPrinters(updatedPrinters);
  };

  // Generate unique ID for new printer
  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  // Open dialog for adding new printer
  const handleAddPrinter = () => {
    setEditingPrinter(null);
    setFormData({
      name: '',
      type: 'usb',
      address: '',
      usbVendorId: undefined,
      usbProductId: undefined,
      port: 9100,
      isDefault: false
    });
    setOpenDialog(true);
  };

  // Open dialog for editing existing printer
  const handleEditPrinter = (printer: Printer) => {
    setEditingPrinter(printer);
    setFormData({
      name: printer.name,
      type: printer.type,
      address: printer.address || '',
      usbVendorId: printer.usbVendorId,
      usbProductId: printer.usbProductId,
      port: printer.port || 9100,
      isDefault: printer.isDefault
    });
    setOpenDialog(true);
  };

  // Handle USB port selection
  const handleSelectUsbPort = async () => {
    if (!('serial' in navigator)) {
      setSnackbar({
        open: true,
        message: 'متصفحك لا يدعم Web Serial API. يرجى استخدام Chrome أو Edge.',
        severity: 'error'
      });
      return;
    }

    try {
      const port = await (navigator as any).serial.requestPort();
      const info = port.getInfo();
      if (info.usbVendorId && info.usbProductId) {
        setFormData(prev => ({
          ...prev,
          usbVendorId: info.usbVendorId,
          usbProductId: info.usbProductId,
          address: `USB (Vendor: ${info.usbVendorId}, Product: ${info.usbProductId})` // Display purposes
        }));
        setSnackbar({
          open: true,
          message: 'تم اختيار منفذ USB بنجاح.',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'لم يتم الحصول على معلومات كافية عن منفذ USB.',
          severity: 'warning'
        });
      }
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: `فشل اختيار منفذ USB: ${error.message || 'خطأ غير معروف'}`, 
        severity: 'error'
      });
    }
  };

  // Save printer (add or edit)
  const handleSavePrinter = () => {
    if (!formData.name.trim()) {
      setSnackbar({
        open: true,
        message: 'اسم الطابعة مطلوب',
        severity: 'error'
      });
      return;
    }

    if (formData.type === 'network' && !formData.address.trim()) {
      setSnackbar({
        open: true,
        message: 'عنوان IP مطلوب لطابعة الشبكة',
        severity: 'error'
      });
      return;
    }

    if (formData.type === 'usb' && (!formData.usbVendorId || !formData.usbProductId)) {
      setSnackbar({
        open: true,
        message: 'يرجى اختيار منفذ USB للطابعة',
        severity: 'error'
      });
      return;
    }

    let updatedPrinters = [...printers];

    const newPrinterData: Printer = {
      id: editingPrinter?.id || generateId(),
      name: formData.name,
      type: formData.type,
      address: formData.type === 'network' ? formData.address : '', // Clear address for USB
      usbVendorId: formData.type === 'usb' ? formData.usbVendorId : undefined,
      usbProductId: formData.type === 'usb' ? formData.usbProductId : undefined,
      port: formData.port,
      isDefault: formData.isDefault
    };

    if (editingPrinter) {
      // Edit existing printer
      const index = updatedPrinters.findIndex(p => p.id === editingPrinter.id);
      if (index !== -1) {
        updatedPrinters[index] = newPrinterData;
      }
    } else {
      // Add new printer
      updatedPrinters.push(newPrinterData);
    }

    // If this printer is set as default, remove default from others
    if (formData.isDefault) {
      updatedPrinters = updatedPrinters.map(p => ({
        ...p,
        isDefault: p.id === newPrinterData.id
      }));
    }

    savePrinters(updatedPrinters);
    setOpenDialog(false);
    setSnackbar({
      open: true,
      message: editingPrinter ? 'تم تحديث الطابعة بنجاح' : 'تم إضافة الطابعة بنجاح',
      severity: 'success'
    });
  };

  // Delete printer
  const handleDeletePrinter = (printerId: string) => {
    const updatedPrinters = printers.filter(p => p.id !== printerId);
    savePrinters(updatedPrinters);
    setSnackbar({
      open: true,
      message: 'تم حذف الطابعة بنجاح',
      severity: 'success'
    });
  };

  // Set printer as default
  const handleSetDefault = (printerId: string) => {
    const updatedPrinters = printers.map(p => ({
      ...p,
      isDefault: p.id === printerId
    }));
    savePrinters(updatedPrinters);
    setSnackbar({
      open: true,
      message: 'تم تعيين الطابعة كافتراضية',
      severity: 'success'
    });
  };

  // Test printer connection (placeholder for now, actual logic in useThermalPrint)
  const handleTestPrinter = async (printer: Printer) => {
    setSnackbar({
      open: true,
      message: `اختبار الطابعة ${printer.name} - سيتم الاختبار عند محاولة الطباعة الفعلية`,
      severity: 'warning'
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          إدارة الطابعات
        </Typography>
        <Typography variant="body2" color="text.secondary">
          إضافة وإدارة طابعات الفواتير للنظام
        </Typography>
      </Box>

      {/* Add Printer Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<IconPlus />}
          onClick={handleAddPrinter}
        >
          إضافة طابعة جديدة
        </Button>
      </Box>

      {/* Printers Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            الطابعات المكونة ({printers.length})
          </Typography>

          {printers.length === 0 ? (
            <Alert severity="info">
              لا توجد طابعات مكونة. اضغط على "إضافة طابعة جديدة" لبدء الإعداد.
            </Alert>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>اسم الطابعة</TableCell>
                    <TableCell>النوع</TableCell>
                    <TableCell>العنوان/المعرف</TableCell>
                    <TableCell>المنفذ</TableCell>
                    <TableCell>الحالة</TableCell>
                    <TableCell>الإجراءات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {printers.map((printer) => (
                    <TableRow key={printer.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconPrinter size={20} />
                          {printer.name}
                          {printer.isDefault && (
                            <Chip
                              label="افتراضي"
                              color="primary"
                              size="small"
                              icon={<IconStar size={16} />}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {printer.type === 'usb' ? (
                            <IconUsb size={16} />
                          ) : (
                            <IconNetwork size={16} />
                          )}
                          {printer.type.toUpperCase()}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {printer.type === 'usb' && printer.usbVendorId && printer.usbProductId
                          ? `Vendor: ${printer.usbVendorId}, Product: ${printer.usbProductId}`
                          : printer.address}
                      </TableCell>
                      <TableCell>{printer.port || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label="متصل"
                          color="success"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleTestPrinter(printer)}
                            title="اختبار الطابعة"
                          >
                            <IconTestPipe size={16} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleEditPrinter(printer)}
                            title="تعديل"
                          >
                            <IconEdit size={16} />
                          </IconButton>
                          {!printer.isDefault && (
                            <IconButton
                              size="small"
                              onClick={() => handleSetDefault(printer.id)}
                              title="تعيين كافتراضي"
                            >
                              <IconStar size={16} />
                            </IconButton>
                          )}
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeletePrinter(printer.id)}
                            title="حذف"
                          >
                            <IconTrash size={16} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Printer Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingPrinter ? 'تعديل الطابعة' : 'إضافة طابعة جديدة'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="اسم الطابعة"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="مثال: طابعة الكاشير الرئيسي"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>نوع الطابعة</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'usb' | 'network' })}
                  label="نوع الطابعة"
                >
                  <MenuItem value="usb">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconUsb size={16} />
                      USB
                    </Box>
                  </MenuItem>
                  <MenuItem value="network">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconNetwork size={16} />
                      شبكة (Network)
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formData.type === 'network' ? (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="عنوان IP"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="192.168.1.100"
                  helperText="عنوان IP الخاص بالطابعة على الشبكة"
                />
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleSelectUsbPort}
                  startIcon={<IconUsb />}
                  sx={{ height: 56 }} // Match TextField height
                >
                  {formData.usbVendorId && formData.usbProductId
                    ? `تم اختيار USB (Vendor: ${formData.usbVendorId}, Product: ${formData.usbProductId})`
                    : 'اختيار منفذ USB للطابعة'}
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  سيطلب المتصفح منك اختيار طابعة USB.
                </Typography>
              </Grid>
            )}

            {formData.type === 'network' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="رقم المنفذ"
                  type="number"
                  value={formData.port}
                  onChange={(e) => setFormData({ ...formData, port: Number(e.target.value) })}
                  placeholder="9100"
                  helperText="رقم المنفذ للطابعة (افتراضي: 9100)"
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  />
                }
                label="تعيين كطابعة افتراضية"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            إلغاء
          </Button>
          <Button variant="contained" onClick={handleSavePrinter}>
            {editingPrinter ? 'تحديث' : 'إضافة'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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

export default PrinterManagement;


