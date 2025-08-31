import { useCallback } from 'react';
import { usePrinterManager } from './usePrinterManager';
import { InvoicePrinter, InvoiceData } from '../utils/invoicePrinter';

export const useInvoicePrinter = () => {
  const { 
    defaultPrinter, 
    printWithDefaultPrinter, 
    printWithSpecificPrinter,
    hasDefaultPrinter,
    getAvailablePrinters 
  } = usePrinterManager();

  // Print invoice with default printer
  const printInvoice = useCallback(async (invoiceData: InvoiceData, log?: (message: string) => void) => {
    log?.('بدء طباعة الفاتورة باستخدام الطابعة الافتراضية...');
    if (!hasDefaultPrinter()) {
      log?.('خطأ: لا توجد طابعة افتراضية محددة.');
      throw new Error('لا توجد طابعة افتراضية محددة. يرجى تكوين طابعة من الإعدادات.');
    }

    if (!defaultPrinter) {
      log?.('خطأ: بيانات الطابعة الافتراضية غير متوفرة.');
      throw new Error('خطأ في تحميل بيانات الطابعة الافتراضية');
    }

    log?.(`الطابعة الافتراضية: ${defaultPrinter.name} (${defaultPrinter.type})`);
    const printer = new InvoicePrinter(defaultPrinter); // إزالة معامل log
    const result = await printer.printInvoice(invoiceData);
    if (result.success) {
      log?.('تم إرسال بيانات الفاتورة إلى الطابعة بنجاح.');
    } else {
      log?.(`فشل إرسال بيانات الفاتورة: ${result.error}`);
    }
    return result;
  }, [defaultPrinter, hasDefaultPrinter]);

  // Print invoice with specific printer
  const printInvoiceWithPrinter = useCallback(async (printerId: string, invoiceData: InvoiceData, log?: (message: string) => void) => {
    log?.(`بدء طباعة الفاتورة باستخدام الطابعة ${printerId}...`);
    const printers = getAvailablePrinters();
    const printer = printers.find(p => p.id === printerId);
    
    if (!printer) {
      log?.(`خطأ: الطابعة المحددة (${printerId}) غير موجودة.`);
      throw new Error('الطابعة المحددة غير موجودة');
    }

    log?.(`الطابعة المختارة: ${printer.name} (${printer.type})`);
    const invoicePrinter = new InvoicePrinter(printer); // إزالة معامل log
    const result = await invoicePrinter.printInvoice(invoiceData);
    if (result.success) {
      log?.('تم إرسال بيانات الفاتورة إلى الطابعة بنجاح.');
    } else {
      log?.(`فشل إرسال بيانات الفاتورة: ${result.error}`);
    }
    return result;
  }, [getAvailablePrinters]);

  // Convert order summary to invoice data
  const convertOrderToInvoice = useCallback((orderSummary: any, additionalData: any = {}): InvoiceData => {
    const now = new Date();
    
    return {
      invoiceNumber: additionalData.invoiceNumber || `INV-${Date.now()}`,
      date: now.toLocaleDateString('ar-EG'),
      time: now.toLocaleTimeString('ar-EG'),
      customerName: additionalData.customerName || orderSummary.customerName,
      customerPhone: additionalData.customerPhone || orderSummary.customerPhone,
      items: orderSummary.items?.map((item: any) => ({
        name: item.name || item.productName,
        quantity: item.quantity || 1,
        price: item.price || item.unitPrice || 0,
        total: item.total || (item.quantity * item.price) || 0
      })) || [],
      subtotal: orderSummary.subtotal || 0,
      tax: orderSummary.tax || 0,
      discount: orderSummary.discount || 0,
      total: orderSummary.total || orderSummary.grandTotal || 0,
      paymentMethod: additionalData.paymentMethod || 'نقدي',
      cashier: additionalData.cashier || localStorage.getItem('user_name') || 'غير محدد',
      notes: additionalData.notes || orderSummary.notes
    };
  }, []);

  // Print order summary directly
  const printOrderSummary = useCallback(async (orderSummary: any, additionalData: any = {}, log?: (message: string) => void) => {
    log?.('تحويل ملخص الطلب إلى بيانات فاتورة...');
    const invoiceData = convertOrderToInvoice(orderSummary, additionalData);
    return await printInvoice(invoiceData, log);
  }, [convertOrderToInvoice, printInvoice]);

  // Test print with default printer
  const testPrint = useCallback(async (log?: (message: string) => void) => {
    log?.('إعداد فاتورة اختبار...');
    const testInvoice: InvoiceData = {
      invoiceNumber: 'TEST-001',
      date: new Date().toLocaleDateString('ar-EG'),
      time: new Date().toLocaleTimeString('ar-EG'),
      customerName: 'عميل تجريبي',
      items: [
        {
          name: 'منتج تجريبي',
          quantity: 1,
          price: 10.00,
          total: 10.00
        }
      ],
      subtotal: 10.00,
      tax: 0.00,
      discount: 0.00,
      total: 10.00,
      paymentMethod: 'نقدي',
      cashier: 'كاشير تجريبي',
      notes: 'هذه فاتورة تجريبية لاختبار الطباعة'
    };

    return await printInvoice(testInvoice, log);
  }, [printInvoice]);

  return {
    printInvoice,
    printInvoiceWithPrinter,
    printOrderSummary,
    convertOrderToInvoice,
    testPrint,
    hasDefaultPrinter,
    defaultPrinter,
    availablePrinters: getAvailablePrinters()
  };
};
