import React, { useState } from 'react';
import { Container, Typography, Button, Box, Alert, Snackbar, Paper, List, ListItem, ListItemText } from '@mui/material';
import { IconPrinter, IconTestPipe } from '@tabler/icons-react';
import { useInvoicePrinter } from '../../hooks/useInvoicePrinter';

const PrintTestPage: React.FC = () => {
  const { testPrint, hasDefaultPrinter } = useInvoicePrinter();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });
  const [isPrinting, setIsPrinting] = useState(false);
  const [printLog, setPrintLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setPrintLog(prevLog => [...prevLog, `${new Date().toLocaleTimeString()} - ${message}`]);
  };

  const handleTestPrint = async () => {
    setPrintLog([]); // Clear previous log
    addLog('بدء اختبار الطباعة...');

    if (!hasDefaultPrinter()) {
      const msg = 'لا توجد طابعة افتراضية محددة. يرجى تكوين طابعة من الإعدادات أولاً.';
      addLog(msg);
      setSnackbar({
        open: true,
        message: msg,
        severity: 'warning'
      });
      return;
    }

    setIsPrinting(true);
    try {
      addLog('محاولة إرسال فاتورة الاختبار...');
      const result = await testPrint(addLog); // Pass addLog function to testPrint
      if (result.success) {
        const msg = 'تم إرسال فاتورة الاختبار إلى الطابعة بنجاح!';
        addLog(msg);
        setSnackbar({
          open: true,
          message: msg,
          severity: 'success'
        });
      } else {
        const msg = `فشل اختبار الطباعة: ${result.error || 'خطأ غير معروف'}`;
        addLog(msg);
        setSnackbar({
          open: true,
          message: msg,
          severity: 'error'
        });
      }
    } catch (error: any) {
      const msg = `خطأ في اختبار الطباعة: ${error.message || 'خطأ غير معروف'}`;
      addLog(msg);
      setSnackbar({
        open: true,
        message: msg,
        severity: 'error'
      });
    } finally {
      setIsPrinting(false);
      addLog('انتهى اختبار الطباعة.');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          <IconPrinter style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          صفحة اختبار الطباعة
        </Typography>
        <Typography variant="body2" color="text.secondary">
          استخدم هذه الصفحة لاختبار وظائف الطباعة الحرارية وعرض سجل الطباعة.
        </Typography>
      </Box>

      {!hasDefaultPrinter() && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          لا توجد طابعة افتراضية محددة. يرجى الذهاب إلى <a href="/settings/printers">إعدادات الطابعات</a> وتعيين طابعة افتراضية قبل الاختبار.
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleTestPrint}
        disabled={isPrinting || !hasDefaultPrinter()}
        startIcon={<IconTestPipe />}
        sx={{ mb: 3 }}
      >
        {isPrinting ? 'جاري الطباعة...' : 'طباعة فاتورة اختبار'}
      </Button>

      <Paper elevation={2} sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>سجل الطباعة</Typography>
        <List sx={{ maxHeight: 300, overflow: 'auto', bgcolor: 'background.paper' }}>
          {printLog.length === 0 ? (
            <ListItem>
              <ListItemText primary="لا يوجد سجل حتى الآن. اضغط على زر 'طباعة فاتورة اختبار' للبدء." />
            </ListItem>
          ) : (
            printLog.map((logEntry, index) => (
              <ListItem key={index}>
                <ListItemText primary={logEntry} />
              </ListItem>
            ))
          )}
        </List>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PrintTestPage;


