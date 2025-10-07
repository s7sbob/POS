// File: src/Pages/pos/newSales/hooks/useInvoiceManager.tsx
import { useState } from 'react';
import { OrderSummary, OrderItem } from '../types/PosSystem';
import { Customer, CustomerAddress } from 'src/utils/api/pagesApi/customersApi';
import { DeliveryCompany } from 'src/utils/api/pagesApi/deliveryCompaniesApi';
import { TableSelection } from '../types/TableSystem';
import * as invoicesApi from '../../../../utils/api/pagesApi/invoicesApi';
import { useError } from '../../../../contexts/ErrorContext';

interface PaymentMethodData {
  method: string;
  amount: number;
  isSelected: boolean;
}

// Interface محسن لتخزين بيانات الفاتورة الأصلية
interface ExistingInvoiceData {
  originalInvoice: invoicesApi.Invoice;
}

export const useInvoiceManager = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingInvoiceData, setExistingInvoiceData] = useState<ExistingInvoiceData | null>(null);
  const [nextInvoiceCode, setNextInvoiceCode] = useState<number | null>(null);
  const { showSuccess, showError } = useError();

  const fetchNextInvoiceCode = async (invoiceType: number) => {
    try {
      const code = await invoicesApi.getNextInvoiceCode(invoiceType);
      setNextInvoiceCode(code);
      return code;
    } catch (error) {
      console.error("Error fetching next invoice code:", error);
      showError("خطأ في جلب رقم الفاتورة التالي");
      return null;
    }
  };

  const getInvoiceType = (orderType: string): number => {
    switch (orderType) {
      case 'Takeaway': return 1;
      case 'Dine-in': return 2;
      case 'Delivery': return 3;
      case 'Pickup': return 4;
      case 'DeliveryCompany': return 5;
      default: return 1;
    }
  };

const getWareHouseId = (): string => {
  const warehouseId = localStorage.getItem('warehouse_id');
  
  if (!warehouseId) {
    console.warn('⚠️ لا يوجد warehouse_id في localStorage! تأكد من إعداد defWareHouse للفرع.');
    // يمكنك رمي خطأ هنا أو إرجاع قيمة افتراضية مؤقتة
    throw new Error('لم يتم تحديد المخزن الافتراضي للفرع. يرجى التواصل مع الإدارة.');
  }
  
  return warehouseId;
};


  const getRawBranchId = (): string => {
    return localStorage.getItem('branch_id') || 'branch_1';
  };

  // دالة تحميل بيانات الفاتورة الأصلية
  const loadExistingInvoice = async (invoiceId: string) => {
    try {
      console.log('🔄 تحميل بيانات الفاتورة الموجودة:', invoiceId);
      const invoiceData = await invoicesApi.getInvoiceById(invoiceId);
      
      setExistingInvoiceData({
        originalInvoice: invoiceData
      });

      console.log('✅ تم تحميل بيانات الفاتورة الموجودة بنجاح');
      console.log(`📊 Items موجودة: ${invoiceData.items?.length || 0}`);
      console.log(`💳 Payments موجودة: ${invoiceData.payments?.length || 0}`);
      
      return invoiceData;
    } catch (error) {
      console.error('❌ خطأ في تحميل بيانات الفاتورة الموجودة:', error);
      throw error;
    }
  };

  // دالة تحويل عنصر الطلب إلى عنصر فاتورة
// تحديث دالة convertOrderItemToInvoiceItem لتشمل العروض
const convertOrderItemToInvoiceItem = (
  item: OrderItem, 
  existingItem?: invoicesApi.InvoiceItem
): invoicesApi.CreateInvoiceItem => {
  const childrens: invoicesApi.CreateInvoiceItem[] = [];
  
  // ✅ معالجة العروض
  if (item.isOfferItem && item.selectedOfferItems) {
    item.selectedOfferItems.forEach(offerItem => {
      childrens.push({
        ProductId: item.product.id, // يمكن تحسينه للحصول على ProductId الحقيقي
        ProductPriceId: offerItem.productPriceId,
        Barcode: '1234567890123',
        UnitId: null,
        PosPriceName: offerItem.productName,
        UnitFactor: 1,
        Qty: offerItem.quantity,
        UnitPrice: offerItem.price / offerItem.quantity,
        UnitCost: 0,
        ItemDiscountPercentage: 0,
        ItemTaxPercentage: 0,
        ServicePercentage: 0,
        WareHouseId: getWareHouseId(),
        Components: [],
        SalesInvoiceItemType: invoicesApi.SalesInvoiceItemType.Product,
        // إضافة بيانات العرض
        OfferId: item.offerId,
        OfferGroupId: offerItem.groupId
      });
    });
  }
  
  // معالجة الـ subItems كـ Childrens (الكود الموجود)
  if (item.subItems && item.subItems.length > 0) {
    item.subItems.forEach(subItem => {
      childrens.push({
        ProductId: subItem.productId || item.product.id,
        ProductPriceId: item.selectedPrice.id,
        Barcode: item.selectedPrice.barcode || '1234567890123',
        UnitId: null,
        PosPriceName: subItem.name,
        UnitFactor: 1,
        Qty: subItem.quantity,
        UnitPrice: subItem.type === 'without' ? 0 : subItem.price / subItem.quantity,
        UnitCost: 0,
        ItemDiscountPercentage: 0,
        ItemTaxPercentage: 0,
        ServicePercentage: 0,
        WareHouseId: getWareHouseId(),
        Components: [],
        SalesInvoiceItemType: subItem.type === 'without' ? 
          invoicesApi.SalesInvoiceItemType.Without :
          invoicesApi.SalesInvoiceItemType.Addition
      });
    });
  }

  // معالجة الـ selectedOptions كـ Childrens (الكود الموجود)
  if (item.selectedOptions && item.selectedOptions.length > 0) {
    item.selectedOptions.forEach(option => {
      childrens.push({
        ProductId: item.product.id,
        ProductPriceId: item.selectedPrice.id,
        Barcode: item.selectedPrice.barcode || '1234567890123',
        UnitId: null,
        PosPriceName: option.itemName,
        UnitFactor: 1,
        Qty: option.quantity,
        UnitPrice: option.extraPrice / option.quantity,
        UnitCost: 0,
        ItemDiscountPercentage: 0,
        ItemTaxPercentage: 0,
        ServicePercentage: 0,
        WareHouseId: getWareHouseId(),
        Components: [],
        SalesInvoiceItemType: invoicesApi.SalesInvoiceItemType.Optional
      });
    });
  }

  const invoiceItem: invoicesApi.CreateInvoiceItem = {
    ProductId: item.product.id,
    ProductPriceId: item.selectedPrice.id,
    Barcode: item.selectedPrice.barcode || '1234567890123',
    UnitId: null,
    PosPriceName: item.selectedPrice.nameArabic,
    UnitFactor: 1,
    Qty: item.quantity,
    UnitPrice: item.selectedPrice.price,
    UnitCost: 45,
    ItemDiscountPercentage: item.discountPercentage || 0,
    ItemTaxPercentage: 0,
    ServicePercentage: 0,
    WareHouseId: getWareHouseId(),
    Components: [],
    Childrens: childrens.length > 0 ? childrens : undefined,
    SalesInvoiceItemType: invoicesApi.SalesInvoiceItemType.Product,
    // إضافة معرف العرض للمنتج الرئيسي
    OfferId: item.offerId || null,
    OfferGroupId: null // المنتج الرئيسي للعرض لا يكون له offerGroupId
  };

  if (existingItem) {
    (invoiceItem as any).id = existingItem.id;
  }

  return invoiceItem;
};


  // دالة تحويل طرق الدفع
  const convertPaymentsToInvoicePayments = (
    payments: PaymentMethodData[],
    originalPayments?: invoicesApi.InvoicePayment[]
  ): invoicesApi.CreateInvoicePayment[] => {
    if (!payments || payments.length === 0) {
      return [];
    }
    
    return payments
      .filter(payment => payment.isSelected && payment.amount > 0)
      .map(payment => {
        const paymentMethodId = payment.method.toLowerCase().includes('كاش') || 
                              payment.method.toLowerCase().includes('cash') ? 'cash' : 
                              payment.method.toLowerCase();

        // البحث عن الدفعة الأصلية المطابقة
        const existingPayment = originalPayments?.find(p => p.paymentMethodId === paymentMethodId);

        const invoicePayment: invoicesApi.CreateInvoicePayment = {
          Amount: payment.amount,
          PaymentMethodId: paymentMethodId
        };

        if (existingPayment) {
          (invoicePayment as any).id = existingPayment.id;
          console.log(`🔄 تحديث payment موجود: ${paymentMethodId} -> ID: ${existingPayment.id}`);
        } else {
          console.log(`✨ إضافة payment جديد: ${paymentMethodId}`);
        }

        return invoicePayment;
      });
  };

  // دالة إنشاء فاتورة جديدة
  const createInvoice = async (
    orderSummary: OrderSummary,
    orderType: string,
    payments: PaymentMethodData[],
    invoiceStatus: number,
    selectedCustomer?: Customer | null,
    selectedAddress?: CustomerAddress | null,
    selectedDeliveryCompany?: DeliveryCompany | null,
    selectedTable?: TableSelection | null,
    servicePercentage: number = 0,
    taxPercentage: number = 0,
    discountPercentage: number = 0,
    notes?: string,
    // إضافة الحقول الجديدة
    documentNumber?: string | null,
    defaultPaymentMethod?: string | null
  ): Promise<invoicesApi.InvoiceResponse> => {
    setIsSubmitting(true);

    try {
      const invoiceData: invoicesApi.CreateInvoiceRequest = {
        backInvoiceCode: null, // استخدام الكود الجديد من الـ API
        InvoiceType: getInvoiceType(orderType),
        InvoiceStatus: invoiceStatus,
        WareHouseId: getWareHouseId(),
        RawBranchId: getRawBranchId(),
        CustomerId: selectedCustomer?.id || null,
        TableId: selectedTable?.table.id || null,
        HallCaptainId: null,
        DeliveryCompanyId: selectedDeliveryCompany?.id || null,
        DeliveryAgentId: null,
        TaxPercentage: taxPercentage,
        ServicePercentage: servicePercentage,
        HeaderDiscountPercentage: discountPercentage,
        PreparedAt: new Date().toISOString(),
        CompletedAt: new Date().toISOString(),
        Notes: notes || `طلب ${orderType}`,
        Items: orderSummary.items.map(item => convertOrderItemToInvoiceItem(item)),
        Payments: convertPaymentsToInvoicePayments(payments),
        // إضافة الحقول الجديدة
        DocumentNumber: documentNumber,
        DefaultPaymentMethod: defaultPaymentMethod
      };

      const result = await invoicesApi.addInvoice(invoiceData);
      showSuccess(`تم إنشاء الفاتورة رقم ${result.invoiceNumber} بنجاح`);
      return result;
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      let errorMessage = 'حدث خطأ أثناء إنشاء الفاتورة';

      if (error.isApiValidationError && error.errors) {
        errorMessage = error.errors.map((err: any) => err.errorMessage).join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }

      showError(errorMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // دالة البحث عن عنصر مطابق في الفاتورة الأصلية
  const findMatchingOriginalItem = (
    orderItem: OrderItem,
    originalItems: invoicesApi.InvoiceItem[]
  ): invoicesApi.InvoiceItem | undefined => {
    return originalItems.find(originalItem => 
      originalItem.productId === orderItem.product.id && 
      originalItem.productPriceId === orderItem.selectedPrice.id
    );
  };

  // دالة تحديث فاتورة موجودة - الحل الجذري
  const updateInvoice = async (
    invoiceId: string,
    orderSummary: OrderSummary,
    orderType: string,
    payments: PaymentMethodData[],
    invoiceStatus: number,
    selectedCustomer?: Customer | null,
    selectedAddress?: CustomerAddress | null,
    selectedDeliveryCompany?: DeliveryCompany | null,
    selectedTable?: TableSelection | null,
    servicePercentage: number = 0,
    taxPercentage: number = 0,
    discountPercentage: number = 0,
    notes?: string,
    /**
     * Whether to preserve items from the original invoice that are not
     * present in the current order summary.  Default true; pass false
     * when you want to remove missing items (e.g. split receipt).
     */
    preserveMissingItems: boolean = true,
    // إضافة الحقول الجديدة
    documentNumber?: string | null,
    defaultPaymentMethod?: string | null
  ): Promise<invoicesApi.InvoiceResponse> => {
    setIsSubmitting(true);

    try {
      console.log('🔄 بدء تحديث الفاتورة:', invoiceId);
      
      // تحميل بيانات الفاتورة الأصلية إذا لم تكن محملة
      let originalInvoice = existingInvoiceData?.originalInvoice;
      if (!originalInvoice || originalInvoice.id !== invoiceId) {
        originalInvoice = await loadExistingInvoice(invoiceId);
      }

      // ✅ بناء قائمة Items شاملة - الحل الصحيح
      const allItems: invoicesApi.CreateInvoiceItem[] = [];
      
      // خريطة لتتبع العناصر المعالجة من الواجهة
      const processedItemsKeys = new Set<string>();

      // 1. معالجة العناصر من الواجهة الحالية
      orderSummary.items.forEach(currentItem => {
        const itemKey = `${currentItem.product.id}-${currentItem.selectedPrice.id}`;
        processedItemsKeys.add(itemKey);
        
        // البحث عن العنصر في الفاتورة الأصلية
        const matchingOriginalItem = findMatchingOriginalItem(currentItem, originalInvoice.items || []);
        
        // تحويل العنصر مع الاحتفاظ بالـ ID إذا كان موجود
        const invoiceItem = convertOrderItemToInvoiceItem(currentItem, matchingOriginalItem);
        allItems.push(invoiceItem);
      });

      // 2. إضافة العناصر الأصلية التي لم تعد موجودة في الواجهة (اختياري)
      if (preserveMissingItems) {
        originalInvoice.items?.forEach(originalItem => {
          const itemKey = `${originalItem.productId}-${originalItem.productPriceId}`;
          
          // إذا لم يتم معالجة هذا العنصر من الواجهة، احتفظ به
          if (!processedItemsKeys.has(itemKey)) {
            const preservedItem: invoicesApi.CreateInvoiceItem = {
              id: originalItem.id, // ✅ الـ ID الأصلي مهم جداً
              ProductId: originalItem.productId,
              ProductPriceId: originalItem.productPriceId,
              Barcode: originalItem.barcode,
              UnitId: originalItem.unitId,
              PosPriceName: originalItem.posPriceName,
              UnitFactor: originalItem.unitFactor,
              Qty: originalItem.qty,
              UnitPrice: originalItem.unitPrice,
              UnitCost: originalItem.unitCost,
              ItemDiscountPercentage: originalItem.itemDiscountPercentage,
              ItemTaxPercentage: originalItem.itemTaxPercentage,
              ServicePercentage: originalItem.servicePercentage,
              WareHouseId: originalItem.wareHouseId,
              Components: originalItem.components || [],
            };
            allItems.push(preservedItem);
            console.log(`🔒 الاحتفاظ بعنصر أصلي: ${originalItem.id} (${originalItem.posPriceName})`);
          }
        });
      }

      // ✅ معالجة المدفوعات بنفس الطريقة
      const allPayments = convertPaymentsToInvoicePayments(payments, originalInvoice.payments || []);

      // إضافة المدفوعات الأصلية التي لم تعد موجودة في الواجهة
      originalInvoice.payments?.forEach(originalPayment => {
        const existsInCurrentPayments = payments?.some(currentPayment => {
          const currentMethodId = currentPayment.method.toLowerCase().includes('كاش') || 
                                 currentPayment.method.toLowerCase().includes('cash') ? 'cash' : 
                                 currentPayment.method.toLowerCase();
          return currentMethodId === originalPayment.paymentMethodId && 
                 currentPayment.isSelected && 
                 currentPayment.amount > 0;
        });

        if (!existsInCurrentPayments) {
          const preservedPayment: invoicesApi.CreateInvoicePayment = {
            id: originalPayment.id,
            Amount: originalPayment.amount,
            PaymentMethodId: originalPayment.paymentMethodId
          };
          allPayments.push(preservedPayment);
          console.log(`🔒 الاحتفاظ بدفعة أصلية: ${originalPayment.id} (${originalPayment.paymentMethodId})`);
        }
      });

      // ✅ بناء طلب التحديث الشامل
      const updateData: invoicesApi.UpdateInvoiceRequest = {
        id: invoiceId,
        backInvoiceCode: originalInvoice.backInvoiceCode,
        androidInvoiceCode: originalInvoice.androidInvoiceCode,
        InvoiceType: getInvoiceType(orderType),
        InvoiceStatus: invoiceStatus,
        WareHouseId: originalInvoice.wareHouseId,
        RawBranchId: originalInvoice.rawBranchId,
        CustomerId: selectedCustomer?.id || originalInvoice.customerId,
        TableId: selectedTable?.table.id || originalInvoice.tableId,
        HallCaptainId: originalInvoice.hallCaptainId,
        DeliveryCompanyId: selectedDeliveryCompany?.id || originalInvoice.deliveryCompanyId,
        DeliveryAgentId: originalInvoice.deliveryAgentId,
        CustomerName: selectedCustomer?.name || originalInvoice.customerName,
        CustomerAddress: selectedAddress?.addressLine || originalInvoice.customerAddress,
        TableGuestsCount: originalInvoice.tableGuestsCount,
        ShiftCode: originalInvoice.shiftCode,
        DayCode: originalInvoice.dayCode,
        ReturnShiftCode: originalInvoice.returnShiftCode,
        TaxPercentage: taxPercentage,
        ServicePercentage: servicePercentage,
        HeaderDiscountPercentage: discountPercentage,
        ItemDiscountTotal: originalInvoice.itemDiscountTotal,
        HeaderDiscountValue: originalInvoice.headerDiscountValue,
        TaxAmount: originalInvoice.taxAmount,
        ServiceAmount: originalInvoice.serviceAmount,
        TotalBeforeDiscount: orderSummary.subtotal,
        TotalAfterDiscount: orderSummary.total,
        TotalAfterTaxAndService: orderSummary.total,
        TotalCost: originalInvoice.totalCost,
        GrossProfit: originalInvoice.grossProfit,
        CreatedAt: originalInvoice.createdAt,
        PrintedAt: originalInvoice.printedAt,
        PreparedAt: originalInvoice.preparedAt,
        CompletedAt: invoiceStatus === 3 ? new Date().toISOString() : originalInvoice.completedAt,
        CreatedByUserId: originalInvoice.createdByUserId,
        CancelledByUserId: originalInvoice.cancelledByUserId,
        CancelReason: originalInvoice.cancelReason,
        RefundedAmount: originalInvoice.refundedAmount,
        Notes: notes || originalInvoice.notes,
        Items: allItems,  // ✅ كل العناصر (الأصلية + الجديدة + المحدثة)
        Payments: allPayments,  // ✅ كل المدفوعات (الأصلية + الجديدة + المحدثة)
        BranchId: originalInvoice.branchId,
        CompanyID: originalInvoice.companyID,
        IsActive: originalInvoice.isActive,
        // إضافة الحقول الجديدة
        DocumentNumber: documentNumber,
        DefaultPaymentMethod: defaultPaymentMethod
      };

      console.log('📤 إرسال بيانات التحديث الشاملة:');
      console.log(`📊 إجمالي Items: ${allItems.length}`);
      console.log(`   - محدثة/موجودة: ${allItems.filter(i => (i as any).id).length}`);
      console.log(`   - جديدة: ${allItems.filter(i => !(i as any).id).length}`);
      console.log(`💳 إجمالي Payments: ${allPayments.length}`);
      console.log(`   - محدثة/موجودة: ${allPayments.filter(p => (p as any).id).length}`);
      console.log(`   - جديدة: ${allPayments.filter(p => !(p as any).id).length}`);
      
      const result = await invoicesApi.updateInvoice(updateData);
      console.log('✅ تم تحديث الفاتورة بنجاح:', result);

      showSuccess(`تم تحديث الفاتورة رقم ${result.invoiceNumber} بنجاح`);
      return result;

    } catch (error: any) {
      console.error('❌ خطأ في تحديث الفاتورة:', error);
      let errorMessage = 'حدث خطأ أثناء تحديث الفاتورة';

      if (error.isApiValidationError && error.errors) {
        errorMessage = error.errors.map((err: any) => err.errorMessage).join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }

      showError(errorMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // دالة موحدة للإنشاء والتحديث
  /**
   * Create or update an invoice.  When updating an existing invoice the default
   * behaviour is to preserve any items/payments present on the original invoice
   * that are not present in the current order summary.  For certain workflows
   * (e.g. splitting a cheque) you may want to remove missing items entirely.
   * To do so, pass preserveMissingItems: false in the options.
   */
  const saveInvoice = async (
    orderSummary: OrderSummary,
    orderType: string,
    payments: PaymentMethodData[],
    invoiceStatus: number,
    options: {
      isEditMode?: boolean;
      invoiceId?: string | null;
      selectedCustomer?: Customer | null;
      selectedAddress?: CustomerAddress | null;
      selectedDeliveryCompany?: DeliveryCompany | null;
      selectedTable?: TableSelection | null;
      servicePercentage?: number;
      taxPercentage?: number;
      discountPercentage?: number;
      notes?: string;
      /**
       * Determines whether missing items from the original invoice should be
       * preserved in the update.  Defaults to true.  Set to false when you
       * want the update to send only the items in orderSummary (e.g. when
       * splitting a cheque and removing items from the original invoice).
       */
      preserveMissingItems?: boolean;
      // إضافة الحقول الجديدة
      documentNumber?: string | null;
      defaultPaymentMethod?: string | null;
    } = {}
  ): Promise<invoicesApi.InvoiceResponse> => {
    const {
      isEditMode = false,
      invoiceId = null,
      selectedCustomer = null,
      selectedAddress = null,
      selectedDeliveryCompany = null,
      selectedTable = null,
      servicePercentage = 0,
      taxPercentage = 0,
      discountPercentage = 0,
      notes,
      preserveMissingItems = true,
      documentNumber = null,
      defaultPaymentMethod = null
    } = options;

    if (isEditMode && invoiceId) {
      return await updateInvoice(
        invoiceId,
        orderSummary,
        orderType,
        payments,
        invoiceStatus,
        selectedCustomer,
        selectedAddress,
        selectedDeliveryCompany,
        selectedTable,
        servicePercentage,
        taxPercentage,
        discountPercentage,
        notes,
        preserveMissingItems,
        documentNumber,
        defaultPaymentMethod
      );
    } else {
      return await createInvoice(
        orderSummary,
        orderType,
        payments,
        invoiceStatus,
        selectedCustomer,
        selectedAddress,
        selectedDeliveryCompany,
        selectedTable,
        servicePercentage,
        taxPercentage,
        discountPercentage,
        notes,
        documentNumber,
        defaultPaymentMethod
      );
    }
  };

  // تنظيف البيانات عند الانتهاء
  const clearExistingInvoiceData = () => {
    setExistingInvoiceData(null);
    console.log('🧹 تم تنظيف بيانات الفاتورة الموجودة');
  };  return {
    saveInvoice,
    isSubmitting,
    loadExistingInvoice,
    updateInvoice,
    clearExistingInvoiceData,
    nextInvoiceCode,
    fetchNextInvoiceCode
  };
};
