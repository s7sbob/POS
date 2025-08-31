import { useState, useEffect, useCallback } from 'react';
import { Printer } from '../types/printer';
import { useThermalPrint } from './useThermalPrint';

export const usePrinterManager = () => {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [defaultPrinter, setDefaultPrinter] = useState<Printer | null>(null);

  // Load printers from localStorage
  useEffect(() => {
    const savedPrinters = localStorage.getItem('pos_printers');
    if (savedPrinters) {
      try {
        const parsedPrinters = JSON.parse(savedPrinters);
        setPrinters(parsedPrinters);
        
        // Find default printer
        const defaultPrinterFound = parsedPrinters.find((p: Printer) => p.isDefault);
        setDefaultPrinter(defaultPrinterFound || null);
      } catch (error) {
        console.error('Error loading printers:', error);
      }
    }
  }, []);

  // Get thermal print hook for default printer
  const { print: thermalPrint } = useThermalPrint({
    printerType: defaultPrinter?.type || 'usb',
    networkConfig: defaultPrinter?.type === 'network' ? {
      ip: defaultPrinter.address || '',
      port: defaultPrinter.port || 9100
    } : undefined,
    usbConfig: defaultPrinter?.type === 'usb' ? {
      vendorId: defaultPrinter.usbVendorId,
      productId: defaultPrinter.usbProductId
    } : undefined
  });

  // Print using default printer
  const printWithDefaultPrinter = useCallback(async (content: string, log?: (message: string) => void) => {
    if (!defaultPrinter) {
      throw new Error('لا توجد طابعة افتراضية محددة');
    }

    return await thermalPrint(content, log);
  }, [defaultPrinter, thermalPrint]);

  // Print using specific printer
  const printWithSpecificPrinter = useCallback(async (printerId: string, content: string, log?: (message: string) => void) => {
    const printer = printers.find(p => p.id === printerId);
    if (!printer) {
      throw new Error('الطابعة المحددة غير موجودة');
    }

    const { print } = useThermalPrint({
      printerType: printer.type,
      networkConfig: printer.type === 'network' ? {
        ip: printer.address || '',
        port: printer.port || 9100
      } : undefined,
      usbConfig: printer.type === 'usb' ? {
        vendorId: printer.usbVendorId,
        productId: printer.usbProductId
      } : undefined
    });

    return await print(content, log);
  }, [printers]);

  // Get all available printers
  const getAvailablePrinters = useCallback(() => {
    return printers;
  }, [printers]);

  // Get default printer
  const getDefaultPrinter = useCallback(() => {
    return defaultPrinter;
  }, [defaultPrinter]);

  // Check if any printer is configured
  const hasPrinters = useCallback(() => {
    return printers.length > 0;
  }, [printers]);

  // Check if default printer is configured
  const hasDefaultPrinter = useCallback(() => {
    return defaultPrinter !== null;
  }, [defaultPrinter]);

  return {
    printers,
    defaultPrinter,
    printWithDefaultPrinter,
    printWithSpecificPrinter,
    getAvailablePrinters,
    getDefaultPrinter,
    hasPrinters,
    hasDefaultPrinter
  };
};

