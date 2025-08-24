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
  Checkbox,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Avatar,
  Card,
  CardContent,
  Divider,
  Stack,
  IconButton,
  Tooltip,
  Badge,
  Grid,
  AppBar,
  Toolbar,
  alpha,
  Fab,
  Zoom
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  ChevronLeft,
  ChevronRight,
  DeliveryDining as DeliveryIcon,
  Assignment as OrderIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  TwoWheeler as BikeIcon,
  AccountCircle as AccountIcon,
  ExitToApp as ExitIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  NotificationImportant as UrgentIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';


// Mock data with 'as const' fix
const mockDeliveryAgents = [
  { id: '1', name: 'أحمد محمد', status: 'available' as const },
  { id: '2', name: 'محمد علي', status: 'available' as const },
  { id: '3', name: 'علي أحمد', status: 'available' as const },
  { id: '4', name: 'خالد محمود', status: 'available' as const }
];


const mockAgentsOnDuty = [
  { id: '5', name: 'سامي حسن', status: 'busy' as const, ordersCount: 2 },
  { id: '6', name: 'محمود أحمد', status: 'busy' as const, ordersCount: 1 }
];


const mockDeliveryOrders = [
  {
    id: '1',
    code: '6',
    customerName: 'أحمد',
    customerAddress: 'شارع الجامعة، المعادي',
    customerPhone: '01012345678',
    total: 570.00,
    area: 'جديدة الفلل',
    status: 'preparing',
    orderTime: new Date(Date.now() - 11 * 60 * 1000),
    selected: false,
    priority: 'high'
  },
  {
    id: '2',
    code: '7',
    customerName: 'سارة محمد',
    customerAddress: 'شارع النيل، الزمالك',
    customerPhone: '01087654321',
    total: 320.50,
    area: 'الزمالك',
    status: 'preparing',
    orderTime: new Date(Date.now() - 25 * 60 * 1000),
    selected: false,
    priority: 'normal'
  },
  {
    id: '3',
    code: '8',
    customerName: 'محمد حسن',
    customerAddress: 'شارع التحرير، وسط البلد',
    customerPhone: '01156789012',
    total: 450.75,
    area: 'وسط البلد',
    status: 'preparing',
    orderTime: new Date(Date.now() - 8 * 60 * 1000),
    selected: false,
    priority: 'urgent'
  },
    {
    id: '4',
    code: '8',
    customerName: 'محمد حسن',
    customerAddress: 'شارع التحرير، وسط البلد',
    customerPhone: '01156789012',
    total: 450.75,
    area: 'وسط البلد',
    status: 'preparing',
    orderTime: new Date(Date.now() - 8 * 60 * 1000),
    selected: false,
    priority: 'urgent'
  },
    {
    id: '5',
    code: '8',
    customerName: 'محمد حسن',
    customerAddress: 'شارع التحرير، وسط البلد',
    customerPhone: '01156789012',
    total: 450.75,
    area: 'وسط البلد',
    status: 'preparing',
    orderTime: new Date(Date.now() - 8 * 60 * 1000),
    selected: false,
    priority: 'urgent'
  },
    {
    id: '6',
    code: '8',
    customerName: 'محمد حسن',
    customerAddress: 'شارع التحرير، وسط البلد',
    customerPhone: '01156789012',
    total: 450.75,
    area: 'وسط البلد',
    status: 'preparing',
    orderTime: new Date(Date.now() - 8 * 60 * 1000),
    selected: false,
    priority: 'urgent'
  },
    {
    id: '7',
    code: '8',
    customerName: 'محمد حسن',
    customerAddress: 'شارع التحرير، وسط البلد',
    customerPhone: '01156789012',
    total: 450.75,
    area: 'وسط البلد',
    status: 'preparing',
    orderTime: new Date(Date.now() - 8 * 60 * 1000),
    selected: false,
    priority: 'urgent'
  },
    {
    id: '8',
    code: '8',
    customerName: 'محمد حسن',
    customerAddress: 'شارع التحرير، وسط البلد',
    customerPhone: '01156789012',
    total: 450.75,
    area: 'وسط البلد',
    status: 'preparing',
    orderTime: new Date(Date.now() - 8 * 60 * 1000),
    selected: false,
    priority: 'urgent'
  },
    {
    id: '9',
    code: '8',
    customerName: 'محمد حسن',
    customerAddress: 'شارع التحرير، وسط البلد',
    customerPhone: '01156789012',
    total: 450.75,
    area: 'وسط البلد',
    status: 'preparing',
    orderTime: new Date(Date.now() - 8 * 60 * 1000),
    selected: false,
    priority: 'urgent'
  },
    {
    id: '10',
    code: '8',
    customerName: 'محمد حسن',
    customerAddress: 'شارع التحرير، وسط البلد',
    customerPhone: '01156789012',
    total: 450.75,
    area: 'وسط البلد',
    status: 'preparing',
    orderTime: new Date(Date.now() - 8 * 60 * 1000),
    selected: false,
    priority: 'urgent'
  },
    {
    id: '11',
    code: '8',
    customerName: 'محمد حسن',
    customerAddress: 'شارع التحرير، وسط البلد',
    customerPhone: '01156789012',
    total: 450.75,
    area: 'وسط البلد',
    status: 'preparing',
    orderTime: new Date(Date.now() - 8 * 60 * 1000),
    selected: false,
    priority: 'urgent'
  },
    {
    id: '12',
    code: '8',
    customerName: 'محمد حسن',
    customerAddress: 'شارع التحرير، وسط البلد',
    customerPhone: '01156789012',
    total: 450.75,
    area: 'وسط البلد',
    status: 'preparing',
    orderTime: new Date(Date.now() - 8 * 60 * 1000),
    selected: false,
    priority: 'urgent'
  },
    {
    id: '13',
    code: '8',
    customerName: 'محمد حسن',
    customerAddress: 'شارع التحرير، وسط البلد',
    customerPhone: '01156789012',
    total: 450.75,
    area: 'وسط البلد',
    status: 'preparing',
    orderTime: new Date(Date.now() - 8 * 60 * 1000),
    selected: false,
    priority: 'urgent'
  },
    {
    id: '14',
    code: '8',
    customerName: 'محمد حسن',
    customerAddress: 'شارع التحرير، وسط البلد',
    customerPhone: '01156789012',
    total: 450.75,
    area: 'وسط البلد',
    status: 'preparing',
    orderTime: new Date(Date.now() - 8 * 60 * 1000),
    selected: false,
    priority: 'urgent'
  },
    {
    id: '15',
    code: '8',
    customerName: 'محمد حسن',
    customerAddress: 'شارع التحرير، وسط البلد',
    customerPhone: '01156789012',
    total: 450.75,
    area: 'وسط البلد',
    status: 'preparing',
    orderTime: new Date(Date.now() - 8 * 60 * 1000),
    selected: false,
    priority: 'urgent'
  },
    {
    id: '16',
    code: '8',
    customerName: 'محمد حسن',
    customerAddress: 'شارع التحرير، وسط البلد',
    customerPhone: '01156789012',
    total: 450.75,
    area: 'وسط البلد',
    status: 'preparing',
    orderTime: new Date(Date.now() - 8 * 60 * 1000),
    selected: false,
    priority: 'urgent'
  },
    {
    id: '17',
    code: '8',
    customerName: 'محمد حسن',
    customerAddress: 'شارع التحرير، وسط البلد',
    customerPhone: '01156789012',
    total: 450.75,
    area: 'وسط البلد',
    status: 'preparing',
    orderTime: new Date(Date.now() - 8 * 60 * 1000),
    selected: false,
    priority: 'urgent'
  },
    {
    id: '18',
    code: '8',
    customerName: 'محمد حسن',
    customerAddress: 'شارع التحرير، وسط البلد',
    customerPhone: '01156789012',
    total: 450.75,
    area: 'وسط البلد',
    status: 'preparing',
    orderTime: new Date(Date.now() - 8 * 60 * 1000),
    selected: false,
    priority: 'urgent'
  },
  {
    id: '19',
    code: '9',
    customerName: 'فاطمة علي',
    customerAddress: 'شارع الهرم، الجيزة',
    customerPhone: '01234567890',
    total: 280.00,
    area: 'الهرم',
    status: 'preparing',
    orderTime: new Date(Date.now() - 15 * 60 * 1000),
    selected: false,
    priority: 'normal'
  }
];


interface DeliveryAgent {
  id: string;
  name: string;
  status: 'available' | 'busy';
  ordersCount?: number;
}


interface DeliveryOrder {
  id: string;
  code: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  total: number;
  area: string;
  status: string;
  orderTime: Date;
  selected: boolean;
  priority: 'normal' | 'high' | 'urgent' | string;
}


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
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    error: {
      main: '#d32f2f',
      light: '#f44336',
      dark: '#c62828',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
    },
  },
  typography: {
    fontFamily: '"Cairo", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '1.75rem', // Adjusted for density
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem', // Adjusted for density
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem', // Adjusted for density
    },
    subtitle1: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '0.9rem', // Adjusted for density
      lineHeight: 1.4,
    },
    body2: {
      fontSize: '0.8rem', // Adjusted for density
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
          boxShadow: '0 2px 10px 0 rgba(0,0,0,0.07)', // Subtler shadow
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
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
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
          padding: '8px 12px', // **MODIFICATION**: Reduced padding for denser table rows
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
          '&.Mui-selected': {
            backgroundColor: alpha('#1976d2', 0.08),
            '&:hover': {
              backgroundColor: alpha('#1976d2', 0.12),
            },
          },
        },
      },
    },
  },
});


const DeliveryManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [orders, setOrders] = useState<DeliveryOrder[]>(mockDeliveryOrders);
  const [availableAgents, setAvailableAgents] = useState<DeliveryAgent[]>(mockDeliveryAgents);
  const [agentsOnDuty, setAgentsOnDuty] = useState<DeliveryAgent[]>(mockAgentsOnDuty);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);


  const getElapsedTime = (orderTime: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - orderTime.getTime()) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };


  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      default:
        return 'primary';
    }
  };


  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <UrgentIcon sx={{ fontSize: '1rem' }} />;
      case 'high':
        return <ScheduleIcon sx={{ fontSize: '1rem' }} />;
      default:
        return <CheckIcon sx={{ fontSize: '1rem' }} />;
    }
  };


  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prevOrders => [...prevOrders]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setOrders(prevOrders => 
      prevOrders.map(order => ({ ...order, selected: newSelectAll }))
    );
  };


  const handleSelectOrder = (orderId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, selected: !order.selected }
          : order
      )
    );
  };


  const handleSelectAgent = (agentId: string, isOnDuty = false) => {
    const agentKey = isOnDuty ? `duty_${agentId}` : agentId;
    setSelectedAgents(prev => 
      prev.includes(agentKey)
        ? prev.filter(id => id !== agentKey)
        : [...prev, agentKey]
    );
  };


  const selectedOrdersCount = orders.filter(order => order.selected).length;
  const totalAmount = orders
    .filter(order => order.selected)
    .reduce((sum, order) => sum + order.total, 0);


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', direction: 'rtl', bgcolor: 'background.default' }}>
        
        {/* Enhanced Left Sidebar */}
        <Card sx={{ 
          width: 300, // **MODIFICATION**: Slightly reduced width
          height: '100vh', 
          borderRadius: 0, 
          borderLeft: '1px solid',
          borderColor: 'divider',
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            p: 2, // **MODIFICATION**: Reduced padding
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            color: 'white'
          }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 36, height: 36 }}>
                <BikeIcon fontSize="small" />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                إدارة الطيارين
              </Typography>
            </Stack>
          </Box>


          <Box sx={{ flex: 1, p: 1.5, overflow: 'auto' }}>
            {/* Available Agents */}
            <Box sx={{ mb: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <Chip 
                  icon={<CheckIcon />}
                  label={`متاح (${availableAgents.length})`}
                  color="success"
                  variant="filled"
                  size="small"
                />
              </Stack>
              
              <Stack spacing={1}>
                {availableAgents.map((agent) => (
                  <Card 
                    key={agent.id}
                    variant="outlined" 
                    sx={{ 
                      p: 1, // **MODIFICATION**: Reduced padding for density
                      cursor: 'pointer', 
                      bgcolor: selectedAgents.includes(agent.id) ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                      border: '1px solid',
                      borderColor: selectedAgents.includes(agent.id) ? 'primary.main' : 'divider',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 4px 12px 0 ${alpha(theme.palette.primary.main, 0.15)}`,
                        borderColor: 'primary.light'
                      }
                    }} 
                    onClick={() => handleSelectAgent(agent.id)}
                  >
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Checkbox
                        checked={selectedAgents.includes(agent.id)}
                        size="small"
                        color="primary"
                        sx={{ p: 0.5 }}
                      />
                      <Avatar 
                        sx={{ 
                          width: 28, 
                          height: 28, 
                          bgcolor: 'success.light',
                          fontSize: '0.8rem'
                        }}
                      >
                        {agent.name.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {agent.name}
                      </Typography>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Box>


            <Divider sx={{ my: 1.5 }} />


            {/* Agents On Duty */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <Chip 
                  icon={<DeliveryIcon />}
                  label={`بالخارج (${agentsOnDuty.length})`}
                  color="warning"
                  variant="filled"
                  size="small"
                />
              </Stack>
              
              <Stack spacing={1}>
                {agentsOnDuty.map((agent) => (
                  <Card 
                    key={agent.id}
                    variant="outlined" 
                    sx={{ 
                      p: 1, // **MODIFICATION**: Reduced padding for density
                      cursor: 'pointer', 
                      bgcolor: selectedAgents.includes(`duty_${agent.id}`) ? alpha(theme.palette.warning.main, 0.1) : 'transparent',
                      border: '1px solid',
                      borderColor: selectedAgents.includes(`duty_${agent.id}`) ? 'warning.main' : 'divider',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 4px 12px 0 ${alpha(theme.palette.warning.main, 0.15)}`,
                        borderColor: 'warning.light'
                      }
                    }} 
                    onClick={() => handleSelectAgent(agent.id, true)}
                  >
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Checkbox
                        checked={selectedAgents.includes(`duty_${agent.id}`)}
                        size="small"
                        color="warning"
                        sx={{ p: 0.5 }}
                      />
                      <Badge 
                        badgeContent={agent.ordersCount} 
                        color="warning"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                      >
                        <Avatar 
                          sx={{ 
                            width: 28, 
                            height: 28, 
                            bgcolor: 'warning.light',
                            fontSize: '0.8rem'
                          }}
                        >
                          {agent.name.charAt(0)}
                        </Avatar>
                      </Badge>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {agent.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2 }}>
                          {agent.ordersCount} طلب نشط
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Box>
          </Box>
        </Card>


        {/* Enhanced Main Content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          {/* Enhanced Header */}
          <AppBar 
            position="static" 
            elevation={0}
            sx={{ 
              bgcolor: 'background.paper', 
              borderBottom: '1px solid',
              borderColor: 'divider',
              color: 'text.primary'
            }}
          >
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px' }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  <OrderIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    شاشة متابعة الطلبات
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    إدارة ومتابعة طلبات التوصيل
                  </Typography>
                </Box>
              </Stack>


              <Stack direction="row" spacing={1}>
                <Tooltip title="تحديث">
                  <IconButton color="primary">
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="فلترة">
                  <IconButton color="primary">
                    <FilterIcon />
                  </IconButton>
                </Tooltip>
                <Button 
                  variant="contained" 
                  color="error" 
                  startIcon={<ExitIcon />}
                  size="small"
                  sx={{ borderRadius: 2 }}
                >
                  خروج
                </Button>
              </Stack>
            </Toolbar>
          </AppBar>


          {/* Stats Cards */}
          <Box sx={{ p: 1.5 }}>
            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ p: 1.5, textAlign: 'center' }}>
                  <Stack alignItems="center" spacing={0.5}>
                    <Avatar sx={{ bgcolor: 'primary.light', width: 40, height: 40 }}>
                      <OrderIcon />
                    </Avatar>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {orders.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      إجمالي الطلبات
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ p: 1.5, textAlign: 'center' }}>
                  <Stack alignItems="center" spacing={0.5}>
                    <Avatar sx={{ bgcolor: 'success.light', width: 40, height: 40 }}>
                      <CheckIcon />
                    </Avatar>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      {selectedOrdersCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      الطلبات المحددة
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ p: 1.5, textAlign: 'center' }}>
                  <Stack alignItems="center" spacing={0.5}>
                    <Avatar sx={{ bgcolor: 'warning.light', width: 40, height: 40 }}>
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                      {availableAgents.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      طيارين متاحين
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ p: 1.5, textAlign: 'center' }}>
                  <Stack alignItems="center" spacing={0.5}>
                    <Avatar sx={{ bgcolor: 'secondary.light', width: 40, height: 40 }}>
                      <DeliveryIcon />
                    </Avatar>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                      {totalAmount.toFixed(0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      قيمة المحدد (جنيه)
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Box>


          {/* Enhanced Table */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 1.5, pt: 0 }}>
            <TableContainer component={Paper}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell align="center">الأولوية</TableCell>
                    <TableCell align="center">الوقت</TableCell>
                    <TableCell align="center">الكود</TableCell>
                    <TableCell>العميل</TableCell>
                    <TableCell>العنوان</TableCell>
                    <TableCell>الهاتف</TableCell>
                    <TableCell align="right">المبلغ</TableCell>
                    <TableCell>المنطقة</TableCell>
                    <TableCell align="center">الحالة</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow 
                      key={order.id}
                      hover
                      onClick={() => handleSelectOrder(order.id)}
                      role="checkbox"
                      aria-checked={order.selected}
                      selected={order.selected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={order.selected}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={`أولوية ${order.priority}`}>
                          <Chip
                            icon={getPriorityIcon(order.priority)}
                            size="small"
                            color={getPriorityColor(order.priority) as any}
                            variant="outlined"
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          icon={<TimeIcon fontSize="small" />}
                          label={getElapsedTime(order.orderTime)}
                          size="small"
                          sx={{ 
                            bgcolor: 'grey.800', 
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={`#${order.code}`}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar sx={{ width: 28, height: 28, bgcolor: 'grey.300' }}>
                            <PersonIcon fontSize="small" />
                          </Avatar>
                          <Typography variant="body2" fontWeight="medium">
                            {order.customerName}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LocationIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {order.customerAddress}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <PhoneIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {order.customerPhone}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body1" fontWeight="bold" color="primary.main">
                          {order.total.toFixed(2)} ج.م
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.area}
                          size="small"
                          variant="outlined"
                          color="default"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label="تجهيز"
                          color="success"
                          size="small"
                          variant="filled"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>


          {/* Enhanced Footer */}
          <Paper 
            sx={{ 
              borderTop: 1, 
              borderColor: 'divider', 
              p: 1.5, // **MODIFICATION**: Reduced padding
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              bgcolor: 'background.paper'
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body2" color="text.secondary">
                إجمالي: <strong>{orders.length}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                المحدد: <strong>{selectedOrdersCount}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                القيمة: <strong>{totalAmount.toFixed(2)} ج.م</strong>
              </Typography>
            </Stack>
            
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton size="small" disabled>
                <ChevronRight />
              </IconButton>
              <Chip label="1" size="small" color="primary" />
              <IconButton size="small">
                <ChevronLeft />
              </IconButton>
            </Stack>
          </Paper>
        </Box>


        {/* Floating Action Button */}
        <Zoom in={selectedOrdersCount > 0}>
          <Fab 
            color="primary" 
            sx={{ 
              position: 'fixed', 
              bottom: 32, 
              left: 32,
              zIndex: 1000
            }}
          >
            <Badge badgeContent={selectedOrdersCount} color="error">
              <DeliveryIcon />
            </Badge>
          </Fab>
        </Zoom>
      </Box>
    </ThemeProvider>
  );
};


export default DeliveryManagementPage;

