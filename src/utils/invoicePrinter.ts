import { Printer } from '../types/printer';

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  time: string;
  customerName?: string;
  customerPhone?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  cashier?: string;
  notes?: string;
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export class InvoicePrinter {
  private printer: Printer;

  constructor(printer: Printer) {
    this.printer = printer;
  }

  // Generate invoice content for thermal printing
  generateInvoiceContent(invoice: InvoiceData): string {
    const lines: string[] = [];
    
    // Header
    lines.push('='.repeat(32));
    lines.push('        فاتورة مبيعات');
    lines.push('='.repeat(32));
    lines.push('');
    
    // Invoice details
    lines.push(`رقم الفاتورة: ${invoice.invoiceNumber}`);
    lines.push(`التاريخ: ${invoice.date}`);
    lines.push(`الوقت: ${invoice.time}`);
    
    if (invoice.customerName) {
      lines.push(`العميل: ${invoice.customerName}`);
    }
    
    if (invoice.customerPhone) {
      lines.push(`الهاتف: ${invoice.customerPhone}`);
    }
    
    if (invoice.cashier) {
      lines.push(`الكاشير: ${invoice.cashier}`);
    }
    
    lines.push('');
    lines.push('-'.repeat(32));
    lines.push('الأصناف:');
    lines.push('-'.repeat(32));
    
    // Items
    invoice.items.forEach(item => {
      lines.push(`${item.name}`);
      lines.push(`  ${item.quantity} × ${item.price.toFixed(2)} = ${item.total.toFixed(2)}`);
    });
    
    lines.push('');
    lines.push('-'.repeat(32));
    
    // Totals
    lines.push(`المجموع الفرعي: ${invoice.subtotal.toFixed(2)}`);
    
    if (invoice.discount > 0) {
      lines.push(`الخصم: ${invoice.discount.toFixed(2)}`);
    }
    
    if (invoice.tax > 0) {
      lines.push(`الضريبة: ${invoice.tax.toFixed(2)}`);
    }
    
    lines.push(`الإجمالي: ${invoice.total.toFixed(2)}`);
    lines.push(`طريقة الدفع: ${invoice.paymentMethod}`);
    
    if (invoice.notes) {
      lines.push('');
      lines.push(`ملاحظات: ${invoice.notes}`);
    }
    
    lines.push('');
    lines.push('='.repeat(32));
    lines.push('    شكراً لزيارتكم');
    lines.push('='.repeat(32));
    lines.push('');
    lines.push('');
    
    return lines.join('\n');
  }

  // Print invoice using the configured printer
  async printInvoice(invoice: InvoiceData): Promise<{ success: boolean; error?: string }> {
    try {
      const content = this.generateInvoiceContent(invoice);
      
      if (this.printer.type === 'network') {
        return await this.printViaNetwork(content);
      } else {
        return await this.printViaUSB(content);
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ غير معروف في الطباعة'
      };
    }
  }

  // Print via network printer
// في الدالة printViaNetwork، استبدل الكود الحالي بـ:
private async printViaNetwork(content: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { address, port } = this.printer;
    
    // التحقق من وجود عنوان الطابعة
    if (!address) {
      return { success: false, error: 'Printer address not specified' };
    }
    
    // 🔥 استخدام Firebase Proxy بدلاً من WebSocket/HTTP مباشرة
    const escPosData = this.convertToESCPOS(content);
    const FIREBASE_PRINTER_PROXY_URL = 'https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/printerProxy';
    
    const response = await fetch(FIREBASE_PRINTER_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'x-printer-ip': address,
        'x-printer-port': (port || 9100).toString()
      },
      body: escPosData
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result.success ? { success: true } : { success: false, error: result.error };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network printing error'
    };
  }
}


  // Print via HTTP
  private async printViaHTTP(ip: string, port: number, data: Uint8Array): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`http://${ip}:${port}/print`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: data
      });
      
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: 'فشل في إرسال البيانات للطابعة' };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ في الاتصال بالطابعة'
      };
    }
  }

  // Print via USB
  private async printViaUSB(content: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!('serial' in navigator)) {
        return { success: false, error: 'Web Serial API غير مدعوم في هذا المتصفح' };
      }

      // Get saved port or request new one
      let port;
      const savedPortInfo = localStorage.getItem('thermal_usb_port');
      
      if (savedPortInfo) {
        try {
          const ports = await (navigator as any).serial.getPorts();
          port = ports.find((p: any) => {
            const info = p.getInfo();
            return info.usbVendorId && info.usbProductId;
          });
        } catch (e) {
          // Ignore error and request new port
        }
      }

      if (!port) {
        port = await (navigator as any).serial.requestPort();
        const portInfo = port.getInfo();
        localStorage.setItem('thermal_usb_port', JSON.stringify(portInfo));
      }

      await port.open({ baudRate: 9600 });
      
      const writer = port.writable?.getWriter();
      if (writer) {
        const escPosData = this.convertToESCPOS(content);
        await writer.write(escPosData);
        writer.releaseLock();
      }

      await port.close();
      return { success: true };
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ في الطباعة عبر USB'
      };
    }
  }

  // Convert text to ESC/POS commands
  private convertToESCPOS(content: string): Uint8Array {
    const encoder = new TextEncoder();
    const commands: number[] = [];
    
    // ESC/POS initialization
    commands.push(0x1B, 0x40); // Initialize printer
    commands.push(0x1B, 0x61, 0x01); // Center align
    
    // Set character size (normal)
    commands.push(0x1B, 0x21, 0x00);
    
    // Add content
    const contentBytes = encoder.encode(content);
    commands.push(...Array.from(contentBytes));
    
    // Cut paper
    commands.push(0x1D, 0x56, 0x41, 0x10);
    
    return new Uint8Array(commands);
  }
}

