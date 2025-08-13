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
    // حسب نوع الطلب
    switch (orderType) {
      case 'Takeaway': return 1;
      case 'Dine-in': return 2;
      case 'Delivery': return 3;
      case 'Pickup': return 4;
      default: return 1;
    }
  };

  const getWareHouseId = (): string => {
    // يمكن الحصول عليه من الإعدادات أو localStorage
    return localStorage.getItem('warehouse_id') || 'e81866c0-791d-449f-bc04-c5d65bb3820c';
  };

  const getRawBranchId = (): string => {
    return localStorage.getItem('branch_id') || 'branch_1';
  };

  const convertOrderItemToInvoiceItem = (item: OrderItem): invoicesApi.InvoiceItem => {
    return {
      ProductId: item.product.id,
      ProductPriceId: item.selectedPrice.id,
      Barcode: item.selectedPrice.barcode,
      UnitId: null,
      PosPriceName: item.selectedPrice.nameArabic,
      UnitFactor: 1,
      Qty: item.quantity,
      UnitPrice: item.selectedPrice.price,
      UnitCost: 0, // يمكن الحصول عليه من المنتج إذا كان متوفراً
      ItemDiscountPercentage: item.discountPercentage || 0,
      ItemTaxPercentage: 14, // يمكن جعله قابل للتخصيص
      ServicePercentage: 10, // يمكن جعله قابل للتخصيص
      WareHouseId: getWareHouseId(),
      Components: []
    };
  };

  const convertPaymentsToInvoicePayments = (payments: PaymentMethodData[]): invoicesApi.InvoicePayment[] => {
    return payments
      .filter(payment => payment.isSelected && payment.amount > 0)
      .map(payment => ({
        Amount: payment.amount,
        PaymentMethodId: payment.method.toLowerCase().includes('كاش') || 
                        payment.method.toLowerCase().includes('cash') ? 'cash' : 
                        payment.method.toLowerCase()
      }));
  };

  const createInvoice = async (
    orderSummary: OrderSummary,
    orderType: string,
    payments: PaymentMethodData[],
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
        InvoiceStatus: 1, // حالة نشطة
        WareHouseId: getWareHouseId(),
        RawBranchId: getRawBranchId(),
        CustomerId: selectedCustomer?.id || null,
        TableId: selectedTable?.table.id || null,
        HallCaptainId: null, // يمكن إضافته لاحقاً
        DeliveryCompanyId: selectedDeliveryCompany?.id || null,
        DeliveryAgentId: null, // يمكن إضافته لاحقاً
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

  return {
    createInvoice,
    isSubmitting
  };
};
