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
  childrens?: InvoiceItem[]; // Added for extra/without items
  salesInvoiceItemType: number; // 1=Product, 2=Addition, 3=Without, 4=Optional
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
  /**
   * Identifier of the customer's selected address.  When present, the API
   * will also include a full `customerAddress` object with the details.
   */
  customerAddressId?: string | null;
  /**
   * Full address object for the invoice customer.  Only provided when
   * `customerAddressId` is not null.
   */
  customerAddress?: any;
  /**
   * Full customer object returned by the server.  Only provided when the
   * invoice is expanded via certain API calls.
   */
  customer?: any;
  deliveryAgentId?: string | null;
  deliveryCompanyId?: string | null;
  tableId?: string | null;
  hallCaptainId?: string | null;
  customerName?: string | null;
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
  Childrens?: CreateInvoiceItem[]; // Added for extra/without items
  SalesInvoiceItemType?: number; // 1=Product, 2=Addition, 3=Without, 4=Optional
   OfferId?: string | null;
  OfferGroupId?: string | null;

  /**
   * Share of the invoice‑wide discount applied to this item.  The API
   * expects the absolute value of the discount on each item when
   * `headerDiscountValue` is specified at the invoice level.  When
   * omitted the server assumes no invoice‑level discount was applied
   * to this line.  The corresponding percentage may be set to zero.
   */
  HeaderDiscountValue?: number;

  /**
   * Percentage of the invoice‑wide discount applied to this item.
   * Typically set to zero because the absolute discount amount is
   * provided in `HeaderDiscountValue`.  Included here for
   * completeness and future compatibility with API changes.
   */
  HeaderDiscountPercentage?: number;
}


// ✅ إضافة enum للوضوح
export enum SalesInvoiceItemType {
  Product = 1,
  Addition = 2,
  Without = 3,
  Optional = 4
}
export interface CreateInvoicePayment {
  id?: string; // اختياري للـ payments الموجودة
  Amount: number;
  PaymentMethodId: string;
}

export interface CreateInvoiceRequest {
  backInvoiceCode?: string | null;
  InvoiceType: number;
  InvoiceStatus: number;
  WareHouseId: string;
  RawBranchId: string;
  CustomerId?: string | null;
  TableId?: string | null;
  HallCaptainId?: string | null;
  DeliveryCompanyId?: string | null;
  DeliveryAgentId?: string | null;
  /**
   * Optional customer name.  When provided the API will store the human‑readable
   * name of the customer on the invoice.  This should mirror the selected
   * customer's `name` rather than packing it into the `Notes` field.
   */
  CustomerName?: string | null;
  /**
   * Identifier of the customer address to attach to the invoice.  Use the
   * `id` from the selected `CustomerAddress` object.  The API will then
   * resolve the full address on the server and populate `customerAddress`
   * in the response.
   */
  CustomerAddressId?: string | null;
  TaxPercentage: number;
  ServicePercentage: number;
  HeaderDiscountPercentage: number;
  /**
   * Absolute value of the discount applied to the entire invoice.  When
   * provided the API will store both the percentage and the amount for
   * auditing.  If omitted the server will derive the amount from the
   * percentage and the total.
   */
  HeaderDiscountValue?: number;
  PreparedAt?: string;
  CompletedAt?: string;
  Notes?: string;
  Items: CreateInvoiceItem[];
  Payments: CreateInvoicePayment[];
  // إضافة الحقول الجديدة لشركات التوصيل
  DocumentNumber?: string | null;
  DefaultPaymentMethod?: string | null;

  /**
   * Optional financial totals.  When provided the API will persist these
   * values directly rather than recalculating them from the items.
   * They mirror the fields present on UpdateInvoiceRequest.  If omitted
   * the server will compute them from the provided items and discounts.
   */
  TotalBeforeDiscount?: number;
  TotalAfterDiscount?: number;
  TotalAfterTaxAndService?: number;
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
  /**
   * Identifier of the customer address associated with this invoice.
   */
  CustomerAddressId?: string | null;
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
  // إضافة الحقول الجديدة لشركات التوصيل
  DocumentNumber?: string | null;
  DefaultPaymentMethod?: string | null;
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

// دالة جلب الطلبات قيد التحضير للتوصيل
export const getDeliveryInPrepareInvoices = async (): Promise<InvoicesResponse> => {
  try {
    const response = await api.get('/GetDeliveryInPrepareInvoices');
    
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
      pageNumber: 0,
      pageSize: 0,
      data: []
    };
  } catch (error) {
    console.error('Error fetching delivery prepare invoices:', error);
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

// دالة لإلغاء الفاتورة بالكامل
// تستدعي نقطة النهاية `CancelInvoice` مع معلمات الاستعلام اللازمة. يتوقع هذا
// الـ endpoint إرفاق معرف الفاتورة ومعرف المستخدم (اختياري) وسبب الإلغاء.
// تستخدم الدالة إتصال GET حيث أن غالبية نقاط نهاية النظام تعمل مع استعلامات GET.
// إذا تم تمرير معرف المستخدم فسيُضاف إلى السلسلة، أما إذا لم يُحدد فسيتم
// إهماله. يتم ترميز سبب الإلغاء لتجنب مشاكل الترميز في عنوان الـ URL.
export const cancelInvoice = async (
  invoiceId: string,
  userId: string | null = null,
  reason: string = ''
): Promise<any> => {
  try {
    // بناء عنوان الـ URL مع المعلمات. encodeURIComponent يضمن سلامة النص.
    let query = `/CancelInvoice?invoiceId=${invoiceId}`;
    if (userId) {
      query += `&userId=${userId}`;
    }
    // حتى لو لم يكن هناك سبب، نرسل حقل السبب ليتمكن الخادم من معالجته
    query += `&reason=${encodeURIComponent(reason)}`;
    console.log('📤 إرسال طلب إلغاء الفاتورة:', query);
    // يستخدم هذا الـ endpoint طريقة POST حتى لو كانت المعلمات في الاستعلام.
    // نرسل طلب POST إلى المسار بما في ذلك الاستعلام دون جسم إضافي.
    const response = await api.post(query);
    console.log('📥 استجابة إلغاء الفاتورة:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ خطأ في إلغاء الفاتورة:', error);
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
    case 5:
      return 'Delivery Company';
    default:
      return 'Unknown';
  }
};

// دالة مساعدة لتحويل حالة الفاتورة إلى نص
export const getInvoiceStatusText = (invoiceStatus: number): string => {
  switch (invoiceStatus) {
    case 1:
      return 'مرحلة التجهيز';
    case 2:
      return 'مرحلة التسليم';
    case 3:
      return 'تم الانتهاء';
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


// دالة جلب كود الفاتورة التالي
export const getNextInvoiceCode = async (posInvoiceType: number): Promise<number> => {
  try {
    const response = await api.get(`/GetNextInvoiceCode?PosInvoiceType=${posInvoiceType}`);
    if (response.data?.isvalid && response.data?.data) {
      return response.data.data;
    }
    throw new Error('Could not fetch next invoice code');
  } catch (error) {
    console.error('Error fetching next invoice code:', error);
    throw error;
  }
};


