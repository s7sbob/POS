// File: src/hooks/useGlobalErrorHandler.ts
import { useEffect } from 'react';
import { useError } from '../contexts/ErrorContext';
import { setGlobalErrorHandler, setGlobalSuccessHandler } from '../utils/axios';

export const useGlobalErrorHandler = () => {
  const { showError, showSuccess } = useError();

  useEffect(() => {
    // ربط Global Error Handler مع axios
    setGlobalErrorHandler(showError);
    setGlobalSuccessHandler(showSuccess);

    // تنظيف عند إلغاء التحميل
    return () => {
      setGlobalErrorHandler(() => {});
      setGlobalSuccessHandler(() => {});
    };
  }, [showError, showSuccess]);
};
