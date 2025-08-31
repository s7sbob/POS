export interface Printer {
  id: string;
  name: string;
  type: 'usb' | 'network';
  address?: any; // Optional for USB printers
  usbVendorId?: number;
  usbProductId?: number;
  port?: number;
  isDefault: boolean;
}


