// File: src/contexts/ProductCopyPasteContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProductCopyData {
  // بيانات المنتج الأساسية
  groupId: string;
  productType: number;
  description: string;
  reorderLevel: number;
  expirationDays: number;
  
  // بيانات الأسعار (بدون الأسماء والأسعار)
  priceTemplates: Array<{
    unitId: string;
    unitFactor: number;
    barcode: string; // سيكون فارغ عند اللصق
    productComponents: Array<{
      rawProductPriceId: string;
      quantity: number;
      notes: string;
    }>;
  }>;
}

interface ProductCopyPasteContextType {
  copiedData: ProductCopyData | null;
  copyProduct: (data: ProductCopyData) => void;
  pasteProduct: () => ProductCopyData | null;
  clearCopiedData: () => void;
  hasCopiedData: boolean;
}

const ProductCopyPasteContext = createContext<ProductCopyPasteContextType | undefined>(undefined);

export const ProductCopyPasteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [copiedData, setCopiedData] = useState<ProductCopyData | null>(null);

  const copyProduct = (data: ProductCopyData) => {
    setCopiedData(data);
    // حفظ في localStorage للاحتفاظ بالبيانات حتى لو تم إعادة تحميل الصفحة
    localStorage.setItem('productCopyData', JSON.stringify(data));
  };

  const pasteProduct = (): ProductCopyData | null => {
    if (copiedData) return copiedData;
    
    // محاولة استرداد من localStorage
    const savedData = localStorage.getItem('productCopyData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setCopiedData(parsed);
        return parsed;
      } catch (error) {
        console.error('Error parsing saved copy data:', error);
      }
    }
    
    return null;
  };

  const clearCopiedData = () => {
    setCopiedData(null);
    localStorage.removeItem('productCopyData');
  };

  const hasCopiedData = copiedData !== null || localStorage.getItem('productCopyData') !== null;

  return (
    <ProductCopyPasteContext.Provider value={{
      copiedData,
      copyProduct,
      pasteProduct,
      clearCopiedData,
      hasCopiedData
    }}>
      {children}
    </ProductCopyPasteContext.Provider>
  );
};

export const useProductCopyPaste = () => {
  const context = useContext(ProductCopyPasteContext);
  if (context === undefined) {
    throw new Error('useProductCopyPaste must be used within a ProductCopyPasteProvider');
  }
  return context;
};
