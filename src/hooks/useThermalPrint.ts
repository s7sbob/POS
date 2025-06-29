// File: src/hooks/useThermalPrint.ts
import { useCallback } from 'react';

interface ThermalPrintOptions {
  printerType?: 'usb' | 'network';
  networkConfig?: {
    ip: string;
    port: number;
  };
}

export const useThermalPrint = (options: ThermalPrintOptions = {}) => {
  
  // دالة الطباعة عبر الشبكة مباشرة
  const printViaNetwork = useCallback(async (content: string) => {
    try {
      if (!options.networkConfig) {
        throw new Error('إعدادات الشبكة غير محددة');
      }

      const { ip, port } = options.networkConfig;
      
      // إرسال مباشر للطابعة عبر الشبكة
      const escPosData = convertToESCPOS(content);
      
      // استخدام WebSocket للاتصال المباشر
      const ws = new WebSocket(`ws://${ip}:${port}`);
      
      return new Promise((resolve) => {
        ws.onopen = () => {
          ws.send(escPosData);
          ws.close();
          resolve({ success: true });
        };
        
        ws.onerror = () => {
          // محاولة عبر HTTP إذا فشل WebSocket
          fetch(`http://${ip}:${port}/print`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/octet-stream' },
            body: escPosData
          }).then(() => {
            resolve({ success: true });
          }).catch(() => {
            resolve({ success: false, error: 'فشل الاتصال بالطابعة' });
          });
        };
      });
      
    } catch (error) {
      return { success: false, error: error && typeof error === 'object' && 'message' in error ? (error as any).message : String(error) };
    }
  }, [options.networkConfig]);

  // دالة الطباعة عبر USB مع حفظ البورت
  const printViaUSB = useCallback(async (content: string) => {
    try {
      if (!('serial' in navigator)) {
        throw new Error('Web Serial API غير مدعوم');
      }

      // التحقق من البورت المحفوظ
      const savedPortInfo = localStorage.getItem('thermal_usb_port');
      let port;

      if (savedPortInfo) {
        // محاولة استخدام البورت المحفوظ
        try {
          const ports = await (navigator as any).serial.getPorts();
          port = ports.find((p: any) => p.getInfo().usbVendorId && p.getInfo().usbProductId);
        } catch (e) {
          }
      }

      // إذا لم يوجد بورت محفوظ أو فشل، اطلب واحد جديد
      if (!port) {
        port = await (navigator as any).serial.requestPort();
        // حفظ معلومات البورت
        const portInfo = port.getInfo();
        localStorage.setItem('thermal_usb_port', JSON.stringify(portInfo));
      }

      await port.open({ baudRate: 9600 });
      
      const writer = port.writable?.getWriter();
      if (writer) {
        const escPosData = convertToESCPOS(content);
        await writer.write(escPosData);
        writer.releaseLock();
      }

      await port.close();
      return { success: true };
      
    } catch (error) {
      return { success: false, error: error && typeof error === 'object' && 'message' in error ? (error as any).message : String(error) };
    }
  }, []);

  // تحويل النص إلى ESC/POS commands
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
  const print = useCallback(async (content: string) => {
    const printerType = options.printerType || 'usb';
    
    if (printerType === 'network') {
      return await printViaNetwork(content);
    } else {
      return await printViaUSB(content);
    }
  }, [options.printerType, printViaNetwork, printViaUSB]);

  return { print };
};
