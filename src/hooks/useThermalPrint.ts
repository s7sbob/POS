import { useCallback } from 'react';

declare global {
  interface SerialPort {
    open(options: { baudRate: number }): Promise<void>;
    close(): Promise<void>;
    writable: WritableStream | null;
  }
  
  interface Navigator {
    serial: {
      requestPort(): Promise<SerialPort>;
      getPorts(): Promise<SerialPort[]>;
    };
  }
}

interface ThermalPrintOptions {
  printerType?: 'usb' | 'network';
  networkConfig?: {
    ip: string;
    port: number;
  };
  usbConfig?: {
    vendorId?: number;
    productId?: number;
  };
}

// 🔥 تحديث URL للـ Firebase Function المنشورة
// const FIREBASE_PRINTER_PROXY_URL = 'https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/printerProxy';
// أو للاختبار المحلي:
const FIREBASE_PRINTER_PROXY_URL = 'http://localhost:3001';

export const useThermalPrint = (options: ThermalPrintOptions = {}) => {
  
  // دالة الطباعة عبر الشبكة
const printViaNetwork = useCallback(async (content: string, log?: (message: string) => void) => {
  log?.('🌐 Starting network printing...');
  try {
    if (!options.networkConfig) {
      throw new Error('Network configuration not specified');
    }

    const { ip, port } = options.networkConfig;
    const url = 'http://localhost:3001/print'; // تأكد من الـ URL
    
    log?.(`📤 Sending to: ${url}`);
    log?.(`🖨️ Target printer: ${ip}:${port}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'x-printer-ip': ip,
        'x-printer-port': port.toString()
      },
      body: convertToESCPOS(content)
    });

    log?.(`📊 Response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    log?.(`📋 Server response: ${JSON.stringify(result)}`);
    
    return result.success ? { success: true } : { success: false, error: result.error };
    
  } catch (error:any) {
    log?.(`💥 Detailed error: ${error}`);
    return { success: false, error: error.message };
  }
}, [options.networkConfig]);


  // دالة الطباعة عبر USB
  const printViaUSB = useCallback(async (content: string, log?: (message: string) => void) => {
    log?.('🔌 Starting USB printing...');
    try {
      if (!('serial' in navigator)) {
        log?.('❌ Web Serial API not supported');
        throw new Error('Web Serial API not supported in this browser');
      }

      let port: SerialPort | any; // 🔥 تعريف صحيح للمتغير
      const { usbConfig } = options;

      // البحث عن منفذ محفوظ
      if (usbConfig?.vendorId && usbConfig?.productId) {
        log?.(`🔍 Searching for USB port (Vendor ID: ${usbConfig.vendorId}, Product ID: ${usbConfig.productId})...`);
        try {
          const ports = await (navigator as any).serial.getPorts();
          port = ports.find((p: any) => 
            p.getInfo().usbVendorId === usbConfig.vendorId && 
            p.getInfo().usbProductId === usbConfig.productId
          );
          if (port) {
            log?.('✅ Found matching USB port');
          } else {
            log?.('⚠️ No matching USB port found, will request new one');
          }
        } catch (e: any) {
          log?.(`⚠️ Error searching for port: ${e.message || e}`);
        }
      }

      // طلب منفذ جديد إذا لم يوجد
      if (!port) {
        log?.('🖱️ Requesting new USB port from user...');
        port = await (navigator as any).serial.requestPort();
        log?.('✅ New USB port selected');
      }

      log?.('🔓 Opening USB port...');
      await port.open({ baudRate: 9600 });
      log?.('📤 USB port opened, sending data...');
      
      const writer = port.writable?.getWriter();
      if (writer) {
        const escPosData = convertToESCPOS(content);
        await writer.write(escPosData);
        writer.releaseLock();
        log?.('✅ Data sent to USB port');
      }

      log?.('🔒 Closing USB port...');
      await port.close();
      log?.('✅ USB port closed successfully');
      return { success: true };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      log?.(`💥 USB printing error: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  }, [options.usbConfig]);

  // 🔥 نقل دالة convertToESCPOS خارج النطاق المحلي
  const convertToESCPOS = (content: string): Uint8Array => {
    const encoder = new TextEncoder();
    const commands = [];
    
    // ESC/POS initialization
    commands.push(0x1B, 0x40); // Initialize
    commands.push(0x1B, 0x61, 0x01); // Center align
    commands.push(0x1B, 0x21, 0x08); // Double height
    
    // Content
    const contentBytes = encoder.encode(content);
    commands.push(...Array.from(contentBytes));
    
    // Cut paper
    commands.push(0x1D, 0x56, 0x41, 0x10);
    
    return new Uint8Array(commands);
  };

  // الدالة الرئيسية للطباعة
  const print = useCallback(async (content: string, log?: (message: string) => void) => {
    const printerType = options.printerType || 'usb';
    log?.(`🖨️ Selected printer type: ${printerType}`);
    
    if (printerType === 'network') {
      return await printViaNetwork(content, log);
    } else {
      return await printViaUSB(content, log);
    }
  }, [options.printerType, printViaNetwork, printViaUSB]);

  return { print };
};
