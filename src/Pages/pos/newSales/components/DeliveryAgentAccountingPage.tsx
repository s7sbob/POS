import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Button,
  useTheme,
  createTheme,
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  Stack,
  Divider,
  alpha,
  Grid
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Assignment as OrderIcon,
  AttachMoney as MoneyIcon,
  AccessTime as TimeIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import * as deliveryAgentsApi from 'src/utils/api/pagesApi/deliveryAgentsApi';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Cairo", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '1.75rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem',
    },
    body1: {
      fontSize: '0.9rem',
      lineHeight: 1.4,
    },
    body2: {
      fontSize: '0.8rem',
      lineHeight: 1.4,
    },
  },
  direction: 'rtl',
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px 0 rgba(0,0,0,0.07)',
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 15px 0 rgba(0,0,0,0.08)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '8px 12px',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#f8fafc',
            fontWeight: 600,
            fontSize: '0.8rem',
            color: '#374151',
            borderBottom: '2px solid #e5e7eb',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: alpha('#1976d2', 0.04),
          },
        },
      },
    },
  },
});

const DeliveryAgentAccountingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { agentId } = useParams<{ agentId: string }>();
  
  const [agent, setAgent] = useState<deliveryAgentsApi.DeliveryAgent | null>(null);
  const [pendingOrders, setPendingOrders] = useState<deliveryAgentsApi.DeliveryAgentPendingOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (agentId) {
      fetchAgentData();
      fetchPendingOrders();
    }
  }, [agentId]);

  const fetchAgentData = async () => {
    try {
      if (agentId) {
        const agentData = await deliveryAgentsApi.getById(agentId);
        setAgent(agentData);
      }
    } catch (error) {
      console.error('Error fetching agent data:', error);
    }
  };

  const fetchPendingOrders = async () => {
    try {
      setLoading(true);
      if (agentId) {
        const orders = await deliveryAgentsApi.getDeliveryAgentPendingOrders(agentId);
        setPendingOrders(orders);
      }
    } catch (error) {
      console.error('Error fetching pending orders:', error);
      setPendingOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusChip = (status: number) => {
    switch (status) {
      case 1:
        return <Chip label="قيد التحضير" color="warning" size="small" />;
      case 2:
        return <Chip label="قيد التوصيل" color="info" size="small" />;
      case 3:
        return <Chip label="تم التسليم" color="success" size="small" />;
      default:
        return <Chip label="غير معروف" color="default" size="small" />;
    }
  };

  const totalAmount = pendingOrders.reduce((sum, order) => sum + order.totalAfterTaxAndService, 0);
  const ordersCount = pendingOrders.length;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        {/* Header */}
        <AppBar position="static" elevation={0} sx={{ backgroundColor: 'primary.main' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => navigate('/pos/delivery/management')}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              حساب الطيار
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 3 }}>
          {/* Agent Info Card */}
          {agent && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <PersonIcon color="primary" sx={{ fontSize: 40 }} />
                      <Box>
                        <Typography variant="h5" gutterBottom>
                          {agent.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {agent.phone}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Card sx={{ backgroundColor: 'primary.light', color: 'white' }}>
                          <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <OrderIcon sx={{ fontSize: 30, mb: 1 }} />
                            <Typography variant="h6">{ordersCount}</Typography>
                            <Typography variant="body2">طلب معلق</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6}>
                        <Card sx={{ backgroundColor: 'success.light', color: 'white' }}>
                          <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <MoneyIcon sx={{ fontSize: 30, mb: 1 }} />
                            <Typography variant="h6">{formatCurrency(totalAmount)}</Typography>
                            <Typography variant="body2">إجمالي المبلغ</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Orders Table */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ReceiptIcon />
                الطلبات المعلقة
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {loading ? (
                <Typography>جاري التحميل...</Typography>
              ) : pendingOrders.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  لا توجد طلبات معلقة
                </Typography>
              ) : (
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>رقم الطلب</TableCell>
                        <TableCell>المبلغ</TableCell>
                        <TableCell>تاريخ الإنشاء</TableCell>
                        <TableCell>تاريخ التحضير</TableCell>
                        <TableCell>الحالة</TableCell>
                        <TableCell>الملاحظات</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              #{order.backInvoiceCode}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="success.main" fontWeight="bold">
                              {formatCurrency(order.totalAfterTaxAndService)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDate(order.createdAt)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDate(order.preparedAt)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {getStatusChip(order.invoiceStatus)}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {order.notes || '--'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.print()}
              startIcon={<ReceiptIcon />}
            >
              طباعة التقرير
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/pos/delivery/management')}
            >
              العودة
            </Button>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default DeliveryAgentAccountingPage;

