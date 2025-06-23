// File: src/hooks/useCopyPaste.ts
import { useState, useCallback } from 'react';

interface CopyPasteOptions {
  storageKey: string;
  onCopySuccess?: (data: any) => void;
  onPasteSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export const useCopyPaste = <T = any>(options: CopyPasteOptions) => {
  const { storageKey, onCopySuccess, onPasteSuccess, onError } = options;
  
  const [copiedData, setCopiedData] = useState<T | null>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const copyData = useCallback((data: T) => {
    try {
      setCopiedData(data);
      localStorage.setItem(storageKey, JSON.stringify(data));
      onCopySuccess?.(data);
    } catch (error) {
      onError?.('فشل في نسخ البيانات');
    }
  }, [storageKey, onCopySuccess, onError]);

  const pasteData = useCallback((): T | null => {
    try {
      if (copiedData) {
        onPasteSuccess?.(copiedData);
        return copiedData;
      }
      
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCopiedData(parsed);
        onPasteSuccess?.(parsed);
        return parsed;
      }
      
      onError?.('لا توجد بيانات منسوخة');
      return null;
    } catch (error) {
      onError?.('فشل في لصق البيانات');
      return null;
    }
  }, [copiedData, storageKey, onPasteSuccess, onError]);

  const clearData = useCallback(() => {
    setCopiedData(null);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  const hasCopiedData = copiedData !== null;

  return {
    copiedData,
    copyData,
    pasteData,
    clearData,
    hasCopiedData
  };
};
