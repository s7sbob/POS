// File: src/components/GlobalPrintHandler.tsx
import React, { useEffect, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useThermalPrint } from '../hooks/useThermalPrint';

interface Props {
  children: React.ReactNode;
  thermalPrinterConfig?: {
    enabled: boolean;
    type: 'usb' | 'network';
    networkConfig?: {
      ip: string;
      port: number;
    };
  };
}

const GlobalPrintHandler: React.FC<Props> = ({ 
  children, 
  thermalPrinterConfig 
}) => {
  const printRef = React.useRef<HTMLDivElement>(null);
  const { print: thermalPrint } = useThermalPrint(thermalPrinterConfig);

  // ⭐ تحديث useReactToPrint للإصدار الجديد
  const handleNormalPrint = useReactToPrint({
    contentRef: printRef, // ⭐ استخدام contentRef بدلاً من content
    pageStyle: `
      @page {
        size: A4;
        margin: 0.5in;
      }
      @media print {
        body { -webkit-print-color-adjust: exact; }
        .no-print { display: none !important; }
        .print-only { display: block !important; }
      }
    `
  });

  // دالة الطباعة الحرارية
  const handleThermalPrint = useCallback(async () => {
    if (!thermalPrinterConfig?.enabled) {
      handleNormalPrint();
      return;
    }

    try {
      const content = printRef.current?.innerText || '';
      const result = await thermalPrint(content);
      
      if (!(result as { success: boolean }).success) {
        handleNormalPrint();
      }
    } catch (error) {
      handleNormalPrint();
    }
  }, [thermalPrinterConfig, thermalPrint, handleNormalPrint]);

  // معالج Ctrl+P
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
      event.preventDefault();
      
      if (thermalPrinterConfig?.enabled) {
        handleThermalPrint();
      } else {
        handleNormalPrint();
      }
    }
  }, [thermalPrinterConfig, handleThermalPrint, handleNormalPrint]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div ref={printRef}>
      {children}
    </div>
  );
};

export default GlobalPrintHandler;
