// src/Pages/pos/newSales/components/TodayOrdersPopup.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Pagination
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import {
  getAllInvoices,
  getInvoiceById, // ✅ إضافة الاستيراد المفقود
  getInvoiceTypeText,
  getInvoiceStatusText,
  formatDate,
  Invoice,
  InvoicesResponse
} from '../../../../utils/api/pagesApi/invoicesApi';
import * as tableSectionsApi from '../../../../utils/api/pagesApi/tableSectionsApi';
import * as deliveryAgentsApi from '../../../../utils/api/pagesApi/deliveryAgentsApi';
import * as customersApi from '../../../../utils/api/pagesApi/customersApi';
import * as deliveryCompaniesApi from '../../../../utils/api/pagesApi/deliveryCompaniesApi';
import styles from '../styles/TodayOrdersPopup.module.css';

interface TodayOrdersPopupProps {
  isOpen: boolean;
  onClose: () => void;
  currentOrderType: string; // للفلترة حسب نوع الطلب الحالي
  onViewOrder: (invoice: Invoice & { isEditMode: boolean }) => void; // لعرض الطلب في الصفحة الرئيسية
}

const TodayOrdersPopup: React.FC<TodayOrdersPopupProps> = ({
  isOpen,
  onClose,
  currentOrderType,
  onViewOrder
}) => {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;

  // States للفلاتر
  const [statusFilter, setStatusFilter] = useState<number | ''>('');
  const [searchFilter, setSearchFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<number | ''>('');

  // States للبيانات المرجعية
  const [tables, setTables] = useState<{[key: string]: string}>({});
  const [deliveryAgents, setDeliveryAgents] = useState<{[key: string]: string}>({});
  const [customers, setCustomers] = useState<{[key: string]: string}>({});
  const [deliveryCompanies, setDeliveryCompanies] = useState<{[key: string]: string}>({});

  // تحميل البيانات المرجعية
  const loadReferenceData = async () => {
    try {
      // تحميل الطاولات
      const tableSections = await tableSectionsApi.getAll();
      const tablesMap: {[key: string]: string} = {};
      tableSections.forEach(section => {
        section.tables.forEach(table => {
          if (table.id) {
            tablesMap[table.id] = `${section.name} - ${table.name}`;
          }
        });
      });
      setTables(tablesMap);

      // تحميل الطيارين
      const agents = await deliveryAgentsApi.getAll();
      const agentsMap: {[key: string]: string} = {};
      agents.forEach(agent => {
        agentsMap[agent.id] = agent.name;
      });
      setDeliveryAgents(agentsMap);

      // تحميل العملاء
      const customersResponse = await customersApi.getAll(1, 1000); // جلب أول 1000 عميل
      const customersMap: {[key: string]: string} = {};
      customersResponse.data.forEach(customer => {
        customersMap[customer.id] = customer.name;
      });
      setCustomers(customersMap);

      // تحميل شركات التوصيل
      const companies = await deliveryCompaniesApi.getAll();
      const companiesMap: {[key: string]: string} = {};
      companies.forEach(company => {
        companiesMap[company.id] = company.name;
      });
      setDeliveryCompanies(companiesMap);

    } catch (error) {
      console.error('Error loading reference data:', error);
    }
  };

  // تحميل البيانات
  const loadInvoices = async (pageNumber: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: InvoicesResponse = await getAllInvoices(pageNumber, pageSize);
      
      setInvoices(response.data);
      setTotalPages(response.pageCount);
      setTotalCount(response.totalCount);
      setPage(pageNumber);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في تحميل البيانات');
      console.error('Error loading invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  // تحميل البيانات عند فتح النافذة
  useEffect(() => {
    if (isOpen) {
      loadReferenceData(); // تحميل البيانات المرجعية
      loadInvoices(1);
      
      // تطبيق فلتر نوع الطلب الحالي
      const orderTypeMap: { [key: string]: number } = {
        'Takeaway': 1,
        'Dine-in': 2,
        'Delivery': 3,
        'Pickup': 4,
        'DeliveryCompany': 5
      };
      
      if (currentOrderType && orderTypeMap[currentOrderType]) {
        setTypeFilter(orderTypeMap[currentOrderType]);
      } else {
        setTypeFilter('');
      }
    }
  }, [isOpen, currentOrderType]);

  // فلترة البيانات
  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      // فلتر نوع الطلب
      if (typeFilter !== '' && invoice.invoiceType !== typeFilter) {
        return false;
      }
      
      // فلتر الحالة
      if (statusFilter !== '' && invoice.invoiceStatus !== statusFilter) {
        return false;
      }
      
      // فلتر البحث (في الملاحظات أو ID)
      if (searchFilter.trim() !== '') {
        const searchTerm = searchFilter.toLowerCase();
        const searchInNotes = invoice.notes?.toLowerCase().includes(searchTerm) || false;
        const searchInId = invoice.id.toLowerCase().includes(searchTerm);
        const searchInCustomer = invoice.customerName?.toLowerCase().includes(searchTerm) || false;
        
        if (!searchInNotes && !searchInId && !searchInCustomer) {
          return false;
        }
      }
      
      return true;
    });
  }, [invoices, typeFilter, statusFilter, searchFilter]);

  // إعادة تعيين الفلاتر
  const clearFilters = () => {
    setStatusFilter('');
    setSearchFilter('');
    setTypeFilter('');
  };

  // معالج تغيير الصفحة
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    loadInvoices(value);
  };

  // معالج عرض الطلب مع معالجة أفضل للأخطاء
  const handleViewOrder = async (invoice: Invoice) => {
    try {
      setLoading(true);
      setError(null); // مسح الأخطاء السابقة
      
      // جلب تفاصيل الفاتورة الكاملة
      const fullInvoiceData = await getInvoiceById(invoice.id);
      
      // تمرير البيانات للصفحة الرئيسية مع إشارة أنها للتعديل
      onViewOrder({
        ...fullInvoiceData,
        isEditMode: true // إضافة علامة التعديل
      });
      
      onClose();
    } catch (error: any) {
      const errorMessage = error.message || t("pos.newSales.todayOrdersPopup.errorLoadingOrder");
      setError(errorMessage);
      console.error('Error loading invoice details:', error);
      
      // عدم إغلاق النافذة في حالة الخطأ للسماح للمستخدم برؤية رسالة الخطأ
    } finally {
      setLoading(false);
    }
  };

  // الحصول على معلومات إضافية حسب نوع الطلب
  const getAdditionalInfo = (invoice: Invoice) => {
    switch (invoice.invoiceType) {
      case 2: // Dine-in
        return {
          label: t("pos.newSales.todayOrdersPopup.table"),
          value: invoice.tableId ? (tables[invoice.tableId] || `${t("pos.newSales.todayOrdersPopup.table")} ${invoice.tableId}`) : '--'
        };
      case 3: // Delivery
        return {
          label: t("pos.newSales.todayOrdersPopup.deliveryAgent"),
          value: invoice.deliveryAgentId ? (deliveryAgents[invoice.deliveryAgentId] || invoice.deliveryAgentId) : '--'
        };
      case 5: // Delivery Company
        return {
          label: t("pos.newSales.todayOrdersPopup.deliveryCompany"),
          value: invoice.deliveryCompanyId ? (deliveryCompanies[invoice.deliveryCompanyId] || invoice.deliveryCompanyId) : '--'
        };
      default:
        return null;
    }
  };

  // دالة لتحديد ما إذا كانت الفاتورة قابلة للتعديل
  const canEditInvoice = (invoice: Invoice) => {
    // يمكن تعديل الفواتير المكتملة والمعلقة فقط، ليس الملغاة
    return invoice.invoiceStatus === 1 || invoice.invoiceStatus === 2;
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        className: styles.dialogPaper
      }}
    >
      <DialogTitle className={styles.dialogTitle}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            {t("pos.newSales.todayOrdersPopup.title", { count: totalCount })}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent className={styles.dialogContent}>
        {/* شريط الفلاتر */}
        {/* <Box className={styles.filtersBar}>
          <TextField
            label="البحث"
            variant="outlined"
            size="small"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="البحث في الملاحظات أو رقم الطلب..."
            className={styles.searchField}
          />
          
          <FormControl size="small" className={styles.filterSelect}>
            <InputLabel>نوع الطلب</InputLabel>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as number | '')}
              label="نوع الطلب"
            >
              <MenuItem value="">{t("pos.newSales.todayOrdersPopup.all")}</MenuItem>
              <MenuItem value={1}>{t("pos.newSales.orderTypes.takeaway")}</MenuItem>
              <MenuItem value={2}>{t("pos.newSales.orderTypes.dineIn")}</MenuItem>
              <MenuItem value={3}>{t("pos.newSales.orderTypes.delivery")}</MenuItem>
              <MenuItem value={4}>{t("pos.newSales.orderTypes.pickup")}</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" className={styles.filterSelect}>
            <InputLabel>الحالة</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as number | '')}
              label="الحالة"
            >
              <MenuItem value="">{t("pos.newSales.todayOrdersPopup.all")}</MenuItem>
              <MenuItem value={1}>مكتملة</MenuItem>
              <MenuItem value={2}>معلقة</MenuItem>
              <MenuItem value={3}>ملغية</MenuItem>
            </Select>
          </FormControl>

          <Button
            startIcon={<ClearIcon />}
            onClick={clearFilters}
            variant="outlined"
            size="small"
          >
            مسح الفلاتر
          </Button>
        </Box> */}

        {/* عرض رسالة الخطأ */}
        {error && (
          <Alert 
            severity="error" 
            className={styles.errorAlert}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* الجدول */}
        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>{t("pos.newSales.todayOrdersPopup.invoiceCode")}</TableCell>
                <TableCell>{t("pos.newSales.todayOrdersPopup.type")}</TableCell>
                <TableCell>{t("pos.newSales.todayOrdersPopup.status")}</TableCell>
                <TableCell>{t("pos.newSales.todayOrdersPopup.creationDate")}</TableCell>
                <TableCell>{t("pos.newSales.todayOrdersPopup.lastUpdate")}</TableCell>
                <TableCell>{t("pos.newSales.todayOrdersPopup.totalAmount")}</TableCell>
                <TableCell>{t("pos.newSales.todayOrdersPopup.customer")}</TableCell>
                <TableCell>{t("pos.newSales.todayOrdersPopup.additionalInfo")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" className={styles.loadingCell}>
                    <CircularProgress size={40} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        {t("pos.newSales.messages.loadingData")}

                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" className={styles.emptyCell}>
                    <Typography variant="body1" color="text.secondary">
                        {t("pos.newSales.messages.noOrdersToShow")}

                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => {
                  const additionalInfo = getAdditionalInfo(invoice);
                  const isEditable = canEditInvoice(invoice);
                  
                  return (
                    <TableRow 
                      key={invoice.id} 
                      className={styles.tableRow}
                      onClick={() => handleViewOrder(invoice)}
                      style={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <Typography variant="body2" className={styles.invoiceId}>
                          #{invoice.backInvoiceCode || invoice.id.substring(0, 8) + '...'}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label={getInvoiceTypeText(invoice.invoiceType)}
                          size="small"
                          color={invoice.invoiceType === 1 ? 'success' : 
                                 invoice.invoiceType === 2 ? 'primary' : 
                                 invoice.invoiceType === 3 ? 'warning' : 
                                 invoice.invoiceType === 4 ? 'info' :
                                 invoice.invoiceType === 5 ? 'secondary' : 'default'}
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label={getInvoiceStatusText(invoice.invoiceStatus)}
                          size="small"
                          color={invoice.invoiceStatus === 1 ? 'info' : 
                                 invoice.invoiceStatus === 2 ? 'primary' : 
                                 invoice.invoiceStatus === 3 ? 'success' : 'default'}
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(invoice.createdAt)}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(invoice.completedAt)}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2" className={styles.totalAmount}>
                          {invoice.totalAfterTaxAndService.toFixed(2)} جنيه
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2">
                          {invoice.customerName || 
                           (invoice.customerId ? customers[invoice.customerId] : null) || 
                           '--'}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        {additionalInfo ? (
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              {additionalInfo.label}:
                            </Typography>
                            <Typography variant="body2">
                              {additionalInfo.value}
                            </Typography>
                          </Box>
                        ) : (
                          '--'
                        )}
                      </TableCell>
                      
                      {/* <TableCell align="center">
                        <VisibilityIcon 
                          className={`${styles.viewIcon} ${!isEditable ? styles.disabledViewIcon : ''}`}
                          title={isEditable ? "عرض وتعديل الطلب" : "عرض الطلب (غير قابل للتعديل)"}
                        />
                      </TableCell> */}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* عرض الصفحات */}
        {totalPages > 1 && (
          <Box className={styles.paginationContainer}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
              disabled={loading}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions className={styles.dialogActions}>
        <Button onClick={onClose} variant="outlined">
          إغلاق
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TodayOrdersPopup;
