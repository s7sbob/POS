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
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  AlertTitle,
  Slide,
  Grow,
  Backdrop,
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
  ArrowBack as ArrowBackIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  NotificationImportant as UrgentIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as invoicesApi from 'src/utils/api/pagesApi/invoicesApi';
import * as deliveryAgentsApi from 'src/utils/api/pagesApi/deliveryAgentsApi';
import { TransitionProps } from '@mui/material/transitions';


// Add these interfaces at the top with other interfaces
interface NotificationState {
  open: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  action?: () => void;
  actionLabel?: string;
}

// Custom transition component
const SlideTransition = React.forwardRef<
  unknown,
  TransitionProps & {
    children: React.ReactElement;
  }
>(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


interface DeliveryAgent {
  id: string;
  name: string;
  phone: string;
  branchName?: string;
  branchId: string;
  companyID?: string;
  isActive: boolean;
  status?: 'available' | 'busy';
  ordersCount?: number;
}

interface DeliveryOrder {
  id: string;
  backInvoiceCode?: string | null; // ✅ تغيير من number إلى string | null
  notes?: string;
  totalAfterTaxAndService: number;
  createdAt: string;
  preparedAt: string;
  deliveryAgentId?: string | null;
  invoiceStatus: number;
  selected: boolean;

  /**
   * The name of the customer associated with this order.  Derived from
   * invoice.customerName or invoice.customer.name.
   */
  customerName?: string;
  /**
   * Primary phone number for the customer.  Pulled from invoice.customer.phone1.
   */
  customerPhone?: string;
  /**
   * The delivery address line for the order.  Derived from
   * invoice.customerAddress.addressLine when available.
   */
  customerAddressLine?: string;
  /**
   * The name of the delivery zone (if available) from the customer address.
   */
  zoneName?: string;
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
    MuiCssBaseline: {
      styleOverrides: {
        '@keyframes pulse': {
          '0%': {
            transform: 'scale(1)',
            opacity: 1,
          },
          '50%': {
            transform: 'scale(1.1)',
            opacity: 0.7,
          },
          '100%': {
            transform: 'scale(1)',
            opacity: 1,
          },
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
  const navigate = useNavigate();
  const [notification, setNotification] = useState<NotificationState>({
  open: false,
  message: '',
  type: 'info'
});
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [availableAgents, setAvailableAgents] = useState<DeliveryAgent[]>([]);
  const [agentsOnDuty, setAgentsOnDuty] = useState<DeliveryAgent[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [agentTimers, setAgentTimers] = useState<{[key: string]: Date}>({});
  const [accountingDialog, setAccountingDialog] = useState<{
    open: boolean;
    agentId?: string;
    agentName?: string;
    orders?: any[];
  }>({ open: false });
  const [loading, setLoading] = useState(true);
  const [filteredByAgent, setFilteredByAgent] = useState<string | null>(null);

  // Fetch delivery agents from API
  const fetchDeliveryAgents = async () => {
    try {
      const agents = await deliveryAgentsApi.getAll();
      
      // Separate agents into available and on duty based on whether they have orders assigned
      const agentsWithStatus = agents
        .filter(agent => agent.isActive)
        .map(agent => ({
          ...agent,
          status: 'available' as const,
          ordersCount: 0
        }));
      
      setAvailableAgents(agentsWithStatus);
    } catch (error) {
      console.error('Error fetching delivery agents:', error);
      setAvailableAgents([]);
    }
  };

  // Fetch delivery orders from API
  const fetchDeliveryOrders = async () => {
    try {
      setLoading(true);
      const response = await invoicesApi.getDeliveryInPrepareInvoices();
      
      const transformedOrders: DeliveryOrder[] = response.data.map((invoice: invoicesApi.Invoice) => ({
        id: invoice.id,
        backInvoiceCode: invoice.backInvoiceCode, // ✅ مباشرة بدون تحويل
        // Keep the raw notes for reference (may contain comments from cashier)
        notes: invoice.notes || '',
        totalAfterTaxAndService: invoice.totalAfterTaxAndService,
        createdAt: invoice.createdAt,
        preparedAt: invoice.preparedAt,
        deliveryAgentId: invoice.deliveryAgentId,
        invoiceStatus: invoice.invoiceStatus,
        selected: false,
        // Extract customer details from the invoice object.  Prefer the
        // customerName field if provided, otherwise fall back to the nested
        // customer object.  Phone and address come from the nested objects.
        customerName: invoice.customerName || (invoice as any).customer?.name || '',
        customerPhone: (invoice as any).customer?.phone1 || '',
        customerAddressLine: (invoice as any).customerAddress?.addressLine || '',
        zoneName: (invoice as any).customerAddress?.zoneName || ''
      }));
      
      setOrders(transformedOrders);
      
      // Update agents on duty based on orders with assigned agents
      await updateAgentsOnDutyFromOrders(transformedOrders);
      
    } catch (error) {
      console.error('Error fetching delivery orders:', error);
      // Fallback to empty array on error
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };


  const showNotification = (
  message: string, 
  type: NotificationState['type'] = 'info',
  title?: string,
  action?: () => void,
  actionLabel?: string
) => {
  setNotification({
    open: true,
    message,
    type,
    title,
    action,
    actionLabel
  });
};

const hideNotification = () => {
  setNotification(prev => ({ ...prev, open: false }));
};

  // Update agents on duty based on orders
  const updateAgentsOnDutyFromOrders = async (orders: DeliveryOrder[]) => {
    try {
      const agentIds = [...new Set(orders
        .filter(order => order.deliveryAgentId)
        .map(order => order.deliveryAgentId!)
      )];

      if (agentIds.length === 0) {
        setAgentsOnDuty([]);
        return;
      }

      const onDutyAgents: DeliveryAgent[] = [];
      
      for (const agentId of agentIds) {
        try {
          const agent = await deliveryAgentsApi.getById(agentId);
          const ordersCount = orders.filter(order => order.deliveryAgentId === agentId).length;
          
          onDutyAgents.push({
            ...agent,
            status: 'busy' as const,
            ordersCount
          });
        } catch (error) {
          console.error(`Error fetching agent ${agentId}:`, error);
        }
      }

      setAgentsOnDuty(onDutyAgents);
      
      // Remove on-duty agents from available agents
      setAvailableAgents(prev => 
        prev.filter(agent => !agentIds.includes(agent.id))
      );
      
    } catch (error) {
      console.error('Error updating agents on duty:', error);
    }
  };

  useEffect(() => {
    fetchDeliveryAgents();
    fetchDeliveryOrders();
  }, []);


  const getElapsedTime = (orderTimeString: string) => {
    const orderTime = new Date(orderTimeString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - orderTime.getTime()) / 1000);
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getAgentTimerElapsed = (agentId: string) => {
    const startTime = agentTimers[agentId];
    if (!startTime) return '00:00:00';
    
    const now = new Date();
    const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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

  // Handle agent accounting - show agent's pending orders in the same page
  const handleAgentAccounting = async (agentId: string) => {
    try {
      setLoading(true);
      
      // Fetch pending orders for the selected agent
      const agentPendingOrders = await deliveryAgentsApi.getDeliveryAgentPendingOrders(agentId);
      
      // Transform the data to match the existing DeliveryOrder interface
      const transformedOrders: DeliveryOrder[] = agentPendingOrders.map((order: any) => ({
        id: order.id,
        backInvoiceCode: order.backInvoiceCode, // ✅ إضافة هذا السطر
        notes: order.notes || '',
        totalAfterTaxAndService: order.totalAfterTaxAndService,
        createdAt: order.createdAt,
        preparedAt: order.preparedAt,
        deliveryAgentId: order.deliveryAgentId,
        invoiceStatus: order.invoiceStatus,
        selected: false,
        // Extract customer info from nested fields
        customerName: order.customerName || order.customer?.name || '',
        customerPhone: order.customer?.phone1 || '',
        customerAddressLine: order.customerAddress?.addressLine || '',
        zoneName: order.customerAddress?.zoneName || ''
      }));
      
      // Update the orders state with agent's pending orders
      setOrders(transformedOrders);
      
      // Set filter to show only this agent's orders
      setFilteredByAgent(agentId);
      
      // Clear any selected orders
      setSelectedAgents([]);
      
    } catch (error) {
      console.error('Error fetching agent pending orders:', error);
      showNotification('حدث خطأ أثناء جلب طلبات الطيار', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on selected agent
  const displayedOrders = filteredByAgent 
    ? orders.filter(order => order.deliveryAgentId === filteredByAgent)
    : orders;
    
  const selectedOrdersCount = displayedOrders.filter(order => order.selected).length;
  const totalOrdersCount = orders.length;

    const handlePrintReceipt = async () => {
    // Check if exactly one agent is selected and at least one order is selected
    const selectedAgentIds = selectedAgents.filter(id => !id.startsWith('duty_'));
    if (selectedAgentIds.length !== 1 || selectedOrdersCount === 0) {
      showNotification('يجب اختيار طيار واحد فقط وطلب واحد على الأقل');
      return;
    }

    const selectedAgentId = selectedAgentIds[0];
    const agent = availableAgents.find(a => a.id === selectedAgentId);
    
    if (!agent) {
      showNotification('الطيار غير موجود');
      return;
    }

    try {
      // Update selected orders with agent ID and status using API
      const selectedOrders = orders.filter(order => order.selected);
      
      for (const order of selectedOrders) {
        // Get the full invoice data first
        const fullInvoice = await invoicesApi.getInvoiceById(order.id);
        
        // Update the invoice with agent ID and status to 2 (in delivery)
        const updateData: invoicesApi.UpdateInvoiceRequest = {
          id: fullInvoice.id,
          InvoiceType: fullInvoice.invoiceType,
          InvoiceStatus: 2, // Set to in delivery
          WareHouseId: fullInvoice.wareHouseId,
          RawBranchId: fullInvoice.rawBranchId,
          CustomerId: fullInvoice.customerId,
          TableId: fullInvoice.tableId,
          HallCaptainId: fullInvoice.hallCaptainId,
          DeliveryCompanyId: fullInvoice.deliveryCompanyId,
          DeliveryAgentId: selectedAgentId, // Set the selected agent ID
          TaxPercentage: fullInvoice.taxPercentage,
          ServicePercentage: fullInvoice.servicePercentage,
          HeaderDiscountPercentage: fullInvoice.headerDiscountPercentage,
          PreparedAt: fullInvoice.preparedAt,
          CompletedAt: fullInvoice.completedAt,
          Notes: fullInvoice.notes,
          Items: fullInvoice.items.map(item => ({
            id: item.id,
            ProductId: item.productId,
            ProductPriceId: item.productPriceId,
            Barcode: item.barcode,
            UnitId: item.unitId,
            PosPriceName: item.posPriceName,
            UnitFactor: item.unitFactor,
            Qty: item.qty,
            UnitPrice: item.unitPrice,
            UnitCost: item.unitCost,
            ItemDiscountPercentage: item.itemDiscountPercentage,
            ItemTaxPercentage: item.itemTaxPercentage,
            ServicePercentage: item.servicePercentage,
            WareHouseId: item.wareHouseId,
            Components: item.components
          })),
          Payments: fullInvoice.payments.map(payment => ({
            id: payment.id,
            Amount: payment.amount,
            PaymentMethodId: payment.paymentMethodId
          }))
        };
        
        await invoicesApi.updateInvoice(updateData);
      }

      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.selected 
            ? { ...order, deliveryAgentId: selectedAgentId, invoiceStatus: 2, selected: false }
            : order
        )
      );

      // Move agent from available to on duty
      setAvailableAgents(prev => prev.filter(a => a.id !== selectedAgentId));
      setAgentsOnDuty(prev => [...prev, {
        ...agent,
        status: 'busy' as const,
        ordersCount: selectedOrdersCount
      }]);

      // Start timer for the agent
      setAgentTimers(prev => ({
        ...prev,
        [selectedAgentId]: new Date()
      }));

      // Clear selections
      setSelectedAgents([]);
      setSelectAll(false);

      showNotification(`تم تعيين ${selectedOrders.length} طلب للطيار ${agent.name} وبدء التوصيل`);
      
      // Note: Removed automatic refresh to prevent losing current state
      // The orders will be updated locally and user can manually refresh if needed
      
    } catch (error) {
      console.error('Error updating orders:', error);
      showNotification('حدث خطأ أثناء تحديث الطلبات');
    }
  };

  const handleFinishAgentAccounting = async () => {
    // Check if any orders are selected
    if (selectedOrdersCount === 0) {
      showNotification('يجب اختيار طلب واحد على الأقل', 'warning');
      return;
    }

    try {
      // Update selected orders status to 3 (completed) using API
      const selectedOrders = orders.filter(order => order.selected);
      
      for (const order of selectedOrders) {
        // Get the full invoice data first
        const fullInvoice = await invoicesApi.getInvoiceById(order.id);
        
        // Update the invoice status to 3 (completed)
        const updateData: invoicesApi.UpdateInvoiceRequest = {
          id: fullInvoice.id,
          InvoiceType: fullInvoice.invoiceType,
          InvoiceStatus: 3, // Set to completed
          WareHouseId: fullInvoice.wareHouseId,
          RawBranchId: fullInvoice.rawBranchId,
          CustomerId: fullInvoice.customerId,
          TableId: fullInvoice.tableId,
          HallCaptainId: fullInvoice.hallCaptainId,
          DeliveryCompanyId: fullInvoice.deliveryCompanyId,
          DeliveryAgentId: fullInvoice.deliveryAgentId,
          TaxPercentage: fullInvoice.taxPercentage,
          ServicePercentage: fullInvoice.servicePercentage,
          HeaderDiscountPercentage: fullInvoice.headerDiscountPercentage,
          PreparedAt: fullInvoice.preparedAt,
          CompletedAt: new Date().toISOString(),
          Notes: fullInvoice.notes,
          Items: fullInvoice.items.map(item => ({
            id: item.id,
            ProductId: item.productId,
            ProductPriceId: item.productPriceId,
            Barcode: item.barcode,
            UnitId: item.unitId,
            PosPriceName: item.posPriceName,
            UnitFactor: item.unitFactor,
            Qty: item.qty,
            UnitPrice: item.unitPrice,
            UnitCost: item.unitCost,
            ItemDiscountPercentage: item.itemDiscountPercentage,
            ItemTaxPercentage: item.itemTaxPercentage,
            ServicePercentage: item.servicePercentage,
            WareHouseId: item.wareHouseId,
            Components: item.components
          })),
          Payments: fullInvoice.payments.map(payment => ({
            id: payment.id,
            Amount: payment.amount,
            PaymentMethodId: payment.paymentMethodId
          }))
        };
        
        await invoicesApi.updateInvoice(updateData);
      }

        // Update local state - remove completed orders from the list
      setOrders(prevOrders => 
        prevOrders.filter(order => !order.selected)
      );
      
      // Clear selections
      setSelectedAgents([]);
      setSelectAll(false);

      showNotification(`تم إنهاء حساب الطيار وتسليم ${selectedOrders.length} طلب بنجاح`, 'success');

      // Note: Removed automatic refresh to prevent losing current state
      // The orders will be updated locally and user can manually refresh if needed
      
    } catch (error) {
      console.error('Error updating invoices:', error);
      showNotification('حدث خطأ أثناء تحديث الطلبات', 'error');
    }
  };


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
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {agent.name}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAgentAccounting(agent.id);
                        }}
                        sx={{ ml: 1 }}
                      >
                        <AccountIcon fontSize="small" />
                      </IconButton>
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
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {agent.name}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                            {agent.ordersCount} طلب نشط
                          </Typography>
                          <Chip
                            icon={<TimeIcon fontSize="small" />}
                            label={getAgentTimerElapsed(agent.id)}
                            size="small"
                            sx={{ 
                              bgcolor: 'warning.dark', 
                              color: 'white',
                              fontWeight: 'bold',
                              fontFamily: 'monospace',
                              fontSize: '0.7rem',
                              height: '20px',
                              '& .MuiChip-label': {
                                px: 0.5
                              }
                            }}
                          />
                        </Stack>
                      </Box>
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAgentAccounting(agent.id);
                        }}
                        sx={{ ml: 1 }}
                      >
                        <AccountIcon fontSize="small" />
                      </IconButton>
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
                {/* {filteredByAgent && (
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    startIcon={<RefreshIcon />}
                    size="small"
                    sx={{ borderRadius: 2 }}
                  </Button>
                )} */}
                <Tooltip title="تحديث">
                  <IconButton 
                    color="primary"
                    onClick={() => {
                      fetchDeliveryAgents();
                      fetchDeliveryOrders();
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="فلترة">
                  <IconButton color="primary">
                    <FilterIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Toolbar>
          </AppBar>


{/* Stats Cards and Action Buttons */}
<Box sx={{ p: 1.5 }}>
  <Grid container spacing={1.5} alignItems="center">
    {/* Total Orders Stat */}
    <Grid item xs={12} sm={6} md={3}>
      <Card sx={{ p: 1, textAlign: 'center' }}>
        <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
          <Avatar sx={{ bgcolor: 'primary.light', width: 24, height: 24 }}>
            <OrderIcon sx={{ fontSize: 16 }} />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', lineHeight: 1 }}>
              {filteredByAgent ? displayedOrders.length : totalOrdersCount}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
              {filteredByAgent ? 'طلبات الطيار' : 'إجمالي الطلبات'}
            </Typography>
          </Box>
        </Stack>
      </Card>
    </Grid>

    {/* Action Buttons */}
    <Grid item xs={12} sm={6} md={9}>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        {/* {filteredByAgent && (
          <Button
            variant="outlined"
            color="warning"
            size="large"
            onClick={() => setFilteredByAgent(null)}
            sx={{
              minWidth: 140,
              borderRadius: 2,
              fontWeight: 'bold'
            }}
          >
            إلغاء الفلتر
          </Button>
        )} */}

        <Stack direction="row" spacing={1.5}>
          {filteredByAgent ? (
            <>
              <Button
                variant="outlined"
                color="info"
                size="large"
                sx={{
                  minWidth: 140,
                  borderRadius: 2,
                  fontWeight: 'bold',
                }}
                    onClick={() => {
                      setFilteredByAgent(null);
                      fetchDeliveryOrders(); // Reload all orders
                    }}              >
                الذهاب الى اوردرات تنتظر التسليم
              </Button>
              <Button
                variant="contained"
                color="error"
                size="large"
                sx={{
                  minWidth: 140,
                  borderRadius: 2,
                  fontWeight: 'bold',
                }}
                disabled={selectedOrdersCount === 0}
                onClick={handleFinishAgentAccounting}
              >
                انهاء حساب الطيار
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                minWidth: 140,
                borderRadius: 2,
                fontWeight: 'bold',
              }}
              disabled={
                selectedAgents.filter(id => !id.startsWith('duty_')).length !== 1 ||
                selectedOrdersCount === 0
              }
              onClick={handlePrintReceipt}
            >
              طباعة البون
            </Button>
          )}
        </Stack>
      </Stack>
    </Grid>
  </Grid>
</Box>


          {/* Enhanced Table */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 1.5, pt: 0 }}>
            {filteredByAgent && (
              <Box sx={{ mb: 2, p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                <Typography variant="h6" color="info.contrastText">
                  عرض طلبات الطيار المعلقة - يمكنك تحديد الطلبات المدفوعة والضغط على "دفع"
                </Typography>
              </Box>
            )}
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
                    <TableCell align="center">الوقت</TableCell>
                    <TableCell align="center">الكود</TableCell>
                    <TableCell>العميل</TableCell>
                    <TableCell>العنوان</TableCell>
                    <TableCell>الهاتف</TableCell>
                    <TableCell align="right">المبلغ</TableCell>
                    <TableCell>المنطقة</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography>جاري التحميل...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : displayedOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography>لا توجد طلبات</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedOrders.map((order) => (
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
                          <Chip
                            icon={<TimeIcon fontSize="small" />}
                            label={getElapsedTime(order.createdAt)}
                            size="small"
                            sx={{ 
                              bgcolor: 'grey.900', 
                              color: 'white',
                              fontWeight: 'bold',
                              fontFamily: 'monospace',
                              fontSize: '0.85rem',
                              minWidth: '90px',
                              '& .MuiChip-label': {
                                px: 1
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
    label={`#${order.backInvoiceCode }`} // ✅ يعرض backInvoiceCode مباشرة
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.light', fontSize: '0.8rem' }}>
                              {(order.customerName && order.customerName.trim().charAt(0)) || 'ع'}
                            </Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {order.customerName && order.customerName.trim() !== '' ? order.customerName : 'عميل'}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <LocationIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {order.customerAddressLine && order.customerAddressLine.trim() !== '' ? order.customerAddressLine : 'عنوان التوصيل'}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {order.customerPhone && order.customerPhone.trim() !== '' ? order.customerPhone : 'غير محدد'}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                            {order.totalAfterTaxAndService.toFixed(2)} ج.م
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={order.zoneName && order.zoneName.trim() !== '' ? order.zoneName : 'منطقة التوصيل'}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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
              {/* <Typography variant="body2" color="text.secondary">
                القيمة: <strong>{totalAmount.toFixed(2)} ج.م</strong>
              </Typography> */}
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
        {/* <Zoom in={selectedOrdersCount > 0}>
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
        </Zoom> */}
      </Box>
    {/* Enhanced Notification System */}
    <Snackbar
      open={notification.open}
      autoHideDuration={6000}
      onClose={hideNotification}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ 
        '& .MuiSnackbarContent-root': {
          minWidth: '400px'
        }
      }}
    >
      <Alert
        onClose={hideNotification}
        severity={notification.type}
        variant="filled"
        sx={{
          width: '100%',
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          '& .MuiAlert-icon': {
            fontSize: '1.5rem'
          }
        }}
        action={
          notification.action && notification.actionLabel ? (
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                notification.action?.();
                hideNotification();
              }}
              sx={{
                color: 'white',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              {notification.actionLabel}
            </Button>
          ) : undefined
        }
      >
        {notification.title && (
          <AlertTitle sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {notification.title}
          </AlertTitle>
        )}
        {notification.message}
      </Alert>
    </Snackbar>

    {/* Loading Backdrop */}
    <Backdrop
      sx={{ 
        color: '#fff', 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backdropFilter: 'blur(3px)'
      }}
      open={loading}
    >
      <Stack alignItems="center" spacing={2}>
        <Avatar 
          sx={{ 
            width: 64, 
            height: 64, 
            bgcolor: 'primary.main',
            animation: 'pulse 2s infinite'
          }}
        >
          <DeliveryIcon sx={{ fontSize: '2rem' }} />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          جاري التحميل...
        </Typography>
        <Typography variant="body2" color="rgba(255,255,255,0.7)">
          يرجى الانتظار
        </Typography>
      </Stack>
    </Backdrop>

  </ThemeProvider>
);
};


export default DeliveryManagementPage;

