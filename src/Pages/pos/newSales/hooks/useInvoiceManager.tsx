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

export const useInvoiceManager = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useError();

  const getInvoiceType = (orderType: string): number => {
    switch (orderType) {
      case 'Takeaway': return 1;
      case 'Dine-in': return 2;
      case 'Delivery': return 3;
      case 'Pickup': return 4;
      default: return 1;
    }
  };

  const getWareHouseId = (): string => {
    return localStorage.getItem('warehouse_id') || 'e81866c0-791d-449f-bc04-c5d65bb3820c';
  };

  const getRawBranchId = (): string => {
    return localStorage.getItem('branch_id') || 'branch_1';
  };

  const convertOrderItemToInvoiceItem = (item: OrderItem): invoicesApi.CreateInvoiceItem => {
    const components: any[] = [];

    if (item.subItems && item.subItems.length > 0) {
      item.subItems.forEach(subItem => {
        components.push({
          id: subItem.id,
          name: subItem.name,
          quantity: subItem.quantity,
          extraPrice: subItem.type === 'without' ? 0 : subItem.price,
          price: subItem.price,
          type: subItem.type,
          groupId: subItem.groupId,
          isRequired: subItem.isRequired || false,
          isCommentOnly: false,
          useOriginalPrice: false,
          sortOrder: 0,
          WareHouseId: localStorage.getItem('warehouse_id') || 'e81866c0-791d-449f-bc04-c5d65bb3820c',
          ComponentName: subItem.name,
          ProductComponentId: subItem.productId || item.product.id
        });
      });
    }

    if (item.selectedOptions && item.selectedOptions.length > 0) {
      item.selectedOptions.forEach(option => {
        components.push({
          id: option.itemId,
          name: option.itemName,
          quantity: option.quantity,
          extraPrice: option.extraPrice,
          price: option.extraPrice,
          type: 'option',
          groupId: option.groupId,
          isCommentOnly: option.isCommentOnly,
          isRequired: false,
          useOriginalPrice: false,
          sortOrder: 0,
          WareHouseId: localStorage.getItem('warehouse_id') || 'e81866c0-791d-449f-bc04-c5d65bb3820c',
          ComponentName: option.itemName,
          ProductComponentId: item.product.id
        });
      });
    }

    return {
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
      ItemTaxPercentage: 14,
      ServicePercentage: 10,
      WareHouseId: localStorage.getItem('warehouse_id') || 'e81866c0-791d-449f-bc04-c5d65bb3820c',
      Components: components
    };
  };


const convertPaymentsToInvoicePayments = (payments: PaymentMethodData[]): invoicesApi.CreateInvoicePayment[] => {
  // ✅ إذا لم توجد طرق دفع، أرجع مصفوفة فارغة
  if (!payments || payments.length === 0) {
    return [];
  }
  
  return payments
    .filter(payment => payment.isSelected && payment.amount > 0)
    .map(payment => ({
      Amount: payment.amount,
      PaymentMethodId: payment.method.toLowerCase().includes('كاش') || 
                      payment.method.toLowerCase().includes('cash') ? 'cash' : 
                      payment.method.toLowerCase()
    }));
};

  // دالة إنشاء فاتورة جديدة مع دعم اختيار الحالة
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
    notes?: string
  ): Promise<invoicesApi.InvoiceResponse> => {
    setIsSubmitting(true);

    try {
      const invoiceData: invoicesApi.CreateInvoiceRequest = {
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
        Items: orderSummary.items.map(convertOrderItemToInvoiceItem),
        Payments: convertPaymentsToInvoicePayments(payments)
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

  // دالة تحديث فاتورة موجودة مع دعم اختيار الحالة
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
  notes?: string
): Promise<invoicesApi.InvoiceResponse> => {
  setIsSubmitting(true);

  try {
    console.log('🔄 بدء تحديث الفاتورة:', invoiceId);
    
    // ✅ استخدام id بدلاً من invoiceId
    const updateData: invoicesApi.CreateInvoiceRequest & { id: string } = {
      id: invoiceId, // ✅ مُصحح: id بدلاً من invoiceId
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
      Notes: notes || `طلب ${orderType} - تم التحديث`,
      Items: orderSummary.items.map(convertOrderItemToInvoiceItem),
      Payments: convertPaymentsToInvoicePayments(payments)
    };

    console.log('📤 بيانات التحديث المرسلة:', updateData);
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

  // دالة موحدة للإنشاء والتحديث مع دعم اختيار الحالة
  const saveInvoice = async (
    orderSummary: OrderSummary,
    orderType: string,
    payments: PaymentMethodData[],
    invoiceStatus: number, // أجباري هنا
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
      notes
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
        notes
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
        notes
      );
    }
  };

  return {
    createInvoice,
    updateInvoice,
    saveInvoice,
    isSubmitting
  };
};
