// File: src/utils/api/pagesApi/invoicesApi.ts
import api from '../../axios';

export interface InvoiceItem {
  notes: any;
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
  id?: string; // اختياري للـ items الموجودة
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
  id?: string; // اختياري للـ payments الموجودة
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

// Interface جديد للتحديث مع جميع الحقول المطلوبة
export interface UpdateInvoiceRequest {
  id: string;
  backInvoiceCode?: string | null;
  androidInvoiceCode?: string | null;
  InvoiceType: number;
  InvoiceStatus: number;
  WareHouseId: string;
  RawBranchId: string;
  CustomerId?: string | null;
  TableId?: string | null;
  HallCaptainId?: string | null;
  DeliveryCompanyId?: string | null;
  DeliveryAgentId?: string | null;
  CustomerName?: string | null;
  CustomerAddress?: string | null;
  TableGuestsCount?: number | null;
  ShiftCode?: string | null;
  DayCode?: string | null;
  ReturnShiftCode?: string | null;
  TaxPercentage: number;
  ServicePercentage: number;
  HeaderDiscountPercentage: number;
  ItemDiscountTotal?: number;
  HeaderDiscountValue?: number;
  TaxAmount?: number;
  ServiceAmount?: number;
  TotalBeforeDiscount?: number;
  TotalAfterDiscount?: number;
  TotalAfterTaxAndService?: number;
  TotalCost?: number;
  GrossProfit?: number;
  CreatedAt?: string;
  PrintedAt?: string | null;
  PreparedAt?: string;
  CompletedAt?: string;
  CreatedByUserId?: string | null;
  CancelledByUserId?: string | null;
  CancelReason?: string | null;
  RefundedAmount?: number | null;
  Notes?: string;
  Items: CreateInvoiceItem[];
  Payments: CreateInvoicePayment[];
  BranchId?: string | null;
  CompanyID?: string | null;
  IsActive?: boolean;
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
    console.log('📤 إرسال طلب إنشاء فاتورة جديدة:', invoiceData);
    const response = await api.post('/AddInvoice', invoiceData);
    console.log('📥 استجابة إنشاء الفاتورة:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ خطأ في إنشاء الفاتورة:', error);
    throw error;
  }
};

// دالة جلب فاتورة واحدة بالـ ID
export const getInvoiceById = async (invoiceId: string): Promise<Invoice> => {
  try {
    console.log('📤 طلب جلب الفاتورة:', invoiceId);
    const response = await api.get(`/GetInvoiceById?invoiceId=${invoiceId}`);
    console.log('📥 استجابة جلب الفاتورة:', response.data);
    
    if (response.data?.isvalid && response.data?.data) {
      return response.data.data;
    }
    throw new Error('Invoice not found');
  } catch (error) {
    console.error('❌ خطأ في جلب الفاتورة:', error);
    throw error;
  }
};

// دالة تحديث الفاتورة
export const updateInvoice = async (invoiceData: UpdateInvoiceRequest): Promise<InvoiceResponse> => {
  try {
    console.log('📤 إرسال طلب تحديث الفاتورة:', invoiceData);
    const response = await api.post('/UpdateInvoice', invoiceData);
    console.log('📥 استجابة تحديث الفاتورة:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ خطأ في تحديث الفاتورة:', error);
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
