// src/Pages/pos/newSales/hooks/useTodayOrders.ts
import { useState, useEffect, useCallback } from 'react';
import {
  getAllInvoices,
  Invoice,
  InvoicesResponse
} from '../../../../utils/api/pagesApi/invoicesApi';

export const useTodayOrders = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const loadInvoices = useCallback(async (page: number = 1, pageSize: number = 50) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: InvoicesResponse = await getAllInvoices(page, pageSize);
      
      setInvoices(response.data);
      setTotalCount(response.totalCount);
      setTotalPages(response.pageCount);
      
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'حدث خطأ في تحميل البيانات';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshInvoices = useCallback(() => {
    return loadInvoices(1);
  }, [loadInvoices]);

  return {
    invoices,
    loading,
    error,
    totalCount,
    totalPages,
    loadInvoices,
    refreshInvoices
  };
};
