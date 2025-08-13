// File: src/utils/api/pagesApi/invoicesApi.ts
import api from '../../axios';

export interface InvoiceItem {
  id: string;
  productId: string;
  productPriceId: string;
  barcode: string;
  unitId?: string | null;
  posPriceName: string;
  unitFactor: number;
  qty: number;
  unitPrice: number;
  unitCost: number;
  subTotal: number;
  total: number;
  wareHouseId: string;
  itemDiscountPercentage: number;
  itemDiscountValue: number;
  headerDiscountPercentage: number;
  headerDiscountValue: number;
  itemTaxPercentage: number;
  itemTaxAmount: number;
  servicePercentage: number;
  serviceValue: number;
  offerId?: string | null;
  offerGroupId?: string | null;
  parentLineId?: string | null;
  returnToStock: boolean;
  wasteOnReturn: boolean;
  components: any[];
  preparedQty: number;
  preparedAt?: string | null;
  deliveredQty: number;
  deliveredAt?: string | null;
  expectedPreparationDuration?: string | null;
  branchId?: string | null;
  companyID?: string | null;
  isActive: boolean;
}

export interface InvoicePayment {
  id: string;
  paymentMethodId: string;
  amount: number;
  transactionFees: number;
  safeOrAccountId?: string | null;
  deviceTransactionId?: string | null;
  paymentReference?: string | null;
  isRefunded: boolean;
  branchId?: string | null;
  companyID?: string | null;
  isActive: boolean;
}

export interface Invoice {
  id: string;
  backInvoiceCode?: string | null;
  androidInvoiceCode?: string | null;
  invoiceType: number;
  invoiceStatus: number;
  wareHouseId: string;
  rawBranchId: string;
  customerId?: string | null;
  deliveryAgentId?: string | null;
  deliveryCompanyId?: string | null;
  tableId?: string | null;
  hallCaptainId?: string | null;
  customerName?: string | null;
  customerAddress?: string | null;
  tableGuestsCount?: number | null;
  shiftCode?: string | null;
  dayCode?: string | null;
  returnShiftCode?: string | null;
  notes?: string;
  itemDiscountTotal: number;
  headerDiscountPercentage: number;
  headerDiscountValue: number;
  taxPercentage: number;
  taxAmount: number;
  servicePercentage: number;
  serviceAmount: number;
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  totalAfterTaxAndService: number;
  totalCost: number;
  grossProfit: number;
  createdAt: string;
  printedAt?: string | null;
  preparedAt: string;
  completedAt: string;
  createdByUserId?: string | null;
  cancelledByUserId?: string | null;
  cancelReason?: string | null;
  refundedAmount?: number | null;
  items: InvoiceItem[];
  payments: InvoicePayment[];
  branchId?: string | null;
  companyID?: string | null;
  isActive: boolean;
}

export interface InvoicesResponse {
  totalCount: number;
  pageCount: number;
  pageNumber: number;
  pageSize: number;
  data: Invoice[];
}

export interface CreateInvoiceItem {
  ProductId: string;
  ProductPriceId: string;
  Barcode: string;
  UnitId?: string | null;
  PosPriceName: string;
  UnitFactor: number;
  Qty: number;
  UnitPrice: number;
  UnitCost: number;
  ItemDiscountPercentage: number;
  ItemTaxPercentage: number;
  ServicePercentage: number;
  WareHouseId: string;
  Components: any[];
}

export interface CreateInvoicePayment {
  Amount: number;
  PaymentMethodId: string;
}

export interface CreateInvoiceRequest {
  InvoiceType: number;
  InvoiceStatus: number;
  WareHouseId: string;
  RawBranchId: string;
  CustomerId?: string | null;
  TableId?: string | null;
  HallCaptainId?: string | null;
  DeliveryCompanyId?: string | null;
  DeliveryAgentId?: string | null;
  TaxPercentage: number;
  ServicePercentage: number;
  HeaderDiscountPercentage: number;
  PreparedAt?: string;
  CompletedAt?: string;
  Notes?: string;
  Items: CreateInvoiceItem[];
  Payments: CreateInvoicePayment[];
}

export interface InvoiceResponse {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
}

// دالة جلب جميع الفواتير
export const getAllInvoices = async (pageNumber: number = 1, pageSize: number = 50): Promise<InvoicesResponse> => {
  try {
    const response = await api.get('/GetAllInvoices', {
      params: { pageNumber, pageSize }
    });
    
    if (response.data?.isvalid && response.data?.data) {
      return {
        totalCount: response.data.data.totalCount,
        pageCount: response.data.data.pageCount,
        pageNumber: response.data.data.pageNumber,
        pageSize: response.data.data.pageSize,
        data: response.data.data.data
      };
    }
    
    return {
      totalCount: 0,
      pageCount: 0,
      pageNumber: 1,
      pageSize: pageSize,
      data: []
    };
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};

// دالة إنشاء فاتورة جديدة
export const addInvoice = async (invoiceData: CreateInvoiceRequest): Promise<InvoiceResponse> => {
  try {
    const response = await api.post('/AddInvoice', invoiceData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

// دالة جلب فاتورة واحدة بالـ ID
export const getInvoiceById = async (invoiceId: string): Promise<Invoice> => {
  try {
    const response = await api.get(`/GetInvoiceById?invoiceId=${invoiceId}`);
    if (response.data?.isvalid && response.data?.data) {
      return response.data.data;
    }
    throw new Error('Invoice not found');
  } catch (error) {
    console.error('Error fetching invoice:', error);
    throw error;
  }
};

// دالة تحديث الفاتورة
export const updateInvoice = async (invoiceData: CreateInvoiceRequest & { invoiceId: string }): Promise<InvoiceResponse> => {
  try {
    const response = await api.post('/UpdateInvoice', invoiceData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw error;
  }
};

// دالة مساعدة لتحويل نوع الفاتورة إلى نص
export const getInvoiceTypeText = (invoiceType: number): string => {
  switch (invoiceType) {
    case 1:
      return 'Takeaway';
    case 2:
      return 'Dine-in';
    case 3:
      return 'Delivery';
    case 4:
      return 'Pickup';
    default:
      return 'Unknown';
  }
};

// دالة مساعدة لتحويل حالة الفاتورة إلى نص
export const getInvoiceStatusText = (invoiceStatus: number): string => {
  switch (invoiceStatus) {
    case 1:
      return 'مكتملة';
    case 2:
      return 'معلقة';
    case 3:
      return 'ملغية';
    default:
      return 'غير معروف';
  }
};

// دالة مساعدة لتنسيق التاريخ
export const formatDate = (dateString: string): string => {
  if (!dateString || dateString === '0001-01-01T00:00:00') {
    return '--';
  }
  
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};
